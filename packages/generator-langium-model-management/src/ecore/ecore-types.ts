export interface EcoreDefinition {
  classes: EcoreClass[];
  dataTypes: string[];
  types: EcoreType[];
}
export interface EcoreClass {
  attributes: EcoreAttribute[];
  extends: string[];
  instanceClassName?: string;
  instanceTypeName?: string;
  isAbstract: boolean;
  isInterface: boolean;
  isRoot: boolean;
  name: string;
}
export interface EcoreAttribute {
  changeable?: boolean;
  containment?: boolean;
  defaultValueLiteral?: string;
  derived: boolean;
  ID?: string;
  lowerBound: string;
  multiplicity: string;
  name: string;
  ordered?: boolean;
  reference: boolean;
  transient: boolean;
  type: string;
  unique?: boolean;
  unsettable: boolean;
  upperBound: string;
  volatile: boolean;
}
export interface EcoreType {
  name: string;
  types: string[];
}
