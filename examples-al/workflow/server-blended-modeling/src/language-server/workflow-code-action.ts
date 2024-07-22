import { CodeActionProvider, LangiumDocument, MaybePromise } from "langium";
import { CancellationToken, CodeAction, CodeActionParams, Command, Diagnostic } from "vscode-languageclient";
import {
  ActivityNode,
  Category,
  Model,
  NodeType,
  Position,
  Size,
  TaskNode,
  TaskType,
  WeightedEdge,
} from "./generated/ast.js";
import { WorkflowServices } from "./workflow-module.js";
import { findAvailableNodeName } from "./util/name-util.js";

/**
 * A code action provider, that provides actions to create missing nodes
 * for linking-errors.
 */
export class WorkflowCodeActionProvider implements CodeActionProvider {
  constructor(protected services: WorkflowServices) {}

  getCodeActions(
    document: LangiumDocument,
    params: CodeActionParams,
    cancelToken?: CancellationToken
  ): MaybePromise<Array<Command | CodeAction> | undefined> {
    const codeActions: Array<CodeAction> = [];
    // only handle linking-errors
    if (
      params.context.diagnostics.length > 0 &&
      params.context.diagnostics.filter((value) => value.data?.code === "linking-error").length ===
        params.context.diagnostics.length
    ) {
      const missingNode = params.context.diagnostics[0];
      let uri = document.uri.toString();

      // if size or position has missing reference, the created node must
      // be inserted to the corresponding .wf file and not the current .wfd file
      if (missingNode.data.containerType === Size || missingNode.data.containerType === Position) {
        uri = uri.slice(0, -1);
      }

      // create decision node
      const createDecisionNode = this.createCodeAction(
        "Decision Node",
        this.createActivityNode("decision", document, missingNode),
        uri
      );
      codeActions.push(createDecisionNode);

      // if error is caused by WeightedEdge 'source' property only allow
      // the creation of a decision node
      if (missingNode.data.containerType === WeightedEdge && missingNode.data.property === "source") {
        return codeActions;
      }

      // create fork node
      const createForkNode = this.createCodeAction(
        "Fork Node",
        this.createActivityNode("fork", document, missingNode),
        uri
      );
      codeActions.push(createForkNode);

      // create merge node
      const createMergeNode = this.createCodeAction(
        "Merge Node",
        this.createActivityNode("merge", document, missingNode),
        uri
      );
      codeActions.push(createMergeNode);

      // create join node
      const createJoinNode = this.createCodeAction(
        "Join Node",
        this.createActivityNode("join", document, missingNode),
        uri
      );
      codeActions.push(createJoinNode);

      // create automated task
      const createAutomatedTask = this.createCodeAction(
        "Automated Task",
        this.createTaskNode("automated", document, missingNode),
        uri
      );
      codeActions.push(createAutomatedTask);

      // create manual task
      const createManualTask = this.createCodeAction(
        "Manual Task",
        this.createTaskNode("manual", document, missingNode),
        uri
      );
      codeActions.push(createManualTask);

      // create category
      const createCategory = this.createCodeAction("Category", this.createCategory(document, missingNode), uri);
      codeActions.push(createCategory);
    }

    return codeActions;
  }

  /**
   * Creates an ActivityNode object with the given properties
   * @returns The serialized ActivityNode
   */
  private createActivityNode(type: NodeType, document: LangiumDocument, missingNode: Diagnostic): string {
    const activityNode: ActivityNode = {
      $container: document.parseResult.value as Model,
      $type: "ActivityNode",
      name: missingNode.data.refText ?? findAvailableNodeName(document.parseResult.value as Model, "_an"),
      nodeType: type,
    };
    return this.services.serializer.Serializer.serializeAstNode(activityNode);
  }

  /**
   * Creates a TaskNode object with the given properties
   * @returns The serialized TaskNode
   */
  private createTaskNode(type: TaskType, document: LangiumDocument, missingNode: Diagnostic): string {
    const taskNode: TaskNode = {
      $container: document.parseResult.value as Model,
      $type: "TaskNode",
      duration: 0,
      expanded: false,
      label: "TaskNode",
      name: missingNode.data.refText ?? findAvailableNodeName(document.parseResult.value as Model, "_tn"),
      taskType: type,
    };
    return this.services.serializer.Serializer.serializeAstNode(taskNode);
  }

  /**
   * Creates a Category object with the given properties
   * @returns The serialized Category
   */
  private createCategory(document: LangiumDocument, missingNode: Diagnostic): string {
    const category: Category = {
      $container: document.parseResult.value as Model,
      $type: "Category",
      label: "Category",
      name: missingNode.data.refText ?? findAvailableNodeName(document.parseResult.value as Model, "_cat"),
    };
    return this.services.serializer.Serializer.serializeAstNode(category);
  }

  /**
   * Creates a CodeAction that attaches a serialized
   * node to the end of the document with the given uri.
   * @returns The serialized Category
   */
  private createCodeAction(nodeType: string, serializedNode: string, uri: string): CodeAction {
    const action: CodeAction = {
      title: `Create missing ${nodeType}`,
      kind: "quickfix",
      edit: {
        changes: {
          [uri]: [
            {
              range: {
                start: {
                  character: Number.MAX_SAFE_INTEGER,
                  line: Number.MAX_SAFE_INTEGER,
                },
                end: {
                  character: Number.MAX_SAFE_INTEGER,
                  line: Number.MAX_SAFE_INTEGER,
                },
              },
              newText: `\n${serializedNode}\n`,
            },
          ],
        },
      },
    };
    return action;
  }
}
