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
import { Parameter } from '../../../../../language-server/generated/ast.js';
import { findAvailableNodeName } from '../../../../../language-server/yo-generated/util/name-util.js';
import { ModelTypes } from '../../util/model-types.js';
import { CreateFeatureOperationHandler } from './create-feature-operation-handler.js';

@injectable()
export class CreateParameterOperationHandler extends CreateFeatureOperationHandler {
    override readonly operationType = CreateNodeOperation.KIND;

    override elementTypeIds = [ModelTypes.PARAMETER];

    override label = 'Parameter';

    override createFeature(operation: CreateNodeOperation): void {
        return this.createParameter(operation);
    }

    createParameter(operation: CreateNodeOperation): void {
        const container = this.getContainer(operation) ?? undefined;
        const name = findAvailableNodeName(this.modelState.semanticRoot, 'newParameter');
        if (container) {
            const newParameter: Parameter = {
                $type: 'Parameter',
                $container: null,
                __id: createRandomUUID(),
                name,
                visibility: 'PUBLIC',
                isException: false,
                isOrdered: false,
                isStream: false,
                isUnique: false
            };
            this.modelState.insertToSemanticText(container.$cstNode.text, newParameter, ['parameters']);
        }
    }
}