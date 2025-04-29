
// THIS FILE IS GENERATED - TEST

  const mapping: Record<string, Array<{ property: string; allowedChildTypes?: string[] }>> = {};
  
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
  