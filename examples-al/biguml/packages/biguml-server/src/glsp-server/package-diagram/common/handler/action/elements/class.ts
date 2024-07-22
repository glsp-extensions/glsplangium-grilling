import {
    ElementBoolProperty,
    ElementChoiceProperty,
    ElementProperties,
    ElementTextProperty,
    SetPropertyPaletteAction
} from '@biguml/biguml-protocol';
import { Class } from '../../../../../../language-server/generated/ast.js';

export namespace ClassPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: Class): SetPropertyPaletteAction[] {
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
                        propertyId: 'isAbstract',
                        type: 'BOOL',
                        value: semanticElement.isAbstract,
                        label: 'isAbstract'
                    } as ElementBoolProperty,
                    {
                        elementId: semanticElement.__id,
                        propertyId: 'isActive',
                        type: 'BOOL',
                        value: semanticElement.isActive,
                        label: 'isActive'
                    } as ElementBoolProperty,
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
