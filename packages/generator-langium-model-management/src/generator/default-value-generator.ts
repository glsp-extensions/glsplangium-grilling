import fs from "fs";
import path from "path";
import { LangiumDeclaration } from "./../types";

interface DefaultMappingEntry {
  property: string;
  defaultValue?: any;
  propertyType: string;
}

export function buildDefaultValueMapping(
  langiumDeclarations: Array<LangiumDeclaration>
): Record<string, DefaultMappingEntry[]> {
  const mapping: Record<string, DefaultMappingEntry[]> = {};
  langiumDeclarations.forEach((parentDecl) => {
    if (!parentDecl.properties) return;
    parentDecl.properties.forEach((prop) => {
      const propType = prop.types[0]?.type;

      const defaultDecorator = prop.decorators?.find((dec) =>
        dec.startsWith("defaultValue:")
      );
      let explicitDefault: any = undefined;
      if (defaultDecorator) {
        explicitDefault = defaultDecorator.substring("defaultValue:".length);
      }

      if (propType === "simple") {
        const entry: DefaultMappingEntry = {
          property: prop.name,
          defaultValue: explicitDefault,
          propertyType: prop.types[0].typeName,
        };
        if (!mapping[parentDecl.name]) {
          mapping[parentDecl.name] = [];
        }
        mapping[parentDecl.name].push(entry);
      }
    });
  });
  return mapping;
}

export function writeDefaultValueFile(
  extensionPath: string,
  mapping: Record<string, DefaultMappingEntry[]>
) {
  const content = `
    //THIS FILE IS GENERATED

  interface DefaultMappingEntry {
    property: string;
    defaultValue?: any;
    propertyType: string;
  }
  
  const defaultMapping: Record<string, DefaultMappingEntry[]> = ${JSON.stringify(mapping, null, 2)};
  
  export function getDefaultValue(parentType: string, propertyName: string): any {
    const entries = defaultMapping[parentType];
    if (entries) {
        const entry = entries.find(e => e.property === propertyName);
        if (entry) {
        if (entry.defaultValue !== undefined) {
            return entry.defaultValue;
        }
        // Fallback for simple types:
        if (entry.propertyType === "string") {
            return "";
        } else if (entry.propertyType === "boolean") {
            return true;
        } else if (entry.propertyType === "number") {
            return 0;
        } else {
            // For complex types, we assume they are always arrays.
            return [];
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
  const filePath = path.join(outputFolder, "getDefaultValue.ts");
  fs.writeFileSync(filePath, content, { encoding: "utf8" });
  console.log(`Generated getDefaultValue file at: ${filePath}`);
}
