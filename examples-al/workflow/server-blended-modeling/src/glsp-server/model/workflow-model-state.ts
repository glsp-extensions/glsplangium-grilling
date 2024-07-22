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
import { AstNode } from "langium";
import { DiagramSerializer, ModelService } from "model-service";
import { Range } from "vscode-languageclient";
import { WorkflowLSPServices } from "../../integration.js";
import { Model } from "../../language-server/generated/ast.js";
import { WorkflowNameProvider } from "../../language-server/workflow-naming.js";
import { getRangeFromText, removeAllComments, replaceStartingFrom } from "../common/util/text-edit.js";
import { WorkflowModelIndex } from "./workflow-model-index.js";

export interface WorkflowSourceModel {
  text: string | undefined;
  textDetails: string | undefined;
}

/**
 * Custom model state that does not only keep track of the GModel root but also the semantic root.
 * It also provides convenience methods for accessing specific language services.
 */
@injectable()
export class WorkflowModelState extends DefaultModelState implements JsonModelState<WorkflowSourceModel> {
  @inject(WorkflowModelIndex) override readonly index: WorkflowModelIndex;
  @inject(WorkflowLSPServices) readonly services: WorkflowLSPServices;

  protected _semanticUri: string;
  protected _semanticUriDetails: string;
  protected _semanticRoot: Model;
  protected _semanticRootDetails: Model;
  protected _semanticText: string;
  protected _semanticTextDetails: string;

  setSemanticRoot(uri: string, semanticRoot: Model, uriDetails?: string, semanticRootDetails?: Model): void {
    this._semanticUri = uri;
    this._semanticRoot = semanticRoot;
    if (uriDetails) {
      this._semanticUriDetails = uriDetails;
    }
    if (semanticRootDetails) {
      this._semanticRootDetails = semanticRootDetails;
    }
    this._semanticText = semanticRoot.$document?.textDocument.getText() ?? "";
    this._semanticTextDetails = semanticRootDetails?.$document?.textDocument.getText() ?? "";
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

  get modelService(): ModelService {
    return this.services.shared.model.ModelService;
  }

  get semanticSerializer(): DiagramSerializer<Model> {
    return this.services.language.serializer.Serializer;
  }

  get nameProvider(): WorkflowNameProvider {
    return this.services.language.references.NameProvider;
  }

  get sourceModel(): WorkflowSourceModel {
    return {
      text: this._semanticText,
      textDetails: this._semanticTextDetails,
    };
  }

  replaceSemanticRoot(model: Model) {
    this._semanticRoot = model;
    this._semanticText = model.$document?.textDocument.getText() ?? "";
    this.index.indexSemanticRoot(this.semanticRoot, this.semanticRootDetails);
  }

  replaceSemanticRootDetails(model: Model) {
    this._semanticRootDetails = model;
    this._semanticTextDetails = model.$document?.textDocument.getText() ?? "";
    this.index.indexSemanticRoot(this.semanticRoot, this.semanticRootDetails);
  }

  replaceSemanticText(sourceModel: WorkflowSourceModel) {
    if (sourceModel.text) {
      this._semanticText = sourceModel.text;
    }
    if (sourceModel.textDetails) {
      this._semanticTextDetails = sourceModel.textDetails;
    }
  }

  async updateSourceModel(
    sourceModel: WorkflowSourceModel,
    doNotUpdateSemanticRoot?: boolean,
    doNotUpdateSemanticRootDetails?: boolean
  ): Promise<void> {
    if (!doNotUpdateSemanticRoot) {
      const model = await this.modelService.update<Model>(
        this.semanticUri,
        sourceModel.text ?? this.semanticRoot,
        "glsp"
      );
      if (Object.keys(model).length > 0) {
        // only replace semantic root if model is not empty
        this._semanticRoot = model;
      }
    }
    if (!doNotUpdateSemanticRootDetails) {
      const model = await this.modelService.update<Model>(
        this.semanticUriDetails,
        sourceModel.textDetails ?? this.semanticRootDetails,
        "glsp"
      );
      if (Object.keys(model).length > 0) {
        // only replace semantic root if model is not empty
        this._semanticRootDetails = model;
      }
    }
    this.index.indexSemanticRoot(this.semanticRoot, this.semanticRootDetails);
  }

  /** Textual representation of the current semantic root. */
  get semanticText(): string {
    return this._semanticText;
  }

  get semanticTextDetails(): string {
    return this._semanticTextDetails;
  }

  insertToSemanticText(node: AstNode, container?: string) {
    let serializedNode = this.services.language.serializer.Serializer.serializeAstNode(node);
    if (container) {
      // new node was inserted as a child node of a category
      let insertPosition = container.lastIndexOf("}");
      let newContainer = container;
      if (insertPosition < 0) {
        // no childre yet, create model container
        serializedNode = ` {\n${serializedNode}\n}`;
        insertPosition = container.lastIndexOf(";");
      } else {
        // append child to model
        serializedNode = `${serializedNode}\n`;
      }
      newContainer = newContainer.slice(0, insertPosition) + serializedNode + newContainer.slice(insertPosition);
      this._semanticText = this._semanticText.replace(container, newContainer);
    } else {
      this._semanticText += `\n${serializedNode}`;
    }
  }

  insertToSemanticTextDetails(node: AstNode) {
    const serializedNode = this.services.language.serializer.Serializer.serializeAstNode(node);
    this._semanticTextDetails += `\n${serializedNode}`;
  }

  deleteFromSemanticText(range: Range) {
    this._semanticText = this._semanticText.replace(getRangeFromText(range, this._semanticText), "");
  }

  deleteFromSemanticTextDetails(range: Range) {
    this._semanticTextDetails = this._semanticTextDetails.replace(
      getRangeFromText(range, this._semanticTextDetails),
      ""
    );
  }

  updateInSemanticText(oldText: string, oldAttributeValue: string, newAttributeValue: string): string {
    let newText = oldText;
    const cleanedText = removeAllComments(newText);
    // find the position of the attribute in the cleaned text
    const attributeIndex = cleanedText.indexOf(oldAttributeValue);
    newText = replaceStartingFrom(newText, oldAttributeValue, newAttributeValue, attributeIndex);
    this._semanticText = this._semanticText.replace(oldText, newText);
    // return updated text to ensure multiple updates in the same comment
    return newText;
  }

  updateInSemanticTextDetails(oldText: string, oldAttributeValue: string, newAttributeValue: string): string {
    let newText = oldText;
    const cleanedText = removeAllComments(newText);
    // find the position of the attribute in the cleaned text
    const attributeIndex = cleanedText.indexOf(oldAttributeValue);
    newText = replaceStartingFrom(newText, oldAttributeValue, newAttributeValue, attributeIndex);
    this._semanticTextDetails = this._semanticTextDetails.replace(oldText, newText);
    // return updated text to ensure multiple updates in the same comment
    return newText;
  }
}
