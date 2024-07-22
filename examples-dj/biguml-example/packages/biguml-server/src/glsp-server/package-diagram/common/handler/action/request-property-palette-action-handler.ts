import { RequestPropertyPaletteAction, SetPropertyPaletteAction } from '@biguml/biguml-protocol';
import { Action, ActionHandler, MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { isClass, isPackage } from '../../../../../language-server/generated/ast';
import { PackageDiagramModelState } from '../../../model/package-diagram-model-state';
import { ClassPropertyPaletteHandler } from './elements/class';
import { PackagePropertyPaletteHandler } from './elements/package';

@injectable()
export class RequestPropertyPaletteActionHandler implements ActionHandler {
    actionKinds = [RequestPropertyPaletteAction.KIND];

    @inject(PackageDiagramModelState)
    protected modelState: PackageDiagramModelState;

    execute(action: RequestPropertyPaletteAction): MaybePromise<Action[]> {
        if (!action.elementId) {
            return [SetPropertyPaletteAction.create()];
        }
        let semanticElement = this.modelState.index.findIdElement(action.elementId);
        if (!semanticElement) {
            return [SetPropertyPaletteAction.create()];
        }

        if (isClass(semanticElement)) {
            return ClassPropertyPaletteHandler.getPropertyPalette(semanticElement);
        } else if (isPackage(semanticElement)) {
            return PackagePropertyPaletteHandler.getPropertyPalette(semanticElement);
        }
        return [SetPropertyPaletteAction.create()];
    }
}
