import fs from "fs";
import ts from "typescript";
import { visitGeneratorConfigFile } from "./generator-config-parser";
import { Declaration } from "../types";
import { visit } from "./typescript-file-parser";
import prettier from "prettier";

export async function parseDefinitionFile(
  path: any
): Promise<Array<Declaration>> {
  let definitionFileContent = fs.readFileSync(path, "utf8");
  let formattedDefinitionFile = await prettier.format(definitionFileContent, {
    parser: "typescript",
    trailingComma: "es5",
  });
  fs.writeFileSync(path, formattedDefinitionFile);
  const program = ts.createProgram([path], {
    target: ts.ScriptTarget.ES2022,
  });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(path);
  const declarations: Array<Declaration> = [];
  ts.forEachChild(source, visit(declarations));
  return declarations;
}

export function parseLangiumConfigFile(path: string) {
  const file = JSON.parse(fs.readFileSync(path).toString());
  let languageName = file.projectName;
  let languageId = file.languages[0].id;
  return { languageName, languageId };
}

export function parseGeneratorConfigFile(path: string) {
  const program = ts.createProgram([path], {
    target: ts.ScriptTarget.ES2022,
  });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(path);

  let properties: any = {};

  ts.forEachChild(source, visitGeneratorConfigFile(properties));
  if (!properties["referenceProperty"]) {
    properties["referenceProperty"] = "__id";
  }
  return properties;
}
