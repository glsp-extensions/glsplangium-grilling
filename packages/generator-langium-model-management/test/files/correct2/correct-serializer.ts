/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { DiagramSerializer, Serializer } from "model-service";
import {
  Root,
  isRoot,
  Element,
  isElement,
  OtherElement,
  isOtherElement,
  ConnectElementWithOtherElement,
  isConnectElementWithOtherElement,
} from "../generated/ast.js";
import { TestServices } from "./test-module.js";
import { AstNode } from "langium";

export class TestSerializer
  implements Serializer<Root>, DiagramSerializer<Root>
{
  constructor(protected services: TestServices) {}

  serialize(root: AstNode): string {
    let str: Array<string> = [];
    if (isRoot(root)) {
      str.push(
        '"elements": [\n' +
          root.elements
            .map((element) => "" + this.serializeElement(element))
            .join(",\n") +
          "\n]"
      );

      str.push(
        '"otherElements": [\n' +
          root.otherElements
            .map((element) => "" + this.serializeOtherElement(element))
            .join(",\n") +
          "\n]"
      );

      str.push(
        '"connections": [\n' +
          root.connections
            .map(
              (element) =>
                "" + this.serializeConnectElementWithOtherElement(element)
            )
            .join(",\n") +
          "\n]"
      );
    }
    str = str.filter((element) => !!element);
    const json = JSON.parse("{\n" + str.join(",\n") + "\n}");
    return JSON.stringify(json, undefined, "\t");
  }

  serializeElement(element: Element): string {
    let str: Array<string> = [];
    str.push('"__type": "Element"');
    if (element.__id !== undefined && element.__id !== null) {
      str.push('"__id": ' + '"' + element.__id + '"');
    }
    if (element.name !== undefined && element.name !== null) {
      str.push('"name": ' + '"' + element.name + '"');
    }
    return "{" + str.join(",\n") + "}";
  }

  serializeOtherElement(element: OtherElement): string {
    let str: Array<string> = [];
    str.push('"__type": "OtherElement"');
    if (element.__id !== undefined && element.__id !== null) {
      str.push('"__id": ' + '"' + element.__id + '"');
    }
    if (element.name !== undefined && element.name !== null) {
      str.push('"name": ' + '"' + element.name + '"');
    }
    return "{" + str.join(",\n") + "}";
  }

  serializeConnectElementWithOtherElement(
    element: ConnectElementWithOtherElement
  ): string {
    let str: Array<string> = [];
    str.push('"__type": "ConnectElementWithOtherElement"');
    if (element.__id !== undefined && element.__id !== null) {
      str.push('"__id": ' + '"' + element.__id + '"');
    }
    if (element.element !== undefined && element.element !== null) {
      str.push(
        '"element": ' +
          "{" +
          ' "__type": "Reference", "__refType": "Element", "__value": "' +
          (element.element.ref?.__id ?? "undefined") +
          '"}'
      );
    }
    if (element.otherElement !== undefined && element.otherElement !== null) {
      str.push(
        '"otherElement": ' +
          "{" +
          ' "__type": "Reference", "__refType": "OtherElement", "__value": "' +
          (element.otherElement.ref?.__id ?? "undefined") +
          '"}'
      );
    }
    return "{" + str.join(",\n") + "}";
  }

  public asDiagram(root: Root): string {
    return "";
  }
}
