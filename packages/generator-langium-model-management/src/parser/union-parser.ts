import ts, { SyntaxKind } from "typescript";
import { Property } from "../types";
import { visitTypeReferenceNode } from "./type-reference-parser";

export const visitUnionType = (target: Property) => (node: ts.Node) => {
  if (
    node.kind === SyntaxKind.NumberKeyword ||
    node.kind === SyntaxKind.BooleanKeyword ||
    node.kind === SyntaxKind.StringKeyword
  ) {
    target.types.push({ type: "simple", typeName: node.getText() });
  } else if (ts.isTypeReferenceNode(node)) {
    ts.forEachChild(node, visitTypeReferenceNode(target));
  } else if (ts.isLiteralTypeNode(node)) {
    ts.forEachChild(node, (child) => {
      if (
        ts.isStringLiteral(child) ||
        ts.isNumericLiteral(child) ||
        child.kind === ts.SyntaxKind.TrueKeyword ||
        child.kind === ts.SyntaxKind.FalseKeyword
      ) {
        let text = child.getText().replace(/\'/g, "");
        target.types.push({ type: "constant", typeName: JSON.stringify(text) });
      }
    });
  }
};
