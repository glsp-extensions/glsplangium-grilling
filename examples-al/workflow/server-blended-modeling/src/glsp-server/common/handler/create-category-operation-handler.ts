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
import { Category, Position, Size } from "../../../language-server/generated/ast.js";
import { findAvailableNodeName } from "../../../language-server/util/name-util.js";
import { CreateWorkflowNodeOperationHandler } from "./create-workflow-node-operation-handler.js";

@injectable()
export class CreateCategoryHandler extends CreateWorkflowNodeOperationHandler {
  override elementTypeIds = [ModelTypes.CATEGORY];
  override label = "Category";

  override createNode(operation: CreateNodeOperation): void {
    return this.createCategory(operation);
  }

  createCategory(operation: CreateNodeOperation): void {
    const container = this.getContainer(operation)?.children ?? this.modelState.semanticRoot;
    const categoryContainer = this.getContainer(operation) ?? undefined;
    const containerDetails = this.modelState.semanticRootDetails;
    const location = this.getLocation(operation);
    const category: Category = {
      $container: container,
      $type: "Category",
      name: operation.args?.name
        ? operation.args.name.toString()
        : findAvailableNodeName(this.modelState.semanticRoot, "_cat"),
      label: "Category",
    };
    const size: Size = {
      $container: containerDetails,
      $type: "Size",
      node: { ref: category, $refText: category.name },
      width: 150,
      height: 100,
    };
    const position: Position = {
      $container: containerDetails,
      $type: "Position",
      node: { ref: category, $refText: category.name },
      x: location?.x ?? 0,
      y: location?.y ?? 0,
    };
    if (categoryContainer && categoryContainer.$cstNode?.text) {
      this.modelState.insertToSemanticText(category, categoryContainer.$cstNode?.text);
    } else {
      this.modelState.insertToSemanticText(category);
    }
    this.modelState.insertToSemanticTextDetails(size);
    this.modelState.insertToSemanticTextDetails(position);
  }
}
