/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import {
  Command,
  DeleteElementOperation,
  OperationHandler,
} from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import {
  Edge,
  Node,
  isCategory,
  isEdge,
  isNode,
} from "../../../language-server/generated/ast.js";
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
    const { patch, patchDetails } = this.deleteElements(operation);
    return new WorkflowCommand(
      this.state,
      patch?.length > 0 ? JSON.stringify(patch) : undefined,
      patchDetails?.length > 0 ? JSON.stringify(patchDetails) : undefined
    );
  }

  protected deleteElements(operation: DeleteElementOperation): {
    patch: any;
    patchDetails: any;
  } {
    let patch: any[] = [];
    const patchDetails: any[] = [];
    for (const elementId of operation.elementIds) {
      const element = this.state.index.findSemanticElement(
        elementId,
        isDiagramElement
      );
      const path = this.state.index.findPath(elementId);
      patch.push({
        op: "remove",
        path,
      });
      if (isNode(element)) {
        patch = [...this.deleteIncomingAndOutgoingEdges(elementId), ...patch];
        patchDetails.push(...this.deleteNestedElements(element));
        patchDetails.push(...this.deleteSizeAndPosition(elementId));
      }
    }
    patch.sort(patchPrioritySorter);
    patchDetails.sort(patchPrioritySorter);
    return { patch, patchDetails };
  }

  private deleteNestedElements(element: Node) {
    let patch: any[] = [];
    if (isCategory(element)) {
      element.children?.nodes.forEach((node) => {
        patch.push({
          op: "remove",
          path: this.state.index.findSizePath(node.__id),
        });
        patch.push({
          op: "remove",
          path: this.state.index.findPositionPath(node.__id),
        });
        if (isNode(node)) {
          patch = [...this.deleteNestedElements(node), ...patch];
        }
      });
    }
    console.log(patch);
    return patch;
  }

  private deleteIncomingAndOutgoingEdges(nodeId: string): any[] {
    const edgesToRemove = this.state.semanticRoot.edges.filter(
      (edge) =>
        edge.source?.ref?.__id === nodeId || edge.target?.ref?.__id === nodeId
    );
    return edgesToRemove.map((edge) => ({
      op: "remove",
      path: this.state.index.findPath(edge.__id),
    }));
  }

  private deleteSizeAndPosition(nodeId: string): any[] {
    return [
      {
        op: "remove",
        path: this.state.index.findPositionPath(nodeId),
      },
      {
        op: "remove",
        path: this.state.index.findSizePath(nodeId),
      },
    ];
  }
}

function isDiagramElement(item: unknown): item is Edge | Node {
  return isEdge(item) || isNode(item);
}
function patchPrioritySorter(a, b) {
  if (a.path.length === 0 || b.path.length === 0) {
    return b.path.localeCompare(a.path);
  }
  const aPath = a.path.split("/");
  const bPath = b.path.split("/");
  let i = 0;
  while (aPath[i] === bPath[i]) {
    i += 1;
  }
  if (!isNaN(aPath[i]) && !isNaN(bPath[i])) {
    const compare = +bPath[i] - +aPath[i];
    return compare !== 0
      ? compare
      : patchPrioritySorter(
          {
            ...a,
            path: aPath.slice(aPath.indexOf(aPath[i]) + aPath[i].length),
          },
          { ...b, path: bPath.slice(bPath.indexOf(bPath[i]) + bPath[i].length) }
        );
  }
  return b.path.localeCompare(a.path);
}
