
// THIS FILE IS GENERATED - TEST

  const mapping: Record<string, Array<{ property: string; allowedChildTypes?: string[] }>> = {
  "Class": [
    {
      "property": "properties",
      "allowedChildTypes": [
        "Property"
      ]
    },
    {
      "property": "operations",
      "allowedChildTypes": [
        "Operation"
      ]
    }
  ],
  "Interface": [
    {
      "property": "properties",
      "allowedChildTypes": [
        "Property"
      ]
    },
    {
      "property": "operations",
      "allowedChildTypes": [
        "Operation"
      ]
    }
  ],
  "Operation": [
    {
      "property": "parameters",
      "allowedChildTypes": [
        "Parameter"
      ]
    }
  ],
  "DataType": [
    {
      "property": "properties",
      "allowedChildTypes": [
        "Property"
      ]
    },
    {
      "property": "operations",
      "allowedChildTypes": [
        "Operation"
      ]
    }
  ],
  "InstanceSpecification": [
    {
      "property": "slots",
      "allowedChildTypes": [
        "Slot"
      ]
    }
  ],
  "Slot": [
    {
      "property": "values",
      "allowedChildTypes": [
        "LiteralSpecification"
      ]
    }
  ],
  "PackageDiagram": [
    {
      "property": "entities",
      "allowedChildTypes": [
        "Enumeration",
        "Class",
        "Interface",
        "DataType",
        "PrimitiveType",
        "InstanceSpecification",
        "Package"
      ]
    },
    {
      "property": "relations",
      "allowedChildTypes": [
        "Abstraction",
        "Dependency",
        "Association",
        "InterfaceRealization",
        "Generalization",
        "PackageImport",
        "PackageMerge",
        "Realization",
        "Substitution",
        "Usage"
      ]
    }
  ],
  "Package": [
    {
      "property": "entities",
      "allowedChildTypes": [
        "Enumeration",
        "Class",
        "Interface",
        "DataType",
        "PrimitiveType",
        "InstanceSpecification",
        "Package"
      ]
    }
  ]
};
  
  export function getCreationPath(parentType: string, childType: string): string {
    if (mapping[parentType]) {
      for (const entry of mapping[parentType]) {
        if (entry.allowedChildTypes && entry.allowedChildTypes.includes(childType)) {
          return entry.property;
        }
      }
    }
    return "";
  }
  