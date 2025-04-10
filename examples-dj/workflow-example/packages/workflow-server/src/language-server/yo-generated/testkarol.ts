[
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
            "typeName": "\"\\\"decision\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"fork\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"join\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"merge\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "NodeType"
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
            "typeName": "\"\\\"manual\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"automated\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "TaskType"
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
            "typeName": "\"\\\"low\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"medium\\\"\""
          },
          {
            "type": "constant",
            "typeName": "\"\\\"high\\\"\""
          }
        ],
        "multiplicity": "1"
      }
    ],
    "extends": [],
    "name": "Weight"
  },
  {
    "type": "class",
    "isAbstract": false,
    "decorators": [
      "root"
    ],
    "properties": [
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Node"
          }
        ],
        "multiplicity": "*",
        "name": "nodes"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "Edge"
          }
        ],
        "multiplicity": "*",
        "name": "edges"
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
    "name": "Model"
  },
  {
    "type": "class",
    "isAbstract": true,
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
    "extends": [],
    "name": "Node"
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
        "name": "label"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "simple",
            "typeName": "number"
          }
        ],
        "multiplicity": "1",
        "name": "duration"
      },
      {
        "decorators": [],
        "isOptional": true,
        "types": [
          {
            "type": "complex",
            "typeName": "TaskType"
          }
        ],
        "multiplicity": "1",
        "name": "taskType"
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
        "name": "reference"
      }
    ],
    "extends": [
      "Node"
    ],
    "name": "TaskNode"
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
            "typeName": "Model"
          }
        ],
        "multiplicity": "1",
        "name": "children"
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
        "name": "label"
      }
    ],
    "extends": [
      "Node"
    ],
    "name": "Category"
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
            "typeName": "NodeType"
          }
        ],
        "multiplicity": "1",
        "name": "nodeType"
      }
    ],
    "extends": [
      "Node"
    ],
    "name": "ActivityNode"
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
            "typeName": "Node"
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
            "typeName": "Node"
          }
        ],
        "multiplicity": "1",
        "name": "target"
      }
    ],
    "extends": [],
    "name": "Edge"
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
            "type": "complex",
            "typeName": "Weight"
          }
        ],
        "multiplicity": "1",
        "name": "weight"
      }
    ],
    "extends": [
      "Edge"
    ],
    "name": "WeightedEdge"
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
            "typeName": "Node"
          }
        ],
        "multiplicity": "1",
        "name": "node"
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
  }
]