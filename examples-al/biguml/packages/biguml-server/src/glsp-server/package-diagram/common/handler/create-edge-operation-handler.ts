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
import { Relation, RelationType } from '../../../../language-server/generated/ast.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';
import { ModelTypes } from '../util/model-types.js';
import { PackageDiagramCommand } from './package-diagram-command.js';

@injectable()
export class CreatePackageDiagramEdgeOperationHandler extends OperationHandler implements CreateEdgeOperationHandler {
    readonly operationType = CreateEdgeOperation.KIND;

    elementTypeIds = [
        ModelTypes.ABSTRACTION,
        ModelTypes.DEPENDENCY,
        ModelTypes.ELEMENT_IMPORT,
        ModelTypes.PACKAGE_IMPORT,
        ModelTypes.PACKAGE_MERGE,
        ModelTypes.USAGE
    ];

    override label = 'Relation';

    @inject(PackageDiagramModelState)
    protected override modelState: PackageDiagramModelState;

    override createCommand(operation: CreateEdgeOperation): Command {
        return new PackageDiagramCommand(this.modelState, () =>
            this.createEdge(operation, this.getRelationTypeFromElementId(operation.elementTypeId))
        );
    }

    createEdge(operation: CreateEdgeOperation, packageRelationType: RelationType): void {
        const sourceNode = this.modelState.index.findIdElement(operation.sourceElementId);
        const targetNode = this.modelState.index.findIdElement(operation.targetElementId);
        if (!(sourceNode && targetNode)) {
            return;
        }
        const newEdge: Relation = {
            $type: 'Relation',
            __id: createRandomUUID(),
            source: {
                ref: {
                    $container: null,
                    $type: null,
                    name: null,
                    __id: sourceNode.__id
                },
                $refText: this.modelState.nameProvider.getLocalName(sourceNode) || sourceNode.__id
            },
            target: {
                ref: {
                    $container: null,
                    $type: null,
                    name: null,
                    __id: targetNode.__id
                },
                $refText: this.modelState.nameProvider.getLocalName(targetNode) || targetNode.__id
            },
            relationType: packageRelationType
        };
        this.modelState.insertToSemanticText(this.modelState.semanticText, newEdge, ['diagram', 'relations']);
    }

    getRelationTypeFromElementId(elementTypeId: string): RelationType {
        switch (elementTypeId) {
            case ModelTypes.ABSTRACTION:
                return 'ABSTRACTION';
            case ModelTypes.DEPENDENCY:
                return 'DEPENDENCY';
            case ModelTypes.ELEMENT_IMPORT:
                return 'ELEMENT_IMPORT';
            case ModelTypes.PACKAGE_IMPORT:
                return 'PACKAGE_IMPORT';
            case ModelTypes.PACKAGE_MERGE:
                return 'PACKAGE_MERGE';
            case ModelTypes.USAGE:
                return 'USAGE';
            default:
                return 'ABSTRACTION';
        }
    }

    getTriggerActions(): TriggerEdgeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerEdgeCreationAction.create(typeId));
    }
}
