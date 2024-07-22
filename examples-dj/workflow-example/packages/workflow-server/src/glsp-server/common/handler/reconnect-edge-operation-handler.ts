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
  Command,
  OperationHandler,
  ReconnectEdgeOperation,
} from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { WorkflowModelState } from "../../model/workflow-model-state.js";
import { WorkflowCommand } from "./workflow-command.js";

@injectable()
export class WorfklowReconnectEdgeOperationHandler extends OperationHandler {
  operationType = ReconnectEdgeOperation.KIND;

  @inject(WorkflowModelState) protected state: WorkflowModelState;

  createCommand(operation: ReconnectEdgeOperation): Command {
    return new WorkflowCommand(this.state, this.reconnectEdge(operation));
  }

  protected reconnectEdge(
    operation: ReconnectEdgeOperation
  ): string | undefined {
    const edgePath = this.state.index.findPath(operation.edgeElementId);
    const sourceNode = this.state.index.findNode(operation.sourceElementId);
    const targetNode = this.state.index.findNode(operation.targetElementId);
    return JSON.stringify({
      op: "replace",
      path: edgePath,
      value: {
        $type: "Edge",
        __id: operation.edgeElementId,
        source: {
          ref: {
            __id: operation.sourceElementId,
            __documentUri: sourceNode?.$document?.uri,
          },
          $refText:
            this.state.nameProvider.getLocalName(sourceNode) ||
            sourceNode?.__id,
        },
        target: {
          ref: {
            __id: operation.targetElementId,
            __documentUri: targetNode?.$document?.uri,
          },
          $refText:
            this.state.nameProvider.getLocalName(targetNode) ||
            targetNode?.__id,
        },
      },
    });
  }
}
