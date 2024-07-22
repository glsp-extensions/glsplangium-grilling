import { SetPropertyPaletteAction } from '@biguml/biguml-protocol';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';
import { Slot } from '../../../../../../language-server/generated/ast';
import { ModelTypes } from '../../../util/model-types';
import { PropertyPalette } from './util';

export namespace SlotPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: Slot, featureOptions): SetPropertyPaletteAction[] {
        const propertyPalette = PropertyPalette.builder().elementId(semanticElement.__id).label(semanticElement.$type);
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
