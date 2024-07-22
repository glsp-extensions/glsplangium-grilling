/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { Command, MaybePromise } from "@eclipse-glsp/server";
import { WorkflowModelState } from "../../model/workflow-model-state.js";

/**
 * A custom recording command that tracks updates during exection through a textual semantic state.
 * Tracking updates ensures that we have proper undo/redo support
 */
export class WorkflowCommand implements Command {
  constructor(
    protected state: WorkflowModelState,
    protected modelPatch?: string,
    protected modelDetailsPatch?: string
  ) {}
  async undo(): Promise<void> {
    await this.state.undo();
  }
  async redo(): Promise<void> {
    await this.state.redo();
  }
  canUndo?(): boolean {
    return true;
  }

  async execute(): Promise<void> {
    if (this.modelPatch) {
      await this.state.sendModelPatch(this.modelPatch);
    }
    if (this.modelDetailsPatch) {
      await this.state.sendModelDetailsPatch(this.modelDetailsPatch);
    }
  }
}
