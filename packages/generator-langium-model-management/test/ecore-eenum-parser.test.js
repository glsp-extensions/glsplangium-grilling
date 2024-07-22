import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { expect, test } from "vitest";
import { parseEcoreDefinition } from "../src/ecore/ecore-parser";
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});
test("EEnum - test parse simple EEnum", async () => {
  const _path = path.resolve("./test", "files", "ecore", "eenum.ecore");
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  expect(ecoreDefinition.types.length).toBe(1);
  expect(ecoreDefinition.classes.length).toBe(1);
  expect(ecoreDefinition.types[0].name).toBe("SimpleEnum");
  const eenum = ecoreDefinition.types[0];
  expect(eenum.types.length).toBe(3);
  expect(eenum.types[0]).toBe(JSON.stringify("LITERAL1"));
  expect(eenum.types[1]).toBe(JSON.stringify("LITERAL2"));
  expect(eenum.types[2]).toBe(JSON.stringify("LITERAL3"));
});
