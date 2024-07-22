/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { streamAst } from "langium";
import { Model, isNode } from "../../generated/ast.js";

export function findAvailableNodeName(container: Model, name: string): string {
  let counter = 1;
  let availableName = name + counter;
  while (
    streamAst(container).find(
      (node) => isNode(node) && node.name === availableName
    )
  ) {
    availableName = name + counter++;
  }
  return availableName;
}
