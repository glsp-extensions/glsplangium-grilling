import { expect, test } from "vitest";
import { checkDeclarationValidity } from "../src/validators";

test("Validator - test valid LangiumDeclaration with root", async () => {
  const langiumDeclarations = [
    {
      type: "class",
      name: "SimpleClass",
      isAbstract: false,
      decorators: ["root"],
      properties: [{ name: "simpleProperty", type: "string" }],
      extendedBy: [],
    },
  ];
  expect(() => checkDeclarationValidity(langiumDeclarations)).to.not.throw();
});

test("Validator - test invalid LangiumDeclaration with two roots", async () => {
  const langiumDeclarations = [
    {
      type: "class",
      name: "SimpleClass",
      isAbstract: false,
      decorators: ["root"],
      properties: [{ name: "simpleProperty", type: "string" }],
      extendedBy: [],
    },
    {
      type: "class",
      name: "SimpleClass1",
      isAbstract: false,
      decorators: ["root"],
      properties: [{ name: "simpleProperty", type: "string" }],
      extendedBy: [],
    },
  ];
  expect(() => checkDeclarationValidity(langiumDeclarations)).toThrowError();
});

test("Validator - test invalid LangiumDeclaration with no root", async () => {
  const langiumDeclarations = [
    {
      type: "class",
      name: "SimpleClass",
      isAbstract: false,
      decorators: [],
      properties: [{ name: "simpleProperty", type: "string" }],
      extendedBy: [],
    },
    {
      type: "class",
      name: "SimpleClass1",
      isAbstract: false,
      decorators: [],
      properties: [{ name: "simpleProperty", type: "string" }],
      extendedBy: [],
    },
  ];
  expect(() => checkDeclarationValidity(langiumDeclarations)).toThrowError();
});

test("Validator - test invalid LangiumDeclaration with abstract element that is never extended", async () => {
  const langiumDeclarations = [
    {
      type: "class",
      name: "AbstractClass",
      isAbstract: true,
      decorators: [],
      properties: [{ name: "simpleProperty", type: "string" }],
      extendedBy: [],
    },
    {
      type: "class",
      name: "SimpleClass1",
      isAbstract: false,
      decorators: ["root"],
      properties: [{ name: "simpleProperty", type: "string" }],
      extendedBy: [],
    },
  ];
  expect(() => checkDeclarationValidity(langiumDeclarations)).toThrowError();
});

test("Validator - test valid LangiumDeclaration with abstract element that is extended", async () => {
  const langiumDeclarations = [
    {
      type: "class",
      name: "AbstractClass",
      isAbstract: true,
      decorators: [],
      properties: [{ name: "simpleProperty", type: "string" }],
      extendedBy: ["ExtendAbstractClass"],
    },
    {
      type: "class",
      name: "ExtendAbstractClass",
      isAbstract: false,
      decorators: [],
      properties: [{ name: "simpleProperty1", type: "string" }],
      extendedBy: [],
    },
    {
      type: "class",
      name: "SimpleClass1",
      isAbstract: false,
      decorators: ["root"],
      properties: [{ name: "simpleProperty", type: "string" }],
      extendedBy: [],
    },
  ];
  expect(() => checkDeclarationValidity(langiumDeclarations)).to.not.throw();
});
