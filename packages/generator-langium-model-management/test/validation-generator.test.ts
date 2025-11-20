import fs from "fs";
import os from "os";
import path from "path";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("fs");
vi.mock("../src/util", () => ({
  format: vi.fn(async (s: string) => s),
}));

vi.mock("ts-morph", () => {
  class FakeProperty {
    constructor(
      public name: string,
      public decorators: any[],
      public typeText: string,
      public isOptional: boolean = false
    ) {}
    getName() {
      return this.name;
    }
    getDecorators() {
      return this.decorators;
    }
    getTypeNode() {
      return undefined;
    }
    getType() {
      return { getText: () => this.typeText };
    }
    hasQuestionToken() {
      return this.isOptional;
    }
  }

  class FakeClass {
    constructor(
      private _name: string,
      private _properties: FakeProperty[]
    ) {}
    getName() {
      return this._name;
    }
    getProperties() {
      return this._properties;
    }
  }

  const fakeSourceFile = {
    getImportDeclarations: () => [
      {
        getModuleSpecifierValue: () => "class-validator",
        getNamedImports: () => [{ getName: () => "MinLength" }],
      },
    ],
    getClasses: () => [
      new FakeClass("Person", [
        new FakeProperty(
          "name",
          [
            {
              getName: () => "MinLength",
              getText: () => "@MinLength(3)",
              getArguments: () => [],
            },
          ],
          "string"
        ),
        new FakeProperty("age", [], "number", true),
      ]),
    ],
  };

  return {
    Project: class {
      addSourceFileAtPath() {
        return fakeSourceFile;
      }
    },
  };
});

import {
  buildValidationInfo,
  generateValidationFiles,
} from "../src/generator/validation-generator";
import { format } from "../src/util";

const mockWrite = fs.writeFileSync as unknown as Mock;
const mockMkdir = fs.mkdirSync as unknown as Mock;
const mockExists = fs.existsSync as unknown as Mock;

function createTempDef(content: string) {
  const temp = path.join(os.tmpdir(), `def-${Math.random()}.ts`);
  fs.writeFileSync(temp, content);
  return temp;
}

describe("buildValidationInfo", () => {
  test("extracts entities and properties from mocked ts-morph", () => {
    const def = createTempDef("ignored");

    const info = (buildValidationInfo as any)(def);

    expect(info.entities.length).toBe(1);

    const cls = info.entities[0];
    expect(cls.name).toBe("Person");
    expect(cls.dtoClassName).toBe("PersonValidationElement");

    expect(info.decoratorImports).toEqual([
      { from: "class-validator", names: ["MinLength"] },
    ]);

    const props = cls.props.map((p: any) => p.name.replace(/\?$/, ""));
    expect(props).toEqual(["name"]);
  });
});

describe("generateValidationFiles", () => {
  beforeEach(() => {
    mockWrite.mockReset();
    mockMkdir.mockReset();
    mockExists.mockReturnValue(false);
    (format as Mock).mockClear();
  });

  test("writes validation-elements and validator files", async () => {
    const defContent = `
      import { MinLength } from "class-validator";

      export class Person {
        @MinLength(3)
        name: string;

        age?: number;
      }
    `;

    const defPath = createTempDef(defContent);
    const extPath = "/project/ext";

    mockExists.mockReturnValue(false);

    await generateValidationFiles(extPath);

    const writtenFiles = mockWrite.mock.calls.map((c) => c[0]);
    const validationElementsPath = path.join(
      extPath,
      "yo-generated",
      "validation",
      "validation-elements.ts"
    );
    const validatorPath = path.join(
      extPath,
      "yo-generated",
      "validation",
      "validator.ts"
    );

    expect(writtenFiles).toContain(validationElementsPath);
    expect(writtenFiles).toContain(validatorPath);

    const elementsContent = mockWrite.mock.calls.find(
      (c) => c[0] === validationElementsPath
    )![1];

    expect(elementsContent).toContain("export class PersonValidationElement");
    expect(elementsContent).toContain("@MinLength");

    const validatorContent = mockWrite.mock.calls.find(
      (c) => c[0] === validatorPath
    )![1];

    expect(validatorContent).toContain("validateSync");
    expect(validatorContent).toContain("PersonValidationElement");
  });

  test("calls mkdirSync twice (recursive) even when folders exist", async () => {
    mockExists.mockReturnValue(true);

    const def = createTempDef("ignored");
    await generateValidationFiles("/proj/ext");

    expect(mockMkdir).toHaveBeenCalledTimes(2);
  });
});
