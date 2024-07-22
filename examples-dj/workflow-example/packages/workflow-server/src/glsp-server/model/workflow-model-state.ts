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
import { DefaultModelState, JsonModelState } from "@eclipse-glsp/server";
import { inject, injectable } from "inversify";
import { Model } from "../../language-server/generated/ast.js";
import { WorkflowModelIndex } from "./workflow-model-index.js";
import { WorkflowLSPServices } from "../../integration.js";
import { URI } from "vscode-uri";
import { ModelService, DiagramSerializer } from "model-service";
import { QualifiedNameProvider } from "../../language-server/yo-generated/workflow-diagram-naming.js";

export interface WorkflowSourceModel {
  text: string;
  textDetails: string;
}

/**
 * Custom model state that does not only keep track of the GModel root but also the semantic root.
 * It also provides convenience methods for accessing specific language services.
 */
@injectable()
export class WorkflowModelState
  extends DefaultModelState
  implements JsonModelState<WorkflowSourceModel>
{
  @inject(WorkflowModelIndex) override readonly index: WorkflowModelIndex;
  @inject(WorkflowLSPServices)
  readonly services: WorkflowLSPServices;

  protected _semanticUri: string;
  protected _semanticUriDetails: string;
  protected _semanticRoot: Model;
  protected _semanticRootDetails: Model;
  protected _packageId: string;

  setSemanticRoot(
    uri: string,
    semanticRoot: Model,
    uriDetails?: string,
    semanticRootDetails?: Model
  ): void {
    this._semanticUri = uri;
    this._semanticRoot = semanticRoot;
    this._packageId =
      this.services.shared.workspace.PackageManager.getPackageIdByUri(
        URI.parse(uri)
      );
    if (uriDetails) {
      this._semanticUriDetails = uriDetails;
    }
    if (semanticRootDetails) {
      this._semanticRootDetails = semanticRootDetails;
    }
    this.index.indexSemanticRoot(this.semanticRoot, this.semanticRootDetails);
  }

  get semanticUri(): string {
    return this._semanticUri;
  }

  get semanticRoot(): Model {
    return this._semanticRoot;
  }

  get semanticUriDetails(): string {
    return this._semanticUriDetails;
  }

  get semanticRootDetails(): Model {
    return this._semanticRootDetails;
  }

  get packageId(): string {
    return this._packageId;
  }

  get modelService(): ModelService {
    return this.services.shared.model.ModelService;
  }

  get semanticSerializer(): DiagramSerializer<Model> {
    return this.services.language.serializer.Serializer;
  }

  get nameProvider(): QualifiedNameProvider {
    return this.services.language.references.QualifiedNameProvider;
  }

  get sourceModel(): WorkflowSourceModel {
    return {
      text: this.semanticText(),
      textDetails: this.semanticTextDetails(),
    };
  }

  async replaceSemanticRoot(model: Model) {
    this._semanticRoot = model;
    this.index.indexSemanticRoot(this.semanticRoot, this.semanticRootDetails);
  }

  async replaceSemanticRootDetails(model: Model) {
    this._semanticRootDetails = model;
    this.index.indexSemanticRoot(this.semanticRoot, this.semanticRootDetails);
  }

  async updateSemanticRoot(
    content?: string,
    contentDetails?: string,
    doNotUpdateSemanticRoot?: boolean,
    doNotUpdateSemanticRootDetails?: boolean
  ): Promise<void> {
    if (!doNotUpdateSemanticRoot) {
      this._semanticRoot = await this.modelService.update(
        this.semanticUri,
        content ?? this.semanticRoot,
        "glsp"
      );
    }
    if (!doNotUpdateSemanticRootDetails) {
      this._semanticRootDetails = await this.modelService.update(
        this.semanticUriDetails,
        contentDetails ?? this.semanticRootDetails,
        "glsp"
      );
    }
    this.index.indexSemanticRoot(this.semanticRoot, this.semanticRootDetails);
  }

  async sendModelPatch(patch: string): Promise<void> {
    this._semanticRoot = await this.modelService.patch(
      this.semanticUri,
      patch,
      "glsp"
    );
    this.index.indexSemanticRoot(this.semanticRoot, this.semanticRootDetails);
  }
  async sendModelDetailsPatch(patch: string): Promise<void> {
    this._semanticRootDetails = await this.modelService.patch(
      this.semanticUriDetails,
      patch,
      "glsp"
    );
    this.index.indexSemanticRoot(this.semanticRoot, this.semanticRootDetails);
  }

  async updateSourceModel(
    sourceModel: WorkflowSourceModel,
    doNotUpdateSemanticRoot?: boolean,
    doNotUpdateSemanticRootDetails?: boolean
  ): Promise<void> {
    if (!doNotUpdateSemanticRoot) {
      this._semanticRoot = await this.modelService.update<Model>(
        this.semanticUri,
        sourceModel.text ?? this.semanticRoot,
        "glsp"
      );
    }
    if (!doNotUpdateSemanticRootDetails) {
      this._semanticRootDetails = await this.modelService.update<Model>(
        this.semanticUriDetails,
        sourceModel.textDetails ?? this.semanticRootDetails,
        "glsp"
      );
    }
    this.index.indexSemanticRoot(this.semanticRoot, this.semanticRootDetails);
  }

  async undo() {
    this._semanticRootDetails = await this.modelService.undo(
      this.semanticUriDetails
    );
    this._semanticRoot = await this.modelService.undo(this.semanticUri);
    this.index.indexSemanticRoot(this.semanticRoot, this.semanticRootDetails);
  }
  async redo() {
    this._semanticRoot = await this.modelService.redo(this.semanticUri);
    this._semanticRootDetails = await this.modelService.redo(
      this.semanticUriDetails
    );
    this.index.indexSemanticRoot(this.semanticRoot, this.semanticRootDetails);
  }

  /** Textual representation of the current semantic root. */
  semanticText(): string {
    return this.services.language.serializer.Serializer.serialize(
      this.semanticRoot
    );
  }

  semanticTextDetails(): string {
    return this.services.language.serializer.Serializer.serialize(
      this.semanticRootDetails
    );
  }
}
