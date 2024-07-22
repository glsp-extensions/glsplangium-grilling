import { ValidationAcceptor, ValidationChecks } from "langium";
import {
  WorkflowAstType,
  WeightedEdge,
  ActivityNode,
  Model,
  isWeightedEdge,
  isPosition,
  isSize,
} from "./generated/ast.js";
import type { WorkflowServices } from "./workflow-module.js";

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: WorkflowServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.WorkflowValidator;
  const checks: ValidationChecks<WorkflowAstType> = {
    Model: [
      validator.checkNoDuplicateNames,
      validator.checkNoDuplicateEdges,
      validator.checkNoDuplicatePosition,
      validator.checkNoDuplicateSize,
      validator.checkAstNodeInCorrectFile,
    ],
    WeightedEdge: validator.checkWeigtedEdgeStartsFromDecisionNode,
  };
  registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class WorkflowValidator {
  checkWeigtedEdgeStartsFromDecisionNode(weigtedEdge: WeightedEdge, accept: ValidationAcceptor): void {
    if (weigtedEdge.source?.ref?.$type === "ActivityNode") {
      const sourceNode: ActivityNode = weigtedEdge.source.ref as ActivityNode;
      if (sourceNode.nodeType !== "decision") {
        accept("error", "WeightedEdge source must be a decision node.", {
          node: weigtedEdge,
          property: "source",
        });
      }
    } else if (weigtedEdge.source?.ref) {
      accept("error", "WeightedEdge source must be a decision node.", {
        node: weigtedEdge,
        property: "source",
      });
    }
  }

  checkNoDuplicateNames(model: Model, accept: ValidationAcceptor): void {
    const reported = new Set();
    model.nodes.forEach((node) => {
      if (reported.has(node.name)) {
        accept("error", `Node has non-unique name '${node.name}'.`, {
          node: node,
          property: "name",
        });
      }
      reported.add(node.name);
    });
  }

  checkNoDuplicateEdges(model: Model, accept: ValidationAcceptor): void {
    const reportedEdges = new Set();
    const reportedWeightedEdges = new Set();
    model.edges.forEach((edge) => {
      if (!isWeightedEdge(edge) && reportedEdges.has(`edge${edge.source?.$refText}${edge.target?.$refText}`)) {
        accept("error", `Edge already exists '${edge.source?.$refText}->${edge.target?.$refText}'.`, {
          node: edge,
          property: "target",
        });
      } else if (!isWeightedEdge(edge)) {
        reportedEdges.add(`edge${edge.source?.$refText}${edge.target?.$refText}`);
      } else if (
        isWeightedEdge(edge) &&
        reportedWeightedEdges.has(`weighted_edge${edge.source?.$refText}${edge.target?.$refText}`)
      ) {
        accept("error", `Weighted edge already exists '${edge.source?.$refText}->${edge.target?.$refText}'.`, {
          node: edge,
          property: "target",
        });
      } else {
        reportedWeightedEdges.add(`weighted_edge${edge.source?.$refText}${edge.target?.$refText}`);
      }
    });
  }

  checkNoDuplicatePosition(model: Model, accept: ValidationAcceptor): void {
    const reported = new Set();
    model.metaInfos.forEach((metaInfo) => {
      if (isPosition(metaInfo)) {
        if (metaInfo.node) {
          if (reported.has(metaInfo.node.$refText)) {
            accept("error", `Position for '${metaInfo.node.$refText}' is already set.`, {
              node: metaInfo,
              property: "node",
            });
          }
          reported.add(metaInfo.node.$refText);
        }
      }
    });
  }

  checkNoDuplicateSize(model: Model, accept: ValidationAcceptor): void {
    const reported = new Set();
    model.metaInfos.forEach((metaInfo) => {
      if (isSize(metaInfo)) {
        if (metaInfo.node) {
          if (reported.has(metaInfo.node.$refText)) {
            accept("error", `Size for '${metaInfo.node.$refText}' is already set.`, {
              node: metaInfo,
              property: "node",
            });
          }
          reported.add(metaInfo.node.$refText);
        }
      }
    });
  }

  checkAstNodeInCorrectFile(model: Model, accept: ValidationAcceptor): void {
    if (model.$document?.uri.toString().endsWith(".wf")) {
      if (model.metaInfos.length > 0) {
        model.metaInfos.forEach((metaInfo) => {
          accept("error", `MetaInfo is not allowed in this file, place it in a .wfd file`, { node: metaInfo });
        });
      }
    } else if (model.$document?.uri.toString().endsWith(".wfd")) {
      if (model.nodes.length > 0) {
        model.nodes.forEach((node) => {
          accept("error", `Node is not allowed in this file, place it in a .wf file`, {
            node: node,
          });
        });
      }
      if (model.edges.length > 0) {
        model.edges.forEach((edge) => {
          accept("error", `Edge is not allowed in this file, place it in a .wf file`, {
            node: edge,
          });
        });
      }
    }
  }
}
