import { SetPropertyPaletteAction } from '@biguml/biguml-protocol';
import { LiteralSpecification } from '../../../../../../language-server/generated/ast';
import { PropertyPalette } from './util';

export namespace LiteralSpecificationPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: LiteralSpecification): SetPropertyPaletteAction[] {
        const propertyPalette = PropertyPalette.builder().elementId(semanticElement.__id).label(semanticElement.$type);
        propertyPalette.text(semanticElement.__id, 'name', semanticElement.name, 'Name');
        propertyPalette.text(semanticElement.__id, 'value', semanticElement.value, 'Value');

        return [SetPropertyPaletteAction.create(propertyPalette.build())];
    }
}
