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
} from "@eclipse-glsp/server";
import { injectable } from "inversify";
import { WorfklowModelChangeBoundsOperationHandler } from "../common/handler/change-bounds-operation-handler.js";
import { CreateAutomatedTaskOperationHandler } from "../common/handler/create-automated-task-operation-handler.js";
import { CreateCategoryHandler } from "../common/handler/create-category-operation-handler.js";
import { CreateDecisionNodeOperationHandler } from "../common/handler/create-decision-node-operation-handler.js";
import { CreateWorkflowEdgeOperationHandler } from "../common/handler/create-edge-operation-handler.js";
import { CreateForkNodeOperationHandler } from "../common/handler/create-fork-node-operation-handler.js";
import { CreateJoinNodeOperationHandler } from "../common/handler/create-join-node-operation-handler.js";
import { CreateManualTaskOperationHandler } from "../common/handler/create-manual-task-operation-handler.js";
import { CreateMergeNodeOperationHandler } from "../common/handler/create-merge-node-operation-handler.js";
import { CreateWeightedEdgeOperationHandler } from "../common/handler/create-weighted-edge-operation-handler.js";
import { WorkflowDeleteOperationHandler } from "../common/handler/delete-operation-handler.js";
import { WorfklowReconnectEdgeOperationHandler } from "../common/handler/reconnect-edge-operation-handler.js";
import { WorkflowUpdateClientOperationHandler } from "../common/handler/update-glsp-client-handler.js";
import { WorfklowModelLabelEditOperationHandler } from "../common/labeledit/workflow-label-edit-operation-handler.js";
import { WorkflowLabelEditValidator } from "../common/labeledit/workflow-label-edit-validator.js";
import { WorkflowModelValidator } from "../common/marker/workflow-model-validator.js";
import { WorkflowNavigationTargetResolver } from "../common/model/workflow-navigation-target-resolver.js";
import { NextNodeNavigationTargetProvider } from "../common/provider/next-node-navigation-target-provider.js";
import { NodeDocumentationNavigationTargetProvider } from "../common/provider/node-documentation-navigation-target-provider.js";
import { PreviousNodeNavigationTargetProvider } from "../common/provider/previous-node-navigation-target-provider.js";
import { WorkflowCommandPaletteActionProvider } from "../common/provider/workflow-command-palette-action-provider.js";
import { WorkflowContextMenuItemProvider } from "../common/provider/workflow-context-menu-item-provider.js";
import { EditTaskOperationHandler } from "../common/taskedit/edit-task-operation-handler.js";
import { TaskEditContextActionProvider } from "../common/taskedit/task-edit-context-provider.js";
import { TaskEditValidator } from "../common/taskedit/task-edit-validator.js";
import { WorkflowGModelFactory } from "../model/workflow-gmodel-factory.js";
import { WorkflowModelIndex } from "../model/workflow-model-index.js";
import { WorkflowModelState } from "../model/workflow-model-state.js";
import { WorkflowModelStorage } from "../model/workflow-model-storage.js";
import { WorkflowDiagramConfiguration } from "./workflow-diagram-configuration.js";
import { WorkflowPopupFactory } from "./workflow-popup-factory.js";

@injectable()
export class WorkflowDiagramModule extends DiagramModule {
  readonly diagramType = "workflow-diagram";

  protected bindDiagramConfiguration(): BindingTarget<DiagramConfiguration> {
    return WorkflowDiagramConfiguration;
  }

  protected bindSourceModelStorage(): BindingTarget<SourceModelStorage> {
    return WorkflowModelStorage;
  }

  protected bindModelState(): BindingTarget<ModelState> {
    this.context.bind(WorkflowModelState).toSelf().inSingletonScope();
    return { service: WorkflowModelState };
  }

  protected bindGModelFactory(): BindingTarget<GModelFactory> {
    return WorkflowGModelFactory;
  }

  protected override configureOperationHandlers(
    binding: InstanceMultiBinding<OperationHandlerConstructor>
  ): void {
    super.configureOperationHandlers(binding);
    binding.add(CreateAutomatedTaskOperationHandler);
    binding.add(CreateManualTaskOperationHandler);
    binding.add(CreateDecisionNodeOperationHandler);
    binding.add(CreateMergeNodeOperationHandler);
    binding.add(CreateForkNodeOperationHandler);
    binding.add(CreateJoinNodeOperationHandler);
    binding.add(CreateWorkflowEdgeOperationHandler);
    binding.add(CreateWeightedEdgeOperationHandler);
    binding.add(EditTaskOperationHandler);
    binding.add(CreateCategoryHandler);
    binding.add(WorfklowModelChangeBoundsOperationHandler);
    binding.add(WorfklowModelLabelEditOperationHandler);
    binding.add(WorkflowUpdateClientOperationHandler);
    binding.add(WorkflowDeleteOperationHandler);
    binding.add(WorfklowReconnectEdgeOperationHandler);
  }

  protected override bindGModelIndex(): BindingTarget<GModelIndex> {
    this.context.bind(WorkflowModelIndex).toSelf().inSingletonScope();
    return { service: WorkflowModelIndex };
  }

  protected override bindNavigationTargetResolver():
    | BindingTarget<NavigationTargetResolver>
    | undefined {
    return WorkflowNavigationTargetResolver;
  }

  protected override bindContextMenuItemProvider():
    | BindingTarget<ContextMenuItemProvider>
    | undefined {
    return WorkflowContextMenuItemProvider;
  }

  protected override bindCommandPaletteActionProvider():
    | BindingTarget<CommandPaletteActionProvider>
    | undefined {
    return WorkflowCommandPaletteActionProvider;
  }

  protected override bindLabelEditValidator():
    | BindingTarget<LabelEditValidator>
    | undefined {
    return WorkflowLabelEditValidator;
  }

  protected override bindPopupModelFactory():
    | BindingTarget<PopupModelFactory>
    | undefined {
    return WorkflowPopupFactory;
  }

  protected override bindModelValidator():
    | BindingTarget<ModelValidator>
    | undefined {
    return WorkflowModelValidator;
  }

  protected override configureNavigationTargetProviders(
    binding: MultiBinding<NavigationTargetProvider>
  ): void {
    super.configureNavigationTargetProviders(binding);
    binding.add(NextNodeNavigationTargetProvider);
    binding.add(PreviousNodeNavigationTargetProvider);
    binding.add(NodeDocumentationNavigationTargetProvider);
  }

  protected override configureContextActionProviders(
    binding: MultiBinding<ContextActionsProvider>
  ): void {
    super.configureContextActionProviders(binding);
    binding.add(TaskEditContextActionProvider);
  }

  protected override configureContextEditValidators(
    binding: MultiBinding<ContextEditValidator>
  ): void {
    super.configureContextEditValidators(binding);
    binding.add(TaskEditValidator);
  }
}
