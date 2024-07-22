import { ElementChoiceProperty, ElementProperties, ElementTextProperty, SetPropertyPaletteAction } from '@biguml/biguml-protocol';
import { Package } from '../../../../../../language-server/generated/ast';

export namespace PackagePropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: Package): SetPropertyPaletteAction[] {
        let propertyPalette: { elementId: string; palette?: ElementProperties; responseId?: string } = {
            elementId: semanticElement.__id,
            palette: {
                elementId: semanticElement.__id,
                label: semanticElement.$type,
                items: [
                    {
                        elementId: semanticElement.__id,
                        propertyId: 'name',
                        type: 'TEXT',
                        disabled: false,
                        text: semanticElement.name,
                        label: 'Name'
                    } as ElementTextProperty,
                    {
                        elementId: semanticElement.__id,
                        propertyId: 'uri',
                        type: 'TEXT',
                        disabled: false,
                        text: semanticElement.uri,
                        label: 'URI'
                    } as ElementTextProperty,
                    {
                        elementId: semanticElement.__id,
                        propertyId: 'visibility',
                        type: 'CHOICE',
                        choices: [
                            {
                                label: 'public',
                                value: 'PUBLIC'
                            },
                            {
                                label: 'private',
                                value: 'PRIVATE'
                            },
                            {
                                label: 'protected',
                                value: 'PROTECTED'
                            },
                            {
                                label: 'package',
                                value: 'PACKAGE'
                            }
                        ],
                        choice: semanticElement.visibility,
                        label: 'Visibility'
                    } as ElementChoiceProperty
                ]
            }
        };
        return [SetPropertyPaletteAction.create(propertyPalette)];
    }
}
