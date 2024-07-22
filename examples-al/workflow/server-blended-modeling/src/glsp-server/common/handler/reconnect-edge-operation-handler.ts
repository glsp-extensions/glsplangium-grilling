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
import { Command, OperationHandler, ReconnectEdgeOperation } from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { WorkflowModelState } from "../../model/workflow-model-state.js";
import { WorkflowCommand } from "./workflow-command.js";

@injectable()
export class WorfklowReconnectEdgeOperationHandler extends OperationHandler {
  operationType = ReconnectEdgeOperation.KIND;

  @inject(WorkflowModelState) protected state: WorkflowModelState;

  createCommand(operation: ReconnectEdgeOperation): Command {
    return new WorkflowCommand(this.state, () => this.reconnectEdge(operation));
  }

  protected reconnectEdge(operation: ReconnectEdgeOperation): void {
    const oldEdge = this.state.index.findEdge(operation.edgeElementId);
    let updatedElement;

    // update semantic text
    if (oldEdge?.$cstNode && operation.sourceElementId) {
      if (oldEdge.source?.$refText) {
        updatedElement = this.state.updateInSemanticText(
          oldEdge.$cstNode.text,
          oldEdge.source.$refText,
          operation.sourceElementId
        );
      } else {
        updatedElement = this.state.updateInSemanticText(oldEdge.$cstNode.text, "", `${operation.sourceElementId} `);
      }
    }
    if (oldEdge?.$cstNode && operation.targetElementId) {
      if (oldEdge.target?.$refText) {
        this.state.updateInSemanticText(
          updatedElement ?? oldEdge.$cstNode.text,
          oldEdge.target.$refText,
          operation.targetElementId
        );
      } else {
        this.state.updateInSemanticText(updatedElement ?? oldEdge.$cstNode.text, ";", ` ${operation.targetElementId};`);
      }
    }
  }
}
