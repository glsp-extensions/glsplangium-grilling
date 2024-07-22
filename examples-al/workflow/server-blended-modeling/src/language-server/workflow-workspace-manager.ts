/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { DefaultWorkspaceManager } from "langium";
import { CancellationToken, Emitter, Event, WorkspaceFolder } from "vscode-languageserver";
import { URI } from "vscode-uri";
import { WorkflowSharedServices } from "./workflow-module.js";

/**
 * A custom workspace manager that fires an event when the workspace is initialized
 * (we use this for starting LSP-dependent servers)
 */
export class WorkflowWorkspaceManager extends DefaultWorkspaceManager {
  protected onWorkspaceInitializedEmitter = new Emitter<URI[]>();

  constructor(protected services: WorkflowSharedServices) {
    super(services);
    this.initialBuildOptions = { validation: true };
  }

  override async initializeWorkspace(
    folders: WorkspaceFolder[],
    cancelToken?: CancellationToken | undefined
  ): Promise<void> {
    await super.initializeWorkspace(folders, cancelToken);
    console.info("Workspace Initialized");
    const uris = this.folders?.map((folder) => this.getRootFolder(folder)) || [];
    this.onWorkspaceInitializedEmitter.fire(uris);
  }

  get onWorkspaceInitialized(): Event<URI[]> {
    return this.onWorkspaceInitializedEmitter.event;
  }
}
