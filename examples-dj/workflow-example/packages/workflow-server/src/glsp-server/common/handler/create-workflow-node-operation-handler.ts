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
  CreateNodeOperationHandler,
  GCompartment,
  OperationHandler,
  Point,
  TriggerNodeCreationAction,
} from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import {
  Category,
  isCategory,
} from "../../../language-server/generated/ast.js";
import { GCategory } from "../../model/graph-extension.js";
import { WorkflowModelState } from "../../model/workflow-model-state.js";
import { ModelTypes } from "../util/model-types.js";
import { GridSnapper } from "./grid-snapper.js";
import { URI } from "vscode-uri";
import { WorkflowCommand } from "./workflow-command.js";

@injectable()
export abstract class CreateWorkflowNodeOperationHandler
  extends OperationHandler
  implements CreateNodeOperationHandler
{
  readonly operationType = CreateNodeOperation.KIND;

  elementTypeIds = [ModelTypes.AUTOMATED_TASK];

  override label = "Task Node";

  @inject(WorkflowModelState)
  protected override modelState: WorkflowModelState;

  override createCommand(operation: CreateNodeOperation): Command {
    const modelPatch = this.createNode(operation);
    const modelDetailsPatch = this.createNodeDetails(
      operation,
      JSON.parse(modelPatch).value.__id,
      URI.parse(this.modelState.semanticUri).path
    );
    return new WorkflowCommand(this.modelState, modelPatch, modelDetailsPatch);
  }

  createNode(operation: CreateNodeOperation): string {
    return JSON.stringify({ op: "test" });
  }
  createNodeDetails(
    operation: CreateNodeOperation,
    id: string,
    nodeDocumentUri: string
  ): string {
    const category = this.getContainer(operation) ?? undefined;
    const location = this.getLocation(operation);
    const patch: any[] = [];
    patch.push({
      op: "add",
      path: "/metaInfos/-",
      value: {
        $type: "Size",
        __id: "size_" + id,
        node: { $ref: { __id: id, __documentUri: nodeDocumentUri } },
        width: 80,
        height: 30,
      },
    });
    patch.push({
      op: "add",
      path: "/metaInfos/-",
      value: {
        $type: "Position",
        node: { $ref: { __id: id, __documentUri: nodeDocumentUri } },
        __id: "pos_" + id,
        x: category
          ? this.getRelativeLocation(operation, category)?.x ?? 0
          : location?.x ?? 0,
        y: category
          ? this.getRelativeLocation(operation, category)?.y ?? 0
          : location?.y ?? 0,
      },
    });
    return JSON.stringify(patch);
  }

  getTriggerActions(): TriggerNodeCreationAction[] {
    return this.elementTypeIds.map((typeId) =>
      TriggerNodeCreationAction.create(typeId)
    );
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

  getContainerPath(operation: CreateNodeOperation): string | undefined {
    if (operation.containerId) {
      const container = this.modelState.index.findNode(operation.containerId);
      if (isCategory(container)) {
        return (
          this.modelState.index.findPath(operation.containerId)! + "/children"
        );
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
    const categoryPosition = this.modelState.index.findPosition(category.__id);
    if (!operation.location || !categoryPosition) {
      return undefined;
    }
    return {
      x: operation.location?.x - categoryPosition?.x,
      y: operation.location?.y - categoryPosition?.y,
    };
  }
}
