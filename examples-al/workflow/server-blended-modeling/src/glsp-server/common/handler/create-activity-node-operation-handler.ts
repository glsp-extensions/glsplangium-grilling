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
import { ActivityNode, NodeType, Position, Size } from "../../../language-server/generated/ast.js";
import { findAvailableNodeName } from "../../../language-server/util/name-util.js";
import { CreateWorkflowNodeOperationHandler } from "./create-workflow-node-operation-handler.js";

@injectable()
export abstract class CreateActivityNodeOperationHandler extends CreateWorkflowNodeOperationHandler {
  override createNode(operation: CreateNodeOperation): void {
    switch (operation.elementTypeId) {
      case ModelTypes.DECISION_NODE:
        this.createActivityNode(operation, "decision");
        break;
      case ModelTypes.FORK_NODE:
        this.createActivityNode(operation, "fork");
        break;
      case ModelTypes.JOIN_NODE:
        this.createActivityNode(operation, "join");
        break;
      case ModelTypes.MERGE_NODE:
        this.createActivityNode(operation, "merge");
        break;
    }
  }

  createActivityNode(operation: CreateNodeOperation, activityNodeType: NodeType): void {
    const container = this.getContainer(operation)?.children ?? this.modelState.semanticRoot;
    const category = this.getContainer(operation) ?? undefined;
    const containerDetails = this.modelState.semanticRootDetails;
    const location = this.getLocation(operation);
    const activityNode: ActivityNode = {
      $container: container,
      $type: "ActivityNode",
      name: operation.args?.name
        ? operation.args.name.toString()
        : findAvailableNodeName(this.modelState.semanticRoot, "_an"),
      nodeType: activityNodeType,
    };
    const size: Size = {
      $container: containerDetails,
      $type: "Size",
      node: { ref: activityNode, $refText: activityNode.name },
      width: activityNodeType === "decision" || activityNodeType === "merge" ? 32 : 10,
      height: activityNodeType === "decision" || activityNodeType === "merge" ? 32 : 50,
    };
    const position: Position = {
      $container: containerDetails,
      $type: "Position",
      node: { ref: activityNode, $refText: activityNode.name },
      x: category ? this.getRelativeLocation(operation, category)?.x ?? 0 : location?.x ?? 0,
      y: category ? this.getRelativeLocation(operation, category)?.y ?? 0 : location?.y ?? 0,
    };
    if (category && category.$cstNode?.text) {
      this.modelState.insertToSemanticText(activityNode, category.$cstNode?.text);
    } else {
      this.modelState.insertToSemanticText(activityNode);
    }
    this.modelState.insertToSemanticTextDetails(size);
    this.modelState.insertToSemanticTextDetails(position);
  }
}
