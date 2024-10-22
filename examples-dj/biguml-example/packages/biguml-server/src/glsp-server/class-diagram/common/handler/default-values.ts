import { CreateNodeOperation } from '@eclipse-glsp/server';
import { GridSnapper } from './grid-snapper.js';

export function getDefaultSize(id: string, nodeDocumentUri: string, width: number = 80, height: number = 30) {
    return {
        $type: 'Size',
        __id: `size_${id}`,
        element: { ref: { __id: id, __documentUri: nodeDocumentUri } },
        width,
        height
    };
}

export function getDefaultPosition(id: string, nodeDocumentUri: string, operation: CreateNodeOperation, x: number = 0, y: number = 0) {
    const location = GridSnapper.snap(operation.location);
    return {
        $type: 'Position',
        __id: `pos_${id}`,
        element: { ref: { __id: id, __documentUri: nodeDocumentUri } },
        x: x !== undefined ? x : location?.x ?? 0,
        y: y !== undefined ? y : location?.y ?? 0
    };
}
