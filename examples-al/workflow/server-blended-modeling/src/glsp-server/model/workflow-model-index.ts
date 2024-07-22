/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { GModelIndex } from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import {
  Node,
  Edge,
  Model,
  isNode,
  isEdge,
  Category,
  isCategory,
  ActivityNode,
  TaskNode,
  isActivityNode,
  isTaskNode,
  Size,
  isSize,
  isPosition,
  Position,
} from "../../language-server/generated/ast.js";
import { WorkflowLSPServices } from "../../integration.js";
import { AstNode, isAstNode, streamAst, streamReferences } from "langium";

/**
 * Custom model index that indexes the semantic elements (AstNodes) of the model.
 */
@injectable()
export class WorkflowModelIndex extends GModelIndex {
  @inject(WorkflowLSPServices) services: WorkflowLSPServices;

  protected idToSemanticNode = new Map<string, AstNode>();
  protected references = new Set<string>();

  createId(node?: AstNode): string | undefined {
    return this.services.language.references.NameProvider.getLocalName(node);
  }

  indexSemanticRoot(root: Model, rootDetails?: Model): void {
    this.idToSemanticNode.clear();
    this.references.clear();
    streamAst(root).forEach((node) => {
      this.indexAstNode(node);
      streamReferences(node).forEach((reference) => {
        this.references.add(reference.reference.$refText);
      });
    });
    if (rootDetails) {
      streamAst(rootDetails).forEach((node) => {
        this.indexAstNode(node);
        streamReferences(node).forEach((reference) => {
          this.references.add(reference.reference.$refText);
        });
      });
    }
  }

  protected indexAstNode(node: AstNode): void {
    const id = this.createId(node);
    if (id) {
      this.idToSemanticNode.set(id, node);
    }
  }

  getAllInvalidReferences(): string[] {
    return Array.from(this.references).filter((referenceId) => !this.findSemanticElement(referenceId, isAstNode));
  }

  /**
   * Creates an index with a different ID for the provided node.
   * This is necessary to index edges with missing nodes.
   * @param idNode the node with the ID that should be used for the index
   * @param node tte noded that should be indexed by the given ID
   */
  addNodeToIndexWithDifferentId(idNode: AstNode, node: AstNode): void {
    const id = this.createId(idNode);
    if (id) {
      this.idToSemanticNode.set(id, node);
    }
  }

  findNode(id: string): Node | undefined {
    return this.findSemanticElement(id, isNode);
  }

  findEdge(id: string): Edge | undefined {
    return this.findSemanticElement(id, isEdge);
  }

  findCategory(id: string): Category | undefined {
    return this.findSemanticElement(id, isCategory);
  }

  findActivityNode(id: string): ActivityNode | undefined {
    return this.findSemanticElement(id, isActivityNode);
  }

  findTaskNode(id: string): TaskNode | undefined {
    return this.findSemanticElement(id, isTaskNode);
  }

  findSize(nodeId: string): Size | undefined {
    return this.findSemanticElement(`Size_${nodeId}`, isSize);
  }

  findPosition(nodeId: string): Position | undefined {
    return this.findSemanticElement(`Position_${nodeId}`, isPosition);
  }

  findByType<T extends AstNode>(guard: (item: unknown) => item is T): AstNode[] {
    const astNodes: Set<AstNode> = new Set();
    this.idToSemanticNode.forEach((node) => {
      if (guard(node)) {
        astNodes.add(node);
      }
    });
    return Array.from(astNodes);
  }

  findSemanticElement<T extends AstNode>(id: string, guard: (item: unknown) => item is T): T | undefined {
    const semanticNode = this.idToSemanticNode.get(id);
    return guard(semanticNode) ? semanticNode : undefined;
  }

  findOutgoingEdges(nodeId: string): Edge[] {
    const edges: Set<Edge> = new Set();
    this.idToSemanticNode.forEach((node) => {
      if (isEdge(node) && node.source?.$refText === nodeId) {
        edges.add(node);
      }
    });
    return Array.from(edges);
  }
}
