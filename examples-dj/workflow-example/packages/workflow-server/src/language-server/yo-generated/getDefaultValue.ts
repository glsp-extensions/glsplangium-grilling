
    //THIS FILE IS GENERATED

  interface DefaultMappingEntry {
    property: string;
    defaultValue?: any;
    propertyType: string;
  }
  
  const defaultMapping: Record<string, DefaultMappingEntry[]> = {
  "TaskNode": [
    {
      "property": "label",
      "propertyType": "string"
    },
    {
      "property": "duration",
      "propertyType": "number"
    },
    {
      "property": "reference",
      "propertyType": "string"
    },
    {
      "property": "name",
      "propertyType": "string"
    }
  ],
  "Category": [
    {
      "property": "label",
      "propertyType": "string"
    },
    {
      "property": "name",
      "propertyType": "string"
    }
  ],
  "ActivityNode": [
    {
      "property": "name",
      "propertyType": "string"
    }
  ],
  "Size": [
    {
      "property": "height",
      "propertyType": "number"
    },
    {
      "property": "width",
      "propertyType": "number"
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
    }
  ]
};
  
  export function getDefaultValue(parentType: string, propertyName: string): any {
    const entries = defaultMapping[parentType];
    if (entries) {
        const entry = entries.find(e => e.property === propertyName);
        if (entry) {
        if (entry.defaultValue !== undefined) {
            return entry.defaultValue;
        }
        // Fallback for simple types:
        if (entry.propertyType === "string") {
            return "";
        } else if (entry.propertyType === "boolean") {
            return true;
        } else if (entry.propertyType === "number") {
            return 0;
        } else {
            // For complex types, we assume they are always arrays.
            return [];
        }
        }
    }
    return "";
  }
  