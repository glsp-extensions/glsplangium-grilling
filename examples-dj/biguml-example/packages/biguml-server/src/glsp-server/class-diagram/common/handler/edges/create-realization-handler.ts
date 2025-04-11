/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Command, CreateEdgeOperation } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { createRandomUUID } from 'model-service';
import { BigUmlCommand } from '../../../../biguml/index.js';
import { ModelTypes } from '../../util/model-types.js';
import { CreateClassDiagramEdgeOperationHandler } from './create-edge-operation-handler.js';

@injectable()
export class CreateRealizationOperationHandler extends CreateClassDiagramEdgeOperationHandler {
    override elementTypeIds = [ModelTypes.REALIZATION];

    override label = 'Realization';

    override createCommand(operation: CreateEdgeOperation): Command {
        return new BigUmlCommand(this.modelState, this.createEdge(operation, this.getRelationTypeFromElementId(operation.elementTypeId)));
    }

    override createEdge(operation: CreateEdgeOperation, relationType: string): string | undefined {
        const sourceNode = this.modelState.index.findIdElement(operation.sourceElementId);
        const targetNode = this.modelState.index.findIdElement(operation.targetElementId);
        if (!(sourceNode && targetNode)) {
            return;
        }
        const patch = JSON.stringify({
            op: 'add',
            path: '/diagram/relations/-',
            value: {
                $type: 'Realization',
                __id: createRandomUUID(),
                source: {
                    ref: {
                        __id: sourceNode.__id,
                        __documentUri: sourceNode.$document?.uri
                    },
                    $refText: this.modelState.nameProvider.getLocalName(sourceNode) || sourceNode.__id
                },
                target: {
                    ref: {
                        __id: targetNode.__id,
                        __documentUri: sourceNode.$document?.uri
                    },
                    $refText: this.modelState.nameProvider.getLocalName(targetNode) || targetNode.__id
                },
                relationType,
                visibility: 'PUBLIC'
            }
        });
        return patch;
    }
}
