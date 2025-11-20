import { describe, expect, test } from 'vitest';

import { EnumerationValidationElement } from '../../yo-generated/validation/validation-elements.js';
import { validateNode } from '../../yo-generated/validation/validator.js';

function catchErrorMsg(fn: () => any): string {
    try {
        fn();
        return 'NO_ERROR';
    } catch (e: any) {
        return e.message ?? String(e);
    }
}

describe('ValidationElements – direct class-validator behaviour', () => {
    test('EnumerationValidationElement enforces LengthBetween(3,10)', () => {
        const tooShort = new EnumerationValidationElement({ name: 'A', $type: 'Enumeration' } as any);
        const tooLong = new EnumerationValidationElement({ name: 'VeryLongEnumerationName', $type: 'Enumeration' } as any);
        const ok = new EnumerationValidationElement({ name: 'Colors', $type: 'Enumeration' } as any);

        const msg1 = catchErrorMsg(() => validateNode(tooShort as any));
        const msg2 = catchErrorMsg(() => validateNode(tooLong as any));
        const msg3 = catchErrorMsg(() => validateNode(ok as any));

        expect(msg1).toContain('Enumeration.name must be 3–10 characters');
        expect(msg2).toContain('Enumeration.name must be 3–10 characters');
        expect(msg3).toBe('NO_ERROR');
    });

    test('ClassValidationElement – uppercase first letter + min length', () => {
        const lowercase = { $type: 'Class', name: 'class', isActive: false };
        const tooShort = { $type: 'Class', name: 'Ax', isActive: false };
        const ok = { $type: 'Class', name: 'ValidName', isActive: false };

        const msg1 = catchErrorMsg(() => validateNode(lowercase as any));
        const msg2 = catchErrorMsg(() => validateNode(tooShort as any));
        const msg3 = catchErrorMsg(() => validateNode(ok as any));

        expect(msg1).toContain('First letter of class name must be uppercase');
        expect(msg2).toContain('Class name must be at least 5 characters long');
        expect(msg3).toBe('NO_ERROR');
    });

    test('ClassValidationElement – active classes limited to max 3 properties', () => {
        const tooManyProps = {
            $type: 'Class',
            name: 'ValidName',
            isActive: true,
            properties: [{}, {}, {}, {}]
        };

        const ok = {
            $type: 'Class',
            name: 'ValidName',
            isActive: true,
            properties: [{}, {}, {}]
        };

        const msg1 = catchErrorMsg(() => validateNode(tooManyProps as any));
        const msg2 = catchErrorMsg(() => validateNode(ok as any));

        expect(msg1).toContain('Active classes must declare at most 3 properties.');
        expect(msg2).toBe('NO_ERROR');
    });

    test('ValidateIf ensures ArrayMaxSize is not applied when isActive=false', () => {
        const inactiveWithTooMany = {
            $type: 'Class',
            name: 'ValidName',
            isActive: false,
            properties: [{}, {}, {}, {}, {}, {}]
        };

        const msg = catchErrorMsg(() => validateNode(inactiveWithTooMany as any));

        expect(msg).toBe('NO_ERROR');
    });

    test('InterfaceValidationElement enforces LengthBetween(3,10)', () => {
        const tooShort = { $type: 'Interface', name: 'A' };
        const ok = { $type: 'Interface', name: 'Abcde' };

        const msg1 = catchErrorMsg(() => validateNode(tooShort as any));
        const msg2 = catchErrorMsg(() => validateNode(ok as any));

        expect(msg1).toContain('Interface.name must be 3–10 characters');
        expect(msg2).toBe('NO_ERROR');
    });

    test('DataTypeValidationElement enforces MinLength(5)', () => {
        const tooShort = { $type: 'DataType', name: 'Int' };
        const ok = { $type: 'DataType', name: 'Float32' };

        const msg1 = catchErrorMsg(() => validateNode(tooShort as any));
        const msg2 = catchErrorMsg(() => validateNode(ok as any));

        expect(msg1).toContain('longer than or equal to 5 characters');
        expect(msg2).toBe('NO_ERROR');
    });
});

describe('validateNode – integration behaviour', () => {
    test('throws combined message when multiple constraints fail', () => {
        const node = {
            $type: 'Class',
            name: 'abc', // lowercase + <5 chars
            isActive: true,
            properties: [{}, {}, {}, {}]
        };

        const msg = catchErrorMsg(() => validateNode(node as any));

        expect(msg).toContain('First letter of class name must be uppercase.');
        expect(msg).toContain('Class name must be at least 5 characters long');
        expect(msg).toContain('Active classes must declare at most 3 properties.');
    });

    test('validateNode does nothing for unknown AST nodes', () => {
        const msg = catchErrorMsg(() => validateNode({ $type: 'UnknownNode', name: 'whatever' } as any));
        expect(msg).toBe('NO_ERROR');
    });
});
