/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
/* eslint-disable import/no-duplicates */
import { configureELKLayoutModule } from "@eclipse-glsp/layout-elk";
import { LoggerFactory, LogLevel, MaybePromise, ServerModule } from "@eclipse-glsp/server";
import { createAppModule, defaultLaunchOptions, SocketServerLauncher } from "@eclipse-glsp/server/node.js";
import { Container, ContainerModule } from "inversify";
import { WorkflowServices, WorkflowSharedServices } from "../language-server/workflow-module.js";
import { WorkflowDiagramModule } from "./diagram/workflow-diagram-module.js";
import { WorkflowLSPServices } from "../integration.js";
import { WorkflowLayoutConfigurator } from "./common/layout/workflow-layout-configurator.js";

const GLSP_SERVER_PORT = 5007;
const GLSP_SERVER_HOST = "127.0.0.1";

/**
 * Launches a GLSP server with access to the given language services on the default port.
 *
 * @param services language services
 * @returns a promise that is resolved as soon as the server is shut down or rejects if an error occurs
 */
export function startGLSPServer(services: WorkflowLSPServices): MaybePromise<void> {
  const launchOptions = { ...defaultLaunchOptions, logLevel: LogLevel.debug };

  // create module based on launch options, e.g., logging etc.
  const appModule = createAppModule(launchOptions);
  // create custom module to bind language services to support injection within GLSP classes
  const lspModule = createLSPModule(services);

  // create app container will all necessary modules and retrieve launcher
  const appContainer = new Container();
  appContainer.load(appModule, lspModule);

  const logger = appContainer.get<LoggerFactory>(LoggerFactory)("WorkflowServer");
  const launcher = appContainer.resolve<SocketServerLauncher>(SocketServerLauncher);

  // use Eclipse Layout Kernel with our custom layered layout configuration
  const elkLayoutModule = configureELKLayoutModule({
    algorithms: ["layered"],
    layoutConfigurator: WorkflowLayoutConfigurator,
  });

  // create server module with our workflow model diagram
  const serverModule = new ServerModule().configureDiagramModule(new WorkflowDiagramModule(), elkLayoutModule);

  launcher.configure(serverModule);
  try {
    return launcher.start({ ...launchOptions, port: GLSP_SERVER_PORT, host: GLSP_SERVER_HOST });
  } catch (error) {
    logger.error("Error in GLSP server launcher:", error);
  }
}

/**
 * Custom module to bind language services so that they can be injected in other classes created through DI.
 *
 * @param services language services
 * @returns container module
 */
export function createLSPModule(services: WorkflowLSPServices): ContainerModule {
  return new ContainerModule((bind) => {
    bind(WorkflowLSPServices).toConstantValue(services);
    bind(WorkflowSharedServices).toConstantValue(services.shared);
    bind(WorkflowServices).toConstantValue(services.language);
  });
}
