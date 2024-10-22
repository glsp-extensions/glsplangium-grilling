import { defaultGetContainerPath } from '../util/default-container-path';
import { ModelTypes } from '../util/model-types.js';
import { ElementTypeConfig } from './types';

export const elementTypeConfigs: { [elementTypeId: string]: ElementTypeConfig } = {
    [ModelTypes.ENUMERATION]: {
        label: 'Enumeration',
        elementTypeId: ModelTypes.ENUMERATION,
        containerPath: '/diagram/enumerations/-',
        size: {
            width: 100,
            height: 50
        },
        position: {
            x: 200,
            y: 100
        }
    },
    [ModelTypes.INTERFACE]: {
        label: 'Interface',
        elementTypeId: ModelTypes.INTERFACE
    },
    [ModelTypes.PACKAGE]: {
        label: 'Package',
        elementTypeId: ModelTypes.PACKAGE,
        getContainerPath: (operation, modelState, defaultContainerPath) =>
            defaultGetContainerPath(operation, modelState, 'entities', defaultContainerPath)
    },
    [ModelTypes.PROPERTY]: {
        label: 'Property',
        elementTypeId: ModelTypes.PROPERTY,
        getContainerPath: (operation, modelState) => defaultGetContainerPath(operation, modelState, 'properties', '')
    },
    [ModelTypes.CLASS]: {
        label: 'Class',
        elementTypeId: ModelTypes.CLASS,
        additionalProperties: {
            isAbstract: false,
            visibility: 'PUBLIC'
        },
        getContainerPath: (operation, modelState, defaultContainerPath) =>
            defaultGetContainerPath(operation, modelState, 'entities', defaultContainerPath)
    },
    [ModelTypes.ABSTRACT_CLASS]: {
        label: 'AbstractClass',
        elementTypeId: ModelTypes.ABSTRACT_CLASS,
        modelType: 'Class',
        additionalProperties: {
            isAbstract: true,
            visibility: 'PUBLIC'
        },
        getContainerPath: (operation, modelState, defaultContainerPath) =>
            defaultGetContainerPath(operation, modelState, 'entities', defaultContainerPath)
    },
    [ModelTypes.DATA_TYPE]: {
        label: 'DataType',
        elementTypeId: ModelTypes.DATA_TYPE,
        additionalProperties: {
            visibility: 'PUBLIC'
        }
    },
    [ModelTypes.ENUMERATION_LITERAL]: {
        label: 'EnumerationLiteral',
        elementTypeId: ModelTypes.ENUMERATION_LITERAL,
        getContainerPath: (operation, modelState, defaultContainerPath) => defaultGetContainerPath(operation, modelState, 'values', ''),
        additionalProperties: {
            visibility: 'PUBLIC'
        }
    },
    [ModelTypes.INSTANCE_SPECIFICATION]: {
        label: 'InstanceSpecification',
        elementTypeId: ModelTypes.INSTANCE_SPECIFICATION,
        additionalProperties: {
            visibility: 'PUBLIC'
        }
    },
    [ModelTypes.LITERAL_SPECIFICATION]: {
        label: 'LiteralSpecification',
        elementTypeId: ModelTypes.LITERAL_SPECIFICATION,
        getContainerPath: (operation, modelState) => defaultGetContainerPath(operation, modelState, 'values', ''),
        additionalProperties: {
            value: 'undefined'
        }
    },
    [ModelTypes.OPERATION]: {
        label: 'Operation',
        elementTypeId: ModelTypes.OPERATION,
        getContainerPath: (operation, modelState) => defaultGetContainerPath(operation, modelState, 'operations', ''),
        additionalProperties: {
            visibility: 'PUBLIC'
        }
    },
    [ModelTypes.PARAMETER]: {
        label: 'Parameter',
        elementTypeId: ModelTypes.PARAMETER,
        getContainerPath: (operation, modelState) => defaultGetContainerPath(operation, modelState, 'parameters', ''),
        additionalProperties: {
            visibility: 'PUBLIC'
        }
    },
    [ModelTypes.PRIMITIVE_TYPE]: {
        label: 'PrimitiveType',
        elementTypeId: ModelTypes.PRIMITIVE_TYPE,
        containerPath: '/diagram/entities/-'
    },
    [ModelTypes.SLOT]: {
        label: 'Slot',
        elementTypeId: ModelTypes.SLOT,
        getContainerPath: (operation, modelState) => defaultGetContainerPath(operation, modelState, 'slots', '')
    }
};
