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
): { defaultMapping: DefaultMapping; noBoundsClasses: string[] } {
  const mapping: DefaultMapping = {};
  const noBoundsClasses: string[] = [];

  for (const decl of langiumDeclarations) {
    if (decl.decorators?.includes("noBounds")) {
      noBoundsClasses.push(decl.name);
    }
    if (decl.type !== "class" || !decl.name || !decl.properties) {
      continue;
    }
    const seen = new Set<string>();
    const entries: DefaultMappingEntry[] = [];
    for (const prop of decl.properties) {
      if (prop.decorators?.includes("noDefault")) {
        continue;
      }

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
  return { defaultMapping: mapping, noBoundsClasses };
}

export function writeDefaultValueFile(
  extensionPath: string,
  payload: { defaultMapping: DefaultMapping; noBoundsClasses: string[] }
) {
  const content = `// THIS FILE IS GENERATED — DO NOT EDIT

interface DefaultMappingEntry {
  property: string;
  propertyType: string;
  defaultValue?: any;
}

const defaultMapping: Record<string, DefaultMappingEntry[]> = ${JSON.stringify(
    payload.defaultMapping,
    null,
    2
  )};

export const noBoundsClasses = new Set<string>(
  ${JSON.stringify(payload.noBoundsClasses, null, 2)}
);

export function isNoBounds(typeId: string): boolean {
  return noBoundsClasses.has(stripPrefix(typeId));
}

export function getProperties(elementTypeId: string): DefaultMappingEntry[] {
  const parentType = stripPrefix(elementTypeId);
  const entries = defaultMapping[parentType] || [];
  return entries.reduce((acc, e) => {
    if (e.defaultValue !== undefined) {
      acc.push(e);
      return acc;
    }

    switch (e.propertyType) {
      case 'string':
        return acc;

      case 'boolean':
        acc.push({ ...e, defaultValue: false });
        return acc;

      case 'number':
        acc.push({ ...e, defaultValue: 0 });
        return acc;

      case 'Visibility':
        acc.push({ ...e, defaultValue: 'PUBLIC' });
        return acc;

      case 'Concurrency':
        acc.push({ ...e, defaultValue: 'SEQUENTIAL' });
        return acc;

      default:
        acc.push({ ...e, defaultValue: [] });
        return acc;
    }
  }, [] as typeof entries);
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
