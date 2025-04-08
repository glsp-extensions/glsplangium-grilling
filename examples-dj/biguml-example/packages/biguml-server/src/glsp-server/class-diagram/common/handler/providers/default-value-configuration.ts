/**import { injectable, multiInject } from 'inversify';
import { DefaultValueProvider } from './default-value-provider';

@injectable()
export class DefaultValueConfigurationImpl {
    @multiInject(DefaultValueProvider)
    protected providers: DefaultValueProvider[];

    getDefaultValueFor(type: string, name: string): any {
        for (const provider of this.providers) {
            if (provider.canHandle(type, name)) {
                const value = provider.provide(type, name);
                if (value !== undefined) {
                    return value;
                }
            }
        return undefined;
    }
}
}
**/
