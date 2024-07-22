import ts, { SyntaxKind } from "typescript";
import { Multiplicity, Property } from "../types";
import { visitTypeReferenceNode } from "./type-reference-parser";
import { visitUnionType } from "./union-parser";

export const visitPropertyDeclaration =
  (target: Property) => (node: ts.Node) => {
    if (ts.isIdentifier(node)) {
      target.name = node.text;
    } else if (ts.isDecorator(node)) {
      ts.forEachChild(node, (child) => {
        if (ts.isIdentifier(child)) {
          target.decorators.push(child.text);
        }
      });
    } else if (ts.isTypeReferenceNode(node)) {
      ts.forEachChild(node, visitTypeReferenceNode(target));
    } else if (ts.isUnionTypeNode(node)) {
      ts.forEachChild(node, visitUnionType(target));
    } else if (
      node.kind === SyntaxKind.NumberKeyword ||
      node.kind === SyntaxKind.BooleanKeyword ||
      node.kind === SyntaxKind.StringKeyword
    ) {
      target.types.push({ type: "simple", typeName: node.getText() });
    } else if (ts.isLiteralTypeNode(node)) {
      ts.forEachChild(node, (child) => {
        if (
          ts.isStringLiteral(child) ||
          ts.isNumericLiteral(child) ||
          child.kind === ts.SyntaxKind.TrueKeyword ||
          child.kind === ts.SyntaxKind.FalseKeyword
        ) {
          let text = child.getText().replace(/\'/g, "");
          target.types.push({
            type: "constant",
            typeName: JSON.stringify(text),
          });
        }
      });
    } else if (ts.isQuestionToken(node)) {
      target.isOptional = true;
    } else if (ts.isArrayTypeNode(node)) {
      target.multiplicity = target.isOptional
        ? Multiplicity.ZERO_TO_N
        : Multiplicity.ONE_TO_N;
      ts.forEachChild(node, visitPropertyDeclaration(target));
    }
  };
