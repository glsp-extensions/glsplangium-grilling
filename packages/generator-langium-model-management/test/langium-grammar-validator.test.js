import { expect, test } from "vitest";
import { checkLangiumGrammar } from "../src/validators";

const generatorConfig = {
  // DO NOT CHANGE THE VALUES OF THE PROPERTIES; THIS CAN BREAK YOUR LANGUAGE
  referenceProperty: "__id",
};
test("Validator - test valid LangiumGrammar", async () => {
  const langiumGrammar = {
    entryRule: {
      name: "Entry",
      definitions: [
        {
          name: "parserRule1",
          type: { type: "complex", typeName: "ParserRule1" },
          multiplicity: "*",
          crossReference: false,
          optional: true,
        },
      ],
    },
    typeRules: [],
    parserRules: [
      {
        name: "ParserRule1",
        isAbstract: false,
        extendedBy: [],
        definitions: [
          {
            name: "name",
            type: { type: "simple", typeName: "string" },
            multiplicity: "1",
            crossReference: false,
            optional: false,
          },
        ],
      },
    ],
  };
  expect(() =>
    checkLangiumGrammar(langiumGrammar, generatorConfig)
  ).to.not.throw();
});

test("Validator - test invalid LangiumGrammar", async () => {
  const langiumGrammar = {
    entryRule: {
      name: "Entry",
      definitions: [
        {
          name: "parserRule1",
          type: { type: "complex", typeName: "ParserRule1" },
          multiplicity: "*",
          crossReference: false,
          optional: true,
        },
      ],
    },
    typeRules: [],
    parserRules: [
      {
        name: "ParserRule1",
        isAbstract: false,
        extendedBy: [],
        definitions: [
          {
            name: "name",
            type: { type: "simple", typeName: "string" },
            multiplicity: "1",
            crossReference: false,
            optional: false,
          },
          {
            name: "parserRule1",
            type: { type: "complex", typeName: "ParserRule1" },
            multiplicity: "1",
            crossReference: false,
            optional: false,
          },
        ],
      },
    ],
  };
  expect(() =>
    checkLangiumGrammar(langiumGrammar, generatorConfig)
  ).toThrowError();
});
