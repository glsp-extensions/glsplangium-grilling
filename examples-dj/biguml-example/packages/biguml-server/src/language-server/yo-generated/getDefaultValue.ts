// THIS FILE IS GENERATED — DO NOT EDIT

interface DefaultMappingEntry {
  property: string;
  propertyType: string;
  defaultValue?: any;
}

const defaultMapping: Record<string, DefaultMappingEntry[]> = {
  "Diagram": [
    {
      "property": "diagram",
      "propertyType": "UnionType_0"
    },
    {
      "property": "metaInfos",
      "propertyType": "MetaInfo"
    }
  ],
  "ElementWithSizeAndPosition": [],
  "Entity": [],
  "MetaInfo": [],
  "Size": [
    {
      "property": "height",
      "propertyType": "number"
    },
    {
      "property": "width",
      "propertyType": "number"
    },
    {
      "property": "element",
      "propertyType": "ElementWithSizeAndPosition"
    }
  ],
  "Position": [
    {
      "property": "x",
      "propertyType": "number"
    },
    {
      "property": "y",
      "propertyType": "number"
    },
    {
      "property": "element",
      "propertyType": "ElementWithSizeAndPosition"
    }
  ],
  "TestElementKarol": [
    {
      "property": "name",
      "propertyType": "string",
      "defaultValue": "defaultName"
    },
    {
      "property": "description",
      "propertyType": "string"
    }
  ],
  "ClassDiagram": [
    {
      "property": "diagramType",
      "propertyType": "\"\\\"CLASS\\\"\""
    },
    {
      "property": "entities",
      "propertyType": "Entity"
    },
    {
      "property": "relations",
      "propertyType": "Relation"
    }
  ],
  "Enumeration": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "values",
      "propertyType": "EnumerationLiteral"
    }
  ],
  "EnumerationLiteral": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "value",
      "propertyType": "string"
    },
    {
      "property": "visibility",
      "propertyType": "Visibility"
    }
  ],
  "Class": [
    {
      "property": "name",
      "propertyType": "string",
      "defaultValue": "Karol"
    },
    {
      "property": "isAbstract",
      "propertyType": "boolean",
      "defaultValue": false
    },
    {
      "property": "properties",
      "propertyType": "Property"
    },
    {
      "property": "operations",
      "propertyType": "Operation"
    },
    {
      "property": "isActive",
      "propertyType": "boolean"
    },
    {
      "property": "visibility",
      "propertyType": "Visibility",
      "defaultValue": "PUBLIC"
    }
  ],
  "AbstractClass": [
    {
      "property": "isAbstract",
      "propertyType": "boolean",
      "defaultValue": true
    },
    {
      "property": "visibility",
      "propertyType": "Visibility",
      "defaultValue": "PUBLIC"
    },
    {
      "property": "name",
      "propertyType": "string",
      "defaultValue": "Karol"
    },
    {
      "property": "properties",
      "propertyType": "Property"
    },
    {
      "property": "operations",
      "propertyType": "Operation"
    },
    {
      "property": "isActive",
      "propertyType": "boolean"
    }
  ],
  "Interface": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "properties",
      "propertyType": "Property"
    },
    {
      "property": "operations",
      "propertyType": "Operation"
    }
  ],
  "Property": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "isDerived",
      "propertyType": "boolean"
    },
    {
      "property": "isOrdered",
      "propertyType": "boolean"
    },
    {
      "property": "isStatic",
      "propertyType": "boolean"
    },
    {
      "property": "isDerivedUnion",
      "propertyType": "boolean"
    },
    {
      "property": "isReadOnly",
      "propertyType": "boolean"
    },
    {
      "property": "isUnique",
      "propertyType": "boolean"
    },
    {
      "property": "visibility",
      "propertyType": "Visibility"
    },
    {
      "property": "multiplicity",
      "propertyType": "string"
    },
    {
      "property": "propertyType",
      "propertyType": "DataTypeReference"
    },
    {
      "property": "aggregation",
      "propertyType": "AggregationType"
    }
  ],
  "Operation": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "isAbstract",
      "propertyType": "boolean"
    },
    {
      "property": "isStatic",
      "propertyType": "boolean"
    },
    {
      "property": "isQuery",
      "propertyType": "boolean"
    },
    {
      "property": "visibility",
      "propertyType": "Visibility"
    },
    {
      "property": "concurrency",
      "propertyType": "Concurrency"
    },
    {
      "property": "parameters",
      "propertyType": "Parameter"
    }
  ],
  "Parameter": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "isException",
      "propertyType": "boolean"
    },
    {
      "property": "isStream",
      "propertyType": "boolean"
    },
    {
      "property": "isOrdered",
      "propertyType": "boolean"
    },
    {
      "property": "isUnique",
      "propertyType": "boolean"
    },
    {
      "property": "direction",
      "propertyType": "ParameterDirection"
    },
    {
      "property": "effect",
      "propertyType": "EffectType"
    },
    {
      "property": "visibility",
      "propertyType": "Visibility"
    },
    {
      "property": "parameterType",
      "propertyType": "DataTypeReference"
    },
    {
      "property": "multiplicity",
      "propertyType": "string"
    }
  ],
  "DataType": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "properties",
      "propertyType": "Property"
    },
    {
      "property": "operations",
      "propertyType": "Operation"
    },
    {
      "property": "isAbstract",
      "propertyType": "boolean"
    },
    {
      "property": "visibility",
      "propertyType": "Visibility"
    }
  ],
  "PrimitiveType": [
    {
      "property": "name",
      "propertyType": "string"
    }
  ],
  "InstanceSpecification": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "visibility",
      "propertyType": "Visibility"
    },
    {
      "property": "slots",
      "propertyType": "Slot"
    }
  ],
  "Slot": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "definingFeature",
      "propertyType": "SlotDefiningFeature"
    },
    {
      "property": "values",
      "propertyType": "LiteralSpecification"
    }
  ],
  "LiteralSpecification": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "value",
      "propertyType": "string"
    }
  ],
  "Relation": [
    {
      "property": "source",
      "propertyType": "Entity"
    },
    {
      "property": "target",
      "propertyType": "Entity"
    },
    {
      "property": "relationType",
      "propertyType": "RelationType"
    }
  ],
  "Abstraction": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "visibility",
      "propertyType": "Visibility"
    },
    {
      "property": "source",
      "propertyType": "Entity"
    },
    {
      "property": "target",
      "propertyType": "Entity"
    },
    {
      "property": "relationType",
      "propertyType": "RelationType"
    }
  ],
  "Dependency": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "visibility",
      "propertyType": "Visibility"
    },
    {
      "property": "source",
      "propertyType": "Entity"
    },
    {
      "property": "target",
      "propertyType": "Entity"
    },
    {
      "property": "relationType",
      "propertyType": "RelationType"
    }
  ],
  "Association": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "sourceMultiplicity",
      "propertyType": "string"
    },
    {
      "property": "targetMultiplicity",
      "propertyType": "string"
    },
    {
      "property": "sourceName",
      "propertyType": "string"
    },
    {
      "property": "targetName",
      "propertyType": "string"
    },
    {
      "property": "sourceAggregation",
      "propertyType": "AggregationType"
    },
    {
      "property": "targetAggregation",
      "propertyType": "AggregationType"
    },
    {
      "property": "visibility",
      "propertyType": "Visibility"
    },
    {
      "property": "source",
      "propertyType": "Entity"
    },
    {
      "property": "target",
      "propertyType": "Entity"
    },
    {
      "property": "relationType",
      "propertyType": "RelationType"
    }
  ],
  "InterfaceRealization": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "visibility",
      "propertyType": "Visibility"
    },
    {
      "property": "source",
      "propertyType": "Entity"
    },
    {
      "property": "target",
      "propertyType": "Entity"
    },
    {
      "property": "relationType",
      "propertyType": "RelationType"
    }
  ],
  "Generalization": [
    {
      "property": "isSubstitutable",
      "propertyType": "boolean"
    },
    {
      "property": "source",
      "propertyType": "Entity"
    },
    {
      "property": "target",
      "propertyType": "Entity"
    },
    {
      "property": "relationType",
      "propertyType": "RelationType"
    }
  ],
  "PackageImport": [
    {
      "property": "visibility",
      "propertyType": "Visibility"
    },
    {
      "property": "source",
      "propertyType": "Entity"
    },
    {
      "property": "target",
      "propertyType": "Entity"
    },
    {
      "property": "relationType",
      "propertyType": "RelationType"
    }
  ],
  "PackageMerge": [
    {
      "property": "source",
      "propertyType": "Entity"
    },
    {
      "property": "target",
      "propertyType": "Entity"
    },
    {
      "property": "relationType",
      "propertyType": "RelationType"
    }
  ],
  "Realization": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "visibility",
      "propertyType": "Visibility"
    },
    {
      "property": "source",
      "propertyType": "Entity"
    },
    {
      "property": "target",
      "propertyType": "Entity"
    },
    {
      "property": "relationType",
      "propertyType": "RelationType"
    }
  ],
  "Substitution": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "visibility",
      "propertyType": "Visibility"
    },
    {
      "property": "source",
      "propertyType": "Entity"
    },
    {
      "property": "target",
      "propertyType": "Entity"
    },
    {
      "property": "relationType",
      "propertyType": "RelationType"
    }
  ],
  "Usage": [
    {
      "property": "name",
      "propertyType": "string"
    },
    {
      "property": "visibility",
      "propertyType": "Visibility"
    },
    {
      "property": "source",
      "propertyType": "Entity"
    },
    {
      "property": "target",
      "propertyType": "Entity"
    },
    {
      "property": "relationType",
      "propertyType": "RelationType"
    }
  ],
  "StateMachineDiagram": [
    {
      "property": "diagramType",
      "propertyType": "\"\\\"STATE_MACHINE\\\"\""
    }
  ],
  "PackageDiagram": [
    {
      "property": "diagramType",
      "propertyType": "\"\\\"PACKAGE\\\"\""
    },
    {
      "property": "entities",
      "propertyType": "Entity"
    },
    {
      "property": "relations",
      "propertyType": "Relation"
    }
  ],
  "Package": [
    {
      "property": "name",
      "propertyType": "string",
      "defaultValue": "Hello"
    },
    {
      "property": "uri",
      "propertyType": "string"
    },
    {
      "property": "visibility",
      "propertyType": "Visibility"
    },
    {
      "property": "test",
      "propertyType": "test"
    },
    {
      "property": "entities",
      "propertyType": "Entity"
    }
  ],
  "test": [
    {
      "property": "name",
      "propertyType": "string"
    }
  ]
};

/**
 * Return all properties for a given type,
 * filling in primitive defaults when none explicit.
 */
export function getProperties(
  elementTypeId: string
): DefaultMappingEntry[] {
  const parentType = stripPrefix(elementTypeId);
  const entries = defaultMapping[parentType] || [];
  return entries.map(e => {
    if (e.defaultValue !== undefined) {
      return e;
    }
    switch (e.propertyType) {
      case 'string':  return { ...e, defaultValue: '' };
      case 'boolean': return { ...e, defaultValue: false };
      case 'number':  return { ...e, defaultValue: 0 };
      default:        return { ...e, defaultValue: [] };
    }
  });
}

function stripPrefix(name: string): string {
  return name.replace(/^.*?__/, '');
}
