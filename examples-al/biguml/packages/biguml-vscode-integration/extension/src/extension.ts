/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import 'reflect-metadata';

import { configureDefaultCommands } from '@eclipse-glsp/vscode-integration/node.js';
import { Container } from 'inversify';
import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/node.js';
import { createContainer } from './di.config.js';
import { TYPES } from './di.types.js';
import { UVGlspConnector } from './glsp/uv-glsp-connector.js';
import { UVGlspServer } from './glsp/uv-glsp-server.js';
import { VSCodeSettings } from './language.js';
import { createLanguageClientConfig, createModelServerConfig } from './languageclient/uv-languageclient.js';
import { createGLSPServerConfig } from './server/glsp-server.launcher.js';
import { ServerManager } from './server/server.manager.js';

let diContainer: Container | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    console.log('ACTIVATING EXTENSION');

    // Start server process using quickstart component
    const languageClientConfig = createLanguageClientConfig(context);
    const modelServerConfig = createModelServerConfig();
    const glspServerConfig = createGLSPServerConfig();
    // Wrap server with quickstart component

    console.log('GOT MODELSERVER CONFIG AND GLSP SERVER CONFIG');

    diContainer = createContainer(context, {
        glspServerConfig,
        languageClientConfig,
        modelServerConfig
    });
    console.log('CREATED DI CONTAINER');
    configureDefaultCommands({
        extensionContext: context,
        connector: diContainer.get<UVGlspConnector>(TYPES.Connector),
        diagramPrefix: VSCodeSettings.commands.prefix
    });
    console.log('CONFIGURED DEFAULT COMMANDS');
    diContainer.getAll<any>(TYPES.RootInitialization);
    console.log('GOT ALL ROOT INITIALIZATION');
    diContainer.get<LanguageClient>(TYPES.LanguageClient).start();
    console.log('STARTED LANGUAGE CLIENT');
    setTimeout(() => {
        diContainer!.get<UVGlspServer>(TYPES.GlspServer).start();
        console.log('STARTED GLSP SERVER');
        setTimeout(() => {
            diContainer!.get<ServerManager>(TYPES.ServerManager).start();
            console.log('STARTED SERVER MANAGER');
            vscode.commands.executeCommand('setContext', `${VSCodeSettings.name}.isRunning`, true);
        }, 3000);
    }, 5000);
}

export async function deactivate(context: vscode.ExtensionContext): Promise<any> {
    if (diContainer) {
        return Promise.all([diContainer.get<ServerManager>(TYPES.ServerManager).stop()]);
    }
}
