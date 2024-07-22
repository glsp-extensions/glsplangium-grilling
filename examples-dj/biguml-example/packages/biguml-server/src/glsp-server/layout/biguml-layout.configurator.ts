import { AbstractLayoutConfigurator, LayoutOptions } from '@eclipse-glsp/layout-elk';
import { GGraph } from '@eclipse-glsp/server';
import { injectable } from 'inversify';

@injectable()
export class BigUmlLayoutConfigurator extends AbstractLayoutConfigurator {
    protected override graphOptions(graph: GGraph): LayoutOptions | undefined {
        return {
            'elk.algorithm': 'layered'
        };
    }
}
