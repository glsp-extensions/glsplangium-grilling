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
import { CreateNodeOperation } from "@eclipse-glsp/server";
import { createRandomUUID } from "model-service";
import { injectable } from "inversify";
import { findAvailableNodeName } from "../../../language-server/yo-generated/util/name-util.js";
import { ModelTypes } from "../util/model-types.js";
import { CreateWorkflowNodeOperationHandler } from "./create-workflow-node-operation-handler.js";

@injectable()
export class CreateTaskNodeOperationHandler extends CreateWorkflowNodeOperationHandler {
  override label = "Task Node";

  override elementTypeIds = [ModelTypes.AUTOMATED_TASK, ModelTypes.MANUAL_TASK];

  override createNode(operation: CreateNodeOperation): string {
    switch (operation.elementTypeId) {
      case ModelTypes.AUTOMATED_TASK:
        return this.createTask(operation, "automated");
      case ModelTypes.MANUAL_TASK:
        return this.createTask(operation, "manual");
      default:
        return this.createTask(operation, "undefined");
    }
  }

  createTask(operation: CreateNodeOperation, taskType: string): string {
    const containerPath = this.getContainerPath(operation) ?? "";
    const newName = operation.args?.name
      ? (operation.args.name as string)
      : findAvailableNodeName(this.modelState.semanticRoot, "_tn");
    const patch = JSON.stringify({
      op: "add",
      path: containerPath + "/nodes/-",
      value: {
        $type: "TaskNode",
        duration: 0,
        __id: createRandomUUID(),
        label: newName,
        name: newName,
        taskType,
      },
    });
    return patch;
  }
}
