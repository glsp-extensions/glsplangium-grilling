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
import { Slot } from '../../../../../../language-server/generated/ast.js';
import { ModelTypes } from '../../../util/model-types.js';
import { PropertyPalette } from './util.js';

export namespace SlotPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: Slot, featureOptions): SetPropertyPaletteAction[] {
        const propertyPalette = PropertyPalette.builder().elementId(semanticElement.__id).label(semanticElement.$type);
        console.log('HERE!!!');
        propertyPalette.choice(
            semanticElement.__id,
            'definingFeature',
            featureOptions,
            semanticElement.definingFeature?.ref?.__id + '_refValue',
            'Defining Feature'
        );
        propertyPalette.reference(
            semanticElement.__id,
            'values',
            'values',
            semanticElement.values.map(value => ({
                elementId: value.__id,
                label: value.name,
                name: value.name,
                deleteActions: [DeleteElementOperation.create([value.__id])]
            })),
            [
                {
                    label: 'Create Literal Specification',
                    action: CreateNodeOperation.create(ModelTypes.LITERAL_SPECIFICATION, { containerId: semanticElement.__id })
                }
            ]
        );

        return [SetPropertyPaletteAction.create(propertyPalette.build())];
    }
}
