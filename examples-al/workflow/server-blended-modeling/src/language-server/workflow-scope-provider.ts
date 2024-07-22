/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { DefaultScopeProvider, getDocument, MapScope, ReferenceInfo, Scope } from "langium";
import { WorkflowServices } from "./workflow-module.js";

/**
 * A custom scope provider that only consideres elements within the same diagram.
 * e.g. diagram1.wf and diagram1.wfd share the same scope, other files from the
 * directory won't
 */
export class WorkflowScopeProvider extends DefaultScopeProvider {
  constructor(protected services: WorkflowServices) {
    super(services);
  }

  protected override getGlobalScope(referenceType: string, context: ReferenceInfo): Scope {
    // define uris from which references should be included for the global scope
    const source = getDocument(context.container);
    const uri = source.uri.toString();

    const uris: Set<string> = new Set();
    uris.add(uri);
    if (uri.endsWith("d")) {
      // add .wf document
      uris.add(uri.slice(0, -1));
    } else {
      // add .wfd document
      uris.add(uri.concat("d"));
    }

    // the global scope contains all elements known to the language server
    // from the documents included in uris
    const globalScope = this.globalScopeCache.get(
      referenceType,
      () => new MapScope(this.indexManager.allElements(referenceType, uris))
    );

    return globalScope;
  }
}
