/*********************************************************************************
* Copyright (c) 2023 borkdominik and others.
*
* This program and the accompanying materials are made available under the
* terms of the MIT License which is available at https://opensource.org/licenses/MIT.
*
* SPDX-License-Identifier: MIT
*********************************************************************************/
import { CreateNodeOperation } from '@eclipse-glsp/server';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';

export function defaultGetContainerPath(
    operation: CreateNodeOperation,
    modelState: ClassDiagramModelState,
    propertyName: string,
    defaultContainerPath: string
): string | undefined {
    if (operation.containerId) {
        const containerPath = modelState.index.findPath(operation.containerId);
        if (containerPath) {
            return `${containerPath}/${propertyName}/-`;
        }
    }
    return defaultContainerPath;
}
