import { DefaultTypes, GCompartment, GLabel, GNode, GNodeBuilder } from '@eclipse-glsp/server';

export class GMissingNode extends GNode {
    name: string;

    static override builder(): GMissingNodeBuilder {
        return new GMissingNodeBuilder(GMissingNode).layout('vbox').addCssClass('uml-node').addCssClass('missing');
    }
}

export class GMissingNodeBuilder<T extends GMissingNode = GMissingNode> extends GNodeBuilder<T> {
    name(name: string): this {
        this.proxy.name = name;
        return this;
    }

    override build(): T {
        this.layout('hbox').addLayoutOption('paddingRight', 10).add(this.createCompartmentHeader());
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
        header.add(labelBuilder.build());
        return header.build();
    }
}
