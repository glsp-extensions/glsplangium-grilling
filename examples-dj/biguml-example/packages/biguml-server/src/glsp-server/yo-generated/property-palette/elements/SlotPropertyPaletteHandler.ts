// AUTO-GENERATED – DO NOT EDIT

import { SetPropertyPaletteAction } from '@biguml/biguml-protocol';
import {
  CreateNodeOperation,
  DeleteElementOperation,
} from '@eclipse-glsp/server';
import { Slot } from '../../../../language-server/generated/ast.js';
import { ModelTypes } from '../../../../glsp-server/util/model-types.js';
import { PropertyPalette } from '../../../util/property-palette-util.js';

export namespace SlotPropertyPaletteHandler {
  export function getPropertyPalette(
    semanticElement: Slot,
    definingFeatureChoices,
  ): SetPropertyPaletteAction[] {
    return [
      SetPropertyPaletteAction.create(
        PropertyPalette.builder()
          .elementId(semanticElement.__id)
          .label(semanticElement.$type)
          .text(semanticElement.__id, 'name', semanticElement.name, 'Name')
          .choice(
            semanticElement.__id,
            'definingFeature',
            definingFeatureChoices,
            semanticElement.definingFeature?.ref?.__id + '_refValue',
            'Defining Feature',
          )
          .reference(
            semanticElement.__id,
            'values',
            'Values',
            (semanticElement.values ?? []).map((e) => ({
              elementId: e.__id,
              label: e.name,
              name: e.name,
              deleteActions: [DeleteElementOperation.create([e.__id])],
            })),
            [
              {
                label: 'Create Literal Specification',
                action: CreateNodeOperation.create(
                  ModelTypes.LITERAL_SPECIFICATION,
                  { containerId: semanticElement.__id },
                ),
              },
            ],
          )
          .build(),
      ),
    ];
  }
}
