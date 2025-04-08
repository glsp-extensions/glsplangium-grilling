//THIS FILE IS GENERATED

interface DefaultMappingEntry {
    property: string;
    defaultValue?: any;
    propertyType: string;
}

const defaultMapping: Record<string, DefaultMappingEntry[]> = {
    Diagram: [
        {
            property: 'diagram',
            propertyType: 'UnionType_0'
        }
    ],
    Size: [
        {
            property: 'height',
            propertyType: 'number'
        },
        {
            property: 'width',
            propertyType: 'number'
        }
    ],
    Position: [
        {
            property: 'x',
            propertyType: 'number'
        },
        {
            property: 'y',
            propertyType: 'number'
        }
    ],
    TestElementKarol: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'description',
            propertyType: 'string'
        }
    ],
    Enumeration: [
        {
            property: 'name',
            propertyType: 'string'
        }
    ],
    EnumerationLiteral: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'value',
            propertyType: 'string'
        }
    ],
    Class: [
        {
            property: 'name',
            defaultValue: 'Hello world',
            propertyType: 'string'
        },
        {
            property: 'isAbstract',
            propertyType: 'boolean'
        },
        {
            property: 'isActive',
            propertyType: 'boolean'
        }
    ],
    Interface: [
        {
            property: 'name',
            propertyType: 'string'
        }
    ],
    Property: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'isDerived',
            propertyType: 'boolean'
        },
        {
            property: 'isOrdered',
            propertyType: 'boolean'
        },
        {
            property: 'isStatic',
            propertyType: 'boolean'
        },
        {
            property: 'isDerivedUnion',
            propertyType: 'boolean'
        },
        {
            property: 'isReadOnly',
            propertyType: 'boolean'
        },
        {
            property: 'isUnique',
            propertyType: 'boolean'
        },
        {
            property: 'multiplicity',
            propertyType: 'string'
        }
    ],
    Operation: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'isAbstract',
            propertyType: 'boolean'
        },
        {
            property: 'isStatic',
            propertyType: 'boolean'
        },
        {
            property: 'isQuery',
            propertyType: 'boolean'
        }
    ],
    Parameter: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'isException',
            propertyType: 'boolean'
        },
        {
            property: 'isStream',
            propertyType: 'boolean'
        },
        {
            property: 'isOrdered',
            propertyType: 'boolean'
        },
        {
            property: 'isUnique',
            propertyType: 'boolean'
        },
        {
            property: 'multiplicity',
            propertyType: 'string'
        }
    ],
    DataType: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'isAbstract',
            propertyType: 'boolean'
        }
    ],
    PrimitiveType: [
        {
            property: 'name',
            propertyType: 'string'
        }
    ],
    InstanceSpecification: [
        {
            property: 'name',
            propertyType: 'string'
        }
    ],
    Slot: [
        {
            property: 'name',
            propertyType: 'string'
        }
    ],
    LiteralSpecification: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'value',
            propertyType: 'string'
        }
    ],
    Abstraction: [
        {
            property: 'name',
            propertyType: 'string'
        }
    ],
    Dependency: [
        {
            property: 'name',
            propertyType: 'string'
        }
    ],
    Association: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'sourceMultiplicity',
            propertyType: 'string'
        },
        {
            property: 'targetMultiplicity',
            propertyType: 'string'
        },
        {
            property: 'sourceName',
            propertyType: 'string'
        },
        {
            property: 'targetName',
            propertyType: 'string'
        }
    ],
    InterfaceRealization: [
        {
            property: 'name',
            propertyType: 'string'
        }
    ],
    Generalization: [
        {
            property: 'isSubstitutable',
            propertyType: 'boolean'
        }
    ],
    Realization: [
        {
            property: 'name',
            propertyType: 'string'
        }
    ],
    Substitution: [
        {
            property: 'name',
            propertyType: 'string'
        }
    ],
    Usage: [
        {
            property: 'name',
            propertyType: 'string'
        }
    ],
    Package: [
        {
            property: 'name',
            propertyType: 'string'
        },
        {
            property: 'uri',
            propertyType: 'string'
        }
    ]
};

export function getDefaultValue(parentType: string, propertyName: string): any | undefined {
    const entries = defaultMapping[parentType];
    if (entries) {
        const entry = entries.find(e => e.property === propertyName);
        if (entry) {
            if (entry.defaultValue !== undefined) {
                return entry.defaultValue;
            }
            // Fallback for simple types:
            if (entry.propertyType === 'string') {
                return '';
            } else if (entry.propertyType === 'boolean') {
                return true;
            } else if (entry.propertyType === 'number') {
                return 0;
            } else {
                // For complex types, we assume they are always arrays.
                return [];
            }
        }
    }
    return undefined;
}
