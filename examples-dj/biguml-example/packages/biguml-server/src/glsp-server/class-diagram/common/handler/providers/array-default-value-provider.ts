/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
/*
import { injectable } from 'inversify';
import { DefaultValueProvider } from './default-value-provider.js';

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
        // ... other cases not needed for now (this serves as an example), will be replaced by default values from ast.ts

        // as default empty array is returned
        return [];
    }
}
*/
