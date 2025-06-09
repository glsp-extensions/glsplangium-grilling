import { ArrayMinSize, Equals, MinLength, ValidateIf } from 'class-validator';
import { Class } from '../generated/ast.js';
import { LengthBetween } from './custom-validators/length-between-validator.js';

export class ClassValidationElement {
    constructor(src: Class) {
        Object.assign(this, src);
    }

    @MinLength(5)
    name!: string;

    @ValidateIf(o => o.isActive === true)
    @ArrayMinSize(3)
    properties?: unknown[];

    isActive?: boolean;

    @Equals(false, { message: 'temp must be false in this profile.' })
    temp?: boolean;
}

export class EnumerationValidationElement {
    constructor(src: { name: string }) {
        Object.assign(this, src);
    }

    @LengthBetween(3, 10, { message: 'Enumeration.name must be 3–10 characters' })
    name!: string;
}

export class InterfaceValidationElement {
    constructor(src: { name: string }) {
        Object.assign(this, src);
    }

    @LengthBetween(3, 10, { message: 'Interface.name must be 3–10 characters' })
    name!: string;
}
