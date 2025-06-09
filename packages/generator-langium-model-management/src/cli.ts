#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { parseEcoreDefinitionFile } from "./ecore/ecore-parser";
import {
  buildCreationPathMapping,
  writeCreationPathFile,
} from "./generator/creation-path-generator";
import {
  buildDefaultValueMapping,
  writeDefaultValueFile,
} from "./generator/default-value-generator";
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
          console.log(
            "DEBUG: Raw declarations from def.ts:",
            JSON.stringify(tsDeclarations, null, 2)
          );
          generate(tsDeclarations, generatorConfig, config, extensionPath);
        });
      });
    }
  } else {
    const defFilePath = path.resolve(extensionPath, "definition", "def.ts");
    parseDefinitionFile(defFilePath).then((tsDeclarations) => {
      const output = JSON.stringify(tsDeclarations, null, 2);

      // Define the output folder and file path
      const outputFolder = path.join(extensionPath, "yo-generated");
      if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
      }
      const testFilePath = path.join(outputFolder, "testkarol.ts");

      // Write the output to testkarol.ts
      fs.writeFileSync(testFilePath, output, { encoding: "utf8" });
      console.log("DEBUG: Raw declarations have been written to", testFilePath);

      // Continue with your generation process
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
  const creationPathMapping = buildCreationPathMapping(langiumDeclarations);
  writeCreationPathFile(extensionPath, creationPathMapping);

  const defaultMapping = buildDefaultValueMapping(langiumDeclarations);
  writeDefaultValueFile(extensionPath, defaultMapping);
}

function writeToFile(extensionPath: string, filePath: string, text: string) {
  if (!fs.existsSync(extensionPath)) {
    fs.mkdirSync(extensionPath, { recursive: true });
  }
  fs.writeFileSync(filePath, text, { encoding: "utf8", flag: "w" });
}
