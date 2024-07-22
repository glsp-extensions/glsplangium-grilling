import {
  createDefaultModule,
  createDefaultSharedModule,
  DefaultSharedModuleContext,
  inject,
  Module,
  PartialLangiumServices,
  PartialLangiumSharedServices,
} from "langium";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  WorkflowDiagramGeneratedModule,
  WorkflowDiagramGeneratedSharedModule,
} from "../generated/module.js";
import { ClientLogger } from "./workflow-diagram-client-logger.js";
import { WorkflowDiagramCompletionProvider } from "./workflow-diagram-completion-provider.js";
import { WorkflowDiagramDocumentBuilder } from "./workflow-diagram-document-builder.js";
import { WorkflowDiagramModelFormatter } from "./workflow-diagram-formatter.js";
import { WorkflowDiagramJsonSerializer } from "./workflow-diagram-json-serializer.js";
import { WorkflowDiagramLangiumDocumentFactory } from "./workflow-diagram-langium-document-factory.js";
import { WorkflowDiagramLangiumDocuments } from "./workflow-diagram-langium-documents.js";
import { QualifiedNameProvider } from "./workflow-diagram-naming.js";
import { WorkflowDiagramPackageManager } from "./workflow-diagram-package-manager.js";
import { WorkflowDiagramScopeComputation } from "./workflow-diagram-scope.js";
import { WorkflowDiagramScopeProvider } from "./workflow-diagram-scope-provider.js";
import { WorkflowDiagramSerializer } from "./workflow-diagram-serializer.js";
import { WorkflowDiagramWorkspaceManager } from "./workflow-diagram-workspace-manager.js";
import {
  OpenableTextDocuments,
  ModelService,
  OpenTextDocumentManager,
  AddedSharedModelServices,
  AddedSharedServices,
  ExtendedLangiumServices,
  ExtendedServiceRegistry,
  SharedServices
} from "model-service";
import { WorkflowDiagramValidator } from "./workflow-diagram-validator.js";

/**
 * Declaration of custom services - add your own service classes here.
 */
export type WorkflowDiagramAddedSharedServices = {
  workspace: {
    WorkspaceManager: WorkflowDiagramWorkspaceManager;
    PackageManager: WorkflowDiagramPackageManager;
  };
  logger: {
    ClientLogger: ClientLogger;
  };
};

export const WorkflowDiagramSharedServices = Symbol(
  "WorkflowDiagramSharedServices"
);
export type WorkflowDiagramSharedServices = SharedServices &
  WorkflowDiagramAddedSharedServices;

export const WorkflowDiagramSharedModule: Module<
  WorkflowDiagramSharedServices,
  PartialLangiumSharedServices &
    WorkflowDiagramAddedSharedServices &
    AddedSharedServices &
    AddedSharedModelServices
> = {
  ServiceRegistry: () => new ExtendedServiceRegistry(),
  workspace: {
    WorkspaceManager: (services) =>
      new WorkflowDiagramWorkspaceManager(services),
    PackageManager: (services) => new WorkflowDiagramPackageManager(services),
    LangiumDocumentFactory: (services) =>
      new WorkflowDiagramLangiumDocumentFactory(services),
    LangiumDocuments: (services) =>
      new WorkflowDiagramLangiumDocuments(services),
    TextDocuments: () => new OpenableTextDocuments(TextDocument),
    TextDocumentManager: (services) => new OpenTextDocumentManager(services),
    DocumentBuilder: (services) => new WorkflowDiagramDocumentBuilder(services),
  },
  logger: {
    ClientLogger: (services) => new ClientLogger(services),
  },
  model: {
    ModelService: (services) => new ModelService(services),
  },
};

export interface WorkflowDiagramModuleContext {
  shared: WorkflowDiagramSharedServices;
}
export interface WorkflowDiagramAddedServices {
  shared: WorkflowDiagramSharedServices;
  references: {
    QualifiedNameProvider: QualifiedNameProvider;
  };
  serializer: {
    Serializer: WorkflowDiagramSerializer;
  };
  validation: {
    WorkflowDiagramValidator: WorkflowDiagramValidator;
  };
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type WorkflowDiagramServices = ExtendedLangiumServices &
  WorkflowDiagramAddedServices;
export const WorkflowDiagramServices = Symbol("WorkflowDiagramServices");

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export function createWorkflowDiagramModule(
  context: WorkflowDiagramModuleContext
): Module<
  WorkflowDiagramServices,
  PartialLangiumServices & WorkflowDiagramAddedServices
> {
  return {
    references: {
      ScopeComputation: (services) =>
        new WorkflowDiagramScopeComputation(services),
      ScopeProvider: (services) => new WorkflowDiagramScopeProvider(services),
      QualifiedNameProvider: (services) => new QualifiedNameProvider(services),
    },
    lsp: {
      CompletionProvider: (services) =>
        new WorkflowDiagramCompletionProvider(services),
      Formatter: () => new WorkflowDiagramModelFormatter(),
    },
    serializer: {
      Serializer: (services) => new WorkflowDiagramSerializer(services),
      JsonSerializer: (services) => new WorkflowDiagramJsonSerializer(services),
    },
    validation: {
      WorkflowDiagramValidator: () => new WorkflowDiagramValidator(),
    },
    shared: () => context.shared,
  };
}

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createWorkflowDiagramServices(
  context: DefaultSharedModuleContext
): {
  shared: WorkflowDiagramSharedServices;
  WorkflowDiagram: WorkflowDiagramServices;
} {
  const shared = inject(
    createDefaultSharedModule(context),
    WorkflowDiagramGeneratedSharedModule,
    WorkflowDiagramSharedModule
  );
  const WorkflowDiagram = inject(
    createDefaultModule({ shared }),
    WorkflowDiagramGeneratedModule,
    createWorkflowDiagramModule({ shared })
  );
  shared.ServiceRegistry.register(WorkflowDiagram);
  return { shared, WorkflowDiagram };
}
