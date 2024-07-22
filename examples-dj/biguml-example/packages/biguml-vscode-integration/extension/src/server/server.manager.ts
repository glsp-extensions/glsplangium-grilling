/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ContainerModule, inject, injectable, multiInject } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../di.types';
import { VSCodeSettings } from '../language';
import { OutputChannel } from '../vscode/output/output.channel';
import { UmlServerLauncher } from './launcher';

export interface ServerManagerStateListener {
    serverManagerStateChanged(manager: ServerManager, state: ServerManager.State): void | Promise<void>;
}

export const serverManagerModule = new ContainerModule(bind => {
    bind(ServerManager).toSelf().inSingletonScope();
    bind(TYPES.ServerManager).toService(ServerManager);
});

@injectable()
export class ServerManager {
    protected _state: ServerManager.State = {
        state: 'none'
    };

    public get state(): ServerManager.State {
        return this._state;
    }

    protected set state(value: ServerManager.State) {
        this._state = value;
        this.emit(l => l.serverManagerStateChanged(this, this._state));
    }

    constructor(
        @inject(TYPES.OutputChannel) protected readonly output: OutputChannel,
        @multiInject(TYPES.ServerLauncher) protected readonly launchers: UmlServerLauncher[],
        @multiInject(TYPES.ServerManagerStateListener) protected readonly listeners: ServerManagerStateListener[]
    ) {
        this.listeners.forEach(l => l.serverManagerStateChanged(this, this.state));
    }

    async start(): Promise<void> {
        let progressResolve: (() => void) | undefined;
        let progress: vscode.Progress<{ message?: string; increment?: number }> | undefined;

        vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: `Initializing ${VSCodeSettings.name} environment`,
                cancellable: false
            },
            p => {
                progress = p;
                return new Promise<void>(resolve => {
                    progressResolve = resolve;
                });
            }
        );

        const launchers = this.launchers.filter(l => l.isEnabled);
        this.output.channel.appendLine(`Registered server launchers: ${this.launchers.map(l => l.serverName).join(', ')}`);

        if (launchers.length > 0) {
            this.output.channel.appendLine(`Enabled server launchers: ${launchers.map(l => l.serverName).join(', ')}`);

            try {
                this.state = {
                    state: 'assertion-succeeded'
                };

                for (const launcher of launchers) {
                    this.state = {
                        state: 'launching-server',
                        launcher
                    };

                    progress?.report({
                        message: `Starting ${launcher.serverName}`
                    });

                    await launcher.start();
                    await launcher.ping();
                }
                progress?.report({
                    message: undefined
                });

                this.state = {
                    state: 'servers-launched',
                    launchers
                };
            } catch (error) {
                this.output.appendLine('Something went wrong. Please check the logs.');
                this.output.error(error as Error);
                vscode.window.showErrorMessage('Something went wrong. Please check the logs.');

                let reason = 'Something went wrong.';
                let details: string | undefined =
                    'Please check the logs (Command: > Output: Show Output Channels... -> bigUML Modeling Tool).';

                if (error instanceof Error) {
                    reason = error.message;
                    details = error.stack;
                }

                this.state = {
                    state: 'error',
                    reason,
                    details
                };
            }
        } else {
            this.output.channel.appendLine('Skip starting servers, no server enabled.');
            this.state = {
                state: 'servers-launched',
                launchers
            };
        }

        progressResolve?.();
    }

    async stop(): Promise<void> {
        const launchers = this.launchers.filter(l => l.isRunning);

        for (const launcher of launchers) {
            await launcher.stop();
        }

        this.state = {
            state: 'none'
        };
    }

    protected emit(cb: (l: ServerManagerStateListener) => void): void {
        this.listeners.forEach(cb);
    }
}

export namespace ServerManager {
    export type ActiveState = 'none' | 'error' | 'assertion-succeeded' | 'launching-server' | 'servers-launched';

    interface CommonState {
        readonly state: ActiveState;
    }

    export interface NoneState extends CommonState {
        readonly state: 'none';
    }

    export interface ErrorState extends CommonState {
        readonly state: 'error';
        readonly reason: any;
        readonly details?: any;
    }

    export interface AssertionSucceededState extends CommonState {
        readonly state: 'assertion-succeeded';
    }

    export interface LaunchingServerState extends CommonState {
        readonly state: 'launching-server';
        readonly launcher: UmlServerLauncher;
    }

    export interface ServerLaunchedState extends CommonState {
        readonly state: 'servers-launched';
        readonly launchers: UmlServerLauncher[];
    }

    export type State = NoneState | ErrorState | AssertionSucceededState | LaunchingServerState | ServerLaunchedState;
}
