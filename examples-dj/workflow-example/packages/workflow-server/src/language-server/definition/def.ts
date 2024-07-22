import { root, crossReference } from "generator-langium-model-management";

type NodeType = "decision" | "fork" | "join" | "merge";
type TaskType = "manual" | "automated";
type Weight = "low" | "medium" | "high";

@root
class Model {
  nodes?: Array<Node>;
  edges?: Array<Edge>;
  metaInfos?: Array<MetaInfo>;
}
abstract class Node {
  name: string;
}
class TaskNode extends Node {
  label?: string;
  duration?: number;
  taskType?: TaskType;
  reference?: string;
}
class Category extends Node {
  children?: Model;
  label?: string;
}
class ActivityNode extends Node {
  nodeType?: NodeType;
}
class Edge {
  @crossReference source: Node;
  @crossReference target: Node;
}
class WeightedEdge extends Edge {
  weight: Weight;
}
abstract class MetaInfo {
  @crossReference node: Node;
}
class Size extends MetaInfo {
  height: number;
  width: number;
}
class Position extends MetaInfo {
  x: number;
  y: number;
}
