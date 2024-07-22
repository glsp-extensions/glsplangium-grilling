import { expect, test } from "vitest";
import {
  transformLangiumDeclarationToEntryRule,
  transformLangiumDeclarationsToTypeRules,
} from "../src/transformer";
const generatorConfig = {
  // DO NOT CHANGE THE VALUES OF THE PROPERTIES; THIS CAN BREAK YOUR LANGUAGE
  referenceProperty: "__id",
};
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
  const langiumDeclarations = [
    {
      type: "class",
      name: "SimpleClass",
      isAbstract: false,
      decorators: ["root"],
      properties: [
        {
          name: "simpleProperty",
          type: [{ type: "simple", typeName: "string" }],
          decorators: [],
          isOptional: false,
          multiplicity: "1",
        },
      ],
      extendedBy: [],
    },
  ];
  const validEntryRule = {
    name: "SimpleClass",
    definitions: [
      {
        name: "simpleProperty",
        type: { type: "simple", typeName: "string" },
        multiplicity: "1",
        crossReference: false,
        optional: false,
      },
    ],
  };
  expect(
    compareObjects(
      transformLangiumDeclarationToEntryRule(langiumDeclarations[0]),
      validEntryRule
    )
  ).toBe(true);
});

test("Transformer - test transformation from Declaration to LangiumDeclaration types", async () => {
  const langiumDeclarations = [
    {
      type: "type",
      name: "SimpleType",
      isAbstract: true,
      decorators: [],
      properties: [
        {
          name: "simpleProperty",
          types: [
            { type: "simple", typeName: "string" },
            { type: "simple", typeName: "number" },
          ],
          decorators: [],
          isOptional: false,
          multiplicity: "1",
        },
      ],
      extendedBy: [],
    },
  ];
  const validTypeRules = [
    {
      name: "SimpleType",
      definitions: [
        { type: "simple", typeName: "string" },
        { type: "simple", typeName: "number" },
      ],
    },
  ];
  expect(
    compareObjects(
      transformLangiumDeclarationsToTypeRules(langiumDeclarations),
      validTypeRules
    )
  ).toBe(true);
});

test("Transformer - test transformation from Declaration to LangiumDeclaration abstract class", async () => {
  const langiumDeclarations = [
    {
      type: "class",
      name: "SimpleClass",
      isAbstract: false,
      decorators: [],
      properties: [
        {
          name: "simpleExtendedProperty",
          types: [
            { type: "simple", typeName: "string" },
            { type: "simple", typeName: "number" },
          ],
          decorators: [],
          isOptional: false,
          multiplicity: "1",
        },
      ],
      extendedBy: [],
    },
    {
      type: "class",
      name: "AbstractClass",
      isAbstract: true,
      decorators: [],
      properties: [
        {
          name: "simpleProperty",
          types: [],
          decorators: [],
          isOptional: false,
          multiplicity: "1",
        },
      ],
      extendedBy: ["SimpleClass"],
    },
  ];
  const validTypeRules = [
    {
      name: "AbstractClass",
      definitions: [{ type: "simple", typeName: "SimpleClass" }],
    },
    {
      name: "UnionType_0",
      definitions: [
        { type: "simple", typeName: "string" },
        { type: "simple", typeName: "number" },
      ],
    },
  ];
  const newTypeRules =
    transformLangiumDeclarationsToTypeRules(langiumDeclarations);
  expect(compareObjects(newTypeRules, validTypeRules)).toBe(true);
});
