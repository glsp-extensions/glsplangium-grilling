/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { AstNode } from "langium";
import { DiagramSerializer, Serializer } from "model-service";
import {
  ActivityNode,
  Category,
  Edge,
  MetaInfo,
  Model,
  Node,
  Position,
  Size,
  TaskNode,
  WeightedEdge,
  isActivityNode,
  isCategory,
  isEdge,
  isMetaInfo,
  isModel,
  isNode,
  isPosition,
  isSize,
  isTaskNode,
  isWeightedEdge,
} from "./generated/ast.js";
import { WorkflowServices } from "./workflow-module.js";

/**
 * Hand-written AST serializer as there is currently no out-of-the box serializer from Langium, but it is on the roadmap.
 * cf. https://github.com/langium/langium/discussions/683
 * cf. https://github.com/langium/langium/discussions/863
 */
export class WorkflowSerializer implements Serializer<Model>, DiagramSerializer<Model> {
  constructor(protected services: WorkflowServices, protected refNameProvider = services.references.NameProvider) {}

  serialize(root: Model): string {
    const nodes = this.serializeNodes(root.nodes);
    const edges = this.serializeEdges(root.edges);
    const metaInfos = this.serializeMetaInfos(root.metaInfos);
    const serializedModel = [nodes, edges, metaInfos].filter((part) => part.length > 0).join("\n");
    return serializedModel;
  }

  serializeAstNode(astNode: AstNode): string {
    if (isNode(astNode)) {
      return this.serializeNode(astNode);
    } else if (isEdge(astNode)) {
      return this.serializeEdge(astNode);
    } else if (isMetaInfo(astNode)) {
      return this.serializeMetaInfo(astNode);
    }
    return "";
  }

  protected serializeNodes(nodes: Node[]) {
    return `${nodes.map((node) => this.serializeNode(node)).join("\n")}`;
  }

  protected serializeEdges(edges: Edge[]) {
    return `${edges.map((edge) => this.serializeEdge(edge)).join("\n")}`;
  }

  protected serializeMetaInfos(metaInfos: MetaInfo[]) {
    return `${metaInfos.map((metaInfo) => this.serializeMetaInfo(metaInfo)).join("\n")}`;
  }

  protected serializeMetaInfo(metaInfo: MetaInfo): string {
    if (isSize(metaInfo)) {
      return this.serializeSize(metaInfo);
    } else if (isPosition(metaInfo)) {
      return this.serializePosition(metaInfo);
    }
    return "";
  }

  protected serializeNode(node: Node): string {
    if (isTaskNode(node)) {
      return this.serializeTaskNode(node);
    } else if (isCategory(node)) {
      return this.serializeCategory(node);
    } else if (isActivityNode(node)) {
      return this.serializeActivityNode(node);
    }
    return "";
  }

  protected serializeTaskNode(node: TaskNode): string {
    let serializedNode = `TaskNode ${node.name}`;
    if (node.label) serializedNode += ` "${node.label}"`;
    if (node.expanded) serializedNode += ` "expanded"`;
    if (node.duration) serializedNode += ` ${node.duration}`;
    if (node.taskType) serializedNode += ` ${node.taskType}`;
    serializedNode += ";";
    return serializedNode;
  }

  protected serializeActivityNode(node: ActivityNode): string {
    let serializedNode = `ActivityNode ${node.name}`;
    if (node.nodeType) serializedNode += ` ${node.nodeType}`;
    serializedNode += ";";
    return serializedNode;
  }

  protected serializeCategory(category: Category): string {
    let serializedCategory = `Category ${category.name}`;
    if (category.label) serializedCategory += ` "${category.label}"`;
    if (category.children) serializedCategory += ` {\n${this.serialize(category.children)}\n}`;
    serializedCategory += ";";
    return serializedCategory;
  }

  protected serializeEdge(edge: Edge): string {
    if (isWeightedEdge(edge)) {
      return this.serializeWeigtedEdge(edge);
    } else {
      return `${edge.source?.$refText ?? " "} -> ${edge.target?.$refText ?? " "};`;
    }
  }

  protected serializeWeigtedEdge(edge: WeightedEdge): string {
    return `${edge.source?.$refText ?? " "} -> ${edge.probability} ${edge.target?.$refText ?? " "};`;
  }

  protected serializeSize(size: Size) {
    return `Size ${size.node.$refText} ${size.width} ${size.height};`;
  }

  protected serializePosition(position: Position) {
    return `Position ${position.node.$refText} ${position.x} ${position.y};`;
  }

  asDiagram(model: Model): string {
    if (isModel(model)) {
      return this.serialize(model);
    }
    return "";
  }
}
