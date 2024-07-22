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
import { GEdge, GEdgeBuilder, GGraph, GGraphBuilder, GModelElement, GModelFactory, GNode } from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import {
  ActivityNode,
  Category,
  Edge,
  Model,
  Node,
  TaskNode,
  WeightedEdge,
  isWeightedEdge,
} from "../../language-server/generated/ast.js";
import { GActivityNode, GCategory, GMissingNode, GTaskNode, GWeightedEdge } from "./graph-extension.js";
import { WorkflowModelState } from "./workflow-model-state.js";
import { isActivityNode, isCategory, isTaskNode } from "../../language-server/generated/ast.js";
import { ModelTypes } from "../common/util/model-types.js";
import { WorkflowModelIndex } from "./workflow-model-index.js";

@injectable()
export class WorkflowGModelFactory implements GModelFactory {
  @inject(WorkflowModelState)
  protected readonly modelState: WorkflowModelState;

  @inject(WorkflowModelIndex)
  protected readonly modelIndex: WorkflowModelIndex;

  private graphBuilder: GGraphBuilder<GGraph>;

  private missingNodes: Set<string>;

  createModel(): void {
    this.missingNodes = new Set();
    const newRoot = this.createGraph();
    if (newRoot) {
      // update GLSP root element in state so it can be used in any follow-up actions/commands
      this.modelState.updateRoot(newRoot);
    }
  }

  protected createGraph(): GGraph | undefined {
    const model = this.modelState.semanticRoot;
    const modelDetails = this.modelState.semanticRootDetails;
    this.graphBuilder = GGraph.builder().id(this.modelState.semanticUri);
    model.nodes.map((node) => this.createNode(node)).forEach((node) => this.graphBuilder.add(node));
    this.createEdgesAndMissingNodes(model, modelDetails).forEach((element) => this.graphBuilder.add(element));
    return this.graphBuilder.build();
  }

  /**
   * @description Creates all the edges of the graphs, handles the cases
   * where no source or target node is specified or where source or target node
   * don't exist, and creates additional nodes to display the missing node
   * on the diagram.
   * @param model The root Model or a Category
   * @returns A list of the created GModelElements
   */
  protected createEdgesAndMissingNodes(model: Model, modelDetails?: Model): GModelElement[] {
    const createdElements: GModelElement[] = [];
    // non-existent cross-references
    this.modelIndex
      .getAllInvalidReferences()
      .map((missingId) => this.createMissingNode(missingId))
      .forEach((node) => {
        createdElements.push(node);
      });
    // add missing nodes to graph
    Array.from(this.missingNodes)
      .map((id) => this.createMissingNode(id))
      .forEach((node) => {
        createdElements.push(node);
      });

    // add missing edge sources
    model.edges
      .filter((edge) => !edge.source)
      .forEach((edge) => {
        const missingNodeId = `${ModelTypes.MISSING_NODE}_${this.modelIndex.createId(edge)}`;
        const newEdge: Edge = {
          $container: edge.$container,
          $type: edge.$type,
          source: { ref: undefined, $refText: missingNodeId },
          target: edge.target,
        };
        this.modelIndex.addNodeToIndexWithDifferentId(newEdge, edge);
        createdElements.push(this.createMissingNode(missingNodeId));
        createdElements.push(this.createEdge(newEdge));
      });

    // add missing edge targets
    model.edges
      .filter((edge) => !edge.target)
      .forEach((edge) => {
        const missingNodeId = `${ModelTypes.MISSING_NODE}_${this.modelIndex.createId(edge)}`;
        const newEdge: Edge = {
          $container: edge.$container,
          $type: edge.$type,
          source: edge.source,
          target: { ref: undefined, $refText: missingNodeId },
        };
        this.modelIndex.addNodeToIndexWithDifferentId(newEdge, edge);
        createdElements.push(this.createMissingNode(missingNodeId));
        createdElements.push(this.createEdge(newEdge));
      });

    // create edges with valid target and source (remaining edges)
    model.edges
      .filter((edge) => edge.target && edge.source)
      .map((edge) => this.createEdge(edge))
      .forEach((edge) => {
        createdElements.push(edge);
      });

    return createdElements;
  }

  protected createNode(node: Node): GNode {
    if (isActivityNode(node)) {
      return this.createActivityNode(node);
    } else if (isCategory(node)) {
      return this.createCategory(node);
    } else if (isTaskNode(node)) {
      return this.createTaskNode(node);
    }
    return GNode.builder().build();
  }

  protected createActivityNode(activityNode: ActivityNode): GNode {
    const node = GActivityNode.builder().id(activityNode.name);

    if (activityNode.nodeType) {
      node.nodeType(activityNode.nodeType);
    }

    switch (activityNode.nodeType) {
      case "decision":
        node.type(ModelTypes.DECISION_NODE);
        break;
      case "fork":
        node.type(ModelTypes.FORK_NODE);
        break;
      case "join":
        node.type(ModelTypes.JOIN_NODE);
        break;
      default:
        node.type(ModelTypes.MERGE_NODE);
        break;
    }

    const size = this.modelIndex.findSize(activityNode.name);
    if (size) {
      node.size(size.width, size.height);
      node.addLayoutOption("prefWidth", size.width);
      node.addLayoutOption("prefHeight", size.height);
    }
    const position = this.modelIndex.findPosition(activityNode.name);
    if (position) {
      node.position(position.x, position.y);
    }

    return node.build();
  }

  protected createCategory(category: Category): GNode {
    const cat = GCategory.builder().type(ModelTypes.CATEGORY).id(category.name);

    if (category.label) {
      cat.name(category.label);
    } else {
      cat.name(category.name);
    }

    const size = this.modelIndex.findSize(category.name);
    if (size) {
      cat.size(size.width, size.height);
      cat.addLayoutOption("prefWidth", size.width);
      cat.addLayoutOption("prefHeight", size.height);
    }
    const position = this.modelIndex.findPosition(category.name);
    if (position) {
      cat.position(position.x, position.y);
    }

    if (category.children) {
      if (category.children.edges) {
        this.createEdgesAndMissingNodes(category.children).forEach((element) => cat.addChildren(element));
      }
      if (category.children.nodes) {
        category.children.nodes.map((node) => this.createNode(node)).forEach((node) => cat.addChildren(node));
      }
    }

    return cat.build();
  }

  protected createTaskNode(taskNode: TaskNode): GNode {
    const node = GTaskNode.builder().id(taskNode.name);

    if (taskNode.taskType) {
      node.taskType(taskNode.taskType);
      switch (taskNode.taskType) {
        case "automated":
          node.type(ModelTypes.AUTOMATED_TASK);
          break;
        case "manual":
          node.type(ModelTypes.MANUAL_TASK);
          break;
      }
    }

    if (taskNode.duration) {
      node.duration(taskNode.duration);
    }

    if (taskNode.label) {
      node.name(taskNode.label);
    } else {
      node.name(taskNode.name);
    }

    const size = this.modelIndex.findSize(taskNode.name);
    if (size) {
      node.addLayoutOption("prefWidth", size.width);
      node.addLayoutOption("prefHeight", size.height);
      node.size(size.width, size.height);
    }
    const position = this.modelIndex.findPosition(taskNode.name);
    if (position) {
      node.position(position.x, position.y);
    }

    return node.build();
  }

  protected createEdge(edge: Edge): GEdge {
    if (isWeightedEdge(edge)) {
      return this.createWeightedEdge(edge);
    } else {
      return this.createSimpleEdge(edge);
    }
  }

  protected createWeightedEdge(edge: WeightedEdge): GEdge {
    if (!edge.source || !edge.target) {
      throw new Error("Source and target must be set");
    }
    return GWeightedEdge.builder()
      .sourceId(edge.source?.$refText)
      .targetId(edge.target?.$refText)
      .id(`WeightedEdge_${edge.source?.$refText}${edge.target?.$refText}`)
      .probability(edge.probability)
      .addCssClass(edge.probability)
      .build();
  }

  protected createSimpleEdge(edge: Edge): GEdge {
    if (!edge.source || !edge.target) {
      throw new Error("Source and target must be set");
    }
    const edgeBuild = new GEdgeBuilder(GEdge)
      .sourceId(edge.source?.$refText)
      .targetId(edge.target?.$refText)
      .id(`Edge_${edge.source?.$refText}${edge.target?.$refText}`);
    return edgeBuild.build();
  }

  protected createMissingNode(missingId: string): GNode {
    const node = GMissingNode.builder().id(missingId).name(`MISSING: ${missingId}`);
    const size = this.modelIndex.findSize(missingId);
    if (size) {
      node.addLayoutOption("prefWidth", size.width);
      node.addLayoutOption("prefHeight", size.height);
      node.size(size.width, size.height);
    }
    const position = this.modelIndex.findPosition(missingId);
    if (position) {
      node.position(position.x, position.y);
    }
    return node.build();
  }
}
