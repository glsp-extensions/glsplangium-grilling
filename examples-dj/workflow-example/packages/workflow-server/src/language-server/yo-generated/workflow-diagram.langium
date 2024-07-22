grammar WorkflowDiagram

import 'terminals'

entry Model :   '{'    (   '"nodes"' ':' '[' ( (  nodes += Node  ) (  ','   nodes += Node  )* )? ']' )? ( ','  '"edges"' ':' '[' ( (  edges += Edge  ) (  ','   edges += Edge  )* )? ']' )? ( ','  '"metaInfos"' ':' '[' ( (  metaInfos += MetaInfo  ) (  ','   metaInfos += MetaInfo  )* )? ']' )?   '}' ;
TaskNode :   '{'  '"__type"' ':' '"TaskNode"'   ( ','  '"__id"' ':' '"' __id = LANGIUM_ID '"' ) ( ','  '"label"' ':' '"' label = LANGIUM_ID '"' )? ( ','  '"duration"' ':' duration = LANGIUM_INT )? ( ','  '"taskType"' ':' '"' taskType = TaskType '"' )? ( ','  '"reference"' ':' '"' reference = LANGIUM_ID '"' )? ( ','  '"name"' ':' '"' name = LANGIUM_ID '"' )   '}' ;
Category :   '{'  '"__type"' ':' '"Category"'   ( ','  '"__id"' ':' '"' __id = LANGIUM_ID '"' ) ( ','  '"children"' ':' children = Model )? ( ','  '"label"' ':' '"' label = LANGIUM_ID '"' )? ( ','  '"name"' ':' '"' name = LANGIUM_ID '"' )   '}' ;
ActivityNode :   '{'  '"__type"' ':' '"ActivityNode"'   ( ','  '"__id"' ':' '"' __id = LANGIUM_ID '"' ) ( ','  '"nodeType"' ':' '"' nodeType = NodeType '"' )? ( ','  '"name"' ':' '"' name = LANGIUM_ID '"' )   '}' ;
Edge :  WeightedEdge  |   '{'  '"__type"' ':' '"Edge"'   ( ','  '"__id"' ':' '"' __id = LANGIUM_ID '"' ) ( ','  '"source"' ':' '{' '"__type"' ':' '"Reference"'  ','  '"__refType"' ':' '"Node"'  ','  '"__value"' ':' '"'source=[Node:LANGIUM_ID]'"' '}' ) ( ','  '"target"' ':' '{' '"__type"' ':' '"Reference"'  ','  '"__refType"' ':' '"Node"'  ','  '"__value"' ':' '"'target=[Node:LANGIUM_ID]'"' '}' )   '}' ;
WeightedEdge :   '{'  '"__type"' ':' '"WeightedEdge"'   ( ','  '"__id"' ':' '"' __id = LANGIUM_ID '"' ) ( ','  '"weight"' ':' '"' weight = Weight '"' ) ( ','  '"source"' ':' '{' '"__type"' ':' '"Reference"'  ','  '"__refType"' ':' '"Node"'  ','  '"__value"' ':' '"'source=[Node:LANGIUM_ID]'"' '}' ) ( ','  '"target"' ':' '{' '"__type"' ':' '"Reference"'  ','  '"__refType"' ':' '"Node"'  ','  '"__value"' ':' '"'target=[Node:LANGIUM_ID]'"' '}' )   '}' ;
Size :   '{'  '"__type"' ':' '"Size"'   ( ','  '"__id"' ':' '"' __id = LANGIUM_ID '"' ) ( ','  '"height"' ':' height = LANGIUM_INT ) ( ','  '"width"' ':' width = LANGIUM_INT ) ( ','  '"node"' ':' '{' '"__type"' ':' '"Reference"'  ','  '"__refType"' ':' '"Node"'  ','  '"__value"' ':' '"'node=[Node:LANGIUM_ID]'"' '}' )   '}' ;
Position :   '{'  '"__type"' ':' '"Position"'   ( ','  '"__id"' ':' '"' __id = LANGIUM_ID '"' ) ( ','  '"x"' ':' x = LANGIUM_INT ) ( ','  '"y"' ':' y = LANGIUM_INT ) ( ','  '"node"' ':' '{' '"__type"' ':' '"Reference"'  ','  '"__refType"' ':' '"Node"'  ','  '"__value"' ':' '"'node=[Node:LANGIUM_ID]'"' '}' )   '}' ;
NodeType  returns string : "decision" | "fork" | "join" | "merge" ;
TaskType  returns string : "manual" | "automated" ;
Weight  returns string : "low" | "medium" | "high" ;
Node  : TaskNode | Category | ActivityNode ;
MetaInfo  : Size | Position ;