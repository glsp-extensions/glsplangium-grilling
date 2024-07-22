/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { Operation } from '@eclipse-glsp/protocol';
import { Command, OperationHandler } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { BigUmlCommand } from '../../../biguml/common/handler/big-uml-command.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';

@injectable()
export class UpdateOperationHandler extends OperationHandler {
    override operationType = UpdateOperation.KIND;

    @inject(ClassDiagramModelState) protected override modelState: ClassDiagramModelState;

    createCommand(_operation: UpdateOperation): Command {
        return new BigUmlCommand(this.modelState, JSON.stringify([JSON.parse(this.createUpdate(_operation))]));
    }

    createUpdate(operation: UpdateOperation): string {
        const path = this.modelState.index.findPath(operation.elementId);
        let value: any = operation.value;
        if (value && typeof value === 'string' && value.endsWith('_refValue')) {
            let element = this.modelState.index.findIdElement(value.substring(0, value.length - 9));
            value = {
                ref: {
                    __id: element.__id,
                    __documentUri: element.$document?.uri
                }
            };
        }
        let elementToBeUpdated = this.modelState.index.findIdElement(operation.elementId);
        const op = elementToBeUpdated && elementToBeUpdated[operation.property] ? 'replace' : 'add';

        return JSON.stringify({
            op,
            path: path + '/' + operation.property,
            value: value
        });
    }
}

export interface UpdateOperation extends Operation {
    kind: typeof UpdateOperation.KIND;
    elementId: string;
    property: string;
    value: string | number | boolean;
}

export namespace UpdateOperation {
    export const KIND = 'UpdateOperation';

    export function is(object: any): object is UpdateOperation {
        return Operation.hasKind(object, KIND);
    }

    export function create(elementId: string, property: string, value: string | number | boolean): UpdateOperation {
        return {
            kind: KIND,
            isOperation: true,
            elementId,
            property,
            value
        };
    }
}
