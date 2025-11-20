import { beforeEach, describe, expect, test, vi, type Mock } from 'vitest';

vi.mock('@eclipse-glsp/server', () => {
    class Command {
        constructor(..._args: any[]) {}
    }

    class OperationHandler {
        label = '';
    }

    return {
        Command,
        OperationHandler
    };
});

vi.mock('inversify', () => ({
    injectable: () => (target: any) => target
}));

vi.mock('../../../biguml/index.js', () => ({
    BigUmlCommand: vi.fn()
}));

import { BigUmlCommand } from '../../../biguml/index.js';
import { AbstractUpdateOperationHandler, smartCast } from '../../../common/handler/abstract-update-operation-handler.js';
import { UpdateOperation } from '../../operation/update-operation.js';

const BigUmlCommandMock = BigUmlCommand as unknown as Mock;

function createTestModelState() {
    return {
        index: {
            findPath: vi.fn(),
            findIdElement: vi.fn()
        }
    } as any;
}

class TestUpdateOperationHandler extends AbstractUpdateOperationHandler {
    constructor(public override modelState: any) {
        super();
    }
}

describe('AbstractUpdateOperationHandler', () => {
    let modelState: ReturnType<typeof createTestModelState>;
    let handler: TestUpdateOperationHandler;

    beforeEach(() => {
        modelState = createTestModelState();
        handler = new TestUpdateOperationHandler(modelState);
        BigUmlCommandMock.mockReset();
        vi.clearAllMocks();
    });

    test('operationType is UpdateOperation.KIND.', () => {
        expect(handler.operationType).toBe(UpdateOperation.KIND);
    });

    test('createUpdatePatch returns undefined when element path is not found', () => {
        modelState.index.findPath.mockReturnValue(undefined);

        const op: any = {
            kind: 'update',
            elementId: 'elem-1',
            property: 'name',
            value: 'NewName'
        };

        const patch = (handler as any).createUpdatePatch(op);
        expect(patch).toBeUndefined();
        expect(modelState.index.findIdElement).not.toHaveBeenCalled();
    });

    test('createUpdatePatch builds replace patch for existing element by default', () => {
        modelState.index.findPath.mockReturnValue('/model/elements/0');
        modelState.index.findIdElement.mockReturnValue({ __id: 'elem-1', name: 'OldName' });

        const op: any = {
            kind: 'update',
            elementId: 'elem-1',
            property: 'name',
            value: 'NewName'
        };

        const patch = (handler as any).createUpdatePatch(op);
        expect(patch).toEqual({
            op: 'replace',
            path: '/model/elements/0/name',
            value: 'NewName'
        });
    });

    test('createCommand returns undefined when no patch is produced', () => {
        modelState.index.findPath.mockReturnValue(undefined);

        const op: any = {
            kind: 'update',
            elementId: 'elem-1',
            property: 'name',
            value: 'NewName'
        };

        const cmd = handler.createCommand(op);
        expect(cmd).toBeUndefined();
        expect(BigUmlCommandMock).not.toHaveBeenCalled();
    });

    test('createCommand wraps patch in BigUmlCommand when patch exists', () => {
        modelState.index.findPath.mockReturnValue('/model/elements/0');
        modelState.index.findIdElement.mockReturnValue({ __id: 'elem-1', name: 'OldName' });

        BigUmlCommandMock.mockImplementation(function (this: any, state: any, json: string) {
            return { state, json };
        });

        const op: any = {
            kind: 'update',
            elementId: 'elem-1',
            property: 'name',
            value: 'NewName'
        };

        const cmd = handler.createCommand(op);
        const patch = (handler as any).createUpdatePatch(op);

        expect(BigUmlCommandMock).toHaveBeenCalledTimes(1);
        expect(BigUmlCommandMock).toHaveBeenCalledWith(modelState, JSON.stringify([patch]));
        expect(cmd).toEqual({
            state: modelState,
            json: JSON.stringify([patch])
        });
    });
});

describe('smartCast', () => {
    test('leaves non-string values unchanged', () => {
        expect(smartCast(true)).toBe(true);
        expect(smartCast(42)).toBe(42);
        const obj = { a: 1 };
        expect(smartCast(obj)).toBe(obj);
    });

    test('casts "true" / "false" (case-insensitive) to booleans', () => {
        expect(smartCast('true')).toBe(true);
        expect(smartCast('TrUe')).toBe(true);
        expect(smartCast('false')).toBe(false);
        expect(smartCast(' FaLsE ')).toBe(false);
    });

    test('casts numeric strings to numbers', () => {
        expect(smartCast('0')).toBe(0);
        expect(smartCast('42')).toBe(42);
        expect(smartCast(' 3.14 ')).toBe(3.14);
    });

    test('does not cast empty or non-numeric strings', () => {
        expect(smartCast('')).toBe('');
        expect(smartCast('   ')).toBe('   ');
        expect(smartCast('abc')).toBe('abc');
        expect(smartCast('123abc')).toBe('123abc');
    });
});
