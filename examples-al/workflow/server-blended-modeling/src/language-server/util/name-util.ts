/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { streamAst } from "langium";
import { Model, isNode } from "../generated/ast.js";

/**
 * Provides a name for newly created nodes
 * @param container the model root
 * @param name the prefix of the name e.g. '_tn'
 * @returns a new name that does not yet exists in the model
 */
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
