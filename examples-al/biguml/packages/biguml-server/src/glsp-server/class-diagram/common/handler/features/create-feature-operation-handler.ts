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
import { inject, injectable } from 'inversify';
import { Entity } from '../../../../../language-server/generated/ast.js';
import { ClassDiagramModelState } from '../../../model/class-diagram-model-state.js';
import { ModelTypes } from '../../util/model-types.js';
import { ClassDiagramCommand } from '../class-diagram-command.js';
import { GridSnapper } from '../grid-snapper.js';

@injectable()
export abstract class CreateFeatureOperationHandler extends OperationHandler implements CreateNodeOperationHandler {
    readonly operationType = CreateNodeOperation.KIND;

    elementTypeIds = [
        ModelTypes.ENUMERATION_LITERAL,
        ModelTypes.LITERAL_SPECIFICATION,
        ModelTypes.OPERATION,
        ModelTypes.PARAMETER,
        ModelTypes.PROPERTY,
        ModelTypes.SLOT
    ];

    override label = 'Feature';

    @inject(ClassDiagramModelState)
    protected override modelState: ClassDiagramModelState;

    override createCommand(operation: CreateNodeOperation): Command {
        return new ClassDiagramCommand(this.modelState, () => this.createFeature(operation));
    }

    createFeature(operation: CreateNodeOperation): void {
        return undefined;
    }

    getTriggerActions(): TriggerNodeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerNodeCreationAction.create(typeId));
    }

    getLocation(operation: CreateNodeOperation): Point | undefined {
        return GridSnapper.snap(operation.location);
    }

    getContainer(operation: CreateNodeOperation): Entity | undefined {
        if (operation.containerId && this.modelState.index.findEntity(operation.containerId)) {
            // class was added to a package
            return this.modelState.index.findEntity(operation.containerId);
        }
        return undefined;
    }
}
