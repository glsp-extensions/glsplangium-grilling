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
import { DefaultModelState, JsonModelState } from '@eclipse-glsp/server';
import { ModelService } from 'model-service';
import { inject, injectable } from 'inversify';
import { AstNode } from 'langium';
import { URI } from 'vscode-uri';
import { BigUmlLSPServices } from '../../../integration.js';
import { Diagram } from '../../../language-server/generated/ast.js';
import { QualifiedNameProvider } from '../../../language-server/yo-generated/uml-naming.js';
import { UmlSerializer } from '../../../language-server/yo-generated/uml-serializer.js';
import { escapeRegExp, regexIndexOf, removeAllComments, replaceStartingFrom } from '../../util/text-edit.js';
import { ClassDiagramModelIndex } from './class-diagram-model-index.js';

export interface ClassDiagramSourceModel {
    text: string;
}

/**
 * Custom model state that does not only keep track of the GModel root but also the semantic root.
 * It also provides convenience methods for accessing specific language services.
 */
@injectable()
export class ClassDiagramModelState extends DefaultModelState implements JsonModelState<ClassDiagramSourceModel> {
    @inject(ClassDiagramModelIndex)
    override readonly index: ClassDiagramModelIndex;
    @inject(BigUmlLSPServices)
    readonly services: BigUmlLSPServices;

    protected _semanticUri: string;
    protected _semanticRoot: Diagram;
    protected _packageId: string;
    protected _semanticText: string;

    setSemanticRoot(uri: string, semanticRoot: Diagram): void {
        this._semanticUri = uri;
        this._semanticRoot = semanticRoot;
        this._packageId = this.services.shared.workspace.PackageManager.getPackageIdByUri(URI.parse(uri));
        this._semanticText = semanticRoot.$document?.textDocument.getText() ?? '';
        this.index.indexSemanticRoot(this.semanticRoot);
    }

    get semanticUri(): string {
        return this._semanticUri;
    }

    get semanticRoot(): Diagram {
        return this._semanticRoot;
    }

    get packageId(): string {
        return this._packageId;
    }

    get modelService(): ModelService {
        return this.services.shared.model.ModelService;
    }

    get semanticSerializer(): UmlSerializer {
        return this.services.language.serializer.Serializer;
    }

    get nameProvider(): QualifiedNameProvider {
        return this.services.language.references.QualifiedNameProvider;
    }

    get sourceModel(): ClassDiagramSourceModel {
        return {
            text: this._semanticText
        };
    }

    // textual representation of the current semantic root
    get semanticText(): string {
        return this._semanticText;
    }

    async replaceSemanticRoot(model: Diagram) {
        this._semanticRoot = model;
        this._semanticText = model.$document?.textDocument.getText() ?? '';
        this.index.indexSemanticRoot(this.semanticRoot);
    }

    replaceSemanticText(sourceModel: ClassDiagramSourceModel) {
        if (sourceModel.text) {
            this._semanticText = sourceModel.text;
        }
    }

    async updateSourceModel(sourceModel: ClassDiagramSourceModel): Promise<void> {
        const model = await this.modelService.update<Diagram>(this.semanticUri, sourceModel.text ?? this.semanticRoot, 'glsp');
        if (Object.keys(model).length > 0) {
            // only replace semantic root if model is not empty
            this._semanticRoot = model;
            this.index.indexSemanticRoot(this.semanticRoot);
        }
    }

    insertToSemanticText(semanticText: string, node: AstNode, container: string[]) {
        const oldSemanticText = semanticText;
        let newSemanticText = semanticText;
        const cleanedSemanticText = removeAllComments(newSemanticText);
        let serializedNode = this.semanticSerializer.serializeAstNode(node);

        // find position of the first '[' of the array declaration
        // and insert element after
        let containerIndex = regexIndexOf(cleanedSemanticText, new RegExp(`"${container.at(0)}"\\s*:`, 'g'), 0);
        if (container.length > 1) {
            // iterate through all the nested containers of the element
            container.slice(1).forEach(selector => {
                containerIndex = regexIndexOf(cleanedSemanticText, new RegExp(`"${selector}"\\s*:`, 'g'), containerIndex);
            });
        }
        const insertIndex = cleanedSemanticText.indexOf('[', containerIndex);

        // if there are already elements in the array
        // the new element must be appended with a ',' separator
        const indexOfNextElement = cleanedSemanticText.indexOf('{', insertIndex + 1);
        const indexOfArrayEnd = cleanedSemanticText.indexOf(']', insertIndex + 1);
        if (indexOfNextElement >= 0 && indexOfNextElement < indexOfArrayEnd) {
            serializedNode = `${serializedNode},`;
        }

        // insert element to semantic text
        newSemanticText =
            newSemanticText.substring(0, insertIndex + 1) + `\n${serializedNode}` + newSemanticText.substring(insertIndex + 1);
        this._semanticText = this._semanticText.replace(oldSemanticText, newSemanticText);
    }

    insertAttributeToSemanticText(semanticText: string, attributeName: string, attributeValue: any, container?: string[]) {
        const oldSemanticText = semanticText;
        let newSemanticText = semanticText;
        const cleanedSemanticText = removeAllComments(newSemanticText);
        let serializedAttributeValue = attributeValue.toString();
        if (typeof attributeValue === 'string') {
            serializedAttributeValue = `"${attributeValue}"`;
        }
        if (typeof attributeValue === 'object') {
            serializedAttributeValue = JSON.stringify(attributeValue);
        }

        // find position of the first '{' of the element declaration
        // and insert element after
        let containerIndex = 0;
        if (container?.length > 0) {
            // iterate through all the nested containers of the element
            container.forEach(selector => {
                containerIndex = regexIndexOf(cleanedSemanticText, new RegExp(`"${selector}"\\s*:`, 'g'), containerIndex);
            });
        }
        const insertIndex = cleanedSemanticText.indexOf('{', containerIndex);

        // if there are already elements in the array
        // the new element must be appended with a ',' separator
        const indexOfNextAttribute = cleanedSemanticText.indexOf('"', insertIndex + 1);
        const indexOfElementEnd = cleanedSemanticText.indexOf('}', insertIndex + 1);
        if (indexOfNextAttribute >= 0 && indexOfNextAttribute < indexOfElementEnd) {
            serializedAttributeValue = `${serializedAttributeValue},`;
        }

        // insert element to semantic text
        newSemanticText =
            newSemanticText.substring(0, insertIndex + 1) +
            `\n"${attributeName}": ${serializedAttributeValue}` +
            newSemanticText.substring(insertIndex + 1);
        this._semanticText = this._semanticText.replace(oldSemanticText, newSemanticText);
    }

    deleteFromSemanticText(elementText: string) {
        console.log('delete regex', new RegExp(`,\\s*${escapeRegExp(elementText)}`, 'g'));
        const cleanedSemanticText = removeAllComments(this._semanticText);

        // ',' before element
        let regExp = new RegExp(`,\\s*${escapeRegExp(elementText)}`, 'g');
        let index = regexIndexOf(cleanedSemanticText, regExp);
        let elementLength = 0;
        if (index >= 0) {
            elementLength = cleanedSemanticText.match(regExp)[0].length;
            this._semanticText = this._semanticText.slice(0, index) + this.semanticText.slice(index + elementLength);
            return;
        }

        // ',' after element
        regExp = new RegExp(`${escapeRegExp(elementText)}\\s*,`, 'g');
        index = regexIndexOf(cleanedSemanticText, regExp);
        if (index >= 0) {
            elementLength = cleanedSemanticText.match(regExp)[0].length;
            this._semanticText = this._semanticText.slice(0, index) + this.semanticText.slice(index + elementLength);
            return;
        }

        // no ',' around element
        regExp = new RegExp(`${escapeRegExp(elementText)}`, 'g');
        index = regexIndexOf(cleanedSemanticText, regExp);
        if (index >= 0) {
            elementLength = cleanedSemanticText.match(regExp)[0].length;
            this._semanticText = this._semanticText.slice(0, index) + this.semanticText.slice(index + elementLength);
            return;
        }
    }

    updateInSemanticText(oldText: string, attributeName: string[], oldAttributeValue: string, newAttributeValue: string): string {
        let newText = oldText;
        const cleanedText = removeAllComments(newText);
        if (typeof oldAttributeValue === 'undefined') {
            // should also fill undefined string variables
            oldAttributeValue = '""';
        }

        // find the position of the attribute in the cleaned text
        let attributeIndex = regexIndexOf(cleanedText, new RegExp(`"${attributeName.at(0)}"\\s*:`, 'g'), 0);
        if (attributeName.length > 1) {
            // iterate through all the nested attributes of the element
            attributeName.slice(1).forEach(selector => {
                attributeIndex = regexIndexOf(cleanedText, new RegExp(`"${selector}"\\s*:`, 'g'), attributeIndex);
            });
        }

        // replace old attribute value with new one
        newText = replaceStartingFrom(newText, oldAttributeValue, newAttributeValue, attributeIndex);
        this._semanticText = this._semanticText.replace(oldText, newText);
        // return updated text to ensure multiple updates in the same comment
        return newText;
    }
}
