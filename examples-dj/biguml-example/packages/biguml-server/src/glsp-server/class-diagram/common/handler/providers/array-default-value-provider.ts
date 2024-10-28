import { injectable } from 'inversify';
import { DefaultValueProvider } from './default-value-provider';

@injectable()
export class ArrayDefaultValueProvider implements DefaultValueProvider {
    provide(type: string, name: string): any {
        if (type === 'Interface') {
            if (name === 'operations') {
                return [];
            }
        }
        if (type === 'Package') {
            if (name === 'parameters') {
                return [];
            }
        }
        //... other cases not needed for now (this serves as an example), will be replaced by default values from ast.ts

        //as default empty array is returned
        return [];
    }
}
