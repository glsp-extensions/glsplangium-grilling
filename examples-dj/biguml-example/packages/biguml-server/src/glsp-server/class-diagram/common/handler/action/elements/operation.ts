import { SetPropertyPaletteAction } from '@biguml/biguml-protocol';
import { CreateNodeOperation, DeleteElementOperation } from '@eclipse-glsp/server';
import { Operation } from '../../../../../../language-server/generated/ast';
import { ModelTypes } from '../../../util/model-types';
import { PropertyPalette } from './util';

export namespace OperationPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: Operation): SetPropertyPaletteAction[] {
        return [
            SetPropertyPaletteAction.create(
                PropertyPalette.builder()
                    .elementId(semanticElement.__id)
                    .label(semanticElement.$type)
                    .text(semanticElement.__id, 'name', semanticElement.name, 'Name')
                    .bool(semanticElement.__id, 'isAbstract', semanticElement.isAbstract, 'isAbstract')
                    .bool(semanticElement.__id, 'isStatic', semanticElement.isStatic, 'isStatic')
                    .bool(semanticElement.__id, 'isQuery', semanticElement.isQuery, 'isQuery')
                    .choice(
                        semanticElement.__id,
                        'visibility',
                        PropertyPalette.DEFAULT_VISIBILITY_CHOICES,
                        semanticElement.visibility,
                        'Visibility'
                    )
                    .choice(
                        semanticElement.__id,
                        'concurrency',
                        [
                            { label: 'sequential', value: 'SEQUENTIAL' },
                            { label: 'guarded', value: 'GUARDED' },
                            { label: 'concurrent', value: 'CONCURRENT' }
                        ],
                        semanticElement.concurrency,
                        'Concurrency'
                    )
                    .reference(
                        semanticElement.__id,
                        'parameters',
                        'Parameters',
                        semanticElement.parameters.map(param => ({
                            elementId: param.__id,
                            label: param.name,
                            name: param.name,
                            deleteActions: [DeleteElementOperation.create([param.__id])]
                        })),
                        [
                            {
                                label: 'Create Parameter',
                                action: CreateNodeOperation.create(ModelTypes.PARAMETER, { containerId: semanticElement.__id })
                            }
                        ]
                    )
                    .build()
            )
        ];
    }
}
