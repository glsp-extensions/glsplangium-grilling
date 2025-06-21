// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@biguml/biguml-protocol';
import { Test } from '../../../../language-server/generated/ast.js';
import { PropertyPalette } from '../../../util/property-palette-util.js';

export namespace TestPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: Test): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                PropertyPalette.builder()
                    .elementId(semanticElement.__id)
                    .label(semanticElement.$type)
                    .text(semanticElement.__id, 'name', semanticElement.name, 'Name')
                    .build()
            )
        ];
    }
}
