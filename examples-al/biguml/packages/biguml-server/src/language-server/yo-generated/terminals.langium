hidden terminal WS: /\s+/;
terminal BOOL returns boolean: /true|false/;
terminal INT returns number: /(-)?[0-9]+(\.[0-9]*)?/;
terminal ID: /([\w_-]|[*])+/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;