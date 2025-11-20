import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { describe, expect, test } from "vitest";

import type { LangiumDeclaration } from "@borkdominik/model-management-common";
import { writeRequestOutlineActionHandlers } from "../src/generator";

function tmpDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "outline-gen-"));
}

const entityDecl: LangiumDeclaration = {
  type: "class",
  name: "Entity",
  isAbstract: true,
  decorators: [],
  extendedBy: [],
  extends: [],
  properties: [],
} as any;

const attributeDecl: LangiumDeclaration = {
  type: "class",
  name: "Attribute",
  isAbstract: false,
  decorators: [],
  extendedBy: [],
  extends: ["Entity"],
  properties: [],
} as any;

const classDecl: LangiumDeclaration = {
  type: "class",
  name: "Class",
  isAbstract: false,
  decorators: [],
  extendedBy: [],
  extends: ["Entity"],
  properties: [
    {
      name: "attributes",
      multiplicity: "*",
      decorators: [],
      types: [{ type: "reference", typeName: "Attribute" }],
    } as any,
  ],
} as any;

const packageDecl: LangiumDeclaration = {
  type: "class",
  name: "Package",
  isAbstract: false,
  decorators: [],
  extendedBy: [],
  extends: ["Entity"],
  properties: [
    {
      name: "classes",
      multiplicity: "*",
      decorators: [],
      types: [{ type: "reference", typeName: "Class" }],
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
      types: [
        { type: "reference", typeName: "Class" },
        { type: "reference", typeName: "Package" },
      ],
    } as any,
  ],
} as any;

describe("writeRequestOutlineActionHandlers", () => {
  test("generates request-class-outline-action-handler with correct outline logic", () => {
    const root = tmpDir();

    const results = writeRequestOutlineActionHandlers(root, [
      entityDecl,
      attributeDecl,
      classDecl,
      packageDecl,
      diagramElementsDecl,
    ]);

    const file = results.find((r) =>
      r.path.endsWith(
        "yo-generated/outline/request-class-outline-action-handler.ts"
      )
    );
    expect(file).toBeDefined();

    const content = file!.content;

    expect(content).toContain(
      "export class RequestClassOutlineActionHandler implements ActionHandler"
    );

    expect(content).toContain(
      "import { isClass, isPackage } from '../../../language-server/generated/ast.js';"
    );

    expect(content).toContain(
      "import { ClassDiagramModelState } from '../../../glsp-server/class-diagram/model/class-diagram-model-state.js';"
    );

    expect(content).toContain(
      "if (this.modelState.semanticRoot.diagram.diagramType !== 'CLASS')"
    );

    expect(content).toContain("const outlineTreeNodes = [");
    expect(content).toContain("label: 'Model'");
    expect(content).toContain("iconClass: 'model'");
    expect(content).toContain("isRoot: true");

    expect(content).toContain("const entities = root.entities ?? [];");
    expect(content).toContain("entities.forEach(entity => {");
    expect(content).toContain("outlineTreeNodes[0].children.push(node);");

    expect(content).toContain("if (isClass(entity)) {");
    expect(content).toContain("node.iconClass = 'class';");

    expect(content).toContain("node.children.push(");
    expect(content).toContain("(entity.attributes ?? []).map(child => ({");
    expect(content).toContain("iconClass: 'attribute'");

    expect(content).toContain("if (isPackage(entity)) {");
    expect(content).toContain("node.iconClass = 'package';");

    expect(content).toContain("(entity.classes ?? []).map(child => ({");
    expect(content).toContain("iconClass: 'class'");
  });
});
