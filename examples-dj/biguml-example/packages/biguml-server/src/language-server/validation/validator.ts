// validation/validator.ts
import { validateSync } from 'class-validator';
import type { AstNode } from 'langium';
import { isClass, isEnumeration, isInterface } from '../generated/ast.js';
import { ClassValidationElement, EnumerationValidationElement, InterfaceValidationElement } from './validation-elements.js';

export function validateNode(node: AstNode): void {
    let errors = [];

    if (isClass(node)) {
        const dto = new ClassValidationElement(node);
        errors = validateSync(dto);
    }

    if (isEnumeration(node)) {
        const dto = new EnumerationValidationElement({
            name: node.name
        });
        errors = validateSync(dto);
    }

    if (isInterface(node)) {
        const dto = new InterfaceValidationElement(node);
        errors = validateSync(dto);
    }

    if (errors.length) {
        const messages = errors.flatMap(e => Object.values(e.constraints ?? {})).join(', ');
        console.error('[validateNode] ' + messages);
        throw new Error(`Validation error: ${messages}`);
    }
}
