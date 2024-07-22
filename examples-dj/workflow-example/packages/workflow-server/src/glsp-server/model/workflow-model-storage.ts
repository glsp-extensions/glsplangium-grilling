/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
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
  ClientSession,
  ClientSessionListener,
  ClientSessionManager,
  GLSPServerError,
  Logger,
  MaybePromise,
  RequestModelAction,
  SaveModelAction,
  SourceModelStorage,
  SOURCE_URI_ARG,
  ActionDispatcher,
} from "@eclipse-glsp/server";
import { inject, injectable, postConstruct } from "inversify";
import { WorkflowModelState } from "./workflow-model-state.js";
import { findRootNode, streamReferences } from "langium";
import { Model, isModel } from "../../language-server/generated/ast.js";
import { UpdateClientOperation } from "../common/handler/update-glsp-client-handler.js";

@injectable()
export class WorkflowModelStorage
  implements SourceModelStorage, ClientSessionListener
{
  @inject(Logger) protected logger: Logger;
  @inject(WorkflowModelState) protected state: WorkflowModelState;
  @inject(ClientSessionManager) protected sessionManager: ClientSessionManager;
  @inject(ActionDispatcher) protected actionDispatcher: ActionDispatcher;

  @postConstruct()
  protected init(): void {
    this.sessionManager.addListener(this, this.state.clientId);
  }

  async loadSourceModel(action: RequestModelAction): Promise<void> {
    // load semantic model from document in language model service
    const sourceUri = this.getSourceUri(action);
    const rootUri = sourceUri;
    const rootUriDetails = `${sourceUri}d`;
    const root = await this.state.modelService.request(
      rootUri,
      isModel,
      "glsp"
    );
    const rootDetails = await this.state.modelService.request(
      rootUriDetails,
      isModel,
      "glsp"
    );
    if (!root) {
      throw new GLSPServerError("Expected Workflow Diagram Root");
    }
    if (!rootDetails) {
      throw new GLSPServerError("Expected Workflow Diagram Details Root");
    }
    this.state.setSemanticRoot(rootUri, root, rootUriDetails, rootDetails);
    this.state.modelService.onUpdate(
      this.state.semanticUri,
      "glsp",
      async (newModel: Model) => {
        await this.state.replaceSemanticRoot(newModel);
        this.actionDispatcher.dispatch(
          UpdateClientOperation.create(false, true)
        );
      }
    );
    this.state.modelService.onUpdate(
      this.state.semanticUriDetails,
      "glsp",
      async (newModel: Model) => {
        await this.state.replaceSemanticRootDetails(newModel);
        this.actionDispatcher.dispatch(
          UpdateClientOperation.create(true, false)
        );
      }
    );
  }

  saveSourceModel(action: SaveModelAction): MaybePromise<void> {
    const saveUri = this.getFileUri(action);

    // save document and all related documents
    this.state.modelService.save(saveUri, this.state.semanticRoot);
    this.state.modelService.save(`${saveUri}d`, this.state.semanticRootDetails);
    streamReferences(this.state.semanticRoot)
      .map((refInfo) => refInfo.reference.ref)
      .nonNullable()
      .map((ref) => findRootNode(ref))
      .forEach((root) =>
        this.state.modelService.save(root.$document!.uri.toString(), root)
      );
    streamReferences(this.state.semanticRootDetails)
      .map((refInfo) => refInfo.reference.ref)
      .nonNullable()
      .map((ref) => findRootNode(ref))
      .forEach((root) =>
        this.state.modelService.save(root.$document!.uri.toString(), root)
      );
  }

  sessionDisposed(_clientSession: ClientSession): void {
    // close loaded document for modification
    this.state.modelService.close(this.state.semanticUri, "glsp");
  }

  protected getSourceUri(action: RequestModelAction): string {
    const sourceUri = action.options?.[SOURCE_URI_ARG];
    if (typeof sourceUri !== "string") {
      throw new GLSPServerError(
        `Invalid RequestModelAction! Missing argument with key '${SOURCE_URI_ARG}'`
      );
    }
    return sourceUri;
  }

  protected getFileUri(action: SaveModelAction): string {
    const uri = action.fileUri ?? this.state.get(SOURCE_URI_ARG);
    if (!uri) {
      throw new GLSPServerError(
        "Could not derive fileUri for saving the current source model"
      );
    }
    return uri;
  }
}
