import ts from "typescript";
import { Declaration, Multiplicity, Property } from "../types";
import { visitTypeReferenceNode } from "./type-reference-parser";
import { visitUnionType } from "./union-parser";

export const visitTypeDeclaration =
  (target: Declaration) => (node: ts.Node) => {
    const property = {
      decorators: [],
      isOptional: true,
      types: [],
      multiplicity: Multiplicity.ONE_TO_ONE,
    } as Property;
    if (ts.isIdentifier(node)) {
      target.name = node.text;
    } else if (ts.isUnionTypeNode(node)) {
      target.properties.push(property);
      ts.forEachChild(node, visitUnionType(property));
    } else if (ts.isTypeReferenceNode(node)) {
      target.properties.push(property);
      ts.forEachChild(node, visitTypeReferenceNode(property));
    } else if (ts.isLiteralTypeNode(node)) {
      target.properties.push(property);
      ts.forEachChild(node, (child) => {
        if (
          ts.isStringLiteral(child) ||
          ts.isNumericLiteral(child) ||
          child.kind === ts.SyntaxKind.TrueKeyword ||
          child.kind === ts.SyntaxKind.FalseKeyword
        ) {
          property.types.push({ type: "constant", typeName: child.getText() });
        }
      });
    }
  };
