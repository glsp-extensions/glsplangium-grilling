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
import { ChangeBoundsOperation, Command, OperationHandler } from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { WorkflowModelState } from "../../model/workflow-model-state.js";
import { WorkflowCommand } from "./workflow-command.js";
import { Position, Size } from "../../../language-server/generated/ast.js";

@injectable()
export class WorfklowModelChangeBoundsOperationHandler extends OperationHandler {
  operationType = ChangeBoundsOperation.KIND;

  @inject(WorkflowModelState) protected state: WorkflowModelState;

  createCommand(operation: ChangeBoundsOperation): Command {
    return new WorkflowCommand(this.state, () => this.changeBounds(operation));
  }

  protected changeBounds(operation: ChangeBoundsOperation): void {
    operation.newBounds.forEach((elementAndBounds) => {
      const size = this.state.index.findSize(elementAndBounds.elementId);
      if (size) {
        // update semantic text
        if (size.$cstNode) {
          const updatedElement = this.state.updateInSemanticTextDetails(
            size.$cstNode?.text,
            size.width.toString(),
            (elementAndBounds.newSize?.width ?? size.width).toString()
          );
          this.state.updateInSemanticTextDetails(
            updatedElement,
            size.height.toString(),
            (elementAndBounds.newSize?.height ?? size.height).toString()
          );
        }
      } else {
        const node = this.state.index.findNode(elementAndBounds.elementId);
        if (node) {
          const size: Size = {
            $container: this.state.semanticRootDetails,
            $type: "Size",
            node: { ref: node, $refText: node?.name },
            width: elementAndBounds.newSize?.width,
            height: elementAndBounds.newSize?.height,
          };
          this.state.insertToSemanticTextDetails(size);
        }
      }
      const position = this.state.index.findPosition(elementAndBounds.elementId);
      if (position) {
        // update semantic text
        if (position.$cstNode) {
          const updatedElement = this.state.updateInSemanticTextDetails(
            position.$cstNode?.text,
            position.x.toString(),
            (elementAndBounds.newPosition?.x ?? position.x).toString()
          );
          this.state.updateInSemanticTextDetails(
            updatedElement,
            position.y.toString(),
            (elementAndBounds.newPosition?.y ?? position.y).toString()
          );
        }
      } else {
        const node = this.state.index.findNode(elementAndBounds.elementId);
        if (node && elementAndBounds.newPosition) {
          const position: Position = {
            $container: this.state.semanticRootDetails,
            $type: "Position",
            node: { ref: node, $refText: node?.name },
            x: elementAndBounds.newPosition?.x,
            y: elementAndBounds.newPosition?.y,
          };
          this.state.insertToSemanticTextDetails(position);
        }
      }
    });
  }
}
