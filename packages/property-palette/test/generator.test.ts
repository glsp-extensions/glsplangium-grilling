import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { describe, expect, test } from "vitest";

import type { LangiumDeclaration } from "@borkdominik/model-management-common";
import { PropertyPaletteContribution } from "../src/contribution";
import {
  writePropertyPaletteHandlers,
  writeRequestPropertyPaletteHandlers,
} from "../src/generator";

function tmpDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "pp-gen-"));
}

const baseClassDecl: LangiumDeclaration = {
  type: "class",
  name: "Class",
  isAbstract: false,
  decorators: [],
  extendedBy: [],
  extends: [],
  properties: [
    {
      name: "name",
      multiplicity: "1",
      decorators: [],
      types: [{ type: "primitive", typeName: "string" }],
    } as any,
    {
      name: "isAbstract",
      multiplicity: "1",
      decorators: [],
      types: [{ type: "primitive", typeName: "boolean" }],
    } as any,
    {
      name: "properties",
      multiplicity: "*",
      decorators: [],
      types: [{ type: "reference", typeName: "Property" }],
    } as any,
    {
      name: "dynamicRef",
      multiplicity: "1",
      decorators: ["dynamicProperty:SomeType"],
      types: [{ type: "reference", typeName: "SomeType" }],
    } as any,
  ],
} as any;

const diagramElementsDecl: LangiumDeclaration = {
  type: "type",
  name: "ClassDiagramElements",
  isAbstract: false,
  decorators: [],
  extendedBy: [],
  extends: [],
  properties: [
    {
      name: "members",
      multiplicity: "*",
      decorators: [],
      types: [{ type: "reference", typeName: "Class" }],
    } as any,
  ],
} as any;

describe("writePropertyPaletteHandlers", () => {
  test("generates element handler for Class", () => {
    const root = tmpDir();
    const results = writePropertyPaletteHandlers(root, [
      baseClassDecl,
      diagramElementsDecl,
    ]);

    const classHandler = results.find((r) =>
      r.path.endsWith(
        "yo-generated/property-palette/elements/ClassPropertyPaletteHandler.ts"
      )
    );
    expect(classHandler).toBeDefined();

    const content = classHandler!.content;

    expect(content).toContain(
      `.text(semanticElement.__id, 'name', semanticElement.name, 'Name')`
    );
    expect(content).toContain(
      `.bool(semanticElement.__id, 'isAbstract', !!semanticElement.isAbstract, 'isAbstract')`
    );
    expect(content).toContain(`.reference(
            semanticElement.__id,
            'properties',`);
    expect(content).toContain("CreateNodeOperation.create(");
    expect(content).toContain("DeleteElementOperation.create");

    expect(content).toContain(
      `.choice(
            semanticElement.__id,
            'dynamicRef',`
    );
    expect(content).toContain("export function getPropertyPalette(");
    expect(content).toContain("semanticElement: Class, someTypeChoices");
  });
});

describe("writeRequestPropertyPaletteHandlers", () => {
  test("generates request-class-property-palette-action-handler", () => {
    const root = tmpDir();
    const results = writeRequestPropertyPaletteHandlers(root, [
      baseClassDecl,
      diagramElementsDecl,
    ]);

    const file = results.find((r) =>
      r.path.endsWith(
        "yo-generated/property-palette/request-class-property-palette-action-handler.ts"
      )
    );
    expect(file).toBeDefined();

    const content = file!.content;
    expect(content).toContain(
      "import { isClass } from '../../../language-server/generated/ast.js';"
    );
    expect(content).toContain(
      "import { ClassPropertyPaletteHandler } from './elements/ClassPropertyPaletteHandler.js';"
    );
    expect(content).toContain("const someTypeChoices =");
    expect(content).toContain("this.modelState.index.getAllSomeTypes");
    expect(content).toContain(
      "} else if (isClass(semanticElement)) {\n      return ClassPropertyPaletteHandler.getPropertyPalette(semanticElement, someTypeChoices);"
    );
  });
});

describe("PropertyPaletteContribution", () => {
  test("delegates to writePropertyPaletteHandlers", () => {
    const root = tmpDir();
    const results = PropertyPaletteContribution.codeGeneration({
      langiumDeclarations: [baseClassDecl, diagramElementsDecl],
      glspRoot: root,
    } as any);

    expect(Array.isArray(results)).toBe(true);
    const classHandler = (results as any[]).find((r) =>
      r.path?.endsWith("ClassPropertyPaletteHandler.ts")
    );
    expect(classHandler).toBeDefined();
  });
});
