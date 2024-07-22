import { CreateEdgeOperation } from '@eclipse-glsp/server';
import { createRandomUUID } from 'model-service';
import { injectable } from 'inversify';
import { RelationType, Usage } from '../../../../../language-server/generated/ast.js';
import { IdAstNode } from '../../../../../language-server/yo-generated/uml-naming.js';
import { ModelTypes } from '../../util/model-types.js';
import { CreateClassDiagramEdgeOperationHandler } from './create-edge-operation-handler.js';

@injectable()
export class CreateUsageOperationHandler extends CreateClassDiagramEdgeOperationHandler {
    override elementTypeIds = [ModelTypes.USAGE];

    override label = 'Usage';

    override generateNewEdge(
        operation: CreateEdgeOperation,
        sourceNode: IdAstNode,
        targetNode: IdAstNode,
        relationType: RelationType
    ): Usage {
        return {
            $type: 'Usage',
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
