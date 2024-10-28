export const DefaultValueProviderSymbol = Symbol.for('DefaultValueProvider');

export interface DefaultValueProvider {
    provide(type: string, name: string): any;
}
