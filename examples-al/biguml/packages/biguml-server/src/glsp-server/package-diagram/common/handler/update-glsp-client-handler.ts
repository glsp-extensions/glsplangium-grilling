/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { Operation } from '@eclipse-glsp/protocol';
import { Command, OperationHandler } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';
import { PackageDiagramCommand } from './package-diagram-command.js';

@injectable()
export class PackageDiagramUpdateClientOperationHandler extends OperationHandler {
    override operationType = UpdateClientOperation.KIND;

    @inject(PackageDiagramModelState) protected state: PackageDiagramModelState;

    createCommand(_operation: UpdateClientOperation): Command {
        return new PackageDiagramCommand(this.state, () => {});
    }
}

export interface UpdateClientOperation extends Operation {
    kind: typeof UpdateClientOperation.KIND;
}

export namespace UpdateClientOperation {
    export const KIND = 'packageDiagramUpdateClientOperation';

    export function is(object: any): object is UpdateClientOperation {
        return Operation.hasKind(object, KIND);
    }

    export function create(): UpdateClientOperation {
        return {
            kind: KIND,
            isOperation: true
        };
    }
}
