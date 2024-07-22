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
import {
  Args,
  CommandPaletteActionProvider,
  CreateEdgeOperation,
  CreateNodeOperation,
  DefaultTypes,
  DeleteElementOperation,
  GModelElement,
  GNode,
  LabeledAction,
  Point,
  ReconnectEdgeOperation,
} from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { GMissingNode, GTaskNode } from "../../model/graph-extension.js";
import { WorkflowModelState } from "../../model/workflow-model-state.js";
import { ModelTypes } from "../util/model-types.js";
import { findAvailableNodeName } from "../../../language-server/yo-generated/util/name-util.js";
import { WorkflowModelIndex } from "../../model/workflow-model-index.js";

@injectable()
export class WorkflowCommandPaletteActionProvider extends CommandPaletteActionProvider {
  @inject(WorkflowModelState)
  protected override modelState: WorkflowModelState;

  @inject(WorkflowModelIndex)
  protected modelIndex: WorkflowModelIndex;

  getPaletteActions(
    selectedElementIds: string[],
    selectedElements: GModelElement[],
    position: Point,
    args?: Args
  ): LabeledAction[] {
    const actions: LabeledAction[] = [];
    if (this.modelState.isReadonly) {
      return actions;
    }
    const index = this.modelState.index;
    // Create actions
    const location = position ?? Point.ORIGIN;
    // Create actions for missing nodes with IDs
    if (selectedElements.length === 1) {
      const element = selectedElements[0];
      if (element instanceof GMissingNode) {
        // Missing node without ID - only possible with unconnected edges, have to reconnect edge
        if (element.id.startsWith(ModelTypes.MISSING_NODE)) {
          const edgeToReconnectId = element.id.slice(
            ModelTypes.MISSING_NODE.length + 1
          );
          const edgeToReconnect = this.modelIndex.findEdge(edgeToReconnectId);
          const taskNodeName = findAvailableNodeName(
            this.modelState.semanticRoot,
            "_tn"
          );
          const activityNodeName = findAvailableNodeName(
            this.modelState.semanticRoot,
            "_an"
          );
          const categoryName = findAvailableNodeName(
            this.modelState.semanticRoot,
            "_cat"
          );
          actions.push({
            label: "Create Missing Node - Manual Task",
            actions: [
              CreateNodeOperation.create(ModelTypes.MANUAL_TASK, {
                location,
                args: { name: taskNodeName },
              }),
              ReconnectEdgeOperation.create({
                edgeElementId: edgeToReconnectId,
                sourceElementId:
                  edgeToReconnect?.source?.$refText ?? taskNodeName,
                targetElementId:
                  edgeToReconnect?.target?.$refText ?? taskNodeName,
              }),
            ],
            icon: "fa-plus-square",
          });
          actions.push({
            label: "Create Missing Node - Automated Task",
            actions: [
              CreateNodeOperation.create(ModelTypes.AUTOMATED_TASK, {
                location,
                args: { name: taskNodeName },
              }),
              ReconnectEdgeOperation.create({
                edgeElementId: edgeToReconnectId,
                sourceElementId:
                  edgeToReconnect?.source?.$refText ?? taskNodeName,
                targetElementId:
                  edgeToReconnect?.target?.$refText ?? taskNodeName,
              }),
            ],
            icon: "fa-plus-square",
          });
          actions.push({
            label: "Create Missing Node - Decision Node",
            actions: [
              CreateNodeOperation.create(ModelTypes.DECISION_NODE, {
                location,
                args: { name: activityNodeName },
              }),
              ReconnectEdgeOperation.create({
                edgeElementId: edgeToReconnectId,
                sourceElementId:
                  edgeToReconnect?.source?.$refText ?? activityNodeName,
                targetElementId:
                  edgeToReconnect?.target?.$refText ?? activityNodeName,
              }),
            ],
            icon: "fa-plus-square",
          });
          actions.push({
            label: "Create Missing Node - Fork Node",
            actions: [
              CreateNodeOperation.create(ModelTypes.FORK_NODE, {
                location,
                args: { name: activityNodeName },
              }),
              ReconnectEdgeOperation.create({
                edgeElementId: edgeToReconnectId,
                sourceElementId:
                  edgeToReconnect?.source?.$refText ?? activityNodeName,
                targetElementId:
                  edgeToReconnect?.target?.$refText ?? activityNodeName,
              }),
            ],
            icon: "fa-plus-square",
          });
          actions.push({
            label: "Create Missing Node - Merge Node",
            actions: [
              CreateNodeOperation.create(ModelTypes.MERGE_NODE, {
                location,
                args: { name: activityNodeName },
              }),
              ReconnectEdgeOperation.create({
                edgeElementId: edgeToReconnectId,
                sourceElementId:
                  edgeToReconnect?.source?.$refText ?? activityNodeName,
                targetElementId:
                  edgeToReconnect?.target?.$refText ?? activityNodeName,
              }),
            ],
            icon: "fa-plus-square",
          });
          actions.push({
            label: "Create Missing Node - Join Node",
            actions: [
              CreateNodeOperation.create(ModelTypes.JOIN_NODE, {
                location,
                args: { name: activityNodeName },
              }),
              ReconnectEdgeOperation.create({
                edgeElementId: edgeToReconnectId,
                sourceElementId:
                  edgeToReconnect?.source?.$refText ?? activityNodeName,
                targetElementId:
                  edgeToReconnect?.target?.$refText ?? activityNodeName,
              }),
            ],
            icon: "fa-plus-square",
          });
          actions.push({
            label: "Create Missing Node - Category",
            actions: [
              CreateNodeOperation.create(ModelTypes.CATEGORY, {
                location,
                args: { name: categoryName },
              }),
              ReconnectEdgeOperation.create({
                edgeElementId: edgeToReconnectId,
                sourceElementId:
                  edgeToReconnect?.source?.$refText ?? categoryName,
                targetElementId:
                  edgeToReconnect?.target?.$refText ?? categoryName,
              }),
            ],
            icon: "fa-plus-square",
          });
        } else {
          // MISSING NODE WITH ID
          actions.push({
            label: "Create Missing Node - Manual Task",
            actions: [
              CreateNodeOperation.create(ModelTypes.MANUAL_TASK, {
                location,
                args: { name: element.id },
              }),
            ],
            icon: "fa-plus-square",
          });
          actions.push({
            label: "Create Missing Node - Automated Task",
            actions: [
              CreateNodeOperation.create(ModelTypes.AUTOMATED_TASK, {
                location,
                args: { name: element.id },
              }),
            ],
            icon: "fa-plus-square",
          });
          actions.push({
            label: "Create Missing Node - Decision Node",
            actions: [
              CreateNodeOperation.create(ModelTypes.DECISION_NODE, {
                location,
                args: { name: element.id },
              }),
            ],
            icon: "fa-plus-square",
          });
          actions.push({
            label: "Create Missing Node - Fork Node",
            actions: [
              CreateNodeOperation.create(ModelTypes.FORK_NODE, {
                location,
                args: { name: element.id },
              }),
            ],
            icon: "fa-plus-square",
          });
          actions.push({
            label: "Create Missing Node - Merge Node",
            actions: [
              CreateNodeOperation.create(ModelTypes.MERGE_NODE, {
                location,
                args: { name: element.id },
              }),
            ],
            icon: "fa-plus-square",
          });
          actions.push({
            label: "Create Missing Node - Join Node",
            actions: [
              CreateNodeOperation.create(ModelTypes.JOIN_NODE, {
                location,
                args: { name: element.id },
              }),
            ],
            icon: "fa-plus-square",
          });
          actions.push({
            label: "Create Missing Node - Category",
            actions: [
              CreateNodeOperation.create(ModelTypes.CATEGORY, {
                location,
                args: { name: element.id },
              }),
            ],
            icon: "fa-plus-square",
          });
        }
      }
    }
    // Create general actions
    actions.push(
      {
        label: "Create Automated Task",
        actions: [
          CreateNodeOperation.create(ModelTypes.AUTOMATED_TASK, { location }),
        ],
        icon: "fa-plus-square",
      },
      {
        label: "Create Manual Task",
        actions: [
          CreateNodeOperation.create(ModelTypes.MANUAL_TASK, { location }),
        ],
        icon: "fa-plus-square",
      },
      {
        label: "Create Merge Node",
        actions: [
          CreateNodeOperation.create(ModelTypes.MERGE_NODE, { location }),
        ],
        icon: "fa-plus-square",
      },
      {
        label: "Create Decision Node",
        actions: [
          CreateNodeOperation.create(ModelTypes.DECISION_NODE, { location }),
        ],
        icon: "fa-plus-square",
      },
      {
        label: "Create Category",
        actions: [
          CreateNodeOperation.create(ModelTypes.CATEGORY, { location }),
        ],
        icon: "fa-plus-square",
      }
    );
    // Create edge action between two nodes
    if (selectedElements.length === 1) {
      const element = selectedElements[0];
      if (element instanceof GNode) {
        actions.push(
          ...this.createEdgeActions(element, index.getAllByClass(GTaskNode))
        );
      }
    } else if (selectedElements.length === 2) {
      const source = selectedElements[0];
      const target = selectedElements[1];
      if (source instanceof GTaskNode && target instanceof GTaskNode) {
        actions.push(
          this.createEdgeAction(
            `Create Edge from ${this.getLabel(source)} to ${this.getLabel(
              target
            )}`,
            source,
            target
          )
        );
        actions.push(
          this.createWeightedEdgeAction(
            `Create Weighted Edge from ${this.getLabel(
              source
            )} to ${this.getLabel(target)}`,
            source,
            target
          )
        );
      }
    }
    // Delete action

    const label = selectedElementIds.length === 1 ? "Delete" : "Delete All";
    actions.push({
      label,
      actions: [DeleteElementOperation.create(selectedElementIds)],
      icon: "fa-minus-square",
    });

    return actions;
  }

  protected createEdgeActions(
    source: GNode,
    targets: GNode[]
  ): LabeledAction[] {
    const actions: LabeledAction[] = [];
    targets.forEach((node) =>
      actions.push(
        this.createEdgeAction(
          `Create Edge to ${this.getLabel(node)}`,
          source,
          node
        )
      )
    );
    targets.forEach((node) =>
      actions.push(
        this.createWeightedEdgeAction(
          `Create Weighted Edge to ${this.getLabel(node)}`,
          source,
          node
        )
      )
    );
    return actions;
  }

  protected createWeightedEdgeAction(
    label: string,
    source: GNode,
    node: GNode
  ): LabeledAction {
    return {
      label,
      actions: [
        CreateEdgeOperation.create({
          elementTypeId: ModelTypes.WEIGHTED_EDGE,
          sourceElementId: source.id,
          targetElementId: node.id,
        }),
      ],
      icon: "fa-plus-square",
    };
  }

  protected createEdgeAction(
    label: string,
    source: GNode,
    node: GNode
  ): LabeledAction {
    return {
      label,
      actions: [
        CreateEdgeOperation.create({
          elementTypeId: DefaultTypes.EDGE,
          sourceElementId: source.id,
          targetElementId: node.id,
        }),
      ],
      icon: "fa-plus-square",
    };
  }

  protected getLabel(node: GNode): string {
    if (node instanceof GTaskNode) {
      return node.name;
    }
    return node.id;
  }
}
