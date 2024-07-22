import { Multiplicity } from "./multiplicity";
import { Type } from "./types";

export interface Property {
  name: string;
  isOptional: boolean;
  decorators: string[];
  types: Type[];
  multiplicity: Multiplicity;
}
