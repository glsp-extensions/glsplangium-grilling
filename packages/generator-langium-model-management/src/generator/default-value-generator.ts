import fs from "fs";
import path from "path";
import { LangiumDeclaration } from "../types";

interface DefaultMappingEntry {
  property: string;
  propertyType: string;
  defaultValue?: any;
}

type DefaultMapping = Record<string, DefaultMappingEntry[]>;

export function buildDefaultValueMapping(
  langiumDeclarations: LangiumDeclaration[]
): DefaultMapping {
  const mapping: DefaultMapping = {};
  for (const decl of langiumDeclarations) {
    if (decl.type !== "class" || !decl.name || !decl.properties) {
      continue;
    }
    const seen = new Set<string>();
    const entries: DefaultMappingEntry[] = [];
    for (const prop of decl.properties) {
      if (seen.has(prop.name)) {
        continue;
      }
      seen.add(prop.name);
      const firstType = prop.types[0];
      if (!firstType) {
        continue;
      }
      const entry: DefaultMappingEntry = {
        property: prop.name,
        propertyType: firstType.typeName,
      };
      if (prop.defaultValue !== undefined) {
        entry.defaultValue = prop.defaultValue;
      }
      entries.push(entry);
    }
    mapping[decl.name] = entries;
  }
  return mapping;
}

export function writeDefaultValueFile(
  extensionPath: string,
  mapping: DefaultMapping
) {
  const content = `// THIS FILE IS GENERATED — DO NOT EDIT

interface DefaultMappingEntry {
  property: string;
  propertyType: string;
  defaultValue?: any;
}

const defaultMapping: Record<string, DefaultMappingEntry[]> = ${JSON.stringify(
    mapping,
    null,
    2
  )};

/**
 * Return all properties for a given type,
 * filling in primitive defaults when none explicit.
 */
export function getProperties(
  elementTypeId: string
): DefaultMappingEntry[] {
  const parentType = stripPrefix(elementTypeId);
  const entries = defaultMapping[parentType] || [];
  return entries.map(e => {
    if (e.defaultValue !== undefined) {
      return e;
    }
    switch (e.propertyType) {
      case 'string':  return { ...e, defaultValue: '' };
      case 'boolean': return { ...e, defaultValue: false };
      case 'number':  return { ...e, defaultValue: 0 };
      default:        return { ...e, defaultValue: [] };
    }
  });
}

function stripPrefix(name: string): string {
  return name.replace(/^.*?__/, '');
}
`;

  const outputFolder = path.join(extensionPath, "yo-generated");
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }
  const filePath = path.join(outputFolder, "getDefaultValue.ts");
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Generated getDefaultValue file at: ${filePath}`);
}
