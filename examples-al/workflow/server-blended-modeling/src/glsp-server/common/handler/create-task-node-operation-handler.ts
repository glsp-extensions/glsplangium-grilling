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
import { injectable } from "inversify";
import { ModelTypes } from "../util/model-types.js";
import { Position, Size, TaskNode, TaskType } from "../../../language-server/generated/ast.js";
import { findAvailableNodeName } from "../../../language-server/util/name-util.js";
import { CreateWorkflowNodeOperationHandler } from "./create-workflow-node-operation-handler.js";

@injectable()
export abstract class CreateTaskNodeOperationHandler extends CreateWorkflowNodeOperationHandler {
  override createNode(operation: CreateNodeOperation): void {
    switch (operation.elementTypeId) {
      case ModelTypes.AUTOMATED_TASK:
        this.createTask(operation, "automated");
        break;
      case ModelTypes.MANUAL_TASK:
        this.createTask(operation, "manual");
        break;
    }
  }

  createTask(operation: CreateNodeOperation, taskType: TaskType): void {
    const container = this.getContainer(operation)?.children ?? this.modelState.semanticRoot;
    const category = this.getContainer(operation) ?? undefined;
    const containerDetails = this.modelState.semanticRootDetails;
    const location = this.getLocation(operation);
    const task: TaskNode = {
      $container: container,
      $type: "TaskNode",
      duration: 0,
      expanded: false,
      label: "TaskNode",
      name: operation.args?.name
        ? operation.args.name.toString()
        : findAvailableNodeName(this.modelState.semanticRoot, "_tn"),
      taskType: taskType,
    };
    if (category && category.$cstNode?.text) {
      this.modelState.insertToSemanticText(task, category.$cstNode?.text);
    } else {
      this.modelState.insertToSemanticText(task);
    }

    // size
    if (this.modelState.index.findSize(task.name)) {
      return;
    }
    const size: Size = {
      $container: containerDetails,
      $type: "Size",
      node: { ref: task, $refText: task.name },
      width: 80,
      height: 30,
    };
    this.modelState.insertToSemanticTextDetails(size);

    // position
    if (this.modelState.index.findPosition(task.name)) {
      return;
    }
    const position: Position = {
      $container: containerDetails,
      $type: "Position",
      node: { ref: task, $refText: task.name },
      x: category ? this.getRelativeLocation(operation, category)?.x ?? 0 : location?.x ?? 0,
      y: category ? this.getRelativeLocation(operation, category)?.y ?? 0 : location?.y ?? 0,
    };
    this.modelState.insertToSemanticTextDetails(position);
  }
}
