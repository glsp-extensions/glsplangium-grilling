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
import { Entity, Position, Size } from '../../../../../language-server/generated/ast.js';
import { ClassDiagramModelState } from '../../../model/class-diagram-model-state.js';
import { ModelTypes } from '../../util/model-types.js';
import { ClassDiagramCommand } from '../class-diagram-command.js';
import { GridSnapper } from '../grid-snapper.js';

@injectable()
export abstract class CreateContainerOperationHandler extends OperationHandler implements CreateNodeOperationHandler {
    readonly operationType = CreateNodeOperation.KIND;

    elementTypeIds = [
        ModelTypes.CLASS,
        ModelTypes.ABSTRACT_CLASS,
        ModelTypes.DATA_TYPE,
        ModelTypes.ENUMERATION,
        ModelTypes.INSTANCE_SPECIFICATION,
        ModelTypes.INTERFACE,
        ModelTypes.PACKAGE,
        ModelTypes.PRIMITIVE_TYPE
    ];

    override label = 'Operation';

    @inject(ClassDiagramModelState)
    protected override modelState: ClassDiagramModelState;

    override createCommand(operation: CreateNodeOperation): Command {
        return new ClassDiagramCommand(this.modelState, () => {
            const newEntityId = this.createNode(operation);
            if (newEntityId) {
                this.createNodeDetails(operation, newEntityId);
            }
        });
    }

    createNode(operation: CreateNodeOperation): string {
        return undefined;
    }

    createNodeDetails(operation: CreateNodeOperation, id: string): void {
        const relativeLocation = this.getRelativeLocation(operation);
        const location = this.getLocation(operation);
        const size: Size = {
            $container: null,
            $type: 'Size',
            __id: 'size_' + id,
            element: { ref: { $container: null, $type: null, name: null, __id: id }, $refText: id },
            width: 80,
            height: 30
        };
        this.modelState.insertToSemanticText(this.modelState.semanticText, size, ['metaInfos']);
        const position: Position = {
            $container: null,
            $type: 'Position',
            __id: 'pos_' + id,
            element: { ref: { $container: null, $type: null, name: null, __id: id }, $refText: id },
            x: relativeLocation?.x ?? location?.x ?? 0,
            y: relativeLocation?.y ?? location?.y ?? 0
        };
        this.modelState.insertToSemanticText(this.modelState.semanticText, position, ['metaInfos']);
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

    getRelativeLocation(operation: CreateNodeOperation) {
        const categoryPosition = this.modelState.index.findPosition(operation.containerId);
        if (!operation.location || !categoryPosition) {
            return undefined;
        }
        return {
            x: operation.location?.x - categoryPosition?.x,
            y: operation.location?.y - categoryPosition?.y
        };
    }

    insertEntityToSemanticText(operation: CreateNodeOperation, entity: Entity): void {
        const container = this.getContainer(operation);
        if (container) {
            // class was added to a package
            this.modelState.insertToSemanticText(container.$cstNode.text, entity, ['entities']);
        } else {
            this.modelState.insertToSemanticText(this.modelState.semanticText, entity, ['diagram', 'entities']);
        }
    }
}
