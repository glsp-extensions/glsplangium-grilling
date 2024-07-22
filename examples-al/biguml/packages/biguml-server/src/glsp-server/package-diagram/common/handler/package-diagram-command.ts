/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { JsonRecordingCommand, MaybePromise } from '@eclipse-glsp/server';
import * as jsonPatch from 'fast-json-patch';
import { PackageDiagramModelState, PackageDiagramSourceModel } from '../../model/package-diagram-model-state.js';

/**
 * A custom recording command that tracks updates during exection through a textual semantic state.
 * Tracking updates ensures that we have proper undo/redo support
 */
export class PackageDiagramCommand extends JsonRecordingCommand<PackageDiagramSourceModel> {
    constructor(
        protected state: PackageDiagramModelState,
        protected runnable: () => MaybePromise<void>
    ) {
        super(state, runnable);
    }

    protected override postChange(newModel: PackageDiagramSourceModel): MaybePromise<void> {
        return this.state.updateSourceModel(newModel);
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
