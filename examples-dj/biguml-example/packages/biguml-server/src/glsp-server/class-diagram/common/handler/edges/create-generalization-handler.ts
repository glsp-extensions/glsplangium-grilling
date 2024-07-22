import { Command, CreateEdgeOperation } from '@eclipse-glsp/server';
import { createRandomUUID } from 'model-service';
import { injectable } from 'inversify';
import { BigUmlCommand } from '../../../../biguml';
import { ModelTypes } from '../../util/model-types';
import { CreateClassDiagramEdgeOperationHandler } from './create-edge-operation-handler';

@injectable()
export class CreateGeneralizationOperationHandler extends CreateClassDiagramEdgeOperationHandler {
    override elementTypeIds = [ModelTypes.GENERALIZATION];

    override label = 'Generalization';

    override createCommand(operation: CreateEdgeOperation): Command {
        return new BigUmlCommand(this.modelState, this.createEdge(operation, this.getRelationTypeFromElementId(operation.elementTypeId)));
    }

    override createEdge(operation: CreateEdgeOperation, relationType: string): string | undefined {
        const sourceNode = this.modelState.index.findIdElement(operation.sourceElementId);
        const targetNode = this.modelState.index.findIdElement(operation.targetElementId);
        if (!(sourceNode && targetNode)) {
            return;
        }
        const patch = JSON.stringify({
            op: 'add',
            path: '/diagram/relations/-',
            value: {
                $type: 'Generalization',
                __id: createRandomUUID(),
                source: {
                    ref: {
                        __id: sourceNode.__id,
                        __documentUri: sourceNode.$document?.uri
                    },
                    $refText: this.modelState.nameProvider.getLocalName(sourceNode) || sourceNode.__id
                },
                target: {
                    ref: {
                        __id: targetNode.__id,
                        __documentUri: sourceNode.$document?.uri
                    },
                    $refText: this.modelState.nameProvider.getLocalName(targetNode) || targetNode.__id
                },
                relationType,
                isSubstitutable: false
            }
        });
        return patch;
    }
}
