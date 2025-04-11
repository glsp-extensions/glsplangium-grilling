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

export interface ElementTypeConfig {
    label: string;
    elementTypeId: string;
    modelType?: string;
    containerPath?: string;
    getContainerPath?: (
        operation: CreateNodeOperation,
        modelState: ClassDiagramModelState,
        defaultContainerPath: string
    ) => string | undefined;
    additionalProperties?: { [key: string]: any };
    size?: {
        width?: number;
        height?: number;
    };
    position?: {
        x?: number;
        y?: number;
    };
}
