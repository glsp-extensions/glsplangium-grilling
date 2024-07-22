import {
    ElementBoolProperty,
    ElementChoiceProperty,
    ElementProperty,
    ElementReferenceProperty,
    ElementTextProperty
} from '@biguml/biguml-protocol';

export class PropertyPalette {
    static builder() {
        return new PropetyPaletteBuilder();
    }
    static DEFAULT_VISIBILITY_CHOICES = [
        { label: 'public', value: 'PUBLIC' },
        { label: 'private', value: 'PRIVATE' },
        { label: 'protected', value: 'PROTECTED' },
        { label: 'package', value: 'PACKAGE' }
    ];
    static DEFAULT_AGGREGATION_CHOICES = [
        { label: 'none', value: 'NONE' },
        { label: 'shared', value: 'SHARED' },
        { label: 'composite', value: 'COMPOSITE' }
    ];
}

export class PropetyPaletteBuilder {
    proxy: {
        elementId?: string;
        label?: string;
        items: Array<ElementProperty>;
    } = { items: [] };

    elementId(elementId: string) {
        this.proxy.elementId = elementId;
        return this;
    }
    label(label: string) {
        this.proxy.label = label;
        return this;
    }

    text(elementId: string, propertyId: string, text: string, label: string) {
        this.proxy.items.push({
            elementId,
            propertyId,
            type: 'TEXT',
            disabled: false,
            text,
            label
        } as ElementTextProperty);
        return this;
    }

    bool(elementId: string, propertyId: string, value: boolean, label: string) {
        this.proxy.items.push({
            elementId,
            propertyId,
            type: 'BOOL',
            value,
            label
        } as ElementBoolProperty);
        return this;
    }

    choice(elementId: string, propertyId: string, choices: Array<{ label: string; value: string }>, choice: string, label: string) {
        this.proxy.items.push({
            elementId,
            propertyId,
            type: 'CHOICE',
            choices,
            choice,
            label
        } as ElementChoiceProperty);
        return this;
    }

    reference(
        elementId: string,
        propertyId: string,
        label: string,
        references: ElementReferenceProperty.Reference[],
        creates: ElementReferenceProperty.CreateReference[]
    ) {
        this.proxy.items.push({
            elementId,
            propertyId,
            disabled: false,
            type: 'REFERENCE',
            references,
            creates,
            label,
            isOrderable: false,
            isAutocomplete: false
        } as ElementReferenceProperty);
        return this;
    }

    build() {
        return {
            elementId: this.proxy.elementId,
            palette: {
                elementId: this.proxy.elementId,
                label: this.proxy.label,
                items: this.proxy.items
            }
        };
    }
}
