/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { SetPropertyPaletteAction } from '@biguml/biguml-protocol';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';
import { InstanceSpecification } from '../../../../../../language-server/generated/ast.js';
import { ModelTypes } from '../../../util/model-types.js';
import { PropertyPalette } from './util.js';

export namespace InstanceSpecificationPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: InstanceSpecification): SetPropertyPaletteAction[] {
        const propertyPalette = PropertyPalette.builder().elementId(semanticElement.__id).label(semanticElement.$type);
        propertyPalette.text(semanticElement.__id, 'name', semanticElement.name, 'Name');
        propertyPalette.choice(
            semanticElement.__id,
            'visibility',
            PropertyPalette.DEFAULT_VISIBILITY_CHOICES,
            semanticElement.visibility,
            'Visibility'
        );
        propertyPalette.reference(
            semanticElement.__id,
            'slots',
            'Slots',
            semanticElement.slots.map(slot => ({
                elementId: slot.__id,
                label: slot.name,
                name: slot.name,
                deleteActions: [DeleteElementOperation.create([slot.__id])]
            })),
            [
                {
                    label: 'Create Parameter',
                    action: CreateNodeOperation.create(ModelTypes.SLOT, { containerId: semanticElement.__id })
                }
            ]
        );

        return [SetPropertyPaletteAction.create(propertyPalette.build())];
    }
}
