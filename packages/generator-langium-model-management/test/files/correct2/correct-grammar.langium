grammar Test

import 'terminals'

entry Root :   '{'    (   '"elements"' ':' '[' ( (  elements += Element  ) (  ','   elements += Element  )* ) ']' ) ( ','  '"otherElements"' ':' '[' ( (  otherElements += OtherElement  ) (  ','   otherElements += OtherElement  )* ) ']' ) ( ','  '"connections"' ':' '[' ( (  connections += ConnectElementWithOtherElement  ) (  ','   connections += ConnectElementWithOtherElement  )* ) ']' )   '}' ;
Element :   '{'  '"__type"' ':' '"Element"'   ( ','  '"__id"' ':' '"' __id = LANGIUM_ID '"' ) ( ','  '"name"' ':' '"' name = LANGIUM_ID '"' )   '}' ;
OtherElement :   '{'  '"__type"' ':' '"OtherElement"'   ( ','  '"__id"' ':' '"' __id = LANGIUM_ID '"' ) ( ','  '"name"' ':' '"' name = LANGIUM_ID '"' )   '}' ;
ConnectElementWithOtherElement :   '{'  '"__type"' ':' '"ConnectElementWithOtherElement"'   ( ','  '"__id"' ':' '"' __id = LANGIUM_ID '"' ) ( ','  '"element"' ':' '{' '"__type"' ':' '"Reference"'  ','  '"__refType"' ':' '"Element"'  ','  '"__value"' ':' '"'element=[Element:LANGIUM_ID]'"' '}' ) ( ','  '"otherElement"' ':' '{' '"__type"' ':' '"Reference"'  ','  '"__refType"' ':' '"OtherElement"'  ','  '"__value"' ':' '"'otherElement=[OtherElement:LANGIUM_ID]'"' '}' )   '}' ;
