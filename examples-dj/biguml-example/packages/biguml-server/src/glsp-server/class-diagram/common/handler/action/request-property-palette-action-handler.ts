import { RequestPropertyPaletteAction, SetPropertyPaletteAction } from '@biguml/biguml-protocol';
import { Action, ActionHandler, MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import {
    isClass,
    isDataType,
    isInstanceSpecification,
    isInterface,
    isLiteralSpecification,
    isOperation,
    isParameter,
    isPrimitiveType,
    isProperty,
    isRelation,
    isSlot
} from '../../../../../language-server/generated/ast';
import { ClassDiagramModelState } from '../../../model/class-diagram-model-state';
import { ClassPropertyPaletteHandler } from './elements/class';
import { DataTypePropertyPaletteHandler } from './elements/data-type';
import { InstanceSpecificationPropertyPaletteHandler } from './elements/instance-specification';
import { InterfacePropertyPaletteHandler } from './elements/interface';
import { LiteralSpecificationPropertyPaletteHandler } from './elements/literal-specification';
import { OperationPropertyPaletteHandler } from './elements/operation';
import { ParameterPropertyPaletteHandler } from './elements/parameter';
import { PrimitiveTypePropertyPaletteHandler } from './elements/primitive-type';
import { PropertyPropertyPaletteHandler } from './elements/property';
import { RelationPropertyPaletteHandler } from './elements/relation';
import { SlotPropertyPaletteHandler } from './elements/slot';

@injectable()
export class RequestPropertyPaletteActionHandler implements ActionHandler {
    actionKinds = [RequestPropertyPaletteAction.KIND];

    @inject(ClassDiagramModelState)
    protected modelState: ClassDiagramModelState;

    execute(action: RequestPropertyPaletteAction): MaybePromise<Action[]> {
        if (!action.elementId) {
            return [SetPropertyPaletteAction.create()];
        }
        let semanticElement = this.modelState.index.findIdElement(action.elementId);
        if (!semanticElement) {
            return [SetPropertyPaletteAction.create()];
        }

        let dataTypes = this.modelState.index.getAllDataTypes().map(dataType => ({
            label: dataType.name,
            value: dataType.__id + '_refValue',
            secondaryText: dataType.$type
        }));
        let definingFeatures = this.modelState.index.getAllDefiningFeatures().map(definingFeature => ({
            label: definingFeature.name,
            value: definingFeature.__id + '_refValue',
            secondaryText: definingFeature.$type
        }));

        if (isClass(semanticElement)) {
            return ClassPropertyPaletteHandler.getPropertyPalette(semanticElement);
        } else if (isInterface(semanticElement)) {
            return InterfacePropertyPaletteHandler.getPropertyPalette(semanticElement);
        } else if (isOperation(semanticElement)) {
            return OperationPropertyPaletteHandler.getPropertyPalette(semanticElement);
        } else if (isProperty(semanticElement)) {
            return PropertyPropertyPaletteHandler.getPropertyPalette(semanticElement, dataTypes);
        } else if (isRelation(semanticElement)) {
            return RelationPropertyPaletteHandler.getPropertyPalette(semanticElement);
        } else if (isParameter(semanticElement)) {
            return ParameterPropertyPaletteHandler.getPropertyPalette(semanticElement, dataTypes);
        } else if (isInstanceSpecification(semanticElement)) {
            return InstanceSpecificationPropertyPaletteHandler.getPropertyPalette(semanticElement);
        } else if (isSlot(semanticElement)) {
            return SlotPropertyPaletteHandler.getPropertyPalette(semanticElement, definingFeatures);
        } else if (isLiteralSpecification(semanticElement)) {
            return LiteralSpecificationPropertyPaletteHandler.getPropertyPalette(semanticElement);
        } else if (isDataType(semanticElement)) {
            return DataTypePropertyPaletteHandler.getPropertyPalette(semanticElement, dataTypes);
        } else if (isPrimitiveType(semanticElement)) {
            return PrimitiveTypePropertyPaletteHandler.getPropertyPalette(semanticElement);
        }
        return [SetPropertyPaletteAction.create()];
    }
}
