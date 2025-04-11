/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RequestOutlineAction, SetOutlineAction } from '@biguml/biguml-protocol';
import { Action, ActionHandler, MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { isClass, isInterface } from '../../../../../language-server/generated/ast.js';
import { ClassDiagramModelState } from '../../../model/class-diagram-model-state.js';

@injectable()
export class RequestOutlineActionHandler implements ActionHandler {
    actionKinds = [RequestOutlineAction.KIND];

    @inject(ClassDiagramModelState)
    protected modelState: ClassDiagramModelState;

    execute(action: RequestOutlineAction): MaybePromise<Action[]> {
        if (this.modelState.index.root.diagram.diagramType === 'CLASS') {
            const root = this.modelState.index.root.diagram;
            const entities = this.modelState.index.root.diagram.entities;
            const outlineTreeNodes = [{ label: 'Model', semanticUri: root.__id, children: [], iconClass: 'model', isRoot: true }];
            entities.forEach(entity => {
                const node = { label: entity.name, semanticUri: entity.__id, children: [], iconClass: 'class' };
                if (isClass(entity)) {
                    node.iconClass = 'class';
                    node.children.push(
                        ...entity.properties.map(property => ({
                            label: property.name,
                            semanticUri: property.__id,
                            children: [],
                            iconClass: 'property'
                        }))
                    );
                }
                if (isInterface(entity)) {
                    node.iconClass = 'interface';
                    node.children.push(
                        ...entity.properties.map(property => ({
                            label: property.name,
                            semanticUri: property.__id,
                            children: [],
                            iconClass: 'property'
                        }))
                    );
                }
                outlineTreeNodes[0].children.push(node);
            });
            return [SetOutlineAction.create({ outlineTreeNodes })];
        }
        return [SetOutlineAction.create({ outlineTreeNodes: [] })];
    }
}
