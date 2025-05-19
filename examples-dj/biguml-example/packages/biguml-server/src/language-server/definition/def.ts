/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
  astType,
  crossReference,
  noBounds,
  path,
  root,
  withDefaults,
} from "generator-langium-model-management";

/**
 * This file has been generated using the langium-model-management generator
 */
@root
class Diagram {
  diagram: ClassDiagram | StateMachineDiagram | PackageDiagram;
  metaInfos?: Array<MetaInfo>;
}

/**
 * META_INFO
 */
abstract class ElementWithSizeAndPosition {}
abstract class Entity extends ElementWithSizeAndPosition {}

abstract class MetaInfo {
  @crossReference element: ElementWithSizeAndPosition;
}
class Size extends MetaInfo {
  height: number;
  width: number;
}
class Position extends MetaInfo {
  x: number;
  y: number;
}

/**
 * CLASS_DIAGRAM
 */
@withDefaults
class ClassDiagram {
  diagramType: "CLASS";
  entities?: Array<Entity>;
  relations?: Array<Relation>;
}

@withDefaults
class Enumeration extends Entity {
  name: string;
  @path values?: Array<EnumerationLiteral>;
}

@noBounds
@withDefaults
class EnumerationLiteral {
  name: string;
  value?: string;
  visibility?: Visibility;
}

@withDefaults
export class Class extends Entity {
  name: string;
  isAbstract: boolean = false;
  @path properties?: Array<Property>;
  @path operations?: Array<Operation>;
  isActive?: boolean;
  visibility?: Visibility;
  ///**@minLength(3)**/ test: string = "abc";
  //test: Test = { name: "Karol" };
}

interface Test {
  name: string;
}

@withDefaults
export class AbstractClass extends Class {
  override isAbstract: boolean = true;
  declare visibility?: Visibility;
}

@withDefaults
class Interface extends Entity {
  name: string;
  @path properties?: Array<Property>;
  @path operations?: Array<Operation>;
}

@noBounds
class Property {
  name: string;
  isDerived?: boolean = false;
  isOrdered?: boolean = false;
  isStatic?: boolean = false;
  isDerivedUnion?: boolean = false;
  isReadOnly?: boolean = false;
  isUnique?: boolean = false;
  visibility?: Visibility = "PUBLIC";
  multiplicity?: string;
  @crossReference propertyType?: DataTypeReference;
  aggregation?: AggregationType;
}

@noBounds
@withDefaults
class Operation {
  name: string;
  isAbstract?: boolean;
  isStatic?: boolean;
  isQuery?: boolean;
  visibility?: Visibility;
  concurrency?: Concurrency;
  @path parameters?: Array<Parameter>;
}

@noBounds
@withDefaults
class Parameter {
  name: string;
  isException?: boolean;
  isStream?: boolean;
  isOrdered?: boolean;
  isUnique?: boolean;
  direction?: ParameterDirection;
  effect?: EffectType;
  visibility?: Visibility;
  @crossReference parameterType?: DataTypeReference;
  multiplicity?: string;
}
type DataTypeReference =
  | DataType
  | Enumeration
  | Class
  | Interface
  | PrimitiveType;

@withDefaults
class DataType extends Entity {
  name: string;
  @path properties?: Array<Property>;
  @path operations?: Array<Operation>;
  isAbstract?: boolean;
  visibility?: Visibility;
}
class PrimitiveType extends Entity {
  name: string;
}

@withDefaults
class InstanceSpecification extends Entity {
  name: string;
  visibility?: Visibility;
  @path slots?: Array<Slot>;
}

@noBounds
class Slot {
  name: string;
  @crossReference definingFeature?: SlotDefiningFeature;
  @path values?: Array<LiteralSpecification> = [];
}
type SlotDefiningFeature = Property | Class | Interface;

class LiteralSpecification {
  name: string;
  value: string;
}

class Relation {
  @crossReference source: Entity;
  @crossReference target: Entity;
  relationType: RelationType;
}

@withDefaults
class Abstraction extends Relation {
  name?: string;
  visibility?: Visibility;
}

@withDefaults
class Dependency extends Relation {
  name?: string;
  visibility?: Visibility;
}

@withDefaults
class Association extends Relation {
  name?: string;
  sourceMultiplicity?: string = "*";
  targetMultiplicity?: string = "*";
  sourceName?: string;
  targetName?: string;
  sourceAggregation?: AggregationType = "NONE";
  targetAggregation?: AggregationType = "NONE";
  visibility?: Visibility;
}
/*@ASTType('Association')*/

@withDefaults
@astType("Association")
class Aggregation extends Relation {
  name?: string;
  sourceMultiplicity?: string = "*";
  targetMultiplicity?: string = "*";
  sourceName?: string;
  targetName?: string;
  sourceAggregation?: AggregationType = "SHARED";
  targetAggregation?: AggregationType = "NONE";
  visibility?: Visibility;
}

@withDefaults
@astType("Association")
class Composition extends Relation {
  name?: string;
  sourceMultiplicity?: string = "*";
  targetMultiplicity?: string = "*";
  sourceName?: string;
  targetName?: string;
  sourceAggregation?: AggregationType = "COMPOSITE";
  targetAggregation?: AggregationType = "NONE";
  visibility?: Visibility;
}

@withDefaults
class InterfaceRealization extends Relation {
  name?: string;
  visibility?: Visibility;
}

@withDefaults
class Generalization extends Relation {
  isSubstitutable: boolean;
}

@withDefaults
class PackageImport extends Relation {
  visibility?: Visibility;
}

@withDefaults
class PackageMerge extends Relation {}
class Realization extends Relation {
  name?: string;
  visibility?: Visibility;
}

@withDefaults
class Substitution extends Relation {
  name?: string;
  visibility?: Visibility;
}

@withDefaults
class Usage extends Relation {
  name?: string;
  visibility?: Visibility;
}
/**
 * STATE_MACHINE
 */
class StateMachineDiagram {
  diagramType: "STATE_MACHINE";
}

/**
 * PACKAGE_DIAGRAM
 */
@withDefaults
class PackageDiagram {
  diagramType: "PACKAGE";
  @path entities?: Array<Entity>;
  @path relations?: Array<Relation>;
}

@withDefaults
class Package extends Entity {
  name: string;
  uri?: string;
  visibility?: Visibility;
  @path entities?: Array<Entity>;
}

/**
 * TYPES
 */
type AggregationType = "NONE" | "SHARED" | "COMPOSITE";
type ParameterDirection = "IN" | "OUT" | "INOUT" | "RETURN";
type EffectType = "CREATE" | "READ" | "UPDATE" | "DELETE";

type Concurrency = "SEQUENTIAL" | "GUARDED" | "CONCURRENT";
type RelationType =
  | "ABSTRACTION"
  | "AGGREGATION"
  | "ASSOCIATION"
  | "COMPOSITION"
  | "DEPENDENCY"
  | "GENERALIZATION"
  | "INTERFACE_REALIZATION"
  | "PACKAGE_IMPORT"
  | "ELEMENT_IMPORT"
  | "PACKAGE_MERGE"
  | "REALIZATION"
  | "SUBSTITUTION"
  | "USAGE";
type Visibility = "PUBLIC" | "PRIVATE" | "PROTECTED" | "PACKAGE";
