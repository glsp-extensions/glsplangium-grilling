import { SetPropertyPaletteAction } from '@biguml/biguml-protocol';
import { Parameter } from '../../../../../../language-server/generated/ast';
import { PropertyPalette } from './util';

export namespace ParameterPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: Parameter, dataTypeChoices): SetPropertyPaletteAction[] {
        const propertyPalette = PropertyPalette.builder().elementId(semanticElement.__id).label(semanticElement.$type);
        propertyPalette.text(semanticElement.__id, 'name', semanticElement.name, 'Name');
        propertyPalette.bool(semanticElement.__id, 'isException', semanticElement.isException, 'isException');
        propertyPalette.bool(semanticElement.__id, 'isStream', semanticElement.isStream, 'isStream');
        propertyPalette.bool(semanticElement.__id, 'isOrdered', semanticElement.isOrdered, 'isOrdered');
        propertyPalette.bool(semanticElement.__id, 'isUnique', semanticElement.isUnique, 'isUnique');
        propertyPalette.choice(
            semanticElement.__id,
            'direction',
            [
                { label: 'in', value: 'IN' },
                { label: 'out', value: 'OUT' },
                { label: 'inout', value: 'INOUT' },
                { label: 'return', value: 'RETURN' }
            ],
            semanticElement.direction,
            'Direction'
        );
        propertyPalette.choice(
            semanticElement.__id,
            'effect',
            [
                { label: 'create', value: 'CREATE' },
                { label: 'read', value: 'READ' },
                { label: 'update', value: 'UPDATE' },
                { label: 'delete', value: 'DELETE' }
            ],
            semanticElement.effect,
            'Effect'
        );
        propertyPalette.choice(
            semanticElement.__id,
            'visibility',
            PropertyPalette.DEFAULT_VISIBILITY_CHOICES,
            semanticElement.visibility,
            'Visibility'
        );
        propertyPalette.choice(
            semanticElement.__id,
            'parameterType',
            dataTypeChoices,
            semanticElement.parameterType?.ref?.__id + '_refValue',
            'Parameter Type'
        );
        propertyPalette.text(semanticElement.__id, 'multiplicity', semanticElement.multiplicity, 'Multiplicity');
        return [SetPropertyPaletteAction.create(propertyPalette.build())];
    }
}
