/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
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
import { GCompartment, GLabel, GModelElement, Marker, MarkerKind, ModelValidator } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { GClassNode } from '../../model/elements/class.graph-extension.js';

@injectable()
export class ClassDiagramModelValidator implements ModelValidator {
    @inject(ClassDiagramModelState)
    protected readonly modelState: ClassDiagramModelState;

    validate(elements: GModelElement[]): Marker[] {
        const markers: Marker[] = [];
        for (const element of elements) {
            if (element instanceof GClassNode) {
                markers.push(...this.validateClass(element));
            }
        }
        return markers;
    }

    protected validateClass(classNode: GClassNode): Marker[] {
        const markers: Marker[] = [];
        const upperCase = this.validateTaskNode_labelStartsUpperCase(classNode);
        if (upperCase) {
            markers.push(upperCase);
        }
        return markers;
    }

    protected validateTaskNode_labelStartsUpperCase(taskNode: GClassNode): Marker | undefined {
        const gCompartment = taskNode.children.find(child => child instanceof GCompartment);
        if (gCompartment) {
            const gLabels = gCompartment.children.filter(child => child instanceof GLabel).map(element => element as GLabel);
            if (gLabels.length > 0 && gLabels[0].text.charAt(0) === gLabels[0].text.charAt(0).toLowerCase()) {
                return {
                    kind: MarkerKind.WARNING,
                    description: 'Class names should start with upper case letters',
                    elementId: taskNode.id,
                    label: 'Class node label in upper case'
                };
            }
        }
        return undefined;
    }
}
