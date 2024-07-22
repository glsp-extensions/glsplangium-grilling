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
import { IdAstNode } from '../../../../language-server/yo-generated/uml-naming.js';
import { findAvailableNodeName } from '../../../../language-server/yo-generated/util/name-util.js';
import { BigUmlCommand } from '../../../biguml/index.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { ModelTypes } from '../util/model-types.js';
import { GridSnapper } from './grid-snapper.js';

@injectable()
export class CreateClassPropertyOperationHandler extends OperationHandler implements CreateNodeOperationHandler {
    readonly operationType = CreateNodeOperation.KIND;

    elementTypeIds = [ModelTypes.PROPERTY];

    override label = 'Property';

    @inject(ClassDiagramModelState)
    protected override modelState: ClassDiagramModelState;

    override createCommand(operation: CreateNodeOperation): Command {
        const patch = this.createProperty(operation);
        return new BigUmlCommand(this.modelState, patch);
    }

    createProperty(operation: CreateNodeOperation): string {
        const patch: any[] = [];
        const container = this.getContainer(operation) ?? undefined;
        const name = findAvailableNodeName(this.modelState.semanticRoot, 'newProperty');
        if (container) {
            patch.push({
                op: 'add',
                path: this.getContainerPath(operation),
                value: {
                    $type: 'Property',
                    __id: createRandomUUID(),
                    name,
                    visibility: 'PUBLIC'
                }
            });
        }
        return JSON.stringify(patch);
    }

    getTriggerActions(): TriggerNodeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerNodeCreationAction.create(typeId));
    }

    getLocation(operation: CreateNodeOperation): Point | undefined {
        return GridSnapper.snap(operation.location);
    }

    getContainer(operation: CreateNodeOperation): IdAstNode | undefined {
        if (operation.containerId) {
            return this.modelState.index.findIdElement(operation.containerId);
        }
        return undefined;
    }

    getContainerPath(operation: CreateNodeOperation): string | undefined {
        if (operation.containerId) {
            const containerPath = this.modelState.index.findPath(operation.containerId);
            if (containerPath) {
                return containerPath + '/properties/-';
            }
        }
        return undefined;
    }
}
