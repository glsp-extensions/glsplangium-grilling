import {
    Command,
    CreateNodeOperation,
    CreateNodeOperationHandler,
    OperationHandler,
    Point,
    TriggerNodeCreationAction
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { createRandomUUID } from 'model-service';
import { URI } from 'vscode-uri';
import { findAvailableNodeName } from '../../../../language-server/yo-generated/util/name-util.js';
import { BigUmlCommand } from '../../../biguml/index.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { astTypes, ModelTypes } from '../util/model-types.js';
import { GridSnapper } from './grid-snapper.js';

@injectable()
export class GenericCreateNodeOperationHandler extends OperationHandler implements CreateNodeOperationHandler {
    readonly operationType = CreateNodeOperation.KIND;

    @inject(ClassDiagramModelState)
    protected override modelState: ClassDiagramModelState;

    get elementTypeIds(): string[] {
        //return Object.keys(this.elementTypeConfigProvider.getElementTypeConfigs());
        return [ModelTypes.CLASS, ModelTypes.ENUMERATION]; //alle hinzufugen von Node
    }

    override label: string = '';

    override createCommand(operation: CreateNodeOperation): Command {
        /**const elementTypeConfigs = this.elementTypeConfigProvider.getElementTypeConfigs();
        const elementTypeId = operation.elementTypeId;
        const config = elementTypeConfigs[elementTypeId];
        if (!config) {
            throw new Error(`No configuration found for elementTypeId ${elementTypeId}`);
        }
**/
        const modelPatch = this.createNode(operation);
        const nodeId = JSON.parse(modelPatch).value.__id;
        const modelDetailsPatch = this.createNodeDetails(operation, nodeId, URI.parse(this.modelState.semanticUri).path);
        const patch = [JSON.parse(modelPatch), ...JSON.parse(modelDetailsPatch)];
        return new BigUmlCommand(this.modelState, JSON.stringify(patch));
    }

    createNodeDetails(operation: CreateNodeOperation, id: string, nodeDocumentUri: string): string {
        /**const elementTypeConfigs = this.elementTypeConfigProvider.getElementTypeConfigs();
        const elementTypeId = operation.elementTypeId;
        const config = elementTypeConfigs[elementTypeId];

        const sizeConfig = config?.size || {};
        const positionConfig = config?.position || {};

        const size = getDefaultSize(id, nodeDocumentUri, sizeConfig.width, sizeConfig.height);

        const position = getDefaultPosition(id, nodeDocumentUri, operation, positionConfig.x, positionConfig.y);**/
        const location = this.getLocation(operation);
        const patch = [
            {
                op: 'add',
                path: '/metaInfos/-',
                value: {
                    $type: 'Size',
                    __id: 'size_' + id,
                    element: { $ref: { __id: id, __documentUri: nodeDocumentUri } },
                    width: 80,
                    height: 30
                }
            },
            {
                op: 'add',
                path: '/metaInfos/-',
                value: {
                    $type: 'Position',
                    element: { $ref: { __id: id, __documentUri: nodeDocumentUri } },
                    __id: 'pos_' + id,
                    x: location?.x ?? 0,
                    y: location?.y ?? 0
                }
            }
        ];

        return JSON.stringify(patch);
    }

    getLocation(operation: CreateNodeOperation): Point | undefined {
        return GridSnapper.snap(operation.location);
    }

    getTriggerActions(): TriggerNodeCreationAction[] {
        return this.elementTypeIds.map(typeId => TriggerNodeCreationAction.create(typeId));
    }

    createNode(operation: CreateNodeOperation): string {
        //const modelType = config.modelType || config.label;
        const newName = findAvailableNodeName(this.modelState.semanticRoot, `Newtest`);
        const id = createRandomUUID();

        const containerPath = this.resolveContainerPath(operation);

        //const defaults = this.collectDefaultValues(modelType);

        //ich kann auf ast file zugreifen
        const astType = astTypes.convertToAst(operation.elementTypeId);

        // alles soll von ast file rausgelesen werden
        const value: any = {
            $type: 'Class',
            __id: id,
            name: newName
            //...defaults,
            //...(config.additionalProperties || {})
        };

        const patch = JSON.stringify({
            op: 'add',
            path: containerPath,
            value
        });
        return patch;
    }

    resolveContainerPath(operation: CreateNodeOperation): string {
        const defaultContainerPath = '/diagram/entities/-';

        /**if (config.getContainerPath) {
            return config.getContainerPath(operation, this.modelState, defaultContainerPath) || defaultContainerPath;
        }

        return config.containerPath || defaultContainerPath;**/
        return defaultContainerPath;
    }
    /**
    //Beispiel, füge beim containerId-ada91cc00-e046-4aca-9ef3-cd5f5256e243 (UID) (Class), den elementTypeId: Class Operation hinzu 
    resolveContainerPath(operation: CreateNodeOperation, config: ElementTypeConfig): string {
    if (operation.containerId)
        const container = this.modelState.index.find(operation.containerId);
        const containerPath = this.modelState.index.findPath(operation.containerId);
            if (container.type ) // hier steht was parent ist (Package)
            getCreationPath(container.type, operation.elementTypeId)
                //  { path: '/operations/-', types: ['Operation'] },
                // container.type === Class, operation.elementTypeId === Operation
                const path = astReflection.getPath(container.type, operation.elementTypeId);
                // /diagram/entities/ada91cc00-e046-4aca-9ef3-cd5f5256e243/operations/-
                return containerPath + path.path;
            }
            
        }
        

        // Pseudocode, bekomme irgendwie die paths zurück //• container.type === Class, operation.elementTypeId === Operation
        const path = astReflection.getMetadataPath(container.type, operation.elementTypeId) ;
        if (path) {
        return container + path:
        }
    }
    }
        return• '/diagram/entities/-';

    


    collectDefaultValues(type: string): any {
        const defaults: any = {};
        const typeMetaData = this.getTypeMetaData(type);

        for (const property of typeMetaData.mandatory) {
            const defaultValue = this.defaultValueConfiguration.getDefaultValueFor(type, property.name);
            if (defaultValue !== undefined) {
                defaults[property.name] = defaultValue;
            } else {
                defaults[property.name] = null;
            }
        }
        return defaults;
    }

    protected umlAstReflection = new UmlAstReflection();

    getTypeMetaData(type: string): TypeMetaData {
        return this.umlAstReflection.getTypeMetaData(type);
    }**/
}
