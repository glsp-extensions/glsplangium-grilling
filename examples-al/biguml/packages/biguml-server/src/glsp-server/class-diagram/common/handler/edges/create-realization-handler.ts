import { CreateEdgeOperation } from '@eclipse-glsp/server';
import { createRandomUUID } from 'model-service';
import { injectable } from 'inversify';
import { Realization, RelationType } from '../../../../../language-server/generated/ast.js';
import { IdAstNode } from '../../../../../language-server/yo-generated/uml-naming.js';
import { ModelTypes } from '../../util/model-types.js';
import { CreateClassDiagramEdgeOperationHandler } from './create-edge-operation-handler.js';

@injectable()
export class CreateRealizationOperationHandler extends CreateClassDiagramEdgeOperationHandler {
    override elementTypeIds = [ModelTypes.REALIZATION];

    override label = 'Realization';

    override generateNewEdge(
        operation: CreateEdgeOperation,
        sourceNode: IdAstNode,
        targetNode: IdAstNode,
        relationType: RelationType
    ): Realization {
        return {
            $type: 'Realization',
            __id: createRandomUUID(),
            source: {
                ref: {
                    $container: null,
                    $type: null,
                    name: null,
                    __id: sourceNode.__id
                },
                $refText: this.modelState.nameProvider.getLocalName(sourceNode) || sourceNode.__id
            },
            target: {
                ref: {
                    $container: null,
                    $type: null,
                    name: null,
                    __id: targetNode.__id
                },
                $refText: this.modelState.nameProvider.getLocalName(targetNode) || targetNode.__id
            },
            relationType: relationType,
            visibility: 'PUBLIC'
        };
    }
}
