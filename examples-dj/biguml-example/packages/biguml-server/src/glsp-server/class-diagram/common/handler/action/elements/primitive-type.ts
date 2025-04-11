/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { SetPropertyPaletteAction } from '@biguml/biguml-protocol';
import { PrimitiveType } from '../../../../../../language-server/generated/ast.js';
import { PropertyPalette } from './util.js';

export namespace PrimitiveTypePropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: PrimitiveType): SetPropertyPaletteAction[] {
        const propertyPalette = PropertyPalette.builder().elementId(semanticElement.__id).label(semanticElement.$type);
        propertyPalette.text(semanticElement.__id, 'name', semanticElement.name, 'Name');

        return [SetPropertyPaletteAction.create(propertyPalette.build())];
    }
}
