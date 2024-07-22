/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { Operation } from '@eclipse-glsp/protocol';
import { Command, OperationHandler } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { ClassDiagramCommand } from './class-diagram-command.js';

@injectable()
export class UpdateOperationHandler extends OperationHandler {
    override operationType = UpdateOperation.KIND;

    @inject(ClassDiagramModelState) protected override modelState: ClassDiagramModelState;

    createCommand(_operation: UpdateOperation): Command {
        return new ClassDiagramCommand(this.modelState, () => this.createUpdate(_operation));
    }

    createUpdate(operation: UpdateOperation): void {
        const node = this.modelState.index.findIdElement(operation.elementId);
        if (!node || !node.$cstNode.text) return undefined;

        let value: any = operation.value;
        if (value && typeof value === 'string' && value.endsWith('_refValue')) {
            let element = this.modelState.index.findIdElement(value.substring(0, value.length - 9));
            value = {
                __id: element.__id
            };
        }
        // replace 'NAME' attribute with 'name'
        // as it is arriving wrongly from the client
        if (operation.property === 'NAME') {
            operation.property = 'name';
        }
        if (node[operation.property] || typeof node[operation.property] === 'boolean') {
            // update
            if (typeof value === 'object') {
                this.modelState.updateInSemanticText(
                    node.$cstNode.text,
                    [operation.property, '__value'],
                    node[operation.property]['$refText'],
                    value['__id'].toString()
                );
            } else {
                this.modelState.updateInSemanticText(node.$cstNode.text, [operation.property], node[operation.property], value.toString());
            }
        } else {
            // insert
            // this.modelState.insertAttributeToSemanticText(node.$cstNode.text, operation.property, value);
        }
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
