/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import 'reflect-metadata';

import {
    GlspVscodeConnector,
    NavigateAction,
    SocketGlspVscodeServer,
    configureDefaultCommands
} from '@eclipse-glsp/vscode-integration/node';
import * as path from 'path';
import * as process from 'process';
import * as vscode from 'vscode';
import WorkflowEditorProvider from './workflow-editor-provider';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';

const DEFAULT_SERVER_PORT = '5007';

let languageClient: LanguageClient | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    // Start server process using quickstart component

    languageClient = launchLanguageClient(context);
    // Wrap server with quickstart component
    setTimeout(() => {
        const workflowServer = new SocketGlspVscodeServer({
            clientId: 'glsp.workflow',
            clientName: 'workflow',
            connectionOptions: {
                port: JSON.parse(process.env.GLSP_SERVER_PORT || DEFAULT_SERVER_PORT),
                host: '127.0.0.1'
            }
        });

        // Initialize GLSP-VSCode connector with server wrapper
        const glspVscodeConnector = new GlspVscodeConnector({
            server: workflowServer,
            logging: true
        });

        const customEditorProvider = vscode.window.registerCustomEditorProvider(
            'workflow.glspDiagram',
            new WorkflowEditorProvider(context, glspVscodeConnector),
            {
                webviewOptions: { retainContextWhenHidden: true },
                supportsMultipleEditorsPerDocument: false
            }
        );

        context.subscriptions.push(workflowServer, glspVscodeConnector, customEditorProvider);
        workflowServer.start();

        configureDefaultCommands({ extensionContext: context, connector: glspVscodeConnector, diagramPrefix: 'workflow' });

        context.subscriptions.push(
            vscode.commands.registerCommand('workflow.goToNextNode', () => {
                glspVscodeConnector.sendActionToActiveClient(NavigateAction.create('next'));
            }),
            vscode.commands.registerCommand('workflow.goToPreviousNode', () => {
                glspVscodeConnector.sendActionToActiveClient(NavigateAction.create('previous'));
            }),
            vscode.commands.registerCommand('workflow.showDocumentation', () => {
                glspVscodeConnector.sendActionToActiveClient(NavigateAction.create('documentation'));
            })
        );
    }, 5000);
}

// This function is called when the extension is deactivated.
export function deactivate(): Thenable<void> | undefined {
    return languageClient?.stop();
}

function launchLanguageClient(context: vscode.ExtensionContext): LanguageClient {
    const serverOptions: ServerOptions = createServerOptions(context);
    const clientOptions: LanguageClientOptions = createClientOptions(context);

    // Start the client. This will also launch the server
    const client = new LanguageClient('workflow', 'Workflow', serverOptions, clientOptions);
    client.start();
    return client;
}

function createServerOptions(context: vscode.ExtensionContext): ServerOptions {
    // needs to match the configuration in tsconfig.json and webpack.config.js
    const serverModule = context.asAbsolutePath(path.join('../../../../', 'server-blended-modeling', 'out', 'main.cjs'));
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
    // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
    const debugOptions = {
        execArgv: ['--nolazy', `--inspect${process.env.DEBUG_BREAK ? '-brk' : ''}=${process.env.DEBUG_SOCKET || '6009'}`]
    };

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    return {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    };
}

function createClientOptions(context: vscode.ExtensionContext): LanguageClientOptions {
    const workflowWatcher = vscode.workspace.createFileSystemWatcher('**/*.{wf,wfd}');
    context.subscriptions.push(workflowWatcher);

    // watch changes to package.json as it contains the dependencies between our systems
    const packageWatcher = vscode.workspace.createFileSystemWatcher('**/package.json');
    context.subscriptions.push(packageWatcher);

    // we listen to directories separately as when we import a library, e.g., a directory within node_modules,
    // we only get that notification but not for nested files
    const directoryWatcher = vscode.workspace.createFileSystemWatcher('**/*/');
    context.subscriptions.push(directoryWatcher);

    // Options to control the language client
    return {
        documentSelector: [
            { scheme: 'file', language: 'workflow' },
            { scheme: 'file', pattern: '**/package.json' }
        ],
        synchronize: {
            // Notify the server about file changes to files contained in the workspace
            fileEvents: [workflowWatcher, packageWatcher, directoryWatcher]
        }
    };
}
