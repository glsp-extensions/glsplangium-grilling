/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
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
import { GEdge, GModelElement, Marker, MarkerKind, ModelValidator } from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { GTaskNode } from "../../model/graph-extension.js";
import { WorkflowModelState } from "../../model/workflow-model-state.js";
import { Edge, TaskNode, isEdge, isTaskNode } from "../../../language-server/generated/ast.js";

@injectable()
export class WorkflowModelValidator implements ModelValidator {
  @inject(WorkflowModelState)
  protected readonly modelState: WorkflowModelState;

  validate(elements: GModelElement[]): Marker[] {
    const markers: Marker[] = [];
    for (const element of elements) {
      if (element instanceof GTaskNode) {
        markers.push(...this.validateTaskNode(element));
      } else if (element instanceof GEdge) {
        markers.push(...this.validateEdge(element));
      }
      if (element.children) {
        markers.push(...this.validate(element.children));
      }
    }
    return markers;
  }

  protected validateTaskNode(taskNode: GTaskNode): Marker[] {
    const markers: Marker[] = [];
    const noDuplicateNames = this.validateTaskNode_noDuplicateNames(taskNode);
    if (noDuplicateNames) {
      markers.push(noDuplicateNames);
    }
    return markers;
  }

  protected validateTaskNode_noDuplicateNames(taskNode: GTaskNode): Marker | undefined {
    const taskNodes = this.modelState.index.findByType(isTaskNode) as TaskNode[];

    if (taskNodes.filter((tn) => tn.name === taskNode.id).length > 1) {
      return {
        kind: MarkerKind.ERROR,
        description: "Name already exists.",
        elementId: taskNode.id,
        label: "Name already exists",
      };
    }
    return undefined;
  }

  protected validateEdge(edge: GEdge): Marker[] {
    const markers: Marker[] = [];
    const noDuplicateEdges = this.validateEdge_noDuplicateEdges(edge);
    if (noDuplicateEdges) {
      markers.push(noDuplicateEdges);
    }
    return markers;
  }

  protected validateEdge_noDuplicateEdges(edge: GEdge): Marker | undefined {
    const edges = this.modelState.index.findByType(isEdge) as Edge[];

    if (
      edges.filter(
        (e) => e.source?.$refText === edge.sourceId && e.target?.$refText === edge.targetId && e.$type === edge.type
      ).length > 1
    ) {
      return {
        kind: MarkerKind.ERROR,
        description: "Edge already exists.",
        elementId: edge.id,
        label: "Edge already exists",
      };
    }
    return undefined;
  }
}
