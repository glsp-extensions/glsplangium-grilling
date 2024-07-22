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
import { Package, Position, Size } from '../../../../language-server/generated/ast.js';
import { findAvailableNodeName } from '../../../../language-server/yo-generated/util/name-util.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';
import { ModelTypes } from '../util/model-types.js';
import { GridSnapper } from './grid-snapper.js';
import { PackageDiagramCommand } from './package-diagram-command.js';

@injectable()
export class CreatePackageOperationHandler extends OperationHandler implements CreateNodeOperationHandler {
    readonly operationType = CreateNodeOperation.KIND;
    override label = 'Package';

    elementTypeIds = [ModelTypes.PACKAGE];

    @inject(PackageDiagramModelState)
    protected override modelState: PackageDiagramModelState;

    override createCommand(operation: CreateNodeOperation): Command {
        return new PackageDiagramCommand(this.modelState, () => {
            const newPackageId = this.createPackage(operation);
            this.createNodeDetails(operation, newPackageId);
        });
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

    createPackage(operation: CreateNodeOperation): string {
        const newName = findAvailableNodeName(this.modelState.semanticRoot, 'NewPackage');
        const newPackage: Package = {
            $type: 'Package',
            $container: null,
            __id: operation.args?.__id ? operation.args.__id.toString() : createRandomUUID(),
            name: newName,
            visibility: 'PUBLIC',
            entities: []
        };
        if (operation.containerId && this.modelState.index.findEntity(operation.containerId)) {
            // package was added to another package
            const container = this.modelState.index.findEntity(operation.containerId);
            this.modelState.insertToSemanticText(container.$cstNode.text, newPackage, ['entities']);
        } else {
            this.modelState.insertToSemanticText(this.modelState.semanticText, newPackage, ['diagram', 'entities']);
        }
        return newPackage.__id;
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
}
