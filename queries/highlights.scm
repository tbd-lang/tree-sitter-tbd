(comment) @comment

(string) @string

(char) @character

(numeric) @number
(unit) @number

(boolean) @boolean

((variant) @constant
  (#set! priority 130))

(module_access
  module: (ident) @module
  "." @punctuation.delimiter
  (#set! priority 140))


(module_access
  function: (ident) @function
  (#set! priority 130))

(op) @operator

(function
  "(" @keyword
  "function" @keyword
  ")" @keyword
  (#set! priority 130))

(function_header
  "(" @function
  name: (ident) @function
  ")" @function
  (#set! priority 130))

(function_header
  "(" @function
  name: (ident) @function
  parameter: (patt (ident) @variable.parameter)
  ")" @function
  (#set! priority 130))

(external
  "(" @keyword
  "external" @keyword
  ")" @keyword
  (#set! priority 130))

(external_header
  "(" @function
  name: (ident) @function
  parameter: (ident) @variable.parameter
  ")" @function
  (#set! priority 130))

(import
  "(" @keyword
  "import" @keyword
  ")" @keyword
 (#set! priority 140))

((import_path) @module
  (#set! priority 140))

(assign
  "(" @keyword
  kind: (let_keyword) @keyword
  ")" @keyword
  (#set! priority 130))

(cond
  "(" @keyword
  "if" @keyword
  ")" @keyword
  (#set! priority 130))

(match
  "(" @keyword
  "match" @keyword
  ")" @keyword
  (#set! priority 130))

(receive
  "(" @keyword
  "receive" @keyword
  ")" @keyword
  (#set! priority 130))

(match_branch
  "(" @keyword
  ")" @keyword
  (#set! priority 130))

(lambda
  "(" @keyword
  "fun" @keyword
  ")" @keyword
  (#set! priority 130))

(lambda_header
  "(" @keyword
  ")" @keyword
  (#set! priority 130))

(call
  "(" @function
  callee: (expr) @function
  ")" @function
  (#set! priority 130))

(call
  "(" @constant
  callee: (expr (variant) @constant)
  ")" @constant
  (#set! priority 130))

(call
  "(" @function
  callee: (expr (module_access) @function)
  ")" @function
  (#set! priority 130))

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
  "#{"
  "<<"
  ">>"
] @punctuation.bracket

[
  "|"
] @punctuation.delimiter

(ident) @variable
