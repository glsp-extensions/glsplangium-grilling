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
