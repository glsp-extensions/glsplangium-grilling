import ts from "typescript";
import { Declaration } from "../types";
import { visitClassDeclaration } from "./class-parser";
import { visitTypeDeclaration } from "./type-parser";
import { visitInterfaceDeclaration } from "./interface-parser";

export const visit = (target: Array<Declaration>) => (node: ts.Node) => {
  const declaration: Declaration = {
    type:
      ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node)
        ? "class"
        : "type",
    isAbstract: ts.isTypeAliasDeclaration(node),
    decorators: [],
    properties: [],
    extends: [],
  };
  if (ts.isClassDeclaration(node)) {
    target.push(declaration);
    ts.forEachChild(node, visitClassDeclaration(declaration));
  } else if (ts.isTypeAliasDeclaration(node)) {
    target.push(declaration);
    ts.forEachChild(node, visitTypeDeclaration(declaration));
  } else if (ts.isInterfaceDeclaration(node)) {
    target.push(declaration);
    ts.forEachChild(node, visitInterfaceDeclaration(declaration));
  }
};
