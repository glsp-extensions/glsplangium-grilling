import ts, { SyntaxKind } from "typescript";
import { Multiplicity, Property } from "../types";
import { visitTypeReferenceNode } from "./type-reference-parser";
import { visitUnionType } from "./union-parser";

export const visitPropertyDeclaration =
  (target: Property) => (node: ts.Node) => {
    if (ts.isIdentifier(node)) {
      target.name = node.text;
    } else if (ts.isDecorator(node)) {
      const expr = node.expression;
      if (ts.isCallExpression(expr)) {
        const decoratorName = expr.expression.getText();
        if (decoratorName === "defaultValue") {
          // Handle @defaultValue("some value")
          if (expr.arguments.length > 0) {
            const arg = expr.arguments[0];
            let value: string;
            if (ts.isStringLiteral(arg)) {
              value = arg.text;
            } else {
              value = arg.getText();
            }
            target.decorators.push(`defaultValue:${value}`);
          } else {
            target.decorators.push("defaultValue:");
          }
        } else {
          // For other call expressions, simply push the decorator's name.
          target.decorators.push(decoratorName);
        }
      } else if (ts.isIdentifier(expr)) {
        // For simple decorators without arguments (e.g., @path, @crossReference)
        target.decorators.push(expr.getText());
      }
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
