/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { configureELKLayoutModule } from '@eclipse-glsp/layout-elk';
import { LogLevel, LoggerFactory, MaybePromise } from '@eclipse-glsp/server';
import { SocketServerLauncher, createAppModule, defaultLaunchOptions } from '@eclipse-glsp/server/node.js';
import { Container, ContainerModule } from 'inversify';
import { BigUmlLSPServices } from '../integration.js';
import { UmlServices, UmlSharedServices } from '../language-server/yo-generated/uml-module.js';
import { BigUmlServerModule } from './biguml-glsp-server.js';
import { BigUmlLayoutConfigurator } from './layout/biguml-layout.configurator.js';
import { PackageDiagramModule } from './package-diagram/diagram/package-diagram-module.js';

const GLSP_SERVER_PORT = 5007;
const GLSP_SERVER_HOST = '127.0.0.1';

/**
 * Launches a GLSP server with access to the given language services on the default port.
 *
 * @param services language services
 * @returns a promise that is resolved as soon as the server is shut down or rejects if an error occurs
 */
export function startGLSPServer(services: BigUmlLSPServices, workspaceFolders: any): MaybePromise<void> {
    const launchOptions = { ...defaultLaunchOptions, logLevel: LogLevel.debug };
    //     // create module based on launch options, e.g., logging etc.
    const appModule = createAppModule(launchOptions);
    //     // create custom module to bind language services to support injection within GLSP classes
    const lspModule = createLSPModule(services);
    //     // create app container will all necessary modules and retrieve launcher
    const appContainer = new Container();
    appContainer.load(appModule, lspModule);
    const logger = appContainer.get<LoggerFactory>(LoggerFactory)('BigUmlServer');
    const launcher = appContainer.resolve<SocketServerLauncher>(SocketServerLauncher);
    //     // use Eclipse Layout Kernel with our custom layered layout configuration
    const elkLayoutModule = configureELKLayoutModule({
        algorithms: ['layered'],
        layoutConfigurator: BigUmlLayoutConfigurator
    });
    //     // create server module with our workflow model diagram
    const serverModule = new BigUmlServerModule().configureDiagramModule(new PackageDiagramModule(), elkLayoutModule);
    launcher.configure(serverModule);
    try {
        return launcher.start({
            ...launchOptions,
            port: GLSP_SERVER_PORT,
            host: GLSP_SERVER_HOST
        });
    } catch (error) {
        logger.error('Error in GLSP server launcher:', error);
    }
}
// /**
//  * Custom module to bind language services so that they can be injected in other classes created through DI.
//  *
//  * @param services language services
//  * @returns container module
//  */
export function createLSPModule(services: BigUmlLSPServices): ContainerModule {
    return new ContainerModule(bind => {
        bind(BigUmlLSPServices).toConstantValue(services);
        bind(UmlSharedServices).toConstantValue(services.shared);
        bind(UmlServices).toConstantValue(services.language);
    });
}
