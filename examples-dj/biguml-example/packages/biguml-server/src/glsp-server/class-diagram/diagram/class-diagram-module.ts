/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import {
    ActionHandlerConstructor,
    BindingTarget,
    CommandPaletteActionProvider,
    ContextActionsProvider,
    ContextEditValidator,
    ContextMenuItemProvider,
    DiagramConfiguration,
    DiagramModule,
    GModelFactory,
    GModelIndex,
    InstanceMultiBinding,
    LabelEditValidator,
    ModelState,
    ModelValidator,
    MultiBinding,
    NavigationTargetProvider,
    NavigationTargetResolver,
    OperationHandlerConstructor,
    PopupModelFactory,
    SourceModelStorage,
    ToolPaletteItemProvider
} from '@eclipse-glsp/server';
import { injectable, interfaces } from 'inversify';
import { RequestOutlineActionHandler } from '../common/handler/action/request-outline-action-handler.js';
import { RequestPropertyPaletteActionHandler } from '../common/handler/action/request-property-palette-action-handler.js';
import { UpdateElementPropertyActionHandler } from '../common/handler/action/update-element-property-action-handler.js';
import { ClassDiagramChangeBoundsOperationHandler } from '../common/handler/change-bounds-operation-handler.js';
import { ClassDiagramDeleteOperationHandler } from '../common/handler/delete-operation-handler.js';
import { CreateAssociationOperationHandler } from '../common/handler/edges/create-association-handler.js';
import { GenericCreateEdgeOperationHandler } from '../common/handler/edges/generic-create-edge-operation-handler.js';
import { GenericCreateNodeOperationHandler } from '../common/handler/generic-create-node-operation-handler.js';
import { ClassDiagramUpdateClientOperationHandler } from '../common/handler/update-glsp-client-handler.js';
import { UpdateOperationHandler } from '../common/handler/update-operation-handler.js';
import { ClassLabelEditOperationHandler } from '../common/labeledit/class-label-edit-operation-handler.js';
import { ClassLabelEditValidator } from '../common/labeledit/class-label-edit-validator.js';
import { ClassDiagramModelValidator } from '../common/marker/class-diagram-model-validator.js';
import { ClassDiagramNavigationTargetResolver } from '../common/model/class-diagram-navigation-target-resolver.js';
import { ClassDiagramCommandPaletteActionProvider } from '../common/provider/class-diagram-command-palette-action-provider.js';
import { ClassDiagramContextMenuItemProvider } from '../common/provider/class-diagram-context-menu-item-provider.js';
import { ClassDiagramToolPaletteItemProvider } from '../common/provider/class-diagram-tool-palette-item-provider.js';
import { NextNodeNavigationTargetProvider } from '../common/provider/next-node-navigation-target-provider.js';
import { NodeDocumentationNavigationTargetProvider } from '../common/provider/node-documentation-navigation-target-provider.js';
import { PreviousNodeNavigationTargetProvider } from '../common/provider/previous-node-navigation-target-provider.js';
import { ClassDiagramGModelFactory } from '../model/class-diagram-gmodel-factory.js';
import { ClassDiagramModelIndex } from '../model/class-diagram-model-index.js';
import { ClassDiagramModelState } from '../model/class-diagram-model-state.js';
import { ClassDiagramModelStorage } from '../model/class-diagram-model-storage.js';
import { ClassDiagramConfiguration } from './class-diagram-configuration.js';
import { ClassDiagramPopupFactory } from './class-diagram-popup-factory.js';

@injectable()
export class ClassDiagramModule extends DiagramModule {
    readonly diagramType = 'uml';

    protected override configure(
        bind: interfaces.Bind,
        unbind: interfaces.Unbind,
        isBound: interfaces.IsBound,
        rebind: interfaces.Rebind
    ): void {
        super.configure(bind, unbind, isBound, rebind);
        // bind(DefaultValueProvider).to(DefaultValueConfigurationImpl).inSingletonScope();
    }

    protected bindDiagramConfiguration(): BindingTarget<DiagramConfiguration> {
        return ClassDiagramConfiguration;
    }

    protected bindSourceModelStorage(): BindingTarget<SourceModelStorage> {
        return ClassDiagramModelStorage;
    }

    protected bindModelState(): BindingTarget<ModelState> {
        this.context.bind(ClassDiagramModelState).toSelf().inSingletonScope();
        return { service: ClassDiagramModelState };
    }

    protected bindGModelFactory(): BindingTarget<GModelFactory> {
        return ClassDiagramGModelFactory;
    }

    protected override configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
        super.configureOperationHandlers(binding);
        binding.add(GenericCreateNodeOperationHandler);
        //binding.add(CreateClassOperationHandler);
        //binding.add(CreateClassPropertyOperationHandler);
        //binding.add(CreateClassMethodOperationHandler);
        //binding.add(CreateEnumerationOperationHandler);
        //binding.add(CreateEnumerationLiteralOperationHandler);
        //binding.add(CreateInterfaceOperationHandler);
        //binding.add(CreateAbstractClassOperationHandler);
        //binding.add(CreateParameterOperationHandler);
        //binding.add(CreatePackageOperationHandler);
        //binding.add(CreateDataTypeOperationHandler);
        //binding.add(CreatePrimitiveTypeOperationHandler);
        //binding.add(CreateInstanceSpecificationOperationHandler);
        //binding.add(CreateSlotOperationHandler);
        //binding.add(CreateLiteralSpecificationOperationHandler);

        binding.add(GenericCreateEdgeOperationHandler);

        //binding.add(CreateAbstractionOperationHandler);
        binding.add(CreateAssociationOperationHandler);
        //binding.add(CreateDependencyOperationHandler);
        //binding.add(CreateGeneralizationOperationHandler);
        //binding.add(CreateInterfaceRealizationOperationHandler);
        //binding.add(CreatePackageImportOperationHandler);
        //binding.add(CreatePackageMergeOperationHandler);
        //binding.add(CreateRealizationOperationHandler);
        //binding.add(CreateSubstitutionOperationHandler);
        //binding.add(CreateUsageOperationHandler);

        binding.add(ClassDiagramChangeBoundsOperationHandler);
        binding.add(ClassLabelEditOperationHandler);
        binding.add(UpdateOperationHandler);
        binding.add(ClassDiagramUpdateClientOperationHandler);
        binding.add(ClassDiagramDeleteOperationHandler);
    }

    protected override bindGModelIndex(): BindingTarget<GModelIndex> {
        this.context.bind(ClassDiagramModelIndex).toSelf().inSingletonScope();
        return { service: ClassDiagramModelIndex };
    }

    protected override bindNavigationTargetResolver(): BindingTarget<NavigationTargetResolver> | undefined {
        return ClassDiagramNavigationTargetResolver;
    }

    protected override bindContextMenuItemProvider(): BindingTarget<ContextMenuItemProvider> | undefined {
        return ClassDiagramContextMenuItemProvider;
    }

    protected override bindToolPaletteItemProvider(): BindingTarget<ToolPaletteItemProvider> {
        return ClassDiagramToolPaletteItemProvider;
    }

    protected override bindCommandPaletteActionProvider(): BindingTarget<CommandPaletteActionProvider> | undefined {
        return ClassDiagramCommandPaletteActionProvider;
    }

    protected override bindLabelEditValidator(): BindingTarget<LabelEditValidator> | undefined {
        return ClassLabelEditValidator;
    }

    protected override bindPopupModelFactory(): BindingTarget<PopupModelFactory> | undefined {
        return ClassDiagramPopupFactory;
    }

    protected override bindModelValidator(): BindingTarget<ModelValidator> | undefined {
        return ClassDiagramModelValidator;
    }

    protected override configureNavigationTargetProviders(binding: MultiBinding<NavigationTargetProvider>): void {
        super.configureNavigationTargetProviders(binding);
        binding.add(NextNodeNavigationTargetProvider);
        binding.add(PreviousNodeNavigationTargetProvider);
        binding.add(NodeDocumentationNavigationTargetProvider);
    }

    protected override configureContextActionProviders(binding: MultiBinding<ContextActionsProvider>): void {
        super.configureContextActionProviders(binding);
    }

    protected override configureContextEditValidators(binding: MultiBinding<ContextEditValidator>): void {
        super.configureContextEditValidators(binding);
    }

    protected override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
        super.configureActionHandlers(binding);
        binding.add(RequestPropertyPaletteActionHandler);
        binding.add(UpdateElementPropertyActionHandler);
        binding.add(RequestOutlineActionHandler);
    }
}
