/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { DiagramSerializer, Serializer } from 'model-service';
import { AstNode } from 'langium';
import {
    Abstraction,
    AggregationType,
    Association,
    Class,
    ClassDiagram,
    Concurrency,
    DataType,
    DataTypeReference,
    Dependency,
    Diagram,
    EffectType,
    ElementWithSizeAndPosition,
    Entity,
    Enumeration,
    EnumerationLiteral,
    Generalization,
    InstanceSpecification,
    Interface,
    InterfaceRealization,
    LiteralSpecification,
    MetaInfo,
    Operation,
    Package,
    PackageDiagram,
    PackageImport,
    PackageMerge,
    Parameter,
    ParameterDirection,
    Position,
    PrimitiveType,
    Property,
    Realization,
    Relation,
    RelationType,
    Size,
    Slot,
    SlotDefiningFeature,
    StateMachineDiagram,
    Substitution,
    UnionType_0,
    Usage,
    Visibility,
    isAbstraction,
    isAssociation,
    isClass,
    isClassDiagram,
    isDataType,
    isDependency,
    isDiagram,
    isEntity,
    isEnumeration,
    isGeneralization,
    isInstanceSpecification,
    isInterface,
    isInterfaceRealization,
    isPackage,
    isPackageDiagram,
    isPackageImport,
    isPackageMerge,
    isPosition,
    isPrimitiveType,
    isProperty,
    isRealization,
    isSize,
    isStateMachineDiagram,
    isSubstitution,
    isUsage
} from '../generated/ast.js';
import { UmlServices } from './uml-module.js';

export class UmlSerializer implements Serializer<Diagram>, DiagramSerializer<Diagram> {
    constructor(protected services: UmlServices) {}

    serialize(root: AstNode): string {
        let str: Array<string> = [];
        if (isDiagram(root)) {
            str.push('"diagram": ' + this.serializeUnionType_0(root.diagram));
            str.push('"metaInfos": [\n' + root.metaInfos.map(element => '' + this.serializeMetaInfo(element)).join(',\n') + '\n]');
        }
        str = str.filter(element => !!element);
        const json = JSON.parse('{\n' + str.join(',\n') + '\n}');
        return JSON.stringify(json, undefined, '\t');
    }

    serializeSize(element: Size): string {
        let str: Array<string> = [];
        str.push('"__type": "Size"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.height !== undefined && element.height !== null) {
            str.push('"height": ' + element.height + '');
        }
        if (element.width !== undefined && element.width !== null) {
            str.push('"width": ' + element.width + '');
        }
        if (element.element !== undefined && element.element !== null) {
            str.push(
                '"element": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "ElementWithSizeAndPosition", "__value": "' +
                    (element.element.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializePosition(element: Position): string {
        let str: Array<string> = [];
        str.push('"__type": "Position"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.x !== undefined && element.x !== null) {
            str.push('"x": ' + element.x + '');
        }
        if (element.y !== undefined && element.y !== null) {
            str.push('"y": ' + element.y + '');
        }
        if (element.element !== undefined && element.element !== null) {
            str.push(
                '"element": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "ElementWithSizeAndPosition", "__value": "' +
                    (element.element.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeClassDiagram(element: ClassDiagram): string {
        let str: Array<string> = [];
        str.push('"__type": "ClassDiagram"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.diagramType !== undefined && element.diagramType !== null) {
            str.push('"diagramType": ' + '"' + element.diagramType + '"');
        }
        if (element.entities !== undefined && element.entities !== null) {
            str.push('"entities": [' + element.entities.map(property => this.serializeEntity(property)).join(',') + ']');
        }
        if (element.relations !== undefined && element.relations !== null) {
            str.push('"relations": [' + element.relations.map(property => this.serializeRelation(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeEnumeration(element: Enumeration): string {
        let str: Array<string> = [];
        str.push('"__type": "Enumeration"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.values !== undefined && element.values !== null) {
            str.push('"values": [' + element.values.map(property => this.serializeEnumerationLiteral(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeEnumerationLiteral(element: EnumerationLiteral): string {
        let str: Array<string> = [];
        str.push('"__type": "EnumerationLiteral"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.value !== undefined && element.value !== null) {
            str.push('"value": ' + '"' + element.value + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeClass(element: Class): string {
        let str: Array<string> = [];
        str.push('"__type": "Class"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.isAbstract !== undefined && element.isAbstract !== null) {
            str.push('"isAbstract": ' + element.isAbstract + '');
        }
        if (element.properties !== undefined && element.properties !== null) {
            str.push('"properties": [' + element.properties.map(property => this.serializeProperty(property)).join(',') + ']');
        }
        if (element.operations !== undefined && element.operations !== null) {
            str.push('"operations": [' + element.operations.map(property => this.serializeOperation(property)).join(',') + ']');
        }
        if (element.isActive !== undefined && element.isActive !== null) {
            str.push('"isActive": ' + element.isActive + '');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeInterface(element: Interface): string {
        let str: Array<string> = [];
        str.push('"__type": "Interface"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.properties !== undefined && element.properties !== null) {
            str.push('"properties": [' + element.properties.map(property => this.serializeProperty(property)).join(',') + ']');
        }
        if (element.operations !== undefined && element.operations !== null) {
            str.push('"operations": [' + element.operations.map(property => this.serializeOperation(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeProperty(element: Property): string {
        let str: Array<string> = [];
        str.push('"__type": "Property"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.isDerived !== undefined && element.isDerived !== null) {
            str.push('"isDerived": ' + element.isDerived + '');
        }
        if (element.isOrdered !== undefined && element.isOrdered !== null) {
            str.push('"isOrdered": ' + element.isOrdered + '');
        }
        if (element.isStatic !== undefined && element.isStatic !== null) {
            str.push('"isStatic": ' + element.isStatic + '');
        }
        if (element.isDerivedUnion !== undefined && element.isDerivedUnion !== null) {
            str.push('"isDerivedUnion": ' + element.isDerivedUnion + '');
        }
        if (element.isReadOnly !== undefined && element.isReadOnly !== null) {
            str.push('"isReadOnly": ' + element.isReadOnly + '');
        }
        if (element.isUnique !== undefined && element.isUnique !== null) {
            str.push('"isUnique": ' + element.isUnique + '');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.multiplicity !== undefined && element.multiplicity !== null) {
            str.push('"multiplicity": ' + '"' + element.multiplicity + '"');
        }
        if (element.propertyType !== undefined && element.propertyType !== null) {
            str.push(
                '"propertyType": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "DataTypeReference", "__value": "' +
                    (element.propertyType.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.aggregation !== undefined && element.aggregation !== null) {
            str.push('"aggregation": ' + this.serializeAggregationType(element.aggregation));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeOperation(element: Operation): string {
        let str: Array<string> = [];
        str.push('"__type": "Operation"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.isAbstract !== undefined && element.isAbstract !== null) {
            str.push('"isAbstract": ' + element.isAbstract + '');
        }
        if (element.isStatic !== undefined && element.isStatic !== null) {
            str.push('"isStatic": ' + element.isStatic + '');
        }
        if (element.isQuery !== undefined && element.isQuery !== null) {
            str.push('"isQuery": ' + element.isQuery + '');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.concurrency !== undefined && element.concurrency !== null) {
            str.push('"concurrency": ' + this.serializeConcurrency(element.concurrency));
        }
        if (element.parameters !== undefined && element.parameters !== null) {
            str.push('"parameters": [' + element.parameters.map(property => this.serializeParameter(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeParameter(element: Parameter): string {
        let str: Array<string> = [];
        str.push('"__type": "Parameter"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.isException !== undefined && element.isException !== null) {
            str.push('"isException": ' + element.isException + '');
        }
        if (element.isStream !== undefined && element.isStream !== null) {
            str.push('"isStream": ' + element.isStream + '');
        }
        if (element.isOrdered !== undefined && element.isOrdered !== null) {
            str.push('"isOrdered": ' + element.isOrdered + '');
        }
        if (element.isUnique !== undefined && element.isUnique !== null) {
            str.push('"isUnique": ' + element.isUnique + '');
        }
        if (element.direction !== undefined && element.direction !== null) {
            str.push('"direction": ' + this.serializeParameterDirection(element.direction));
        }
        if (element.effect !== undefined && element.effect !== null) {
            str.push('"effect": ' + this.serializeEffectType(element.effect));
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.parameterType !== undefined && element.parameterType !== null) {
            str.push(
                '"parameterType": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "DataTypeReference", "__value": "' +
                    (element.parameterType.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.multiplicity !== undefined && element.multiplicity !== null) {
            str.push('"multiplicity": ' + '"' + element.multiplicity + '"');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDataType(element: DataType): string {
        let str: Array<string> = [];
        str.push('"__type": "DataType"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.properties !== undefined && element.properties !== null) {
            str.push('"properties": [' + element.properties.map(property => this.serializeProperty(property)).join(',') + ']');
        }
        if (element.operations !== undefined && element.operations !== null) {
            str.push('"operations": [' + element.operations.map(property => this.serializeOperation(property)).join(',') + ']');
        }
        if (element.isAbstract !== undefined && element.isAbstract !== null) {
            str.push('"isAbstract": ' + element.isAbstract + '');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializePrimitiveType(element: PrimitiveType): string {
        let str: Array<string> = [];
        str.push('"__type": "PrimitiveType"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeInstanceSpecification(element: InstanceSpecification): string {
        let str: Array<string> = [];
        str.push('"__type": "InstanceSpecification"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.slots !== undefined && element.slots !== null) {
            str.push('"slots": [' + element.slots.map(property => this.serializeSlot(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeSlot(element: Slot): string {
        let str: Array<string> = [];
        str.push('"__type": "Slot"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.definingFeature !== undefined && element.definingFeature !== null) {
            str.push(
                '"definingFeature": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "SlotDefiningFeature", "__value": "' +
                    (element.definingFeature.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.values !== undefined && element.values !== null) {
            str.push('"values": [' + element.values.map(property => this.serializeLiteralSpecification(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeLiteralSpecification(element: LiteralSpecification): string {
        let str: Array<string> = [];
        str.push('"__type": "LiteralSpecification"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.value !== undefined && element.value !== null) {
            str.push('"value": ' + '"' + element.value + '"');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeRelation(element: Relation): string {
        let str: Array<string> = [];
        if (isAbstraction(element)) {
            return this.serializeAbstraction(element);
        }
        if (isDependency(element)) {
            return this.serializeDependency(element);
        }
        if (isAssociation(element)) {
            return this.serializeAssociation(element);
        }
        if (isInterfaceRealization(element)) {
            return this.serializeInterfaceRealization(element);
        }
        if (isGeneralization(element)) {
            return this.serializeGeneralization(element);
        }
        if (isPackageImport(element)) {
            return this.serializePackageImport(element);
        }
        if (isPackageMerge(element)) {
            return this.serializePackageMerge(element);
        }
        if (isRealization(element)) {
            return this.serializeRealization(element);
        }
        if (isSubstitution(element)) {
            return this.serializeSubstitution(element);
        }
        if (isUsage(element)) {
            return this.serializeUsage(element);
        }
        str.push('"__type": "Relation"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.relationType !== undefined && element.relationType !== null) {
            str.push('"relationType": ' + this.serializeRelationType(element.relationType));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeAbstraction(element: Abstraction): string {
        let str: Array<string> = [];
        str.push('"__type": "Abstraction"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.relationType !== undefined && element.relationType !== null) {
            str.push('"relationType": ' + this.serializeRelationType(element.relationType));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDependency(element: Dependency): string {
        let str: Array<string> = [];
        str.push('"__type": "Dependency"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.relationType !== undefined && element.relationType !== null) {
            str.push('"relationType": ' + this.serializeRelationType(element.relationType));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeAssociation(element: Association): string {
        let str: Array<string> = [];
        str.push('"__type": "Association"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.sourceMultiplicity !== undefined && element.sourceMultiplicity !== null) {
            str.push('"sourceMultiplicity": ' + '"' + element.sourceMultiplicity + '"');
        }
        if (element.targetMultiplicity !== undefined && element.targetMultiplicity !== null) {
            str.push('"targetMultiplicity": ' + '"' + element.targetMultiplicity + '"');
        }
        if (element.sourceName !== undefined && element.sourceName !== null) {
            str.push('"sourceName": ' + '"' + element.sourceName + '"');
        }
        if (element.targetName !== undefined && element.targetName !== null) {
            str.push('"targetName": ' + '"' + element.targetName + '"');
        }
        if (element.sourceAggregation !== undefined && element.sourceAggregation !== null) {
            str.push('"sourceAggregation": ' + this.serializeAggregationType(element.sourceAggregation));
        }
        if (element.targetAggregation !== undefined && element.targetAggregation !== null) {
            str.push('"targetAggregation": ' + this.serializeAggregationType(element.targetAggregation));
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.relationType !== undefined && element.relationType !== null) {
            str.push('"relationType": ' + this.serializeRelationType(element.relationType));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeInterfaceRealization(element: InterfaceRealization): string {
        let str: Array<string> = [];
        str.push('"__type": "InterfaceRealization"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.relationType !== undefined && element.relationType !== null) {
            str.push('"relationType": ' + this.serializeRelationType(element.relationType));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeGeneralization(element: Generalization): string {
        let str: Array<string> = [];
        str.push('"__type": "Generalization"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.isSubstitutable !== undefined && element.isSubstitutable !== null) {
            str.push('"isSubstitutable": ' + element.isSubstitutable + '');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.relationType !== undefined && element.relationType !== null) {
            str.push('"relationType": ' + this.serializeRelationType(element.relationType));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializePackageImport(element: PackageImport): string {
        let str: Array<string> = [];
        str.push('"__type": "PackageImport"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.relationType !== undefined && element.relationType !== null) {
            str.push('"relationType": ' + this.serializeRelationType(element.relationType));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializePackageMerge(element: PackageMerge): string {
        let str: Array<string> = [];
        str.push('"__type": "PackageMerge"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.relationType !== undefined && element.relationType !== null) {
            str.push('"relationType": ' + this.serializeRelationType(element.relationType));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeRealization(element: Realization): string {
        let str: Array<string> = [];
        str.push('"__type": "Realization"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.relationType !== undefined && element.relationType !== null) {
            str.push('"relationType": ' + this.serializeRelationType(element.relationType));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeSubstitution(element: Substitution): string {
        let str: Array<string> = [];
        str.push('"__type": "Substitution"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.relationType !== undefined && element.relationType !== null) {
            str.push('"relationType": ' + this.serializeRelationType(element.relationType));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeUsage(element: Usage): string {
        let str: Array<string> = [];
        str.push('"__type": "Usage"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.source !== undefined && element.source !== null) {
            str.push(
                '"source": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.source.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.target !== undefined && element.target !== null) {
            str.push(
                '"target": ' +
                    '{' +
                    ' "__type": "Reference", "__refType": "Entity", "__value": "' +
                    (element.target.ref?.__id ?? 'undefined') +
                    '"}'
            );
        }
        if (element.relationType !== undefined && element.relationType !== null) {
            str.push('"relationType": ' + this.serializeRelationType(element.relationType));
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeStateMachineDiagram(element: StateMachineDiagram): string {
        let str: Array<string> = [];
        str.push('"__type": "StateMachineDiagram"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.diagramType !== undefined && element.diagramType !== null) {
            str.push('"diagramType": ' + '"' + element.diagramType + '"');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializePackageDiagram(element: PackageDiagram): string {
        let str: Array<string> = [];
        str.push('"__type": "PackageDiagram"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.diagramType !== undefined && element.diagramType !== null) {
            str.push('"diagramType": ' + '"' + element.diagramType + '"');
        }
        if (element.entities !== undefined && element.entities !== null) {
            str.push('"entities": [' + element.entities.map(property => this.serializeEntity(property)).join(',') + ']');
        }
        if (element.relations !== undefined && element.relations !== null) {
            str.push('"relations": [' + element.relations.map(property => this.serializeRelation(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializePackage(element: Package): string {
        let str: Array<string> = [];
        str.push('"__type": "Package"');
        if (element.__id !== undefined && element.__id !== null) {
            str.push('"__id": ' + '"' + element.__id + '"');
        }
        if (element.name !== undefined && element.name !== null) {
            str.push('"name": ' + '"' + element.name + '"');
        }
        if (element.uri !== undefined && element.uri !== null) {
            str.push('"uri": ' + '"' + element.uri + '"');
        }
        if (element.visibility !== undefined && element.visibility !== null) {
            str.push('"visibility": ' + this.serializeVisibility(element.visibility));
        }
        if (element.entities !== undefined && element.entities !== null) {
            str.push('"entities": [' + element.entities.map(property => this.serializeEntity(property)).join(',') + ']');
        }
        return '{' + str.join(',\n') + '}';
    }

    serializeDataTypeReference(element: DataTypeReference): string {
        if (isDataType(element)) {
            return this.serializeDataType(element);
        }
        if (isEnumeration(element)) {
            return this.serializeEnumeration(element);
        }
        if (isClass(element)) {
            return this.serializeClass(element);
        }
        if (isInterface(element)) {
            return this.serializeInterface(element);
        }
        if (isPrimitiveType(element)) {
            return this.serializePrimitiveType(element);
        }
    }

    serializeSlotDefiningFeature(element: SlotDefiningFeature): string {
        if (isProperty(element)) {
            return this.serializeProperty(element);
        }
        if (isClass(element)) {
            return this.serializeClass(element);
        }
        if (isInterface(element)) {
            return this.serializeInterface(element);
        }
    }

    serializeAggregationType(element: AggregationType): string {
        return '"' + element + '"';
    }

    serializeParameterDirection(element: ParameterDirection): string {
        return '"' + element + '"';
    }

    serializeEffectType(element: EffectType): string {
        return '"' + element + '"';
    }

    serializeConcurrency(element: Concurrency): string {
        return '"' + element + '"';
    }

    serializeRelationType(element: RelationType): string {
        return '"' + element + '"';
    }

    serializeVisibility(element: Visibility): string {
        return '"' + element + '"';
    }

    serializeElementWithSizeAndPosition(element: ElementWithSizeAndPosition): string {
        if (isEntity(element)) {
            return this.serializeEntity(element);
        }
    }

    serializeEntity(element: Entity): string {
        if (isEnumeration(element)) {
            return this.serializeEnumeration(element);
        }
        if (isClass(element)) {
            return this.serializeClass(element);
        }
        if (isInterface(element)) {
            return this.serializeInterface(element);
        }
        if (isDataType(element)) {
            return this.serializeDataType(element);
        }
        if (isPrimitiveType(element)) {
            return this.serializePrimitiveType(element);
        }
        if (isInstanceSpecification(element)) {
            return this.serializeInstanceSpecification(element);
        }
        if (isPackage(element)) {
            return this.serializePackage(element);
        }
    }

    serializeMetaInfo(element: MetaInfo): string {
        if (isSize(element)) {
            return this.serializeSize(element);
        }
        if (isPosition(element)) {
            return this.serializePosition(element);
        }
    }

    serializeUnionType_0(element: UnionType_0): string {
        if (isClassDiagram(element)) {
            return this.serializeClassDiagram(element);
        }
        if (isStateMachineDiagram(element)) {
            return this.serializeStateMachineDiagram(element);
        }
        if (isPackageDiagram(element)) {
            return this.serializePackageDiagram(element);
        }
    }

    public asDiagram(root: Diagram): string {
        return '';
    }
}
