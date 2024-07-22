import { expect, test } from "vitest";
import { transformDeclaration } from "../src/transformer";

function compareObjects(langiumDeclaration1, langiumDeclaration2) {
  return Object.keys(langiumDeclaration1).every((key) => {
    if (typeof langiumDeclaration1[key] === "object") {
      if (Array.isArray(langiumDeclaration1[key])) {
        return langiumDeclaration1[key].every((item, index) =>
          compareObjects(item, langiumDeclaration2[key][index])
        );
      } else {
        return compareObjects(
          langiumDeclaration1[key],
          langiumDeclaration2[key]
        );
      }
    } else {
      return langiumDeclaration1[key] === langiumDeclaration2[key];
    }
  });
}

test("Transformer - test transformation from Declaration to LangiumDeclaration", async () => {
  const tsDeclarations = [
    {
      type: "class",
      name: "SimpleClass",
      isAbstract: false,
      decorators: ["root"],
      properties: [
        {
          name: "simpleProperty",
          type: [{ type: "simple", typeName: "string" }],
        },
      ],
      extends: [],
    },
  ];
  const validLangiumDeclarations = [
    {
      type: "class",
      name: "SimpleClass",
      isAbstract: false,
      decorators: ["root"],
      properties: [
        {
          name: "simpleProperty",
          type: [{ type: "simple", typeName: "string" }],
        },
      ],
      extendedBy: [],
    },
  ];
  expect(() =>
    compareObjects(
      transformDeclaration(tsDeclarations),
      validLangiumDeclarations
    )
  ).to.not.throw();
});

test("Transformer - test transformation from Declaration to LangiumDeclaration with extends", async () => {
  const tsDeclarations = [
    {
      type: "class",
      name: "SimpleClass",
      isAbstract: false,
      decorators: ["root"],
      properties: [
        {
          name: "simpleProperty",
          type: [{ type: "simple", typeName: "string" }],
        },
      ],
      extends: [],
    },
    {
      type: "class",
      name: "ExtendedClass",
      isAbstract: false,
      decorators: ["root"],
      properties: [
        {
          name: "extendedProperty",
          type: [{ type: "simple", typeName: "string" }],
        },
      ],
      extends: ["SimpleClass"],
    },
  ];
  const validLangiumDeclarations = [
    {
      type: "class",
      name: "SimpleClass",
      isAbstract: false,
      decorators: ["root"],
      properties: [
        {
          name: "simpleProperty",
          type: [{ type: "simple", typeName: "string" }],
        },
      ],
      extendedBy: ["SimpleClass"],
    },
    {
      type: "class",
      name: "ExtendedClass",
      isAbstract: false,
      decorators: ["root"],
      properties: [
        {
          name: "extendedProperty",
          type: [{ type: "simple", typeName: "string" }],
        },
      ],
      extendedBy: [],
    },
  ];
  expect(() =>
    compareObjects(
      transformDeclaration(tsDeclarations),
      validLangiumDeclarations
    )
  ).to.not.throw();
});

test("Transformer - test transformation from Declaration to LangiumDeclaration with extends", async () => {
  const tsDeclarations = [
    {
      type: "class",
      name: "SimpleClass",
      isAbstract: false,
      decorators: ["root"],
      properties: [
        {
          name: "simpleProperty",
          type: [
            { type: "simple", typeName: "string" },
            { type: "simple", typeName: "number" },
          ],
        },
      ],
      extends: [],
    },
  ];
  const validLangiumDeclarations = [
    {
      type: "class",
      name: "SimpleClass",
      isAbstract: false,
      decorators: ["root"],
      properties: [
        {
          name: "simpleProperty",
          type: [{ type: "simple", typeName: "UnionType_0" }],
        },
      ],
      extendedBy: [],
    },
    {
      type: "type",
      name: "UnionType_0",
      isAbstract: true,
      decorators: [],
      properties: [
        {
          type: [
            { type: "simple", typeName: "string" },
            { type: "simple", typeName: "number" },
          ],
        },
      ],
    },
  ];
  expect(() =>
    compareObjects(
      transformDeclaration(tsDeclarations),
      validLangiumDeclarations
    )
  ).to.not.throw();
});
