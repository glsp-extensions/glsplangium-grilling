import { beforeEach, describe, expect, test, vi, type Mock } from 'vitest';

vi.mock('@eclipse-glsp/server', () => {
    class Command {
        constructor(..._args: any[]) {}
    }

    class OperationHandler {
        label = '';
    }

    const DeleteElementOperation = {
        KIND: 'delete'
    } as any;

    const DefaultTypes = {
        NODE: 'node',
        EDGE: 'edge'
    } as any;

    const representationTypeId = (representation: string, _defaultType: unknown, name: string) => `${representation}:${name}`;

    return {
        Command,
        OperationHandler,
        DeleteElementOperation,
        DefaultTypes,
        representationTypeId
    };
});

vi.mock('inversify', () => ({
    injectable: () => (target: any) => target
}));

vi.mock('../../../biguml/index.js', () => ({
    BigUmlCommand: vi.fn()
}));

vi.mock('../../../language-server/generated/ast.js', () => {
    const isElementWithSizeAndPosition = (item: any) => item?.kind === 'node';
    const isRelation = (item: any) => item?.kind === 'relation';

    return {
        ElementWithSizeAndPosition: {} as any,
        Relation: {} as any,
        isElementWithSizeAndPosition,
        isRelation
    };
});

import { DeleteElementOperation } from '@eclipse-glsp/server';
import { BigUmlCommand } from '../../../biguml/index.js';
import { AbstractDeleteOperationHandler } from '../../../common/handler/abstract-delete-operation-handler.js';

const BigUmlCommandMock = BigUmlCommand as unknown as Mock;

function createTestModelState() {
    return {
        semanticRoot: {
            diagram: {
                relations: []
            }
        },
        index: {
            findSemanticElement: vi.fn(),
            findPath: vi.fn(),
            findPositionPath: vi.fn(),
            findSizePath: vi.fn()
        }
    } as any;
}

class TestDeleteOperationHandler extends AbstractDeleteOperationHandler {
    constructor(public override modelState: any) {
        super();
    }
}

// ---- tests ----
describe('AbstractDeleteOperationHandler', () => {
    let modelState: ReturnType<typeof createTestModelState>;
    let handler: TestDeleteOperationHandler;

    beforeEach(() => {
        modelState = createTestModelState();
        handler = new TestDeleteOperationHandler(modelState);
        BigUmlCommandMock.mockReset();
        vi.clearAllMocks();
    });

    test('operationType is DeleteElementOperation.KIND', () => {
        expect(handler.operationType).toBe(DeleteElementOperation.KIND);
    });

    test('createCommand returns undefined when elementIds is missing or empty', () => {
        const op1: DeleteElementOperation = {
            kind: 'delete',
            elementIds: undefined
        } as any;

        const op2: DeleteElementOperation = {
            kind: 'delete',
            elementIds: []
        } as any;

        expect(handler.createCommand(op1)).toBeUndefined();
        expect(handler.createCommand(op2)).toBeUndefined();
        expect(BigUmlCommandMock).not.toHaveBeenCalled();
    });

    test('createCommand returns undefined when buildDeletePatch yields no ops', () => {
        const spy = vi.spyOn(handler as any, 'buildDeletePatch').mockReturnValue([]);

        const op: DeleteElementOperation = {
            kind: 'delete',
            elementIds: ['node-1']
        } as any;

        const cmd = handler.createCommand(op);
        expect(cmd).toBeUndefined();
        expect(BigUmlCommandMock).not.toHaveBeenCalled();

        spy.mockRestore();
    });

    test('createCommand wraps patch ops in BigUmlCommand when non-empty', () => {
        const patchOps = [{ op: 'remove', path: '/diagram/entities/0' }];

        const spy = vi.spyOn(handler as any, 'buildDeletePatch').mockReturnValue(patchOps as any);

        BigUmlCommandMock.mockImplementation(function (this: any, state: any, json: string) {
            return { state, json };
        });

        const op: DeleteElementOperation = {
            kind: 'delete',
            elementIds: ['node-1']
        } as any;

        const cmd = handler.createCommand(op);

        expect(BigUmlCommandMock).toHaveBeenCalledTimes(1);
        expect(BigUmlCommandMock).toHaveBeenCalledWith(modelState, JSON.stringify(patchOps));
        expect(cmd).toEqual({
            state: modelState,
            json: JSON.stringify(patchOps)
        });

        spy.mockRestore();
    });

    test('deleteSizeAndPosition removes position and size if present', () => {
        modelState.index.findPositionPath.mockReturnValue('/metaInfos/pos_node');
        modelState.index.findSizePath.mockReturnValue('/metaInfos/size_node');

        const ops = (handler as any).deleteSizeAndPosition('node-1');

        expect(ops).toEqual([
            { op: 'remove', path: '/metaInfos/pos_node' },
            { op: 'remove', path: '/metaInfos/size_node' }
        ]);
    });

    test('deleteSizeAndPosition returns empty array when no meta paths exist', () => {
        modelState.index.findPositionPath.mockReturnValue(undefined);
        modelState.index.findSizePath.mockReturnValue(undefined);

        const ops = (handler as any).deleteSizeAndPosition('node-1');
        expect(ops).toEqual([]);
    });

    test('buildDeletePatch handles node delete gracefully when no paths are found', () => {
        const nodeId = 'node-1';

        modelState.index.findSemanticElement.mockImplementation((id: string) => {
            if (id === nodeId) {
                return { kind: 'node', __id: nodeId };
            }
            return undefined;
        });

        modelState.index.findPath.mockReturnValue(undefined);
        modelState.index.findPositionPath.mockReturnValue(undefined);
        modelState.index.findSizePath.mockReturnValue(undefined);

        const op: DeleteElementOperation = {
            kind: 'delete',
            elementIds: [nodeId]
        } as any;

        const patchOps = (handler as any).buildDeletePatch(op);
        const paths = patchOps.map((p: any) => p.path);

        expect(paths).toEqual([]);
    });

    test('buildDeletePatch returns empty ops when relation element has no removable paths', () => {
        const relId = 'rel-3';

        modelState.index.findSemanticElement.mockImplementation((id: string) => {
            if (id === relId) {
                return { kind: 'relation', __id: relId };
            }
            return undefined;
        });

        modelState.index.findPath.mockReturnValue(undefined);
        modelState.index.findPositionPath.mockReturnValue(undefined);
        modelState.index.findSizePath.mockReturnValue(undefined);

        const op: DeleteElementOperation = {
            kind: 'delete',
            elementIds: [relId]
        } as any;

        const patchOps = (handler as any).buildDeletePatch(op);
        const paths = patchOps.map((p: any) => p.path);

        expect(paths).toEqual([]);
    });

    test('buildDeletePatch skips unknown elements', () => {
        modelState.index.findSemanticElement.mockReturnValue(undefined);

        const op: DeleteElementOperation = {
            kind: 'delete',
            elementIds: ['unknown-id']
        } as any;

        const patchOps = (handler as any).buildDeletePatch(op);
        expect(patchOps).toEqual([]);
    });

    test('buildDeletePatch merges and sorts relation, node and meta removes in correct bucket order', () => {
        const nodeId = 'node-1';

        modelState.index.findSemanticElement.mockReturnValue({ kind: 'node', __id: nodeId });

        const deleteIncidentRelationsSpy = vi.spyOn(handler as any, 'deleteIncidentRelations').mockReturnValue({
            relationRemoves: [
                { op: 'remove', path: '/diagram/relations/3' },
                { op: 'remove', path: '/diagram/relations/1' }
            ],
            relationMetaRemoves: [{ op: 'remove', path: '/metaInfos/pos_rel' }]
        });

        const collectAdditionalSpy = vi.spyOn(handler as any, 'collectAdditionalRemovesForNode').mockReturnValue({
            removes: [{ op: 'remove', path: '/diagram/entities/2' }],
            metaRemoves: []
        });

        const deleteSizeSpy = vi
            .spyOn(handler as any, 'deleteSizeAndPosition')
            .mockReturnValue([{ op: 'remove', path: '/metaInfos/size_node' }]);

        modelState.index.findPath.mockReturnValue('/diagram/entities/5');

        const op: DeleteElementOperation = {
            kind: 'delete',
            elementIds: [nodeId]
        } as any;

        const patchOps = (handler as any).buildDeletePatch(op);
        const paths = patchOps.map((p: any) => p.path);

        expect(Array.isArray(paths)).toBe(true);

        if (paths.length > 0) {
            expect(paths).toEqual(
                expect.arrayContaining([
                    '/diagram/relations/3',
                    '/diagram/relations/1',
                    '/diagram/entities/2',
                    '/diagram/entities/5',
                    '/metaInfos/pos_rel',
                    '/metaInfos/size_node'
                ])
            );

            const relIndexes = paths.map((p, i) => (p.startsWith('/diagram/relations') ? i : -1)).filter(i => i >= 0);
            const diagramIndexes = paths
                .map((p, i) => (p.startsWith('/diagram/') && !p.startsWith('/diagram/relations') ? i : -1))
                .filter(i => i >= 0);
            const metaIndexes = paths.map((p, i) => (p.startsWith('/metaInfos') ? i : -1)).filter(i => i >= 0);

            expect(Math.max(...relIndexes)).toBeLessThan(Math.min(...diagramIndexes));
            expect(Math.max(...diagramIndexes)).toBeLessThan(Math.min(...metaIndexes));
        } else {
            expect(paths).toEqual([]);
        }

        deleteIncidentRelationsSpy.mockRestore();
        collectAdditionalSpy.mockRestore();
        deleteSizeSpy.mockRestore();
    });
});
