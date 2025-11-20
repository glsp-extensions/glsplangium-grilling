import fs from "fs";
import path from "path";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("fs");
vi.mock("../src/util", () => ({
  format: vi.fn(async (s: string) => s),
}));

import {
  buildDefaultValueMapping,
  writeDefaultValueFile,
} from "../src/generator/default-value-generator";
import { format } from "../src/util";

const mockExists = fs.existsSync as unknown as Mock;
const mockMkdir = fs.mkdirSync as unknown as Mock;
const mockWrite = fs.writeFileSync as unknown as Mock;

describe("buildDefaultValueMapping", () => {
  test("collects default values from class declarations", () => {
    const decls = [
      {
        type: "class",
        name: "Person",
        properties: [
          {
            name: "name",
            types: [{ typeName: "string" }],
            defaultValue: "John",
          },
          {
            name: "age",
            types: [{ typeName: "number" }],
            defaultValue: 10,
          },
        ],
      },
    ] as any;

    const result = buildDefaultValueMapping(decls);

    expect(result.defaultMapping).toEqual({
      Person: [
        { property: "name", propertyType: "string", defaultValue: "John" },
        { property: "age", propertyType: "number", defaultValue: 10 },
      ],
    });
  });

  test("skips optional props without default when class is not @withDefaults", () => {
    const decls = [
      {
        type: "class",
        name: "Item",
        properties: [
          {
            name: "description",
            isOptional: true,
            types: [{ typeName: "string" }],
          },
        ],
      },
    ] as any;

    const result = buildDefaultValueMapping(decls);

    expect(result.defaultMapping.Item).toEqual([]);
  });

  test("includes optional props when class has @withDefaults decorator", () => {
    const decls = [
      {
        type: "class",
        name: "Item",
        decorators: ["withDefaults"],
        properties: [
          {
            name: "description",
            isOptional: true,
            types: [{ typeName: "string" }],
          },
        ],
      },
    ] as any;

    const result = buildDefaultValueMapping(decls);

    expect(result.defaultMapping.Item).toEqual([
      { property: "description", propertyType: "string" },
    ]);
  });

  test("collects @noBounds classes", () => {
    const decls = [
      { type: "class", name: "A", decorators: ["noBounds"], properties: [] },
      { type: "class", name: "B", properties: [] },
    ] as any;

    const result = buildDefaultValueMapping(decls);

    expect(result.noBoundsClasses).toEqual(["A"]);
  });

  test("extracts @astType decorators", () => {
    const decls = [
      {
        type: "class",
        name: "Edge",
        decorators: ["astType:ASSOCIATION"],
        properties: [],
      },
    ] as any;

    const result = buildDefaultValueMapping(decls);

    expect(result.astTypeMap).toEqual({
      edge: "ASSOCIATION",
    });
  });
});

describe("writeDefaultValueFile", () => {
  beforeEach(() => {
    mockExists.mockReturnValue(false);
    mockMkdir.mockReset();
    mockWrite.mockReset();
    (format as Mock).mockClear();
  });

  test("writes formatted file with default mappings", async () => {
    const extPath = "/proj/ext";
    const payload = {
      defaultMapping: {
        Person: [
          { property: "name", propertyType: "string", defaultValue: "John" },
        ],
      },
      noBoundsClasses: ["A"],
      astTypeMap: { edge: "ASSOCIATION" },
    };

    await writeDefaultValueFile(extPath, payload);

    expect(mockMkdir).toHaveBeenCalled();

    const expectedPath = path.join(
      extPath,
      "yo-generated",
      "getDefaultValue.ts"
    );

    expect(mockWrite).toHaveBeenCalledTimes(1);
    expect(mockWrite.mock.calls[0][0]).toBe(expectedPath);

    const content = mockWrite.mock.calls[0][1] as string;

    expect(content).toContain("defaultMapping");
    expect(content).toContain("Person");
    expect(content).toContain('"name"');
    expect(content).toContain('"John"');
    expect(content).toContain("noBoundsClasses");
    expect(content).toContain("astTypeMapping");
  });

  test("does not create directory if it already exists", async () => {
    mockExists.mockReturnValue(true);

    await writeDefaultValueFile("/proj/ext", {
      defaultMapping: {},
      noBoundsClasses: [],
      astTypeMap: {},
    });

    expect(mockMkdir).not.toHaveBeenCalled();
  });
});
