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

import { Action, Command, hasStringProp, Operation, OperationHandler } from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { WorkflowModelState } from "../../model/workflow-model-state.js";
import { WorkflowCommand } from "./workflow-command.js";
/**
 * Is send from the command palette action to the GLSP server
 * to update a feature from a specified task.
 */
export interface EditTaskOperation extends Operation {
  kind: typeof EditTaskOperation.KIND;

  /**
   * Id of the task that should be edited
   */
  taskId: string;

  /**
   * The feature that is to be updated
   */
  feature: "taskType";

  /**
   * The new feature value
   */
  value: string;
}

export namespace EditTaskOperation {
  export const KIND = "editTask";

  export function is(object: any): object is EditTaskOperation {
    return (
      Action.hasKind(object, KIND) &&
      hasStringProp(object, "taskId") &&
      hasStringProp(object, "feature") &&
      hasStringProp(object, "value")
    );
  }

  export function create(options: { taskId: string; feature: "taskType"; value: string }): EditTaskOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options,
    };
  }
}

@injectable()
export class EditTaskOperationHandler extends OperationHandler {
  readonly operationType = EditTaskOperation.KIND;

  @inject(WorkflowModelState) protected state: WorkflowModelState;

  createCommand(operation: EditTaskOperation): Command {
    return new WorkflowCommand(this.state, () => this.editTaskType(operation));
  }

  protected editTaskType(operation: EditTaskOperation): void {
    const oldTaskNode = this.state.index.findTaskNode(operation.taskId);

    // update semantic text
    if (oldTaskNode?.$cstNode && oldTaskNode.taskType) {
      this.state.updateInSemanticText(oldTaskNode.$cstNode.text, oldTaskNode.taskType, operation.value);
    }
  }
}
