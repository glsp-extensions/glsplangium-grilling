import { expect, test } from "vitest";
import { checkGeneratorConfigValidity } from "../src/validators";

test("Validator - test valid Generator Config", async () => {
  const generatorConfig = {
    // DO NOT CHANGE THE VALUES OF THE PROPERTIES; THIS CAN BREAK YOUR LANGUAGE
    referenceProperty: "__id",
  };
  expect(() => checkGeneratorConfigValidity(generatorConfig)).to.not.throw();
});

test("Validator - test invalid Generator config throws", async () => {
  const generatorConfig = {
    // DO NOT CHANGE THE VALUES OF THE PROPERTIES; THIS CAN BREAK YOUR LANGUAGE
    referenceProperty: true,
  };
  expect(() => checkGeneratorConfigValidity(generatorConfig)).toThrowError();
});
