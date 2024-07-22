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
import { EnumerationLiteral, isEnumeration } from '../../../../../language-server/generated/ast.js';
import { findAvailableNodeName } from '../../../../../language-server/yo-generated/util/name-util.js';
import { ModelTypes } from '../../util/model-types.js';
import { CreateFeatureOperationHandler } from './create-feature-operation-handler.js';

@injectable()
export class CreateEnumerationLiteralOperationHandler extends CreateFeatureOperationHandler {
    override readonly operationType = CreateNodeOperation.KIND;

    override elementTypeIds = [ModelTypes.ENUMERATION_LITERAL];

    override label = 'Enumeration Literal';

    override createFeature(operation: CreateNodeOperation): void {
        return this.createEnumerationLiteral(operation);
    }

    createEnumerationLiteral(operation: CreateNodeOperation): void {
        const container = this.getContainer(operation) ?? undefined;
        const name = findAvailableNodeName(this.modelState.semanticRoot, 'NewEnumLiteral');
        if (container && isEnumeration(container)) {
            const newEnumerationLiteral: EnumerationLiteral = {
                $type: 'EnumerationLiteral',
                $container: null,
                __id: createRandomUUID(),
                name,
                value: name,
                visibility: 'PUBLIC'
            };
            this.modelState.insertToSemanticText(container.$cstNode.text, newEnumerationLiteral, ['values']);
        }
    }

    getContainerPath(operation: CreateNodeOperation): string | undefined {
        if (operation.containerId) {
            const container = this.modelState.index.findEnumeration(operation.containerId);
            if (isEnumeration(container)) {
                return this.modelState.index.findPath(operation.containerId)! + '/values/-';
            }
        }
        return undefined;
    }
}
