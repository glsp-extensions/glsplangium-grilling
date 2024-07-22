import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { expect, test } from "vitest";
import { parseEcoreDefinition } from "../src/ecore/ecore-parser";
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

test("EDataType - test parse simple EDataType", async () => {
  const _path = path.resolve("./test", "files", "ecore", "edatatype.ecore");
  const fileContent = fs.readFileSync(_path, "utf-8");
  const parsedXml = parser.parse(fileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  expect(ecoreDefinition.types.length).toBe(0);
  expect(ecoreDefinition.classes.length).toBe(1);
  expect(ecoreDefinition.dataTypes.length).toBe(1);
  expect(ecoreDefinition.dataTypes[0]).toBe("SimpleDataType");
});
