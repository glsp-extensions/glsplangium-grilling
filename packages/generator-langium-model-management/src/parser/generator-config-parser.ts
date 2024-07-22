import ts from "typescript";

export const visitGeneratorConfigFile = (target: any) => (node: ts.Node) => {
  if (ts.isVariableStatement(node)) {
    ts.forEachChild(node, visitGeneratorConfigFile(target));
  } else if (ts.isVariableDeclarationList(node)) {
    ts.forEachChild(node, visitGeneratorConfigFile(target));
  } else if (ts.isVariableDeclaration(node)) {
    node.forEachChild((child) => {
      if (ts.isIdentifier(child) && child.text === "properties") {
        ts.forEachChild(node, visitGeneratorConfigFile(target));
      }
    });
  } else if (ts.isPropertyAssignment(node)) {
    let propertyName = "";
    let propertyValue: any = "";
    node.forEachChild((child) => {
      if (ts.isIdentifier(child)) {
        propertyName = child.text;
      } else if (ts.isStringLiteral(child)) {
        propertyValue = child.text;
      } else if (ts.isNumericLiteral(child)) {
        propertyValue = +child.text;
      }
    });
    target[propertyName] = propertyValue;
  } else {
    ts.forEachChild(node, visitGeneratorConfigFile(target));
  }
};
