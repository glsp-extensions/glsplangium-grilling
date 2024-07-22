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
import {
  Category,
  Position,
  Size,
} from "../../../language-server/generated/ast.js";
import { findAvailableNodeName } from "../../../language-server/yo-generated/util/name-util.js";
import { CreateWorkflowNodeOperationHandler } from "./create-workflow-node-operation-handler.js";
import { createRandomUUID } from "model-service";

@injectable()
export class CreateCategoryHandler extends CreateWorkflowNodeOperationHandler {
  override elementTypeIds = [ModelTypes.CATEGORY];
  override label = "Category";

  override createNode(operation: CreateNodeOperation): string {
    return this.createCategory(operation);
  }

  createCategory(operation: CreateNodeOperation): string {
    const containerPath = this.getContainerPath(operation) ?? "";
    const newName = operation.args?.name
      ? (operation.args.name as string)
      : findAvailableNodeName(this.modelState.semanticRoot, "_category");
    const patch = JSON.stringify({
      op: "add",
      path: containerPath + "/nodes/-",
      value: {
        $type: "Category",
        __id: createRandomUUID(),
        children: {
          nodes: [],
          edges: [],
          metaInfos: [],
        },
        label: newName,
        name: newName,
      },
    });
    return patch;
  }
}
