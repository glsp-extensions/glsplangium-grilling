/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { Command, DeleteElementOperation, OperationHandler } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import {
    ClassDiagram,
    ElementWithSizeAndPosition,
    Relation,
    isElementWithSizeAndPosition,
    isRelation
} from '../../../../language-server/generated/ast.js';
import { IdAstNode, isIdAstNode } from '../../../../language-server/yo-generated/uml-naming.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { ClassDiagramCommand } from './class-diagram-command.js';

@injectable()
export class ClassDiagramDeleteOperationHandler extends OperationHandler {
    operationType = DeleteElementOperation.KIND;

    @inject(ClassDiagramModelState) protected state: ClassDiagramModelState;

    createCommand(operation: DeleteElementOperation): Command | undefined {
        if (!operation.elementIds || operation.elementIds.length === 0) {
            return;
        }
        return new ClassDiagramCommand(this.state, () => this.deleteElements(operation));
    }

    protected deleteElements(operation: DeleteElementOperation): void {
        for (const elementId of operation.elementIds) {
            const element = this.state.index.findSemanticElement(elementId, isDiagramElement);
            if (element.$cstNode.text) {
                this.state.deleteFromSemanticText(element.$cstNode.text);
            }
            if (isElementWithSizeAndPosition(element)) {
                this.deleteIncomingAndOutgoingEdges(elementId);
                this.deleteSizeAndPosition(elementId);
            }
        }
    }

    private deleteIncomingAndOutgoingEdges(nodeId: string): void {
        (this.state.semanticRoot.diagram as ClassDiagram).relations
            .filter(edge => edge.source?.ref?.__id === nodeId || edge.target?.ref?.__id === nodeId)
            .forEach(edge => {
                if (edge.$cstNode) {
                    this.state.deleteFromSemanticText(edge.$cstNode.text);
                }
            });
    }

    private deleteSizeAndPosition(nodeId: string): void {
        const size = this.state.index.findSize(nodeId);
        if (size && size.$cstNode.text) {
            this.state.deleteFromSemanticText(size.$cstNode.text);
        }
        const position = this.state.index.findPosition(nodeId);
        if (position && position.$cstNode.text) {
            this.state.deleteFromSemanticText(position.$cstNode.text);
        }
    }
}

function isDiagramElement(item: any): item is Relation | ElementWithSizeAndPosition | IdAstNode {
    return isRelation(item) || isElementWithSizeAndPosition(item) || isIdAstNode(item);
}
