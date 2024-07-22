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
  ChangeBoundsOperation,
  Command,
  OperationHandler,
} from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { URI } from "vscode-uri";
import { WorkflowModelState } from "../../model/workflow-model-state.js";
import { WorkflowCommand } from "./workflow-command.js";

@injectable()
export class WorfklowModelChangeBoundsOperationHandler extends OperationHandler {
  operationType = ChangeBoundsOperation.KIND;

  @inject(WorkflowModelState)
  protected state: WorkflowModelState;

  createCommand(operation: ChangeBoundsOperation): Command {
    return new WorkflowCommand(
      this.state,
      undefined,
      this.changeBounds(operation)
    );
  }

  protected changeBounds(operation: ChangeBoundsOperation): string | undefined {
    const patch: any[] = [];
    operation.newBounds.forEach((elementAndBounds) => {
      const sizePath = this.state.index.findSizePath(
        elementAndBounds.elementId
      );
      const size = this.state.index.findSize(elementAndBounds.elementId);
      patch.push({
        op: size && sizePath ? "replace" : "add",
        path: sizePath ?? "/metaInfos/-",
        value: {
          $type: "Size",
          __id: "size_" + elementAndBounds.elementId,
          node: {
            $ref: {
              __id: elementAndBounds.elementId,
              __documentUri:
                size?.node?.$nodeDescription?.documentUri.path ??
                URI.parse(this.state.semanticUri).path,
            },
          },
          width: elementAndBounds.newSize?.width,
          height: elementAndBounds.newSize?.height,
        },
      });
      const positionPath = this.state.index.findPositionPath(
        elementAndBounds.elementId
      );
      const position = this.state.index.findPosition(
        elementAndBounds.elementId
      );
      patch.push({
        op: position && positionPath ? "replace" : "add",
        path: positionPath ?? "/metaInfos/-",
        value: {
          $type: "Position",
          __id: "pos_" + elementAndBounds.elementId,
          node: {
            $ref: {
              __id: elementAndBounds.elementId,
              __documentUri:
                position?.node?.$nodeDescription?.documentUri.path ??
                URI.parse(this.state.semanticUri).path,
            },
          },
          x: elementAndBounds.newPosition?.x || position?.x,
          y: elementAndBounds.newPosition?.y || position?.y,
        },
      });
    });
    return JSON.stringify(patch);
  }
}
