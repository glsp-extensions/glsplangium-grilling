/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { AstNodeDescription, CompletionAcceptor, CompletionContext, DefaultCompletionProvider, MaybePromise, NextFeature, GrammarAST } from 'langium';
import { isExternalDescriptionForLocalPackage } from './workflow-diagram-scope.js';
import { WorkflowDiagramServices } from './workflow-diagram-module.js';

/**
 * Custom completion provider that only shows the short options to the user if a longer, fully-qualified version is also available.
 */
export class WorkflowDiagramCompletionProvider extends DefaultCompletionProvider {
   protected packageId?: string;

   constructor(services: WorkflowDiagramServices, protected packageManager = services.shared.workspace.PackageManager) {
      super(services);
   }

   protected override completionForCrossReference(
      context: CompletionContext,
      crossRef: NextFeature<GrammarAST.CrossReference>,
      acceptor: CompletionAcceptor
    ): MaybePromise<void> {
      this.packageId = this.packageManager.getPackageIdByDocument(
        context.document
      );
      try {
        super.completionForCrossReference(context, crossRef, acceptor);
      } finally {
        this.packageId = undefined;
      }
    }

   protected override filterCrossReference(
      context: CompletionContext,
      description: AstNodeDescription
    ): boolean {
      // we want to keep fully qualified names in the scope so we can do proper linking
      // but want to hide it from the user for local options, i.e., if we are in the same project we can skip the project name
      return (
        !isExternalDescriptionForLocalPackage(description, this.packageId) &&
        super.filterCrossReference(context, description)
      );
    }
}