/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { DiagramSerializer, Serializer } from "model-service";
import { Element, isElement } from "../generated/ast.js";
import { TestServices } from "./test-module.js";
import { AstNode } from "langium";

export class TestSerializer
  implements Serializer<Element>, DiagramSerializer<Element>
{
  constructor(protected services: TestServices) {}

  serialize(root: AstNode): string {
    let str: Array<string> = [];
    if (isElement(root)) {
      str.push('"name": root.name');
    }
    str = str.filter((element) => !!element);
    const json = JSON.parse("{\n" + str.join(",\n") + "\n}");
    return JSON.stringify(json, undefined, "\t");
  }

  public asDiagram(root: Element): string {
    return "";
  }
}
