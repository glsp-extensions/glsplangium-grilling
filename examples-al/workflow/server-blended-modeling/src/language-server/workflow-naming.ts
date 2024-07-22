/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { AstNode, CstNode, findNodeForProperty, isNamed, NameProvider } from "langium";
import { WorkflowServices } from "./workflow-module.js";
import { isEdge, isMetaInfo, isNode } from "./generated/ast.js";

/**
 * A name provider that returns the local name of a node by default.
 */
export class WorkflowNameProvider implements NameProvider {
  constructor(protected services: WorkflowServices) {}

  /**
   * Returns the direct name of the node if it has one.
   * Creates unique name for edges and MetaInfo nodes.
   *
   * @param node node
   * @returns direct, local name of the node if available
   */
  getLocalName(node?: AstNode): string | undefined {
    if (isNode(node)) {
      return node && isNamed(node) ? node.name : undefined;
    } else if (isEdge(node)) {
      return `${node.$type}_${node.source?.$refText}${node.target?.$refText}`;
    } else if (isMetaInfo(node)) {
      return `${node.$type}_${node.node?.$refText}`;
    } else {
      return undefined;
    }
  }

  getName(node?: AstNode): string | undefined {
    return node ? this.getLocalName(node) : undefined;
  }

  getNameNode(node: AstNode): CstNode | undefined {
    return findNodeForProperty(node.$cstNode, "name");
  }
}
