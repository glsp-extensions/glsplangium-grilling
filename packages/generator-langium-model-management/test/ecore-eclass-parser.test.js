import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { expect, test } from "vitest";
import { parseEcoreDefinition } from "../src/ecore/ecore-parser";
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});
test("EClass - test parse simple EClass", async () => {
  const _path = path.resolve("./test", "files", "ecore", "eclass.simple.ecore");
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  expect(ecoreDefinition.classes.length).toBe(2);
  expect(ecoreDefinition.classes[0].name).toBe("SimpleClass");
  expect(ecoreDefinition.classes[0].attributes.length).toBe(0);
  expect(ecoreDefinition.classes[0].isAbstract).toBe(false);
  expect(ecoreDefinition.classes[0].extends.length).toBe(0);
  expect(ecoreDefinition.classes[0].isInterface).toBe(false);
});

test("EClass - test parse EClass interface", async () => {
  const _path = path.resolve(
    "./test",
    "files",
    "ecore",
    "eclass.interface.ecore"
  );
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  expect(ecoreDefinition.classes.length).toBe(2);
  expect(ecoreDefinition.classes[0].name).toBe("SimpleClass");
  expect(ecoreDefinition.classes[0].attributes.length).toBe(0);
  expect(ecoreDefinition.classes[0].isAbstract).toBe(false);
  expect(ecoreDefinition.classes[0].extends.length).toBe(0);
  expect(ecoreDefinition.classes[0].isInterface).toBe(true);
});
test("EClass - test parse abstract EClass", async () => {
  const _path = path.resolve(
    "./test",
    "files",
    "ecore",
    "eclass.abstract.ecore"
  );
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  expect(ecoreDefinition.classes.length).toBe(2);
  expect(ecoreDefinition.classes[0].name).toBe("SimpleClass");
  expect(ecoreDefinition.classes[0].attributes.length).toBe(0);
  expect(ecoreDefinition.classes[0].isAbstract).toBe(true);
  expect(ecoreDefinition.classes[0].extends.length).toBe(0);
  expect(ecoreDefinition.classes[0].isInterface).toBe(false);
});

test("EClass - test parse abstract EClass interface", async () => {
  const _path = path.resolve(
    "./test",
    "files",
    "ecore",
    "eclass.abstract-interface.ecore"
  );
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  expect(ecoreDefinition.classes.length).toBe(2);
  expect(ecoreDefinition.classes[0].name).toBe("SimpleClass");
  expect(ecoreDefinition.classes[0].attributes.length).toBe(0);
  expect(ecoreDefinition.classes[0].isAbstract).toBe(true);
  expect(ecoreDefinition.classes[0].extends.length).toBe(0);
  expect(ecoreDefinition.classes[0].isInterface).toBe(true);
});

test("EClass - test parse EClass one supertype", async () => {
  const _path = path.resolve(
    "./test",
    "files",
    "ecore",
    "eclass.one-supertype.ecore"
  );
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  expect(ecoreDefinition.classes.length).toBe(3);
  const testClass = ecoreDefinition.classes.find(
    (c) => c.name === "SimpleClass"
  );
  expect(testClass.attributes.length).toBe(0);
  expect(testClass.isAbstract).toBe(false);
  expect(testClass.extends.length).toBe(1);
  expect(testClass.isInterface).toBe(false);
});

test("EClass - test parse EClass two supertypes", async () => {
  const _path = path.resolve(
    "./test",
    "files",
    "ecore",
    "eclass.multiple-supertypes.ecore"
  );
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  expect(ecoreDefinition.classes.length).toBe(4);
  const testClass = ecoreDefinition.classes.find(
    (c) => c.name === "SimpleClass"
  );
  expect(testClass.attributes.length).toBe(0);
  expect(testClass.isAbstract).toBe(false);
  expect(testClass.extends.length).toBe(2);
  expect(testClass.isInterface).toBe(false);
});
