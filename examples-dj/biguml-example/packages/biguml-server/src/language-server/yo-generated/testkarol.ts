[
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "root"
    ],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "complex",
            "typeName": "ClassDiagram"
          },
          {
            "type": "complex",
            "typeName": "StateMachineDiagram"
          },
          {
            "type": "complex",
            "typeName": "PackageDiagram"
          }
        ],
        "multiplicity": "1",
        "name": "diagram"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "MetaInfo"
          }
        ],
        "multiplicity": "*",
        "name": "metaInfos"
      }
    ],
    "extends": [],
    "name": "Diagram"
  },
  {
    "type": "class",
    "isAbstract": true,
    "decorators": [],
    "properties": [],
    "extends": [],
    "name": "ElementWithSizeAndPosition"
  },
  {
    "type": "class",
    "isAbstract": true,
    "decorators": [],
    "properties": [],
    "extends": [
      "ElementWithSizeAndPosition"
    ],
    "name": "Entity"
  },
  {
    "type": "class",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [
          "crossReference"
        ],
        "isOptional": false,
        "types": [
          {
            "type": "complex",
            "typeName": "ElementWithSizeAndPosition"
          }
        ],
        "multiplicity": "1",
        "name": "element"
      }
    ],
    "extends": [],
    "name": "MetaInfo"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "number"
          }
        ],
        "multiplicity": "1",
        "name": "height"
      },
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "number"
          }
        ],
        "multiplicity": "1",
        "name": "width"
      }
    ],
    "extends": [
      "MetaInfo"
    ],
    "name": "Size"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "number"
          }
        ],
        "multiplicity": "1",
        "name": "x"
      },
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "number"
          }
        ],
        "multiplicity": "1",
        "name": "y"
      }
    ],
    "extends": [
      "MetaInfo"
    ],
    "name": "Position"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "description"
      }
    ],
    "extends": [],
    "name": "TestElementKarol"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"CLASS\\\"\""
          }
        ],
        "multiplicity": "1",
        "name": "diagramType"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Entity"
          }
        ],
        "multiplicity": "*",
        "name": "entities"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Relation"
          }
        ],
        "multiplicity": "*",
        "name": "relations"
      }
    ],
    "extends": [],
    "name": "ClassDiagram"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "EnumerationLiteral"
          }
        ],
        "multiplicity": "*",
        "name": "values"
      }
    ],
    "extends": [
      "Entity"
    ],
    "name": "Enumeration"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "value"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      }
    ],
    "extends": [],
    "name": "EnumerationLiteral"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [
          "defaultValue:Hello world"
        ],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isAbstract"
      },
      {
        "decorators": [
          "path"
        ],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Property"
          }
        ],
        "multiplicity": "*",
        "name": "properties"
      },
      {
        "decorators": [
          "path"
        ],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Operation"
          }
        ],
        "multiplicity": "*",
        "name": "operations"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isActive"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      }
    ],
    "extends": [
      "Entity"
    ],
    "name": "Class"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [
          "path"
        ],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Property"
          }
        ],
        "multiplicity": "*",
        "name": "properties"
      },
      {
        "decorators": [
          "path"
        ],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Operation"
          }
        ],
        "multiplicity": "*",
        "name": "operations"
      }
    ],
    "extends": [
      "Entity"
    ],
    "name": "Interface"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isDerived"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isOrdered"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isStatic"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isDerivedUnion"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isReadOnly"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isUnique"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "multiplicity"
      },
      {
        "decorators": [
          "crossReference"
        ],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "DataTypeReference"
          }
        ],
        "multiplicity": "1",
        "name": "propertyType"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "AggregationType"
          }
        ],
        "multiplicity": "1",
        "name": "aggregation"
      }
    ],
    "extends": [],
    "name": "Property"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isAbstract"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isStatic"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isQuery"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Concurrency"
          }
        ],
        "multiplicity": "1",
        "name": "concurrency"
      },
      {
        "decorators": [
          "path"
        ],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Parameter"
          }
        ],
        "multiplicity": "*",
        "name": "parameters"
      }
    ],
    "extends": [],
    "name": "Operation"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isException"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isStream"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isOrdered"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isUnique"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "ParameterDirection"
          }
        ],
        "multiplicity": "1",
        "name": "direction"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "EffectType"
          }
        ],
        "multiplicity": "1",
        "name": "effect"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      },
      {
        "decorators": [
          "crossReference"
        ],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "DataTypeReference"
          }
        ],
        "multiplicity": "1",
        "name": "parameterType"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "multiplicity"
      }
    ],
    "extends": [],
    "name": "Parameter"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "DataType"
          },
          {
            "type": "complex",
            "typeName": "Enumeration"
          },
          {
            "type": "complex",
            "typeName": "Class"
          },
          {
            "type": "complex",
            "typeName": "Interface"
          },
          {
            "type": "complex",
            "typeName": "PrimitiveType"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "DataTypeReference"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [
          "path"
        ],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Property"
          }
        ],
        "multiplicity": "*",
        "name": "properties"
      },
      {
        "decorators": [
          "path"
        ],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Operation"
          }
        ],
        "multiplicity": "*",
        "name": "operations"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isAbstract"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      }
    ],
    "extends": [
      "Entity"
    ],
    "name": "DataType"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      }
    ],
    "extends": [
      "Entity"
    ],
    "name": "PrimitiveType"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      },
      {
        "decorators": [
          "path"
        ],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Slot"
          }
        ],
        "multiplicity": "*",
        "name": "slots"
      }
    ],
    "extends": [
      "Entity"
    ],
    "name": "InstanceSpecification"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [
          "crossReference"
        ],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "SlotDefiningFeature"
          }
        ],
        "multiplicity": "1",
        "name": "definingFeature"
      },
      {
        "decorators": [
          "path"
        ],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "LiteralSpecification"
          }
        ],
        "multiplicity": "*",
        "name": "values"
      }
    ],
    "extends": [],
    "name": "Slot"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Property"
          },
          {
            "type": "complex",
            "typeName": "Class"
          },
          {
            "type": "complex",
            "typeName": "Interface"
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "SlotDefiningFeature"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "value"
      }
    ],
    "extends": [],
    "name": "LiteralSpecification"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [
          "crossReference"
        ],
        "isOptional": false,
        "types": [
          {
            "type": "complex",
            "typeName": "Entity"
          }
        ],
        "multiplicity": "1",
        "name": "source"
      },
      {
        "decorators": [
          "crossReference"
        ],
        "isOptional": false,
        "types": [
          {
            "type": "complex",
            "typeName": "Entity"
          }
        ],
        "multiplicity": "1",
        "name": "target"
      },
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "complex",
            "typeName": "RelationType"
          }
        ],
        "multiplicity": "1",
        "name": "relationType"
      }
    ],
    "extends": [],
    "name": "Relation"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Abstraction"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Dependency"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "sourceMultiplicity"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "targetMultiplicity"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "sourceName"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "targetName"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "AggregationType"
          }
        ],
        "multiplicity": "1",
        "name": "sourceAggregation"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "AggregationType"
          }
        ],
        "multiplicity": "1",
        "name": "targetAggregation"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Association"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "InterfaceRealization"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "boolean"
          }
        ],
        "multiplicity": "1",
        "name": "isSubstitutable"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Generalization"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "PackageImport"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [],
    "extends": [
      "Relation"
    ],
    "name": "PackageMerge"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Realization"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Substitution"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      }
    ],
    "extends": [
      "Relation"
    ],
    "name": "Usage"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"STATE_MACHINE\\\"\""
          }
        ],
        "multiplicity": "1",
        "name": "diagramType"
      }
    ],
    "extends": [],
    "name": "StateMachineDiagram"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"PACKAGE\\\"\""
          }
        ],
        "multiplicity": "1",
        "name": "diagramType"
      },
      {
        "decorators": [
          "path"
        ],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Entity"
          }
        ],
        "multiplicity": "*",
        "name": "entities"
      },
      {
        "decorators": [
          "path"
        ],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Relation"
          }
        ],
        "multiplicity": "*",
        "name": "relations"
      }
    ],
    "extends": [],
    "name": "PackageDiagram"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": false,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "name"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "string"
          }
        ],
        "multiplicity": "1",
        "name": "uri"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Visibility"
          }
        ],
        "multiplicity": "1",
        "name": "visibility"
      },
      {
        "decorators": [
          "path"
        ],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Entity"
          }
        ],
        "multiplicity": "*",
        "name": "entities"
      }
    ],
    "extends": [
      "Entity"
    ],
    "name": "Package"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"NONE\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"SHARED\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"COMPOSITE\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "AggregationType"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"IN\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"OUT\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"INOUT\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"RETURN\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "ParameterDirection"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"CREATE\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"READ\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"UPDATE\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"DELETE\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "EffectType"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"SEQUENTIAL\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"GUARDED\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"CONCURRENT\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "Concurrency"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"ABSTRACTION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"AGGREGATION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"ASSOCIATION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"COMPOSITION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"DEPENDENCY\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"GENERALIZATION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"INTERFACE_REALIZATION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"PACKAGE_IMPORT\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"ELEMENT_IMPORT\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"PACKAGE_MERGE\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"REALIZATION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"SUBSTITUTION\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"USAGE\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "RelationType"
  },
  {
    "type": "type",
    "isAbstract": true,
    "decorators": [],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "constant",
            "typeName": "\"\\\"PUBLIC\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"PRIVATE\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"PROTECTED\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"PACKAGE\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "Visibility"
  }
]