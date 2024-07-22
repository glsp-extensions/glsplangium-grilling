/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { Operation } from '@eclipse-glsp/protocol';
import { Command, OperationHandler } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';
import { PackageDiagramCommand } from './package-diagram-command.js';

@injectable()
export class UpdateOperationHandler extends OperationHandler {
    override operationType = UpdateOperation.KIND;

    @inject(PackageDiagramModelState) protected state: PackageDiagramModelState;

    createCommand(_operation: UpdateOperation): Command {
        return new PackageDiagramCommand(this.state, () => this.createUpdate(_operation));
    }

    @inject(PackageDiagramModelState)
    protected override modelState: PackageDiagramModelState;

    createUpdate(operation: UpdateOperation): void {
        const node = this.state.index.findEntity(operation.elementId);
        if (!node) return undefined;

        if (node.$cstNode.text && (node[operation.property] || typeof node[operation.property] === 'boolean')) {
            this.state.updateInSemanticText(node.$cstNode.text, operation.property, node[operation.property], operation.value.toString());
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
