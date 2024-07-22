/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import {
  WorkflowDiagramServices,
  WorkflowDiagramSharedServices,
} from "./language-server/yo-generated/workflow-diagram-module.js";

/**
 * Language services required in GLSP.
 */
export const WorkflowLSPServices = Symbol("WorkflowDiagramLSPServices");
export interface WorkflowLSPServices {
  /** Language services shared across all languages. */
  shared: WorkflowDiagramSharedServices;
  /** WorkflowDiagram language-specific services. */
  language: WorkflowDiagramServices;
}
