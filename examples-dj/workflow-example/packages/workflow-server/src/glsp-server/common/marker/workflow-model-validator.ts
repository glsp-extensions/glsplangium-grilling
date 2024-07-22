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
import { GCompartment, GLabel, GModelElement, Marker, MarkerKind, ModelValidator } from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { GActivityNode, GTaskNode } from "../../model/graph-extension.js";
import { WorkflowModelState } from "../../model/workflow-model-state.js";

@injectable()
export class WorkflowModelValidator implements ModelValidator {
  @inject(WorkflowModelState)
  protected readonly modelState: WorkflowModelState;

  validate(elements: GModelElement[]): Marker[] {
    const markers: Marker[] = [];
    for (const element of elements) {
      if (element instanceof GTaskNode) {
        markers.push(...this.validateTaskNode(element));
      } else if (element instanceof GActivityNode) {
        if (element.nodeType === "decisionNode") {
          markers.push(...this.validateDecisionNode(element));
        } else if (element.nodeType === "mergeNode") {
          markers.push(...this.validateMergeNode(element));
        }
      }
      if (element.children) {
        markers.push(...this.validate(element.children));
      }
    }
    return markers;
  }

  protected validateTaskNode(taskNode: GTaskNode): Marker[] {
    const markers: Marker[] = [];
    const automated = this.validateTaskNode_isAutomated(taskNode);
    if (automated) {
      markers.push(automated);
    }
    const upperCase = this.validateTaskNode_labelStartsUpperCase(taskNode);
    if (upperCase) {
      markers.push(upperCase);
    }
    return markers;
  }

  protected validateTaskNode_isAutomated(taskNode: GTaskNode): Marker | undefined {
    if (taskNode.taskType === "automated") {
      return {
        kind: MarkerKind.INFO,
        description: "This is an automated task",
        elementId: taskNode.id,
        label: "Automated task",
      };
    }
    return undefined;
  }

  protected validateTaskNode_labelStartsUpperCase(taskNode: GTaskNode): Marker | undefined {
    const gCompartment = taskNode.children.find((child) => child instanceof GCompartment);
    if (gCompartment) {
      const gLabels = gCompartment.children
        .filter((child) => child instanceof GLabel)
        .map((element) => element as GLabel);
      if (gLabels.length > 0 && gLabels[0].text.charAt(0) === gLabels[0].text.charAt(0).toLowerCase()) {
        return {
          kind: MarkerKind.WARNING,
          description: "Task node names should start with upper case letters",
          elementId: taskNode.id,
          label: "Task node label in upper case",
        };
      }
    }
    return undefined;
  }

  protected validateDecisionNode(decisionNode: GActivityNode): Marker[] {
    const markers: Marker[] = [];
    const oneIncoming = this.validateDecisionNode_hasOneIncomingEdge(decisionNode);
    if (oneIncoming) {
      markers.push(oneIncoming);
    }
    return markers;
  }

  protected validateDecisionNode_hasOneIncomingEdge(decisionNode: GActivityNode): Marker | undefined {
    const edges = this.modelState.index.getIncomingEdges(decisionNode);
    if (edges.length > 1) {
      return {
        kind: MarkerKind.ERROR,
        description: "Decision node may only have one incoming edge.",
        elementId: decisionNode.id,
        label: "Too many incoming edges",
      };
    } else if (edges.length === 0) {
      return {
        kind: MarkerKind.ERROR,
        description: "Decision node must have one incoming edge.",
        elementId: decisionNode.id,
        label: "Missing incoming edge",
      };
    }
    return undefined;
  }

  protected validateMergeNode(mergeNode: GActivityNode): Marker[] {
    const markers: Marker[] = [];
    const oneOutgoing = this.validateMergeNode_hasOneOutgoingEdge(mergeNode);
    if (oneOutgoing) {
      markers.push(oneOutgoing);
    }
    return markers;
  }

  protected validateMergeNode_hasOneOutgoingEdge(mergeNode: GActivityNode): Marker | undefined {
    const edges = this.modelState.index.getOutgoingEdges(mergeNode);
    if (edges.length > 1) {
      return {
        kind: MarkerKind.ERROR,
        description: "Merge node may only have one outgoing edge.",
        elementId: mergeNode.id,
        label: "Too many outgoing edges",
      };
    } else if (edges.length === 0) {
      return {
        kind: MarkerKind.ERROR,
        description: "Merge node must have one outgoing edge.",
        elementId: mergeNode.id,
        label: "Missing outgoing edge",
      };
    }
    return undefined;
  }
}
