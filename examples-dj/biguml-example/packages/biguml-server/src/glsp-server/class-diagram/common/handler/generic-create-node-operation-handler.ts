/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    Command,
    CreateNodeOperation,
    CreateNodeOperationHandler,
    OperationHandler,
    Point,
    TriggerNodeCreationAction
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { createRandomUUID } from 'model-service';
import { URI } from 'vscode-uri';
import { findAvailableNodeName } from '../../../../language-server/yo-generated/util/name-util.js';
import { BigUmlCommand } from '../../../biguml/index.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { ModelTypes, astTypes } from '../util/model-types.js';
import { GridSnapper } from './grid-snapper.js';

import { getCreationPath } from '../../../../language-server/yo-generated/getCreationPath.js';
import { getProperties } from '../../../../language-server/yo-generated/getDefaultValue.js';

@injectable()
export class GenericCreateNodeOperationHandler extends OperationHandler implements CreateNodeOperationHandler {
    readonly operationType = CreateNodeOperation.KIND;

    @inject(ClassDiagramModelState)
    declare modelState: ClassDiagramModelState;

    get elementTypeIds(): string[] {
        return [ModelTypes.CLASS, ModelTypes.ABSTRACT_CLASS, ModelTypes.ENUMERATION];
    }

    override label: string = '';

    override createCommand(operation: CreateNodeOperation): Command {
        console.log('===== operation =====: ', operation);
        const modelPatch = this.createNode(operation);
        console.log('modelPatch: ', modelPatch);
        const nodeId = JSON.parse(modelPatch).value.__id;
        const modelDetailsPatch = this.createNodeDetails(operation, nodeId, URI.parse(this.modelState.semanticUri).path);
        const patch = [JSON.parse(modelPatch), ...JSON.parse(modelDetailsPatch)];
        return new BigUmlCommand(this.modelState, JSON.stringify(patch));
    }

    createNodeDetails(operation: CreateNodeOperation, id: string, nodeDocumentUri: string): string {
        const location = this.getLocation(operation);
        console.log('location: ', location);
        const patch = [
            {
                op: 'add',
                path: '/metaInfos/-',
                value: {
                    $type: 'Size',
                    __id: 'size_' + id,
                    element: { $ref: { __id: id, __documentUri: nodeDocumentUri } },
                    width: 80,
                    height: 30
                }
            },
            {
                op: 'add',
                path: '/metaInfos/-',
                value: {
                    $type: 'Position',
                    element: { $ref: { __id: id, __documentUri: nodeDocumentUri } },
                    __id: 'pos_' + id,
                    x: location?.x ?? 0,
                    y: location?.y ?? 0
                }
            }
        ];
        return JSON.stringify(patch);
    }

    getLocation(operation: CreateNodeOperation): Point | undefined {
        return GridSnapper.snap(operation.location);
    }

    getTriggerActions(): TriggerNodeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerNodeCreationAction.create(typeId));
    }

    createNode(operation: CreateNodeOperation): string {
        const newName = findAvailableNodeName(this.modelState.semanticRoot, 'New' + this.stripPrefix(operation.elementTypeId));
        console.log(operation.elementTypeId);
        console.log('newName: ' + newName);
        const id = createRandomUUID();

        const containerPath = this.resolveContainerPath(operation);
        console.log('ContainerPath: ' + containerPath);
        //this could be redone later (convertToAst)
        const astType = astTypes.convertToAst(operation.elementTypeId);
        console.log('elementtypeid: ', operation.elementTypeId);
        console.log('asttype: ' + astType);

        let nodeValue: any = {
            $type: astType,
            __id: id,
            name: newName
        };

        const allProps = getProperties(operation.elementTypeId);
        for (const { property, defaultValue } of allProps) {
            if (property !== 'name' && nodeValue[property] === undefined) {
                console.log('Property: ', property, defaultValue);
                nodeValue[property] = defaultValue;
            }
        }
        console.log('nodevalue: ', nodeValue);
        const patch = JSON.stringify({
            op: 'add',
            path: containerPath,
            value: nodeValue
        });
        return patch;
    }

    resolveContainerPath(operation: CreateNodeOperation): string {
        if (operation.containerId) {
            const container = this.modelState.index.find(operation.containerId);
            console.log('container: ', container);

            const containerPath = this.modelState.index.findPath(operation.containerId);
            console.log('container path: ', containerPath);
            console.log('container type: ', container.type);
            if (container && container.type === 'graph') {
                return '/diagram/entities/-';
            }

            if (container && container.type) {
                const creationProperty = getCreationPath(container.type, operation.elementTypeId);
                if (creationProperty) {
                    return containerPath + '/' + creationProperty + '/-';
                }
            }
        }
        return '';
    }

    stripPrefix(name) {
        return name.replace(/^.*?__/, '');
    }
}
