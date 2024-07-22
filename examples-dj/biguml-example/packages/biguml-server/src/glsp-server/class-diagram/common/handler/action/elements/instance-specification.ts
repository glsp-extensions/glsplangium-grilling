import { SetPropertyPaletteAction } from '@biguml/biguml-protocol';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';
import { InstanceSpecification } from '../../../../../../language-server/generated/ast';
import { ModelTypes } from '../../../util/model-types';
import { PropertyPalette } from './util';

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
