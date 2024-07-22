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
    SourceModelStorage,
    ToolPaletteItemProvider
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { RequestPropertyPaletteActionHandler } from '../common/handler/action/request-property-palette-action-handler.js';
import { UpdateElementPropertyActionHandler } from '../common/handler/action/update-element-property-action-handler.js';
import { ChangeBoundsOperationHandler } from '../common/handler/change-bounds-operation-handler.js';
import { CreateClassOperationHandler } from '../common/handler/create-class-operation-handler.js';
import { CreatePackageDiagramEdgeOperationHandler } from '../common/handler/create-edge-operation-handler.js';
import { CreatePackageOperationHandler } from '../common/handler/create-package-handler.js';
import { PackageDiagramDeleteOperationHandler } from '../common/handler/delete-operation-handler.js';
import { PackageDiagramUpdateClientOperationHandler } from '../common/handler/update-glsp-client-handler.js';
import { UpdateOperationHandler } from '../common/handler/update-operation-handler.js';
import { PackageLabelEditValidator } from '../common/labeledit/package-label-edit-validator.js';
import { PackageLabelEditOperationHandler } from '../common/labeledit/packge-label-edit-operation-handler.js';
import { PackageDiagramModelValidator } from '../common/marker/package-diagram-model-validator.js';
import { PackageDiagramNavigationTargetResolver } from '../common/model/package-diagram-navigation-target-resolver.js';
import { NextNodeNavigationTargetProvider } from '../common/provider/next-node-navigation-target-provider.js';
import { NodeDocumentationNavigationTargetProvider } from '../common/provider/node-documentation-navigation-target-provider.js';
import { PackageDiagramCommandPaletteActionProvider } from '../common/provider/package-diagram-command-palette-action-provider.js';
import { PackageDiagramContextMenuItemProvider } from '../common/provider/package-diagram-context-menu-item-provider.js';
import { PackageDiagramToolPaletteItemProvider } from '../common/provider/package-diagram-tool-palette-item-provider.js';
import { PreviousNodeNavigationTargetProvider } from '../common/provider/previous-node-navigation-target-provider.js';
import { PackageDiagramGModelFactory } from '../model/package-diagram-gmodel-factory.js';
import { PackageDiagramModelIndex } from '../model/package-diagram-model-index.js';
import { PackageDiagramModelState } from '../model/package-diagram-model-state.js';
import { PackageDiagramModelStorage } from '../model/package-diagram-model-storage.js';
import { PackageDiagramConfiguration } from './package-diagram-configuration.js';

@injectable()
export class PackageDiagramModule extends DiagramModule {
    readonly diagramType = 'uml';

    protected bindDiagramConfiguration(): BindingTarget<DiagramConfiguration> {
        return PackageDiagramConfiguration;
    }

    protected bindSourceModelStorage(): BindingTarget<SourceModelStorage> {
        return PackageDiagramModelStorage;
    }

    protected bindModelState(): BindingTarget<ModelState> {
        this.context.bind(PackageDiagramModelState).toSelf().inSingletonScope();
        return { service: PackageDiagramModelState };
    }

    protected bindGModelFactory(): BindingTarget<GModelFactory> {
        return PackageDiagramGModelFactory;
    }

    protected override configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
        super.configureOperationHandlers(binding);
        binding.add(CreateClassOperationHandler);
        binding.add(CreatePackageOperationHandler);
        binding.add(CreatePackageDiagramEdgeOperationHandler);

        binding.add(ChangeBoundsOperationHandler);
        binding.add(PackageLabelEditOperationHandler);
        binding.add(UpdateOperationHandler);
        binding.add(PackageDiagramDeleteOperationHandler);
        binding.add(PackageDiagramUpdateClientOperationHandler);
    }

    protected override bindGModelIndex(): BindingTarget<GModelIndex> {
        this.context.bind(PackageDiagramModelIndex).toSelf().inSingletonScope();
        return { service: PackageDiagramModelIndex };
    }

    protected override bindNavigationTargetResolver(): BindingTarget<NavigationTargetResolver> | undefined {
        return PackageDiagramNavigationTargetResolver;
    }

    protected override bindContextMenuItemProvider(): BindingTarget<ContextMenuItemProvider> | undefined {
        return PackageDiagramContextMenuItemProvider;
    }

    protected override bindToolPaletteItemProvider(): BindingTarget<ToolPaletteItemProvider> {
        return PackageDiagramToolPaletteItemProvider;
    }

    protected override bindCommandPaletteActionProvider(): BindingTarget<CommandPaletteActionProvider> | undefined {
        return PackageDiagramCommandPaletteActionProvider;
    }

    protected override bindLabelEditValidator(): BindingTarget<LabelEditValidator> | undefined {
        return PackageLabelEditValidator;
    }

    protected override bindModelValidator(): BindingTarget<ModelValidator> | undefined {
        return PackageDiagramModelValidator;
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
    }
}
