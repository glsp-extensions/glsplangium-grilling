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
import {
    Command,
    CreateEdgeOperation,
    CreateEdgeOperationHandler,
    OperationHandler,
    TriggerEdgeCreationAction
} from '@eclipse-glsp/server';
import { createRandomUUID } from 'model-service';
import { inject, injectable } from 'inversify';
import { BigUmlCommand } from '../../../../biguml/common/handler/big-uml-command.js';
import { ClassDiagramModelState } from '../../../model/class-diagram-model-state.js';
import { ModelTypes } from '../../util/model-types.js';

@injectable()
export class CreateClassDiagramEdgeOperationHandler extends OperationHandler implements CreateEdgeOperationHandler {
    readonly operationType = CreateEdgeOperation.KIND;

    elementTypeIds = [
        ModelTypes.ABSTRACTION,
        ModelTypes.AGGREGATION,
        ModelTypes.ASSOCIATION,
        ModelTypes.COMPOSITION,
        ModelTypes.DEPENDENCY,
        ModelTypes.GENERALIZATION,
        ModelTypes.INTERFACE_REALIZATION,
        ModelTypes.PACKAGE_IMPORT,
        ModelTypes.PACKAGE_MERGE,
        ModelTypes.REALIZATION,
        ModelTypes.SUBSTITUTION,
        ModelTypes.USAGE
    ];

    override label = 'Relation';

    @inject(ClassDiagramModelState)
    protected override modelState: ClassDiagramModelState;

    override createCommand(operation: CreateEdgeOperation): Command {
        return new BigUmlCommand(this.modelState, this.createEdge(operation, this.getRelationTypeFromElementId(operation.elementTypeId)));
    }

    createEdge(operation: CreateEdgeOperation, relationType: string): string | undefined {
        const sourceNode = this.modelState.index.findIdElement(operation.sourceElementId);
        const targetNode = this.modelState.index.findIdElement(operation.targetElementId);
        if (!(sourceNode && targetNode)) {
            return;
        }
        const patch = JSON.stringify({
            op: 'add',
            path: '/diagram/relations/-',
            value: {
                $type: 'Relation',
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
                relationType
            }
        });
        return patch;
    }

    getRelationTypeFromElementId(elementTypeId: string): string {
        switch (elementTypeId) {
            case ModelTypes.ABSTRACTION:
                return 'ABSTRACTION';
            case ModelTypes.AGGREGATION:
                return 'AGGREGATION';
            case ModelTypes.ASSOCIATION:
                return 'ASSOCIATION';
            case ModelTypes.COMPOSITION:
                return 'COMPOSITION';
            case ModelTypes.DEPENDENCY:
                return 'DEPENDENCY';
            case ModelTypes.GENERALIZATION:
                return 'GENERALIZATION';
            case ModelTypes.INTERFACE_REALIZATION:
                return 'INTERFACE_REALIZATION';
            case ModelTypes.PACKAGE_IMPORT:
                return 'PACKAGE_IMPORT';
            case ModelTypes.PACKAGE_MERGE:
                return 'PACKAGE_MERGE';
            case ModelTypes.REALIZATION:
                return 'REALIZATION';
            case ModelTypes.SUBSTITUTION:
                return 'SUBSTITUTION';
            case ModelTypes.USAGE:
                return 'USAGE';
            default:
                return 'ASSOCIATION';
        }
    }

    getTriggerActions(): TriggerEdgeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerEdgeCreationAction.create(typeId));
    }
}
