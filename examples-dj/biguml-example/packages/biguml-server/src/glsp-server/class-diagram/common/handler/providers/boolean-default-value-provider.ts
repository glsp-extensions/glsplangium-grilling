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
import { DefaultValueProvider } from './default-value-provider';

@injectable()
export class BooleanDefaultValueProvider implements DefaultValueProvider {
    provide(type: string, name: string): any {
        if (type === 'Interface') {
            if (name === 'isAbstract') {
                return true;
            }
        }
        if (type === 'Package') {
            if (name === 'isVisible') {
                return true;
            }
        }
        // ... other cases not needed for now (this serves as an example), will be replaced by default values from ast.ts

        // as default false is returned
        return false;
    }
}
*/
