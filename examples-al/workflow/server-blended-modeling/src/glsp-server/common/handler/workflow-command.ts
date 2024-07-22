/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { JsonRecordingCommand, MaybePromise } from "@eclipse-glsp/server";
import { WorkflowModelState, WorkflowSourceModel } from "../../model/workflow-model-state.js";
import * as jsonPatch from "fast-json-patch";

/**
 * A custom recording command that tracks updates during exection through a textual semantic state.
 * Tracking updates ensures that we have proper undo/redo support
 */
export class WorkflowCommand extends JsonRecordingCommand<WorkflowSourceModel> {
  private doNotUpdateSemanticRoot = false;
  private doNotUpdateSemanticRootDetails = false;

  constructor(
    protected state: WorkflowModelState,
    protected runnable: () => MaybePromise<void>,
    doNotUpdateSemanticRoot?: boolean,
    doNotUpdateSemanticRootDetails?: boolean
  ) {
    super(state, runnable);
    this.doNotUpdateSemanticRoot = doNotUpdateSemanticRoot ?? false;
    this.doNotUpdateSemanticRootDetails = doNotUpdateSemanticRootDetails ?? false;
  }

  protected override postChange(newModel: WorkflowSourceModel): MaybePromise<void> {
    return this.state.updateSourceModel(newModel, this.doNotUpdateSemanticRoot, this.doNotUpdateSemanticRootDetails);
  }

  override async execute(): Promise<void> {
    const beforeState = this.deepClone(await this.getJsonObject());
    await this.doExecute();
    const afterState = await this.getJsonObject();
    this.undoPatch = jsonPatch.compare(afterState, beforeState);
    this.redoPatch = jsonPatch.compare(beforeState, afterState);
    await this.postChange?.(afterState);
  }

  override async undo(): Promise<void> {
    if (this.undoPatch && this.undoPatch.length > 0) {
      const result = this.applyPatch(await this.getJsonObject(), this.undoPatch);
      this.state.replaceSemanticText(result.newDocument);
      await this.postChange?.(result.newDocument as any);
    }
  }

  override async redo(): Promise<void> {
    if (this.redoPatch && this.redoPatch.length > 0) {
      const result = this.applyPatch(await this.getJsonObject(), this.redoPatch);
      this.state.replaceSemanticText(result.newDocument);
      await this.postChange?.(result.newDocument as any);
    }
  }
}
