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
