import ts, { SyntaxKind } from "typescript";
import { Declaration, Multiplicity, Property } from "../types";
import { visitPropertyDeclaration } from "./property-parser";

export const visitClassDeclaration =
  (target: Declaration) => (node: ts.Node) => {
    if (ts.isIdentifier(node)) {
      target.name = node.text;
    } else if (ts.isPropertyDeclaration(node)) {
      const property: Property = {
        decorators: [],
        isOptional: false,
        types: [],
        multiplicity: Multiplicity.ONE_TO_ONE,
      } as Property;
      target.properties.push(property);
      ts.forEachChild(node, visitPropertyDeclaration(property));
    } else if (ts.isHeritageClause(node)) {
      ts.forEachChild(node, (child) => {
        if (ts.isExpressionWithTypeArguments(child)) {
          ts.forEachChild(child, (child) => {
            if (ts.isIdentifier(child)) {
              if (
                child.getText() !== "ABSTRACT_ELEMENT" &&
                child.getText() !== "ROOT_ELEMENT"
              ) {
                target.extends.push(child.getText());
              }
            }
          });
        }
      });
    } else if (node.kind === SyntaxKind.AbstractKeyword) {
      target.isAbstract = true;
    } else if (ts.isDecorator(node)) {
      ts.forEachChild(node, (child) => {
        if (ts.isIdentifier(child)) {
          target.decorators.push(child.getText());
        }
      });
    }
  };
