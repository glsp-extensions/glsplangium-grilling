import fs from "fs";
import path from "path";
import { LangiumDeclaration } from "./../types";

export function buildCreationPathMapping(
  langiumDeclarations: Array<LangiumDeclaration>
): Record<string, Array<{ property: string; allowedChildTypes?: string[] }>> {
  const mapping: Record<
    string,
    Array<{ property: string; allowedChildTypes?: string[] }>
  > = {};

  langiumDeclarations.forEach((parentDecl) => {
    if (!parentDecl.properties) return;
    parentDecl.properties.forEach((prop) => {
      if (prop.decorators && prop.decorators.includes("path")) {
        if (!mapping[parentDecl.name]) {
          mapping[parentDecl.name] = [];
        }
        const allowedType = prop.types[0].typeName;
        let allowedChildTypes = langiumDeclarations
          .filter(
            (childDecl) =>
              childDecl.extends && childDecl.extends.includes(allowedType)
          )
          .map((childDecl) => childDecl.name);
        if (allowedChildTypes.length === 0) {
          allowedChildTypes = [allowedType];
        }
        mapping[parentDecl.name].push({
          property: prop.name,
          allowedChildTypes: allowedChildTypes,
        });
      }
    });
  });
  return mapping;
}

export function writeCreationPathFile(
  extensionPath: string,
  mapping: Record<
    string,
    Array<{ property: string; allowedChildTypes?: string[] }>
  >
): void {
  const content = `
// THIS FILE IS GENERATED - TEST

  const mapping: Record<string, Array<{ property: string; allowedChildTypes?: string[] }>> = ${JSON.stringify(mapping, null, 2)};
  
  export function getCreationPath(parentType: string, childType: string): string {
    if (mapping[parentType]) {
      for (const entry of mapping[parentType]) {
        if (entry.allowedChildTypes && entry.allowedChildTypes.includes(childType)) {
          return entry.property;
        }
      }
    }
    return "";
  }
  `;
  const outputFolder = path.join(extensionPath, "yo-generated");
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }
  const filePath = path.join(outputFolder, "getCreationPath.ts");
  fs.writeFileSync(filePath, content, { encoding: "utf8" });
  console.log(`Generated getCreationPath file at: ${filePath}`);
}
