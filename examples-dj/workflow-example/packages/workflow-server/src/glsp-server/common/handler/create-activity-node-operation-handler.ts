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
export abstract class CreateActivityNodeOperationHandler extends CreateWorkflowNodeOperationHandler {
  override createNode(operation: CreateNodeOperation): string {
    switch (operation.elementTypeId) {
      case ModelTypes.DECISION_NODE:
        return this.createTask(operation, "decision");
      case ModelTypes.FORK_NODE:
        return this.createTask(operation, "fork");
      case ModelTypes.JOIN_NODE:
        return this.createTask(operation, "join");
      case ModelTypes.MERGE_NODE:
        return this.createTask(operation, "merge");
      default:
        return JSON.stringify({ op: "test" });
    }
  }

  createTask(operation: CreateNodeOperation, nodeType: string): string {
    const containerPath = this.getContainerPath(operation) ?? "";
    const newName = operation.args?.name
      ? (operation.args.name as string)
      : findAvailableNodeName(this.modelState.semanticRoot, "_an");
    const patch = JSON.stringify({
      op: "add",
      path: containerPath + "/nodes/-",
      value: {
        $type: "ActivityNode",
        __id: createRandomUUID(),
        name: newName,
        nodeType,
      },
    });
    return patch;
  }
}
