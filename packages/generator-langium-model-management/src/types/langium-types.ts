import { Multiplicity } from "./multiplicity";
import { Type } from "./types";

export interface LangiumGrammar {
  entryRule: EntryRule;
  typeRules: Array<TypeRule>;
  parserRules: Array<ParserRule>;
}
export interface EntryRule {
  name: string;
  definitions: Array<Definition>;
}
export interface TypeRule {
  name: string;
  definitions: Array<Type>;
}
export interface ParserRule {
  name: string;
  isAbstract: boolean;
  extendedBy: string[];
  definitions: Array<Definition>;
}
export interface Definition {
  name: string;
  types?: Type[];
  type?: Type;
  multiplicity: Multiplicity;
  crossReference: boolean;
  optional: boolean;
}
