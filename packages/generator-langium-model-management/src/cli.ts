#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { generateLangiumText } from "./generator/langium-generator";
import { generateSerializer } from "./generator/serializer-generator";
import {
  parseDefinitionFile,
  parseGeneratorConfigFile,
  parseLangiumConfigFile,
} from "./parser/parser";
import {
  transformDeclaration,
  transformLangiumDeclarationsToLangiumGrammar,
} from "./transformer";
import {
  checkDeclarationValidity,
  checkGeneratorConfigValidity,
  checkLangiumGrammar,
} from "./validators";
import { parseEcoreDefinitionFile } from "./ecore/ecore-parser";

/** Parse the command line */
var args = process.argv.slice(2);

if (args.length < 1) {
  throw new Error("Expecting at least one argument");
}
if (args[0] !== "generate") {
  throw new Error("Can only handle the generate argument");
}
if (args[0] === "generate") {
  const config = parseLangiumConfigFile(
    path.resolve("./", "langium-config.json")
  );
  const generatorConfig = parseGeneratorConfigFile(
    path.resolve("./", "generator-config.ts")
  );
  checkGeneratorConfigValidity(generatorConfig);

  const extensionPath = path.resolve("./", "src", "language-server");

  if (args.length > 1) {
    if (args.includes("--from=ecore")) {
      console.log("Generating from ecore");
      const ecorePath = path.resolve(
        extensionPath,
        "definition",
        "definition.ecore"
      );
      parseEcoreDefinitionFile(ecorePath).then(() => {
        parseDefinitionFile(
          path.resolve(extensionPath, "definition", "def.ts")
        ).then((tsDeclarations) => {
          generate(tsDeclarations, generatorConfig, config, extensionPath);
        });
      });
    }
  } else {
    parseDefinitionFile(
      path.resolve(extensionPath, "definition", "def.ts")
    ).then((tsDeclarations) => {
      generate(tsDeclarations, generatorConfig, config, extensionPath);
    });
  }
}

function generate(
  tsDeclarations: any,
  generatorConfig: any,
  config: any,
  extensionPath: string
) {
  const langiumDeclarations = transformDeclaration(tsDeclarations);
  checkDeclarationValidity(langiumDeclarations);
  const langiumGrammar = transformLangiumDeclarationsToLangiumGrammar(
    langiumDeclarations,
    generatorConfig
  );
  checkLangiumGrammar(langiumGrammar);
  const grammarText = generateLangiumText(
    langiumGrammar,
    config.languageId,
    config.languageName
  );
  writeToFile(
    extensionPath,
    path.join(extensionPath, "yo-generated", `${config.languageId}.langium`),
    grammarText
  );
  generateSerializer(
    langiumGrammar,
    config.languageId,
    config.languageName,
    generatorConfig
  ).then((text) =>
    writeToFile(
      extensionPath,
      path.join(
        extensionPath,
        "yo-generated",
        `${config.languageId}-serializer.ts`
      ),
      text
    )
  );
}

function writeToFile(extensionPath: string, filePath: string, text: string) {
  if (!fs.existsSync(extensionPath)) {
    fs.mkdirSync(extensionPath, { recursive: true });
  }
  fs.writeFileSync(filePath, text, { encoding: "utf8", flag: "w" });
}
