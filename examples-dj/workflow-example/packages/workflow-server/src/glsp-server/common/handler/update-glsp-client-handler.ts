/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { Operation } from "@eclipse-glsp/protocol";
import { Command, OperationHandler } from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { WorkflowModelState } from "../../model/workflow-model-state.js";
import { WorkflowCommand } from "./workflow-command.js";

@injectable()
export class WorkflowUpdateClientOperationHandler extends OperationHandler {
  override operationType = UpdateClientOperation.KIND;

  @inject(WorkflowModelState) protected state: WorkflowModelState;

  createCommand(_operation: UpdateClientOperation): Command {
    return new WorkflowCommand(this.state);
  }
}

export interface UpdateClientOperation extends Operation {
  kind: typeof UpdateClientOperation.KIND;
  doNotUpdateSemanticRoot: boolean;
  doNotUpdateSemanticRootDetails: boolean;
}

export namespace UpdateClientOperation {
  export const KIND = "workflowUpdateClientOperation";

  export function is(object: any): object is UpdateClientOperation {
    return Operation.hasKind(object, KIND);
  }

  export function create(
    doNotUpdateSemanticRoot: boolean,
    doNotUpdateSemanticRootDetails: boolean
  ): UpdateClientOperation {
    return {
      kind: KIND,
      isOperation: true,
      doNotUpdateSemanticRoot,
      doNotUpdateSemanticRootDetails,
    };
  }
}
