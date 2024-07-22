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
  OperationHandler,
  CreateEdgeOperation,
  DefaultTypes,
  TriggerEdgeCreationAction,
  CreateEdgeOperationHandler,
} from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { WorkflowModelState } from "../../model/workflow-model-state.js";
import { Edge } from "../../../language-server/generated/ast.js";
import { WorkflowCommand } from "./workflow-command.js";

@injectable()
export class CreateWorkflowEdgeOperationHandler extends OperationHandler implements CreateEdgeOperationHandler {
  readonly operationType = CreateEdgeOperation.KIND;

  elementTypeIds = [DefaultTypes.EDGE];

  override label = "Edge";

  @inject(WorkflowModelState)
  protected override modelState: WorkflowModelState;

  override createCommand(operation: CreateEdgeOperation): Command {
    return new WorkflowCommand(this.modelState, () => this.createEdge(operation));
  }

  createEdge(operation: CreateEdgeOperation): void {
    const sourceNode = this.modelState.index.findNode(operation.sourceElementId);
    const targetNode = this.modelState.index.findNode(operation.targetElementId);
    if (sourceNode && targetNode) {
      const edge: Edge = {
        $container: this.modelState.semanticRoot,
        $type: "Edge",
        source: { ref: sourceNode, $refText: this.modelState.nameProvider.getLocalName(sourceNode) || sourceNode.name },
        target: { ref: targetNode, $refText: this.modelState.nameProvider.getLocalName(targetNode) || targetNode.name },
      };
      this.modelState.insertToSemanticText(edge);
    }
  }

  getTriggerActions(): TriggerEdgeCreationAction[] {
    return this.elementTypeIds.map((typeId) => TriggerEdgeCreationAction.create(typeId));
  }
}
