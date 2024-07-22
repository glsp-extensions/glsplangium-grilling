import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { expect, test } from "vitest";
import { parseEcoreDefinition } from "../src/ecore/ecore-parser";
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});
test("EAttribute - test parse simple EAttribute", async () => {
  const _path = path.resolve(
    "./test",
    "files",
    "ecore",
    "eattribute.simple.ecore"
  );
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  const ecoreClass = ecoreDefinition.classes.find(
    (ec) => ec.name === "SimpleClass"
  );
  expect(ecoreClass.attributes.length).toBe(1);
  const eAttribute = ecoreClass.attributes[0];
  expect(eAttribute.name).toBe("simpleAttribute");
  expect(eAttribute.containment).toBe(true);
  expect(eAttribute.type).toBe("string");
});

test("EAttribute - test parse multiple EAttribute", async () => {
  const _path = path.resolve(
    "./test",
    "files",
    "ecore",
    "eattribute.multiple.ecore"
  );
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  const ecoreClass = ecoreDefinition.classes.find(
    (ec) => ec.name === "SimpleClass"
  );
  expect(ecoreClass.attributes.length).toBeGreaterThan(1);
});

test("EAttribute - test parse EReference containment", async () => {
  const _path = path.resolve(
    "./test",
    "files",
    "ecore",
    "eattribute.containment-reference.ecore"
  );
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  const ecoreClass = ecoreDefinition.classes.find(
    (ec) => ec.name === "SimpleClass"
  );
  expect(ecoreClass.attributes.length).toBe(1);
  const eAttribute = ecoreClass.attributes[0];
  expect(eAttribute.name).toBe("simpleReference");
  expect(eAttribute.containment).toBe(true);
});

test("EAttribute - test parse EReference reference", async () => {
  const _path = path.resolve(
    "./test",
    "files",
    "ecore",
    "eattribute.cross-reference.ecore"
  );
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  const ecoreClass = ecoreDefinition.classes.find(
    (ec) => ec.name === "SimpleClass"
  );
  expect(ecoreClass.attributes.length).toBe(1);
  const eAttribute = ecoreClass.attributes[0];
  expect(eAttribute.name).toBe("simpleReference");
  expect(eAttribute.containment).toBe(false);
});

test("EAttribute - test parse EAttribute optional", async () => {
  const _path = path.resolve(
    "./test",
    "files",
    "ecore",
    "eattribute.optional.ecore"
  );
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  const ecoreClass = ecoreDefinition.classes.find(
    (ec) => ec.name === "SimpleClass"
  );
  expect(ecoreClass.attributes.length).toBe(1);
  const eAttribute = ecoreClass.attributes[0];
  expect(eAttribute.name).toBe("simpleAttribute");
  expect(eAttribute.multiplicity).toBe("?");
});
test("EAttribute - test parse EAttribute exactly one multiplicity", async () => {
  const _path = path.resolve(
    "./test",
    "files",
    "ecore",
    "eattribute.multiplicity-1.ecore"
  );
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  const ecoreClass = ecoreDefinition.classes.find(
    (ec) => ec.name === "SimpleClass"
  );
  expect(ecoreClass.attributes.length).toBe(1);
  const eAttribute = ecoreClass.attributes[0];
  expect(eAttribute.name).toBe("simpleAttribute");
  expect(eAttribute.multiplicity).toBe("1");
});

test("EAttribute - test parse EAttribute one or more multiplicity", async () => {
  const _path = path.resolve(
    "./test",
    "files",
    "ecore",
    "eattribute.multiplicity-plus.ecore"
  );
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  const ecoreClass = ecoreDefinition.classes.find(
    (ec) => ec.name === "SimpleClass"
  );
  expect(ecoreClass.attributes.length).toBe(1);
  const eAttribute = ecoreClass.attributes[0];
  expect(eAttribute.name).toBe("simpleAttribute");
  expect(eAttribute.multiplicity).toBe("+");
});

test("EAttribute - test parse EAttribute zero or more multiplicity", async () => {
  const _path = path.resolve(
    "./test",
    "files",
    "ecore",
    "eattribute.multiplicity-star.ecore"
  );
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  const ecoreClass = ecoreDefinition.classes.find(
    (ec) => ec.name === "SimpleClass"
  );
  expect(ecoreClass.attributes.length).toBe(1);
  const eAttribute = ecoreClass.attributes[0];
  expect(eAttribute.name).toBe("simpleAttribute");
  expect(eAttribute.multiplicity).toBe("*");
});
