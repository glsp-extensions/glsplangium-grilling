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
  Command,
  CreateNodeOperation,
  GCompartment,
  Point,
  OperationHandler,
  TriggerNodeCreationAction,
  CreateNodeOperationHandler,
} from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { GCategory } from "../../model/graph-extension.js";
import { WorkflowModelState } from "../../model/workflow-model-state.js";
import { ModelTypes } from "../util/model-types.js";
import { GridSnapper } from "./grid-snapper.js";
import { Category, isCategory } from "../../../language-server/generated/ast.js";
import { WorkflowCommand } from "./workflow-command.js";

@injectable()
export abstract class CreateWorkflowNodeOperationHandler
  extends OperationHandler
  implements CreateNodeOperationHandler
{
  readonly operationType = CreateNodeOperation.KIND;

  elementTypeIds = [
    ModelTypes.AUTOMATED_TASK,
    ModelTypes.MANUAL_TASK,
    ModelTypes.DECISION_NODE,
    ModelTypes.MERGE_NODE,
    ModelTypes.FORK_NODE,
    ModelTypes.JOIN_NODE,
  ];

  override label = "Operation";

  @inject(WorkflowModelState)
  protected override modelState: WorkflowModelState;

  override createCommand(operation: CreateNodeOperation): Command {
    return new WorkflowCommand(this.modelState, () => this.createNode(operation));
  }

  createNode(operation: CreateNodeOperation): void {}

  getTriggerActions(): TriggerNodeCreationAction[] {
    return this.elementTypeIds.map((typeId) => TriggerNodeCreationAction.create(typeId));
  }

  getLocation(operation: CreateNodeOperation): Point | undefined {
    return GridSnapper.snap(operation.location);
  }

  getContainer(operation: CreateNodeOperation): Category | undefined {
    if (operation.containerId) {
      const container = this.modelState.index.findNode(operation.containerId);
      if (isCategory(container)) {
        return container;
      }
    }
    return undefined;
  }

  getCategoryCompartment(category: GCategory): GCompartment | undefined {
    return category.children
      .filter((child: any) => child instanceof GCompartment)
      .map((child: any) => child as GCompartment)
      .find((comp: { type: string }) => ModelTypes.STRUCTURE === comp.type);
  }

  getRelativeLocation(operation: CreateNodeOperation, category: Category) {
    const categoryPosition = this.modelState.index.findPosition(category.name);
    if (!operation.location || !categoryPosition) {
      return undefined;
    }
    console.log("operation.location?.x", operation.location?.x);
    console.log("operation.location?.y", operation.location?.y);
    console.log("categoryPosition?.x", categoryPosition?.x);
    console.log("categoryPosition?.y", categoryPosition?.y);
    console.log("new position", {
      x: operation.location?.x - categoryPosition?.x,
      y: operation.location?.y - categoryPosition?.y,
    });
    return {
      x: operation.location?.x - categoryPosition?.x,
      y: operation.location?.y - categoryPosition?.y,
    };
  }
}
