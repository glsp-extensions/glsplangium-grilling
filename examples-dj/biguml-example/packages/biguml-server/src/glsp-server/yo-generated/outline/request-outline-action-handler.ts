// AUTO-GENERATED – DO NOT EDIT
import { RequestOutlineAction, SetOutlineAction } from '@biguml/biguml-protocol';
import { ActionHandler, MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import {
    isEnumeration,
    isClass,
    isAbstractClass,
    isInterface,
    isDataType,
    isPrimitiveType,
    isInstanceSpecification,
    isPackage
} from '../../../language-server/generated/ast.js';
import { ClassDiagramModelState } from '../../../glsp-server/class-diagram/model/class-diagram-model-state.js';

@injectable()
export class RequestOutlineActionHandler implements ActionHandler {
    actionKinds = [RequestOutlineAction.KIND];

    @inject(ClassDiagramModelState)
    protected modelState!: ClassDiagramModelState;

    execute(action: RequestOutlineAction): MaybePromise<any[]> {
        if (this.modelState.index.root.diagram.diagramType !== 'CLASS') {
            return [SetOutlineAction.create({ outlineTreeNodes: [] })];
        }
        const root = this.modelState.index.root.diagram;
        const outlineTreeNodes = [{ label: 'Model', semanticUri: root.__id, children: [], iconClass: 'model', isRoot: true }];
        const entities = root.entities ?? [];
        entities.forEach(entity => {
            // default node (leaf)
            const node: any = {
                label: entity.name,
                semanticUri: entity.__id,
                children: [],
                iconClass: 'element'
            };

            if (isEnumeration(entity)) {
                node.iconClass = 'enumeration';
                node.children.push(
                    ...(entity.values ?? []).map(child => ({
                        label: child.name,
                        semanticUri: child.__id,
                        children: [],
                        iconClass: 'enumerationliteral'
                    }))
                );
            }

            if (isClass(entity)) {
                node.iconClass = 'class';
                node.children.push(
                    ...(entity.properties ?? []).map(child => ({
                        label: child.name,
                        semanticUri: child.__id,
                        children: [],
                        iconClass: 'property'
                    }))
                );
                node.children.push(
                    ...(entity.operations ?? []).map(child => ({
                        label: child.name,
                        semanticUri: child.__id,
                        children: [],
                        iconClass: 'operation'
                    }))
                );
            }

            if (isAbstractClass(entity)) {
                node.iconClass = 'abstractclass';
                node.children.push(
                    ...(entity.properties ?? []).map(child => ({
                        label: child.name,
                        semanticUri: child.__id,
                        children: [],
                        iconClass: 'property'
                    }))
                );
                node.children.push(
                    ...(entity.operations ?? []).map(child => ({
                        label: child.name,
                        semanticUri: child.__id,
                        children: [],
                        iconClass: 'operation'
                    }))
                );
            }

            if (isInterface(entity)) {
                node.iconClass = 'interface';
                node.children.push(
                    ...(entity.properties ?? []).map(child => ({
                        label: child.name,
                        semanticUri: child.__id,
                        children: [],
                        iconClass: 'property'
                    }))
                );
                node.children.push(
                    ...(entity.operations ?? []).map(child => ({
                        label: child.name,
                        semanticUri: child.__id,
                        children: [],
                        iconClass: 'operation'
                    }))
                );
            }

            if (isDataType(entity)) {
                node.iconClass = 'datatype';
                node.children.push(
                    ...(entity.properties ?? []).map(child => ({
                        label: child.name,
                        semanticUri: child.__id,
                        children: [],
                        iconClass: 'property'
                    }))
                );
                node.children.push(
                    ...(entity.operations ?? []).map(child => ({
                        label: child.name,
                        semanticUri: child.__id,
                        children: [],
                        iconClass: 'operation'
                    }))
                );
            }

            if (isPrimitiveType(entity)) {
                node.iconClass = 'primitivetype';
            }

            if (isInstanceSpecification(entity)) {
                node.iconClass = 'instancespecification';
                node.children.push(
                    ...(entity.slots ?? []).map(child => ({
                        label: child.name,
                        semanticUri: child.__id,
                        children: [],
                        iconClass: 'slot'
                    }))
                );
            }

            if (isPackage(entity)) {
                node.iconClass = 'package';
                node.children.push(
                    ...(entity.entities ?? []).map(child => ({
                        label: child.name,
                        semanticUri: child.__id,
                        children: [],
                        iconClass: 'entity'
                    }))
                );
            }

            outlineTreeNodes[0].children.push(node);
        });
        return [SetOutlineAction.create({ outlineTreeNodes })];
    }
}
