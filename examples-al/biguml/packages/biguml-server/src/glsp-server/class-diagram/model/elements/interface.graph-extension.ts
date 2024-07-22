import { DefaultTypes, GCompartment, GLabel, GNode, GNodeBuilder } from '@eclipse-glsp/server';
import { ModelTypes } from '../../common/util/model-types.js';

export class GInterfaceNode extends GNode {
    name: string = 'UNDEFINED CLASS NAME';
    isAbstract: boolean = false;
    properties: GCompartment[] = [];
    static override builder(): GInterfaceNodeBuilder {
        return new GInterfaceNodeBuilder(GInterfaceNode).type(ModelTypes.INTERFACE).layout('vbox').addCssClass('uml-node');
    }
}

export class GInterfaceNodeBuilder<T extends GInterfaceNode = GInterfaceNode> extends GNodeBuilder<T> {
    name(name: string): this {
        this.proxy.name = name;
        return this;
    }
    isAbstract(isAbstract: boolean): this {
        this.proxy.isAbstract = isAbstract;
        return this;
    }

    override build(): T {
        return super.build();
    }

    public createCompartmentHeader() {
        const header = GCompartment.builder()
            .type(DefaultTypes.COMPARTMENT_HEADER)
            .id(this.proxy.id + '_comp_header')
            .layout('vbox')
            .addLayoutOption('hAlign', 'center');
        const labelBuilder = GLabel.builder()
            .type(DefaultTypes.LABEL + ':name')
            .id(this.proxy.id + '_name_label')
            .text(this.proxy.name)
            .addArg('highlight', true)
            .addCssClass('uml-font-bold');
        if (this.proxy.isAbstract) {
            labelBuilder.addCssClass('uml-font-italic');
        }
        header.add(labelBuilder.build());
        return header.build();
    }
}
