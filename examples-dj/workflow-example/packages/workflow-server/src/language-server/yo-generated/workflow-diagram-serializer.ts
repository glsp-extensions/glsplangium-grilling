/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { DiagramSerializer, Serializer } from "model-service";
import {
  Model,
  isModel,
  TaskNode,
  isTaskNode,
  Category,
  isCategory,
  ActivityNode,
  isActivityNode,
  Edge,
  isEdge,
  WeightedEdge,
  isWeightedEdge,
  Size,
  isSize,
  Position,
  isPosition,
  NodeType,
  isNodeType,
  TaskType,
  isTaskType,
  Weight,
  isWeight,
  Node,
  isNode,
  MetaInfo,
  isMetaInfo,
} from "../generated/ast.js";
import { WorkflowDiagramServices } from "./workflow-diagram-module.js";
import { AstNode } from "langium";

export class WorkflowDiagramSerializer
  implements Serializer<Model>, DiagramSerializer<Model>
{
  constructor(protected services: WorkflowDiagramServices) {}

  serialize(root: AstNode): string {
    let str: Array<string> = [];
    if (isModel(root)) {
      str.push(
        '"nodes": [\n' +
          root.nodes
            .map((element) => "" + this.serializeNode(element))
            .join(",\n") +
          "\n]"
      );

      str.push(
        '"edges": [\n' +
          root.edges
            .map((element) => "" + this.serializeEdge(element))
            .join(",\n") +
          "\n]"
      );

      str.push(
        '"metaInfos": [\n' +
          root.metaInfos
            .map((element) => "" + this.serializeMetaInfo(element))
            .join(",\n") +
          "\n]"
      );
    }
    str = str.filter((element) => !!element);
    const json = JSON.parse("{\n" + str.join(",\n") + "\n}");
    return JSON.stringify(json, undefined, "\t");
  }

  serializeTaskNode(element: TaskNode): string {
    let str: Array<string> = [];
    str.push('"__type": "TaskNode"');
    if (element.__id !== undefined && element.__id !== null) {
      str.push('"__id": ' + '"' + element.__id + '"');
    }
    if (element.label !== undefined && element.label !== null) {
      str.push('"label": ' + '"' + element.label + '"');
    }
    if (element.duration !== undefined && element.duration !== null) {
      str.push('"duration": ' + element.duration + "");
    }
    if (element.taskType !== undefined && element.taskType !== null) {
      str.push('"taskType": ' + this.serializeTaskType(element.taskType));
    }
    if (element.reference !== undefined && element.reference !== null) {
      str.push('"reference": ' + '"' + element.reference + '"');
    }
    if (element.name !== undefined && element.name !== null) {
      str.push('"name": ' + '"' + element.name + '"');
    }
    return "{" + str.join(",\n") + "}";
  }

  serializeCategory(element: Category): string {
    let str: Array<string> = [];
    str.push('"__type": "Category"');
    if (element.__id !== undefined && element.__id !== null) {
      str.push('"__id": ' + '"' + element.__id + '"');
    }
    if (element.children !== undefined && element.children !== null) {
      str.push('"children": ' + this.serializeModel(element.children));
    }
    if (element.label !== undefined && element.label !== null) {
      str.push('"label": ' + '"' + element.label + '"');
    }
    if (element.name !== undefined && element.name !== null) {
      str.push('"name": ' + '"' + element.name + '"');
    }
    return "{" + str.join(",\n") + "}";
  }

  serializeActivityNode(element: ActivityNode): string {
    let str: Array<string> = [];
    str.push('"__type": "ActivityNode"');
    if (element.__id !== undefined && element.__id !== null) {
      str.push('"__id": ' + '"' + element.__id + '"');
    }
    if (element.nodeType !== undefined && element.nodeType !== null) {
      str.push('"nodeType": ' + this.serializeNodeType(element.nodeType));
    }
    if (element.name !== undefined && element.name !== null) {
      str.push('"name": ' + '"' + element.name + '"');
    }
    return "{" + str.join(",\n") + "}";
  }

  serializeEdge(element: Edge): string {
    let str: Array<string> = [];
    if (isWeightedEdge(element)) {
      return this.serializeWeightedEdge(element);
    }
    str.push('"__type": "Edge"');
    if (element.__id !== undefined && element.__id !== null) {
      str.push('"__id": ' + '"' + element.__id + '"');
    }
    if (element.source !== undefined && element.source !== null) {
      str.push(
        '"source": ' +
          "{" +
          ' "__type": "Reference", "__refType": "Node", "__value": "' +
          (element.source.ref?.__id ?? "undefined") +
          '"}'
      );
    }
    if (element.target !== undefined && element.target !== null) {
      str.push(
        '"target": ' +
          "{" +
          ' "__type": "Reference", "__refType": "Node", "__value": "' +
          (element.target.ref?.__id ?? "undefined") +
          '"}'
      );
    }
    return "{" + str.join(",\n") + "}";
  }

  serializeWeightedEdge(element: WeightedEdge): string {
    let str: Array<string> = [];
    str.push('"__type": "WeightedEdge"');
    if (element.__id !== undefined && element.__id !== null) {
      str.push('"__id": ' + '"' + element.__id + '"');
    }
    if (element.weight !== undefined && element.weight !== null) {
      str.push('"weight": ' + this.serializeWeight(element.weight));
    }
    if (element.source !== undefined && element.source !== null) {
      str.push(
        '"source": ' +
          "{" +
          ' "__type": "Reference", "__refType": "Node", "__value": "' +
          (element.source.ref?.__id ?? "undefined") +
          '"}'
      );
    }
    if (element.target !== undefined && element.target !== null) {
      str.push(
        '"target": ' +
          "{" +
          ' "__type": "Reference", "__refType": "Node", "__value": "' +
          (element.target.ref?.__id ?? "undefined") +
          '"}'
      );
    }
    return "{" + str.join(",\n") + "}";
  }

  serializeSize(element: Size): string {
    let str: Array<string> = [];
    str.push('"__type": "Size"');
    if (element.__id !== undefined && element.__id !== null) {
      str.push('"__id": ' + '"' + element.__id + '"');
    }
    if (element.height !== undefined && element.height !== null) {
      str.push('"height": ' + element.height + "");
    }
    if (element.width !== undefined && element.width !== null) {
      str.push('"width": ' + element.width + "");
    }
    if (element.node !== undefined && element.node !== null) {
      str.push(
        '"node": ' +
          "{" +
          ' "__type": "Reference", "__refType": "Node", "__value": "' +
          (element.node.ref?.__id ?? "undefined") +
          '"}'
      );
    }
    return "{" + str.join(",\n") + "}";
  }

  serializePosition(element: Position): string {
    let str: Array<string> = [];
    str.push('"__type": "Position"');
    if (element.__id !== undefined && element.__id !== null) {
      str.push('"__id": ' + '"' + element.__id + '"');
    }
    if (element.x !== undefined && element.x !== null) {
      str.push('"x": ' + element.x + "");
    }
    if (element.y !== undefined && element.y !== null) {
      str.push('"y": ' + element.y + "");
    }
    if (element.node !== undefined && element.node !== null) {
      str.push(
        '"node": ' +
          "{" +
          ' "__type": "Reference", "__refType": "Node", "__value": "' +
          (element.node.ref?.__id ?? "undefined") +
          '"}'
      );
    }
    return "{" + str.join(",\n") + "}";
  }

  serializeModel(element: Model): string {
    let str: Array<string> = [];
    if (element.nodes !== undefined && element.nodes !== null) {
      str.push(
        '"nodes": [' +
          element.nodes
            .map((property) => this.serializeNode(property))
            .join(",") +
          "]"
      );
    }
    if (element.edges !== undefined && element.edges !== null) {
      str.push(
        '"edges": [' +
          element.edges
            .map((property) => this.serializeEdge(property))
            .join(",") +
          "]"
      );
    }
    if (element.metaInfos !== undefined && element.metaInfos !== null) {
      str.push(
        '"metaInfos": [' +
          element.metaInfos
            .map((property) => this.serializeMetaInfo(property))
            .join(",") +
          "]"
      );
    }
    return "{" + str.join(",\n") + "}";
  }

  serializeNodeType(element: NodeType): any {
    return '"' + element + '"';
  }

  serializeTaskType(element: TaskType): any {
    return '"' + element + '"';
  }

  serializeWeight(element: Weight): any {
    return '"' + element + '"';
  }

  serializeNode(element: Node): any {
    if (isTaskNode(element)) {
      return this.serializeTaskNode(element);
    }
    if (isCategory(element)) {
      return this.serializeCategory(element);
    }
    if (isActivityNode(element)) {
      return this.serializeActivityNode(element);
    }
  }

  serializeMetaInfo(element: MetaInfo): any {
    if (isSize(element)) {
      return this.serializeSize(element);
    }
    if (isPosition(element)) {
      return this.serializePosition(element);
    }
  }

  public asDiagram(root: Model): string {
    return "";
  }
}
