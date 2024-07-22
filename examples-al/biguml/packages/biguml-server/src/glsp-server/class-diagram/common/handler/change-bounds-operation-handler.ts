/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { ChangeBoundsOperation, Command, OperationHandler } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { Position, Size } from '../../../../language-server/generated/ast.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { ClassDiagramCommand } from './class-diagram-command.js';

@injectable()
export class ClassDiagramChangeBoundsOperationHandler extends OperationHandler {
    operationType = ChangeBoundsOperation.KIND;

    @inject(ClassDiagramModelState)
    protected state: ClassDiagramModelState;

    createCommand(operation: ChangeBoundsOperation): Command {
        return new ClassDiagramCommand(this.state, () => this.changeBounds(operation));
    }

    protected changeBounds(operation: ChangeBoundsOperation): void {
        operation.newBounds.forEach(elementAndBounds => {
            const size = this.state.index.findSize(elementAndBounds.elementId);
            if (size) {
                // only update size if it has changed
                if (
                    (elementAndBounds.newSize?.width && elementAndBounds.newSize.width !== size.width) ||
                    (elementAndBounds.newSize?.height && elementAndBounds.newSize.height !== size.height)
                ) {
                    if (size.$cstNode) {
                        // update semantic text
                        const updatedElement = this.state.updateInSemanticText(
                            size.$cstNode?.text,
                            ['width'],
                            size.width.toString(),
                            (elementAndBounds.newSize?.width ?? size.width).toFixed(0)
                        );
                        this.state.updateInSemanticText(
                            updatedElement,
                            ['height'],
                            size.height.toString(),
                            (elementAndBounds.newSize?.height ?? size.height).toFixed(0)
                        );
                    }
                }
            } else {
                const entity = this.state.index.findEntity(elementAndBounds.elementId);
                if (entity) {
                    const size: Size = {
                        $container: null,
                        $type: 'Size',
                        __id: 'size_' + elementAndBounds.elementId,
                        element: { ref: entity, $refText: elementAndBounds.elementId },
                        width: Math.round(elementAndBounds.newSize?.width),
                        height: Math.round(elementAndBounds.newSize?.height)
                    };
                    this.state.insertToSemanticText(this.state.semanticText, size, ['metaInfos']);
                }
            }
            const position = this.state.index.findPosition(elementAndBounds.elementId);
            if (position) {
                // only update positions if it has changed
                if (
                    (elementAndBounds.newPosition?.x && elementAndBounds.newPosition.x !== position.x) ||
                    (elementAndBounds.newPosition?.y && elementAndBounds.newPosition.y !== position.y)
                ) {
                    // update semantic text
                    if (position.$cstNode) {
                        const updatedElement = this.state.updateInSemanticText(
                            position.$cstNode?.text,
                            ['x'],
                            position.x.toString(),
                            (elementAndBounds.newPosition?.x ?? position.x).toFixed(0)
                        );
                        this.state.updateInSemanticText(
                            updatedElement,
                            ['y'],
                            position.y.toString(),
                            (elementAndBounds.newPosition?.y ?? position.y).toFixed(0)
                        );
                    }
                }
            } else {
                const entity = this.state.index.findEntity(elementAndBounds.elementId);
                if (entity) {
                    const position: Position = {
                        $container: null,
                        $type: 'Position',
                        __id: 'pos_' + elementAndBounds.elementId,
                        element: { ref: entity, $refText: elementAndBounds.elementId },
                        x: Math.round(elementAndBounds.newPosition?.x),
                        y: Math.round(elementAndBounds.newPosition?.y)
                    };
                    this.state.insertToSemanticText(this.state.semanticText, position, ['metaInfos']);
                }
            }
        });
    }
}
