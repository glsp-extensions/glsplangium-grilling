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
import { CreateNodeOperation } from '@eclipse-glsp/server';
import { createRandomUUID } from 'model-service';
import { injectable } from 'inversify';
import { Slot } from '../../../../../language-server/generated/ast.js';
import { findAvailableNodeName } from '../../../../../language-server/yo-generated/util/name-util.js';
import { ModelTypes } from '../../util/model-types.js';
import { CreateFeatureOperationHandler } from './create-feature-operation-handler.js';

@injectable()
export class CreateSlotOperationHandler extends CreateFeatureOperationHandler {
    override readonly operationType = CreateNodeOperation.KIND;
    override label = 'Slot';

    override elementTypeIds = [ModelTypes.SLOT];

    override createFeature(operation: CreateNodeOperation): void {
        return this.createSlot(operation);
    }

    getContainerPath(operation: CreateNodeOperation): string | undefined {
        if (operation.containerId) {
            const containerPath = this.modelState.index.findPath(operation.containerId);
            if (containerPath) {
                return containerPath + '/slots/-';
            }
        }
        return undefined;
    }

    createSlot(operation: CreateNodeOperation): void {
        const container = this.getContainer(operation) ?? undefined;
        const name = findAvailableNodeName(this.modelState.semanticRoot, 'NewSlot');
        if (container) {
            const newSlot: Slot = {
                $type: 'Slot',
                $container: null,
                __id: createRandomUUID(),
                name,
                values: []
            };
            this.modelState.insertToSemanticText(container.$cstNode.text, newSlot, ['slots']);
        }
    }
}
