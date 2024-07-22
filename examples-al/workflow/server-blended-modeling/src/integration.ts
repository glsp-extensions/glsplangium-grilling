/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import { WorkflowServices, WorkflowSharedServices } from "./language-server/workflow-module.js";

/**
 * Language services required in GLSP.
 */
export const WorkflowLSPServices = Symbol("WorkflowLSPServices");
export interface WorkflowLSPServices {
  /** Language services shared across all languages. */
  shared: WorkflowSharedServices;
  /** Workflow language-specific services. */
  language: WorkflowServices;
}
