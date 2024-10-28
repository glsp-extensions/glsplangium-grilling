import { injectable, multiInject } from 'inversify';
import { DefaultValueProvider, DefaultValueProviderSymbol } from './default-value-provider';

@injectable()
export class DefaultValueConfiguration {
    @multiInject(DefaultValueProviderSymbol)
    protected providers: DefaultValueProvider[];

    getDefaultValueFor(type: string, name: string): any {
        for (const provider of this.providers) {
            const value = provider.provide(type, name);
            if (value !== undefined) {
                return value;
            }
        }
        return undefined;
    }
}
