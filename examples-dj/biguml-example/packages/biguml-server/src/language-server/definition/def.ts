import { crossReference, root } from "generator-langium-model-management";

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
class ClassDiagram {
  diagramType: "CLASS";
  entities?: Array<Entity>;
  relations?: Array<Relation>;
}
class Enumeration extends Entity {
  name: string;
  values?: Array<EnumerationLiteral>;
}
class EnumerationLiteral {
  name: string;
  value?: string;
  visibility?: Visibility;
}
class Class extends Entity {
  name: string;
  isAbstract?: boolean;
  properties?: Array<Property>;
  operations?: Array<Operation>;
  isActive?: boolean;
  visibility?: Visibility;
}
class Interface extends Entity {
  name: string;
  properties?: Array<Property>;
  operations?: Array<Operation>;
}
class Property {
  name: string;
  isDerived?: boolean;
  isOrdered?: boolean;
  isStatic?: boolean;
  isDerivedUnion?: boolean;
  isReadOnly?: boolean;
  isUnique?: boolean;
  visibility?: Visibility;
  multiplicity?: string;
  @crossReference propertyType?: DataTypeReference;
  aggregation?: AggregationType;
}
class Operation {
  name: string;
  isAbstract?: boolean;
  isStatic?: boolean;
  isQuery?: boolean;
  visibility?: Visibility;
  concurrency?: Concurrency;
  parameters?: Array<Parameter>;
}
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
class DataType extends Entity {
  name: string;
  properties?: Array<Property>;
  operations?: Array<Operation>;
  isAbstract?: boolean;
  visibility?: Visibility;
}
class PrimitiveType extends Entity {
  name: string;
}
class InstanceSpecification extends Entity {
  name: string;
  visibility?: Visibility;
  slots?: Array<Slot>;
}
class Slot {
  name: string;
  @crossReference definingFeature?: SlotDefiningFeature;
  values?: Array<LiteralSpecification>;
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
class Abstraction extends Relation {
  name?: string;
  visibility?: Visibility;
}
class Dependency extends Relation {
  name?: string;
  visibility?: Visibility;
}
class Association extends Relation {
  name?: string;
  sourceMultiplicity?: string;
  targetMultiplicity?: string;
  sourceName?: string;
  targetName?: string;
  sourceAggregation?: AggregationType;
  targetAggregation?: AggregationType;
  visibility?: Visibility;
}
class InterfaceRealization extends Relation {
  name?: string;
  visibility?: Visibility;
}
class Generalization extends Relation {
  isSubstitutable: boolean;
}
class PackageImport extends Relation {
  visibility?: Visibility;
}
class PackageMerge extends Relation {}
class Realization extends Relation {
  name?: string;
  visibility?: Visibility;
}
class Substitution extends Relation {
  name?: string;
  visibility?: Visibility;
}
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
class PackageDiagram {
  diagramType: "PACKAGE";
  entities?: Array<Entity>;
  relations?: Array<Relation>;
}

class Package extends Entity {
  name: string;
  uri?: string;
  visibility?: Visibility;
  entities?: Array<Entity>;
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
