import { SetPropertyPaletteAction } from '@biguml/biguml-protocol';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';
import { DataType } from '../../../../../../language-server/generated/ast.js';
import { ModelTypes } from '../../../util/model-types.js';
import { PropertyPalette } from './util.js';

export namespace DataTypePropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: DataType, dataTypeChoices): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                PropertyPalette.builder()
                    .elementId(semanticElement.__id)
                    .label(semanticElement.$type)
                    .text(semanticElement.__id, 'name', semanticElement.name, 'Name')
                    .bool(semanticElement.__id, 'isAbstract', semanticElement.isAbstract, 'isAbstract')
                    .reference(
                        semanticElement.__id,
                        'properties',
                        'Properties',
                        semanticElement.properties.map(property => ({
                            elementId: property.__id,
                            label: property.name,
                            name: property.name,
                            deleteActions: [DeleteElementOperation.create([property.__id])]
                        })),
                        [
                            {
                                label: 'Create Property',
                                action: CreateNodeOperation.create(ModelTypes.PROPERTY, { containerId: semanticElement.__id })
                            }
                        ]
                    )
                    .reference(
                        semanticElement.__id,
                        'operations',
                        'Operations',
                        semanticElement.operations.map(operation => ({
                            elementId: operation.__id,
                            label: operation.name,
                            name: operation.name,
                            deleteActions: [DeleteElementOperation.create([operation.__id])]
                        })),
                        [
                            {
                                label: 'Create Operation',
                                action: CreateNodeOperation.create(ModelTypes.OPERATION, { containerId: semanticElement.__id })
                            }
                        ]
                    )
                    .build()
            )
        ];
    }
}
