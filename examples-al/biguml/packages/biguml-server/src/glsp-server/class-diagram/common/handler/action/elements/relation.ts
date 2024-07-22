import { SetPropertyPaletteAction } from '@biguml/biguml-protocol';
import {
    Relation,
    isAbstraction,
    isAssociation,
    isDependency,
    isInterfaceRealization,
    isPackageImport,
    isRealization,
    isSubstitution,
    isUsage
} from '../../../../../../language-server/generated/ast.js';
import { PropertyPalette } from './util.js';

export namespace RelationPropertyPaletteHandler {
    export function getPropertyPalette(semanticElement: Relation): SetPropertyPaletteAction[] {
        const propertyPalette = PropertyPalette.builder().elementId(semanticElement.__id).label(semanticElement.$type);
        if (isAssociation(semanticElement)) {
            propertyPalette.text(semanticElement.__id, 'name', semanticElement.name, 'Name');
            propertyPalette.choice(
                semanticElement.__id,
                'visibility',
                PropertyPalette.DEFAULT_VISIBILITY_CHOICES,
                semanticElement.visibility,
                'Visibility'
            );
            propertyPalette.text(semanticElement.__id, 'sourceName', semanticElement.sourceName, 'Source Name');
            propertyPalette.text(semanticElement.__id, 'soruceMultiplicity', semanticElement.sourceMultiplicity, 'Source Multiplicity');
            propertyPalette.choice(
                semanticElement.__id,
                'sourceAggregation',
                PropertyPalette.DEFAULT_AGGREGATION_CHOICES,
                semanticElement.sourceAggregation,
                'Source Aggregation'
            );
            propertyPalette.text(semanticElement.__id, 'targetName', semanticElement.targetName, 'Target Name');
            propertyPalette.text(semanticElement.__id, 'targetMultiplicity', semanticElement.targetMultiplicity, 'Target Multiplicity');
            propertyPalette.choice(
                semanticElement.__id,
                'targetAggregation',
                PropertyPalette.DEFAULT_AGGREGATION_CHOICES,
                semanticElement.targetAggregation,
                'Target Aggregation'
            );
        } else if (
            isAbstraction(semanticElement) ||
            isDependency(semanticElement) ||
            isInterfaceRealization(semanticElement) ||
            isRealization(semanticElement) ||
            isSubstitution(semanticElement) ||
            isUsage(semanticElement)
        ) {
            propertyPalette.text(semanticElement.__id, 'name', semanticElement.name, 'Name');
            propertyPalette.choice(
                semanticElement.__id,
                'visibility',
                PropertyPalette.DEFAULT_VISIBILITY_CHOICES,
                semanticElement.visibility,
                'Visibility'
            );
        } else if (isPackageImport(semanticElement)) {
            propertyPalette.choice(
                semanticElement.__id,
                'visibility',
                PropertyPalette.DEFAULT_VISIBILITY_CHOICES,
                semanticElement.visibility,
                'Visibility'
            );
        }
        return [SetPropertyPaletteAction.create(propertyPalette.build())];
    }
}
