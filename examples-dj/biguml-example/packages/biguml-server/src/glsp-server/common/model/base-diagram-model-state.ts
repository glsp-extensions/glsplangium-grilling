import { DefaultModelState, GModelIndex } from '@eclipse-glsp/server';
import type { DiagramSerializer, ModelService } from 'model-service';
import type { Diagram } from '../../../language-server/generated/ast.js';
import type { QualifiedNameProvider } from '../../../language-server/yo-generated/uml-naming.js';

export interface BigUmlModelIndex extends GModelIndex {
    findIdElement(id: string): any;
    findPath(id: string): string;
}

export abstract class BaseDiagramModelState extends DefaultModelState {
    abstract override index: BigUmlModelIndex;
    abstract semanticUri: string;
    abstract semanticRoot: Diagram;
    abstract modelService: ModelService;
    abstract semanticSerializer: DiagramSerializer<Diagram>;
    abstract nameProvider: QualifiedNameProvider;

    abstract sendModelPatch(patch: string): Promise<void>;
    abstract redo(): Promise<void>;
    abstract undo(): Promise<void>;
}
