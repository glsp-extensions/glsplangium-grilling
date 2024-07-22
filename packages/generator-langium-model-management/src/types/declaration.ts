import { Property } from "./property";

export interface Declaration {
  type: "class" | "type";
  name?: string;
  isAbstract?: boolean;
  decorators?: string[];
  properties?: Array<Property>;
  extends?: string[];
}

export interface LangiumDeclaration {
  type: "class" | "type";
  name?: string;
  isAbstract?: boolean;
  decorators?: string[];
  properties?: Array<Property>;
  extendedBy?: string[];
}
