import chalk from "chalk";
import path from "path";
import { expect, test, vi } from "vitest";
import { parseDefinitionFile } from "../src/parser";
import {
  transformDeclaration,
  transformLangiumDeclarationsToLangiumGrammar,
} from "../src/transformer";
import {
  checkDeclarationValidity,
  checkLangiumGrammar,
} from "../src/validators";

const generatorConfig = {
  // DO NOT CHANGE THE VALUES OF THE PROPERTIES; THIS CAN BREAK YOUR LANGUAGE
  referenceProperty: "__id",
};
test("definition-file-with-containment-cycle throws non-serializable Error", async () => {
  const tsDeclarations = await parseDefinitionFile(
    path.resolve("./test", "files", "definition-file-containment-cycle.ts")
  );
  const langiumDeclarations = transformDeclaration(tsDeclarations);
  const langiumGrammar = transformLangiumDeclarationsToLangiumGrammar(
    langiumDeclarations,
    generatorConfig
  );
  expect(() => checkLangiumGrammar(langiumGrammar)).toThrowError(
    /are not serializable/
  );
});

test("definition-file-with-unused-interface prints warning", async () => {
  const consoleMock = vi
    .spyOn(console, "log")
    .mockImplementation(() => undefined);
  const tsDeclarations = await parseDefinitionFile(
    path.resolve("./test", "files", "definition-file-with-unused-interface.ts")
  );
  const langiumDeclarations = transformDeclaration(tsDeclarations);
  const langiumGrammar = transformLangiumDeclarationsToLangiumGrammar(
    langiumDeclarations,
    generatorConfig
  );
  checkLangiumGrammar(langiumGrammar);
  expect(consoleMock).toHaveBeenLastCalledWith(
    chalk.yellow("WARNING: Type Unused has been defined but is never used.")
  );
});

test("definition-file-with-one-abstract-element has one abstract ruleElement throws error", async () => {
  const tsDeclarations = await parseDefinitionFile(
    path.resolve("./test", "files", "definition-file-one-abstract-element.ts")
  );
  const langiumDeclarations = transformDeclaration(tsDeclarations);
  expect(() => checkDeclarationValidity(langiumDeclarations)).toThrow(
    `Can not create grammar rule for abstract declaration that is not extended by other declarations. [${langiumDeclarations
      .filter((decl) => decl.isAbstract)
      .map((decl) => decl.name)}]`
  );
});
