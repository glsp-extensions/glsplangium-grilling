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
