/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
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
  ApplyLabelEditOperation,
  Command,
  OperationHandler,
} from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { WorkflowModelState } from "../../model/workflow-model-state.js";
import { WorkflowCommand } from "../handler/workflow-command.js";
import {
  isCategory,
  isTaskNode,
} from "../../../language-server/generated/ast.js";

@injectable()
export class WorfklowModelLabelEditOperationHandler extends OperationHandler {
  operationType = ApplyLabelEditOperation.KIND;

  @inject(WorkflowModelState) protected state: WorkflowModelState;

  createCommand(operation: ApplyLabelEditOperation): Command {
    return new WorkflowCommand(this.state, this.editLabel(operation));
  }

  protected editLabel(operation: ApplyLabelEditOperation): string | undefined {
    if (operation.labelId.includes('_classname')) {
      operation.labelId = operation.labelId.replace('_classname', '');
    }
    const node = this.state.index.findNode(operation.labelId);
    const path = this.state.index.findPath(operation.labelId);

    if (!node) return undefined;

    const value = {
      $type: isTaskNode(node) ? "TaskNode" : "Category",
      __id: node.__id,
      label: operation.text,
      name: node.name,
      ...(isTaskNode(node) && {
        duration: node.duration,
        taskType: node.taskType,
      }),
    };

    return JSON.stringify({ op: "replace", path, value });
  }
}
