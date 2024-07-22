/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { Command, DeleteElementOperation, OperationHandler } from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { Edge, Node, isEdge, isNode } from "../../../language-server/generated/ast.js";
import { WorkflowModelState } from "../../model/workflow-model-state.js";
import { WorkflowCommand } from "./workflow-command.js";

@injectable()
export class WorkflowDeleteOperationHandler extends OperationHandler {
  operationType = DeleteElementOperation.KIND;

  @inject(WorkflowModelState) protected state: WorkflowModelState;

  createCommand(operation: DeleteElementOperation): Command | undefined {
    if (!operation.elementIds || operation.elementIds.length === 0) {
      return;
    }
    return new WorkflowCommand(this.state, () => this.deleteElements(operation));
  }

  protected deleteElements(operation: DeleteElementOperation): void {
    for (const elementId of operation.elementIds) {
      const element = this.state.index.findSemanticElement(elementId, isDiagramElement);
      // delete from semantic text
      if (element?.$cstNode) {
        this.state.deleteFromSemanticText(element.$cstNode.range);
      }
      // simply remove any diagram nodes or edges from the diagram
      if (isNode(element)) {
        this.deleteIncomingAndOutgoingEdges(element);
        this.deleteSizeAndPosition(element);
      }
    }
  }

  private deleteIncomingAndOutgoingEdges(node: Node): void {
    // delete from semantic text
    this.state.semanticRoot.edges
      .filter((edge) => edge.source?.$refText === node.name || edge.target?.$refText === node.name)
      .forEach((edge) => {
        if (edge.$cstNode) {
          this.state.deleteFromSemanticText(edge.$cstNode.range);
        }
      });
  }

  private deleteSizeAndPosition(node: Node): void {
    // delete from semantic text
    this.state.semanticRootDetails.metaInfos
      .filter((metaInfo) => metaInfo.node.$refText === node.name)
      .forEach((metaInfo) => {
        if (metaInfo.$cstNode) {
          this.state.deleteFromSemanticTextDetails(metaInfo.$cstNode.range);
        }
      });
  }
}

function isDiagramElement(item: unknown): item is Edge | Node {
  return isEdge(item) || isNode(item);
}
