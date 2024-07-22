import {
  DefaultScopeComputation,
  AstNode,
  LangiumDocument,
  streamContents,
  AstNodeDescription,
  interruptAndCheck,
} from "langium";
import { CancellationToken } from "vscode-jsonrpc";
import { isCategory } from "./generated/ast.js";

/**
 * Custom scope computation that also exports children of a Category node.
 */
export class WorkflowScopeComputation extends DefaultScopeComputation {
  override async computeExportsForNode(
    parentNode: AstNode,
    document: LangiumDocument<AstNode>,
    children: (root: AstNode) => Iterable<AstNode> = streamContents,
    cancelToken: CancellationToken = CancellationToken.None
  ): Promise<AstNodeDescription[]> {
    const exports: AstNodeDescription[] = [];

    this.exportNode(parentNode, exports, document);
    for (const node of children(parentNode)) {
      await interruptAndCheck(cancelToken);
      this.exportNode(node, exports, document);
      if (isCategory(node) && node.children) {
        // recursively include elements of the child model of a category node
        exports.push(...(await this.computeExportsForNode(node.children, document, children, cancelToken)));
      }
    }
    return exports;
  }
}
