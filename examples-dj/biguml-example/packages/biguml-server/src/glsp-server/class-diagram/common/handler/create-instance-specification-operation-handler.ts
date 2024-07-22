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
    CreateNodeOperation,
    CreateNodeOperationHandler,
    OperationHandler,
    Point,
    TriggerNodeCreationAction
} from '@eclipse-glsp/server';
import { createRandomUUID } from 'model-service';
import { inject, injectable } from 'inversify';
import { URI } from 'vscode-uri';
import { findAvailableNodeName } from '../../../../language-server/yo-generated/util/name-util.js';
import { BigUmlCommand } from '../../../biguml/index.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { ModelTypes } from '../util/model-types.js';
import { GridSnapper } from './grid-snapper.js';

@injectable()
export class CreateInstanceSpecificationOperationHandler extends OperationHandler implements CreateNodeOperationHandler {
    readonly operationType = CreateNodeOperation.KIND;
    override label = 'InstanceSpecification';

    elementTypeIds = [ModelTypes.INSTANCE_SPECIFICATION];

    @inject(ClassDiagramModelState)
    protected override modelState: ClassDiagramModelState;

    override createCommand(operation: CreateNodeOperation): Command {
        const modelPatch = this.createNode(operation);
        const modelDetailsPatch = this.createNodeDetails(
            operation,
            JSON.parse(modelPatch).value.__id,
            URI.parse(this.modelState.semanticUri).path
        );
        const patch = [JSON.parse(modelPatch), ...JSON.parse(modelDetailsPatch)];
        return new BigUmlCommand(this.modelState, JSON.stringify(patch));
    }

    createNodeDetails(operation: CreateNodeOperation, id: string, nodeDocumentUri: string): string {
        const location = this.getLocation(operation);
        const patch: any[] = [];
        patch.push({
            op: 'add',
            path: '/metaInfos/-',
            value: {
                $type: 'Size',
                __id: 'size_' + id,
                element: { $ref: { __id: id, __documentUri: nodeDocumentUri } },
                width: 80,
                height: 30
            }
        });
        patch.push({
            op: 'add',
            path: '/metaInfos/-',
            value: {
                $type: 'Position',
                element: { $ref: { __id: id, __documentUri: nodeDocumentUri } },
                __id: 'pos_' + id,
                x: location?.x ?? 0,
                y: location?.y ?? 0
            }
        });
        return JSON.stringify(patch);
    }

    getTriggerActions(): TriggerNodeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerNodeCreationAction.create(typeId));
    }

    getLocation(operation: CreateNodeOperation): Point | undefined {
        return GridSnapper.snap(operation.location);
    }

    getContainer(operation: CreateNodeOperation): undefined {
        return undefined;
    }

    getContainerPath(operation: CreateNodeOperation): string | undefined {
        return undefined;
    }

    createNode(operation: CreateNodeOperation): string {
        return this.createInstanceSpecification(operation);
    }

    createInstanceSpecification(operation: CreateNodeOperation): string {
        const name = findAvailableNodeName(this.modelState.semanticRoot, 'NewInstanceSpecification');
        const patch = JSON.stringify({
            op: 'add',
            path: '/diagram/entities/-',
            value: {
                $type: 'InstanceSpecification',
                __id: createRandomUUID(),
                name,
                visibility: 'PUBLIC',
                slots: []
            }
        });
        return patch;
    }
}
