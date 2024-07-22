grammar Workflow

entry Model:
    (nodes+=Node | edges+=Edge | metaInfos+=MetaInfo)*;

Node:
    (TaskNode | Category | ActivityNode);

MetaInfo:
    (Size | Position);

TaskNode:
    'TaskNode' name=ID label=STRING? (expanded?='expanded')?
    duration=NUMBER? taskType=TaskType?';';

Category:
    'Category' name=ID label=STRING? ('{' children=Model '}')? ';';

ActivityNode:
    'ActivityNode' name=ID (nodeType=NodeType)?';';

TaskType returns string:
    'automated' | 'manual';

NodeType returns string:
    'decision' | 'fork' | 'join' | 'merge';

Weight returns string:
    'low' | 'medium' | 'high';

Edge:
    (source=[Node:ID] '->' (target=[Node:ID])? ';') | 
    ((source=[Node:ID])? '->' target=[Node:ID] ';') | 
    WeightedEdge;

WeightedEdge:
    (source=[Node:ID] '->' probability=Weight (target=[Node:ID])? ';') | 
    ((source=[Node:ID])? '->' probability=Weight target=[Node:ID] ';');

Size:
    'Size' node=[Node:ID] width=NUMBER height=NUMBER ';';

Position:
    'Position' node=[Node:ID] x=NUMBER y=NUMBER ';';

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z@][\w_\-@\/#]*/;
terminal STRING: /"[^"]*"|'[^']*'/;
terminal NUMBER returns number: /(-)?[0-9]+(\.[0-9]*)?/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
