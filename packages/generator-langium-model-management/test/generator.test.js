import fs from "fs";
import path from "path";
import { expect, test } from "vitest";
import { generateSerializer } from "../src/generator/serializer-generator";
import { generateLangiumText } from "../src/generator/langium-generator";
import { parseDefinitionFile } from "../src/parser";
import {
  transformDeclaration,
  transformLangiumDeclarationsToLangiumGrammar,
} from "../src/transformer";
import { checkLangiumGrammar } from "../src/validators";

const generatorConfig = {
  // DO NOT CHANGE THE VALUES OF THE PROPERTIES; THIS CAN BREAK YOUR LANGUAGE
  referenceProperty: "__id",
};

test("correct-definition-file creates correct serializer - 1", async () => {
  const paths = {
    definition: path.resolve(
      "./test",
      "files",
      "correct1",
      "correct-definition-file.ts"
    ),
    serializer: path.resolve(
      "./test",
      "files",
      "correct1",
      "correct-serializer.ts"
    ),
    langiumFile: path.resolve(
      "./test",
      "files",
      "correct1",
      "correct-grammar.langium"
    ),
  };
  const tsDeclarations = await parseDefinitionFile(paths.definition);
  const langiumDeclarations = transformDeclaration(tsDeclarations);
  const langiumGrammar = transformLangiumDeclarationsToLangiumGrammar(
    langiumDeclarations,
    generatorConfig
  );
  expect(() => checkLangiumGrammar(langiumGrammar)).not.toThrow();
  const langiumGrammarText = generateLangiumText(
    langiumGrammar,
    "test",
    "Test"
  );
  const expectedLangiumGrammarText = fs.readFileSync(paths.langiumFile, {
    encoding: "utf8",
    flag: "r",
  });
  expect(langiumGrammarText).toBe(
    expectedLangiumGrammarText.replace(/\r\n/g, "\n")
  );
  const serializerText = await generateSerializer(
    langiumGrammar,
    "test",
    "Test",
    generatorConfig
  );
  const expectedSerializerText = fs.readFileSync(paths.serializer, {
    encoding: "utf8",
    flag: "r",
  });
  expect(serializerText).toEqual(expectedSerializerText.replace(/\r\n/g, "\n"));
});

test("correct-definition-file creates correct serializer - 2", async () => {
  const paths = {
    definition: path.resolve(
      "./test",
      "files",
      "correct2",
      "correct-definition-file.ts"
    ),
    serializer: path.resolve(
      "./test",
      "files",
      "correct2",
      "correct-serializer.ts"
    ),
    langiumFile: path.resolve(
      "./test",
      "files",
      "correct2",
      "correct-grammar.langium"
    ),
  };
  const tsDeclarations = await parseDefinitionFile(paths.definition);
  const langiumDeclarations = transformDeclaration(tsDeclarations);
  const langiumGrammar = transformLangiumDeclarationsToLangiumGrammar(
    langiumDeclarations,
    generatorConfig
  );
  expect(() => checkLangiumGrammar(langiumGrammar)).not.toThrow();
  const langiumGrammarText = generateLangiumText(
    langiumGrammar,
    "test",
    "Test",
    generatorConfig
  );
  const expectedLangiumGrammarText = fs.readFileSync(paths.langiumFile, {
    encoding: "utf8",
    flag: "r",
  });
  expect(langiumGrammarText).toBe(
    expectedLangiumGrammarText.replace(/\r\n/g, "\n")
  );
  const serializerText = await generateSerializer(
    langiumGrammar,
    "test",
    "Test",
    generatorConfig
  );
  const expectedSerializerText = fs.readFileSync(paths.serializer, {
    encoding: "utf8",
    flag: "r",
  });
  expect(serializerText).toEqual(expectedSerializerText.replace(/\r\n/g, "\n"));
});
