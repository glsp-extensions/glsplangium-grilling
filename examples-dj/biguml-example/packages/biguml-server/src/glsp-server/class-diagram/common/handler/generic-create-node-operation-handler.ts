import {
    Command,
    CreateNodeOperation,
    CreateNodeOperationHandler,
    OperationHandler,
    TriggerNodeCreationAction
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import type { TypeMetaData } from 'langium';
import { createRandomUUID } from 'model-service';
import { URI } from 'vscode-uri';
import { UmlAstReflection } from '../../../../language-server/generated/ast.js';
import { findAvailableNodeName } from '../../../../language-server/yo-generated/util/name-util.js';
import { BigUmlCommand } from '../../../biguml/index.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { getDefaultPosition, getDefaultSize } from './default-values.js';
import { elementTypeConfigs } from './element-type-configs.js';
import { ElementTypeConfig } from './types.js';

@injectable()
export class GenericCreateNodeOperationHandler extends OperationHandler implements CreateNodeOperationHandler {
    readonly operationType = CreateNodeOperation.KIND;

    @inject(ClassDiagramModelState)
    protected override modelState: ClassDiagramModelState;

    get elementTypeIds(): string[] {
        return Object.keys(elementTypeConfigs);
    }

    override label: string = '';

    override createCommand(operation: CreateNodeOperation): Command {
        const elementTypeId = operation.elementTypeId;
        const config = elementTypeConfigs[elementTypeId];
        if (!config) {
            throw new Error(`No configuration found for elementTypeId ${elementTypeId}`);
        }

        const modelPatch = this.createNode(operation, config);
        const nodeId = JSON.parse(modelPatch).value.__id;
        const modelDetailsPatch = this.createNodeDetails(operation, nodeId, URI.parse(this.modelState.semanticUri).path);
        const patch = [JSON.parse(modelPatch), ...JSON.parse(modelDetailsPatch)];
        return new BigUmlCommand(this.modelState, JSON.stringify(patch));
    }

    createNodeDetails(operation: CreateNodeOperation, id: string, nodeDocumentUri: string): string {
        const elementTypeId = operation.elementTypeId;
        const config = elementTypeConfigs[elementTypeId];

        const sizeConfig = config?.size || {};
        const positionConfig = config?.position || {};

        const size = getDefaultSize(id, nodeDocumentUri, sizeConfig.width, sizeConfig.height);

        const position = getDefaultPosition(id, nodeDocumentUri, operation, positionConfig.x, positionConfig.y);

        const patch = [
            {
                op: 'add',
                path: '/metaInfos/-',
                value: size
            },
            {
                op: 'add',
                path: '/metaInfos/-',
                value: position
            }
        ];

        return JSON.stringify(patch);
    }

    getTriggerActions(): TriggerNodeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerNodeCreationAction.create(typeId));
    }

    createNode(operation: CreateNodeOperation, config: ElementTypeConfig): string {
        const modelType = config.modelType || config.label;
        const newName = findAvailableNodeName(this.modelState.semanticRoot, `New${modelType}`);
        const id = createRandomUUID();

        const containerPath = this.resolveContainerPath(operation, config);

        const defaults = this.getTypeDefaultValues(modelType);

        const value: any = {
            $type: modelType,
            __id: id,
            name: newName,
            ...defaults,
            ...(config.additionalProperties || {})
        };

        const patch = JSON.stringify({
            op: 'add',
            path: containerPath,
            value
        });
        return patch;
    }

    resolveContainerPath(operation: CreateNodeOperation, config: ElementTypeConfig): string {
        const defaultContainerPath = '/diagram/entities/-';

        if (config.getContainerPath) {
            return config.getContainerPath(operation, this.modelState, defaultContainerPath) || defaultContainerPath;
        }

        return config.containerPath || defaultContainerPath;
    }

    getTypeDefaultValues(type: string): any {
        const typeMetaData = this.getTypeMetaData(type);
        const defaults: any = {};
        for (const mandatoryField of typeMetaData.mandatory) {
            switch (mandatoryField.type) {
                case 'boolean':
                    defaults[mandatoryField.name] = false;
                    break;
                case 'array':
                    defaults[mandatoryField.name] = [];
                    break;
                default:
                    defaults[mandatoryField.name] = null;
                    break;
            }
        }
        return defaults;
    }

    protected umlAstReflection = new UmlAstReflection();

    getTypeMetaData(type: string): TypeMetaData {
        return this.umlAstReflection.getTypeMetaData(type);
    }
}
