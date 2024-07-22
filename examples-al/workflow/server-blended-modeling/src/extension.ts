/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import * as path from "path";
// eslint-disable-next-line import/no-unresolved
import * as vscode from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from "vscode-languageclient/node.js";

let client: LanguageClient | undefined;

// This function is called when the extension is activated.
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  client = launchLanguageClient(context);
}

// This function is called when the extension is deactivated.
export function deactivate(): Thenable<void> | undefined {
  return client?.stop();
}

function launchLanguageClient(context: vscode.ExtensionContext): LanguageClient {
  const serverOptions: ServerOptions = createServerOptions(context);
  const clientOptions: LanguageClientOptions = createClientOptions(context);

  // Start the client. This will also launch the server
  const languageClient = new LanguageClient("workflow", "Workflow", serverOptions, clientOptions);
  languageClient.start();
  return languageClient;
}

function createServerOptions(context: vscode.ExtensionContext): ServerOptions {
  // needs to match the configuration in tsconfig.json and webpack.config.js
  const serverModule = context.asAbsolutePath(path.join("out", "server-main"));
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
  // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
  const debugOptions = {
    execArgv: ["--nolazy", `--inspect${process.env.DEBUG_BREAK ? "-brk" : ""}=${process.env.DEBUG_SOCKET || "6009"}`],
  };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  return {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
  };
}

function createClientOptions(context: vscode.ExtensionContext): LanguageClientOptions {
  const workflowWatcher = vscode.workspace.createFileSystemWatcher("**/*.{wf,wfd}");
  context.subscriptions.push(workflowWatcher);

  // watch changes to package.json as it contains the dependencies between our systems
  const packageWatcher = vscode.workspace.createFileSystemWatcher("**/package.json");
  context.subscriptions.push(packageWatcher);

  // we listen to directories separately as when we import a library, e.g., a directory within node_modules,
  // we only get that notification but not for nested files
  const directoryWatcher = vscode.workspace.createFileSystemWatcher("**/*/");
  context.subscriptions.push(directoryWatcher);

  // Options to control the language client
  return {
    documentSelector: [
      { scheme: "file", language: "workflow" },
      { scheme: "file", pattern: "**/package.json" },
    ],
    synchronize: {
      // Notify the server about file changes to files contained in the workspace
      fileEvents: [workflowWatcher, packageWatcher, directoryWatcher],
    },
  };
}
