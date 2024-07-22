import { UpdateElementPropertyAction } from '@biguml/biguml-protocol';
import { ActionHandler, MaybePromise, Operation } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { PackageDiagramModelState } from '../../../model/package-diagram-model-state';
import { UpdateOperation } from '../update-operation-handler';

@injectable()
export class UpdateElementPropertyActionHandler implements ActionHandler {
    actionKinds = [UpdateElementPropertyAction.KIND];

    @inject(PackageDiagramModelState)
    protected modelState: PackageDiagramModelState;

    execute(action: UpdateElementPropertyAction): MaybePromise<Operation[]> {
        if (!action.elementId) {
            console.log('Could not find element id, no property updating executed.');
            return;
        }

        var semanticElement = this.modelState.index.findIdElement(action.elementId);
        if (!semanticElement) {
            return;
        }

        return [UpdateOperation.create(action.elementId, action.propertyId, action.value)];
    }
}
