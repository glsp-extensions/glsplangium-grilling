import {
  Declaration,
  Definition,
  EntryRule,
  LangiumDeclaration,
  LangiumGrammar,
  Multiplicity,
  TypeRule,
} from "./types";

export function transformDeclaration(
  declarations: Array<Declaration>
): Array<LangiumDeclaration> {
  // map all declarations to langium declarations
  // if a declaration extends another declaration, add the properties of the extended declaration to the extending declaration
  const langiumDeclarations: Array<LangiumDeclaration> = declarations.map(
    (declaration) => {
      if (declaration?.extends.length > 0) {
        declaration.extends.forEach((extend) => {
          declaration.properties = declaration.properties.concat(
            declarations.find((d) => d.name === extend)?.properties || []
          );
        });
      }
      return {
        type: declaration.type,
        name: declaration.name,
        isAbstract: declaration.isAbstract,
        decorators: declaration.decorators,
        properties: declaration.properties,
        extendedBy: [],
      };
    }
  );
  // add the extendedBy property to the langium declarations
  // this is necessary to know which declarations extend which other declarations
  declarations.forEach((declaration) => {
    if (declaration.extends?.length > 0) {
      declaration.extends.forEach((extend) => {
        langiumDeclarations
          .find((langiumDeclaration) => langiumDeclaration.name === extend)
          ?.extendedBy.push(declaration.name);
      });
    }
  });
  // if a declaration is abstract, remove all properties
  langiumDeclarations.forEach((langiumDeclaration) => {
    if (langiumDeclaration.isAbstract && langiumDeclaration.type === "class") {
      langiumDeclaration.properties = [];
    }
  });

  return langiumDeclarations;
}

export function transformLangiumDeclarationToEntryRule(
  langiumDeclaration: LangiumDeclaration
): EntryRule {
  return {
    name: langiumDeclaration.name,
    definitions: langiumDeclaration.properties.map((property) => ({
      name: property.name,
      types: property.types,
      multiplicity: property.multiplicity,
      crossReference: property.decorators.includes("crossReference"),
      optional: property.isOptional,
    })),
  };
}

type _Type = "simple" | "constant" | "complex";

function getTypeName(type) {
  return type.typeName;
}
function getSortedTypeNames(definitions) {
  return definitions.map(getTypeName).sort().join(",");
}
function typeRuleExists(typeRules: Array<TypeRule>, propertyTypes) {
  const propertyTypesStr = propertyTypes.map(getTypeName).sort().join(",");
  return Array.from(typeRules).some(
    (typeRule) => getSortedTypeNames(typeRule.definitions) === propertyTypesStr
  );
}

export function transformLangiumDeclarationsToTypeRules(
  langiumDeclarations: Array<LangiumDeclaration>
): Array<TypeRule> {
  const typeRules: Array<TypeRule> = langiumDeclarations
    .filter((declaration) => declaration.type === "type")
    .map((declaration) => ({
      name: declaration.name,
      definitions:
        declaration.properties.map((property) => property.types)?.flat() ?? [],
    }))
    .concat(
      langiumDeclarations
        .filter(
          (declaration) =>
            declaration.isAbstract && declaration.type === "class"
        )
        .map((declaration) => ({
          name: declaration.name,
          definitions: declaration.extendedBy.map((extendedBy) => ({
            typeName: extendedBy,
            type: "simple",
          })),
        }))
    );
  const typeRules3 = [];
  let unionId = 0;
  langiumDeclarations
    .filter(
      (declaration) => declaration.type === "class" && !declaration.isAbstract
    )
    .forEach((declaration) => {
      declaration.properties.forEach((property) => {
        if (property.types.length > 1) {
          if (
            !typeRuleExists(typeRules, property.types) &&
            !typeRuleExists(typeRules3, property.types)
          ) {
            typeRules3.push({
              name: `UnionType_${unionId++}`,
              definitions: property.types.map((type) => ({
                typeName: type.typeName,
                type: type.type,
              })),
            });
            property.types = [
              { typeName: `UnionType_${unionId - 1}`, type: "simple" },
            ];
          }
        }
      });
    });
  return [...typeRules, ...typeRules3];
}

export function transformLangiumDeclarationsToLangiumGrammar(
  langiumDeclarations: Array<LangiumDeclaration>,
  generatorConfig: any
): LangiumGrammar {
  const entryRule = transformLangiumDeclarationToEntryRule(
    langiumDeclarations.find((langiumDeclaration) =>
      langiumDeclaration.decorators.includes("root")
    )
  );
  const typeRules =
    transformLangiumDeclarationsToTypeRules(langiumDeclarations);
  const parserRules = langiumDeclarations
    .filter(
      (langiumDeclaration) =>
        langiumDeclaration.type === "class" &&
        !langiumDeclaration.isAbstract &&
        !langiumDeclaration.decorators.includes("root")
    )
    .map((langiumDeclaration) => {
      const properties: Array<Definition> = langiumDeclaration.properties.map(
        (property) => ({
          name: property.name,
          type: property.types[0],
          multiplicity: property.multiplicity,
          crossReference: property.decorators.includes("crossReference"),
          optional: property.isOptional,
        })
      );
      if (
        !properties.find(
          (property) => property.name === generatorConfig.referenceProperty
        )
      ) {
        properties.unshift({
          name: generatorConfig.referenceProperty,
          type: { typeName: "string", type: "simple" },
          multiplicity: Multiplicity.ONE_TO_ONE,
          crossReference: false,
          optional: false,
        });
      }
      return {
        name: langiumDeclaration.name,
        isAbstract: langiumDeclaration.isAbstract,
        extendedBy: langiumDeclaration.extendedBy,
        definitions: properties,
      };
    });
  entryRule.definitions.forEach((definition) => {
    if (definition.types.length > 1) {
      const unionType = typeRules.find(
        (typeRule) =>
          typeRule.definitions
            .map((type) => type.typeName)
            .sort()
            .join(",") ===
          definition.types
            .map((type) => type.typeName)
            .sort()
            .join(",")
      );
      if (unionType) {
        definition.type = { typeName: unionType.name, type: "simple" };
      }
    } else {
      definition.type = definition.types[0];
    }
  });

  return { entryRule, typeRules, parserRules };
}
