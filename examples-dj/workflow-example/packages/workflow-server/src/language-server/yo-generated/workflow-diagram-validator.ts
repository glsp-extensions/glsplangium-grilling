import {
    AstNode,
    ValidationAcceptor,
    ValidationChecks,
    streamAllContents,
  } from "langium";
  import { Model, WorkflowDiagramAstType } from "../generated/ast.js";
  import type { WorkflowDiagramServices } from "./workflow-diagram-module.js";
  
  /**
   * Register custom validation checks.
   */
  export function registerValidationChecks(services: WorkflowDiagramServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.WorkflowDiagramValidator;
    const checks: ValidationChecks<WorkflowDiagramAstType> = {
      Model: [validator.checkNoDuplicateIds],
    };
    registry.register(checks, validator);
  }
  
  /**
   * Implementation of custom validations.
   */
  export class WorkflowDiagramValidator {
    checkNoDuplicateIds(model: Model, accept: ValidationAcceptor): void {
      const reported = new Set();
      streamAllContents(model).forEach((astNode: AstNode & { __id?: string }) => {
        if (astNode.__id) {
          if (reported.has(astNode.__id)) {
            accept("error", `Element has non-unique __id ${astNode.__id}.`, {
              node: astNode,
              property: "__id",
            });
          }
          reported.add(astNode.__id);
        }
      });
    }
  }
  