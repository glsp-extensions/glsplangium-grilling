import fs from "fs";
import path from "path";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("fs");
vi.mock("../src/util", () => ({
  format: vi.fn(async (s: string) => s),
}));

import {
  buildCreationPathMapping,
  writeCreationPathFile,
} from "../src/generator/creation-path-generator";
import { format } from "../src/util";

const mockExists = fs.existsSync as unknown as Mock;
const mockMkdir = fs.mkdirSync as unknown as Mock;
const mockWrite = fs.writeFileSync as unknown as Mock;

describe("buildCreationPathMapping", () => {
  test("collects properties with decorator 'path' and resolves derived types", () => {
    const decls = [
      {
        name: "Parent",
        properties: [
          {
            name: "children",
            decorators: ["path"],
            types: [{ typeName: "Base" }],
          },
        ],
      },
      { name: "ChildA", extends: ["Base"], properties: [] },
      { name: "ChildB", extends: ["Base"], properties: [] },
    ] as any;

    const result = buildCreationPathMapping(decls);

    expect(result).toEqual({
      Parent: [
        {
          property: "children",
          allowedChildTypes: ["ChildA", "ChildB"],
        },
      ],
    });
  });

  test("falls back to direct type if no extending decls exist", () => {
    const decls = [
      {
        name: "Parent",
        properties: [
          {
            name: "items",
            decorators: ["path"],
            types: [{ typeName: "Leaf" }],
          },
        ],
      },
      { name: "Unrelated", properties: [] },
    ] as any;

    const result = buildCreationPathMapping(decls);

    expect(result).toEqual({
      Parent: [
        {
          property: "items",
          allowedChildTypes: ["Leaf"],
        },
      ],
    });
  });

  test("ignores properties without 'path' decorator", () => {
    const decls = [
      {
        name: "Parent",
        properties: [
          {
            name: "other",
            decorators: ["notPath"],
            types: [{ typeName: "X" }],
          },
        ],
      },
    ] as any;

    const result = buildCreationPathMapping(decls);
    expect(result).toEqual({});
  });

  test("supports multiple path fields under the same parent", () => {
    const decls = [
      {
        name: "Parent",
        properties: [
          { name: "a", decorators: ["path"], types: [{ typeName: "A" }] },
          { name: "b", decorators: ["path"], types: [{ typeName: "B" }] },
        ],
      },
      { name: "AChild", extends: ["A"], properties: [] },
      { name: "BChild", extends: ["B"], properties: [] },
    ] as any;

    const result = buildCreationPathMapping(decls);

    expect(result).toEqual({
      Parent: [
        { property: "a", allowedChildTypes: ["AChild"] },
        { property: "b", allowedChildTypes: ["BChild"] },
      ],
    });
  });
});

describe("writeCreationPathFile", () => {
  beforeEach(() => {
    mockExists.mockReturnValue(false);
    mockMkdir.mockReset();
    mockWrite.mockReset();
    (format as Mock).mockClear();
  });

  test("writes formatted file with mapping content", async () => {
    const extPath = "/proj/ext";
    const mapping = {
      Parent: [{ property: "children", allowedChildTypes: ["A", "B"] }],
    };

    await writeCreationPathFile(extPath, mapping);

    expect(mockMkdir).toHaveBeenCalled();

    const expectedPath = path.join(
      extPath,
      "yo-generated",
      "getCreationPath.ts"
    );

    expect(mockWrite).toHaveBeenCalledTimes(1);
    expect(mockWrite.mock.calls[0][0]).toBe(expectedPath);

    const content = mockWrite.mock.calls[0][1] as string;

    expect(content).toContain("const mapping:");
    expect(content).toContain('"children"');
    expect(content).toContain('"allowedChildTypes": [');
    expect(content).toContain('"A"');
    expect(content).toContain('"B"');
  });

  test("does not create directory if it already exists", async () => {
    mockExists.mockReturnValue(true);

    await writeCreationPathFile("/proj/ext", {});

    expect(mockMkdir).not.toHaveBeenCalled();
  });
});
