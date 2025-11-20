import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@eclipse-glsp/server', () => {
    class Command {
        constructor(..._args: any[]) {}
    }

    class OperationHandler {
        label = '';
    }

    const CreateNodeOperation = {
        KIND: 'createNode'
    } as any;

    const TriggerNodeCreationAction = {
        create: (elementTypeId: string) => ({
            kind: 'triggerNodeCreation',
            elementTypeId
        })
    };

    const DefaultTypes = {
        NODE: 'node',
        EDGE: 'edge'
    } as any;

    const representationTypeId = (representation: string, _defaultType: unknown, name: string) => `${representation}:${name}`;

    return {
        Command,
        OperationHandler,
        CreateNodeOperation,
        TriggerNodeCreationAction,
        DefaultTypes,
        representationTypeId
    };
});

import { CreateNodeOperation } from '@eclipse-glsp/server';
import { AbstractCreateNodeOperationHandler } from '../abstract-create-node-opertation-handler.js';

vi.mock('model-service', () => ({
    createRandomUUID: () => 'TEST-UUID'
}));

vi.mock('./grid-snapper.js', () => ({
    GridSnapper: {
        snap: (location: any) => location ?? { x: 0, y: 0 }
    }
}));

class TestCreateNodeOperationHandler extends AbstractCreateNodeOperationHandler {
    readonly elementTypeIds = ['class__Property'];

    constructor(public override modelState: any) {
        super();
    }
}

function createTestModelState() {
    return {
        semanticRoot: { $type: 'uml.Model', __id: 'root' },
        semanticUri: 'file:///model/class.di',
        index: {
            find: vi.fn(),
            findPath: vi.fn()
        }
    };
}

describe('AbstractCreateNodeOperationHandler', () => {
    let modelState: ReturnType<typeof createTestModelState>;
    let handler: TestCreateNodeOperationHandler;

    beforeEach(() => {
        modelState = createTestModelState();
        handler = new TestCreateNodeOperationHandler(modelState);
        vi.clearAllMocks();
    });

    test('stripPrefix removes element type prefix', () => {
        expect(handler.stripPrefix('class__Property')).toBe('Property');
        expect(handler.stripPrefix('Property')).toBe('Property');
        expect(handler.stripPrefix('myPrefix__MyType__Extra')).toBe('MyType__Extra');
    });

    test('getTriggerActions returns one trigger action per elementTypeId', () => {
        const actions = handler.getTriggerActions();
        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual({
            kind: 'triggerNodeCreation',
            elementTypeId: 'class__Property'
        });
    });

    test('resolveContainerPath returns /diagram/entities/- for graph container', () => {
        modelState.index.find.mockReturnValue({ type: 'graph' });
        modelState.index.findPath.mockReturnValue('/ignored');

        const op: CreateNodeOperation = {
            kind: 'createNode',
            elementTypeId: 'class__Property',
            containerId: 'graph_1',
            location: { x: 10, y: 20 }
        } as any;

        const path = handler.resolveContainerPath(op);
        expect(path).toBe('/diagram/entities/-');
    });

    test('resolveContainerPath returns empty string for non-graph container without creation path', () => {
        modelState.index.find.mockReturnValue({ type: 'uml.Class' });
        modelState.index.findPath.mockReturnValue('/model/0');

        const op: CreateNodeOperation = {
            kind: 'createNode',
            elementTypeId: 'class__Property',
            containerId: 'class_1',
            location: { x: 10, y: 20 }
        } as any;

        const path = handler.resolveContainerPath(op);
        expect(path).toBe('');
    });

    test('resolveContainerPath returns empty string if containerId is missing', () => {
        const op: CreateNodeOperation = {
            kind: 'createNode',
            elementTypeId: 'class__Property',
            location: { x: 10, y: 20 }
        } as any;

        const path = handler.resolveContainerPath(op);
        expect(path).toBe('');
    });

    test('createNode builds add-patch with id, name and type', () => {
        const spy = vi.spyOn(handler, 'resolveContainerPath').mockReturnValue('/diagram/entities/-');

        const op: CreateNodeOperation = {
            kind: 'createNode',
            elementTypeId: 'class__Property',
            location: { x: 10, y: 20 }
        } as any;

        const json = handler.createNode(op);
        const patch = JSON.parse(json);

        expect(patch.op).toBe('add');
        expect(patch.path).toBe('/diagram/entities/-');

        expect(patch.value.__id).toBe('TEST-UUID');
        expect(typeof patch.value.$type).toBe('string');
        expect(patch.value.$type.length).toBeGreaterThan(0);

        expect(typeof patch.value.name).toBe('string');
        expect(patch.value.name.length).toBeGreaterThan(0);

        spy.mockRestore();
    });

    test('createNodeDetails returns empty array string when isNoBounds is true', () => {
        const op: CreateNodeOperation = {
            kind: 'createNode',
            elementTypeId: 'class__Property',
            location: { x: 50, y: 100 }
        } as any;

        const json = handler.createNodeDetails(op, 'TEST-UUID', '/model/class.di');

        expect(json).toBe('[]');
    });
});
