import { LangiumGrammar } from "./types";
import { Type } from "./types/types";

export function getReturnTypeFromDefinitions(definitions: Array<Type>) {
  if (definitions.every((definition) => definition.type === "simple")) {
    if (definitions.every((definition) => definition.typeName === "number")) {
      return "number";
    } else if (
      definitions.every((definition) => definition.typeName === "boolean")
    ) {
      return "boolean";
    }
  } else if (
    definitions.every((definition) => definition.type === "constant")
  ) {
    let type = "string";
    if (
      definitions.every(
        (definition) => typeof JSON.parse(definition.typeName) === "number"
      )
    ) {
      type = "number";
    } else if (
      definitions.every(
        (definition) => typeof JSON.parse(definition.typeName) === "boolean"
      )
    ) {
      type = "boolean";
    }
    return type;
  }
}

export function isString(langiumGrammar: LangiumGrammar, _type: Type) {
  if (_type.typeName === "string") return true;
  const typeRule = langiumGrammar.typeRules.find(
    (ruleElement) => ruleElement.name === _type.typeName
  );
  if (typeRule) {
    return getReturnTypeFromDefinitions(typeRule.definitions) === "string";
  }
}
