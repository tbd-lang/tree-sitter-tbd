(comment) @comment

(string) @string

(numeric) @number

(boolean) @boolean

(variant
  ":" @punctuation.special
  name: (ident) @constructor
  (#set! priority 130))

(module_access
  module: (ident) @module
  (#set! priority 140))

(module_access
  function: (ident) @function.call
  (#set! priority 130))

(op) @operator

(function
  "function" @keyword
  name: (ident) @function
  (#set! priority 130))

(external
  "external" @keyword
  name: (ident) @function
  (#set! priority 130))

(function
  parameter: (patt (ident) @variable.parameter)
  (#set! priority 130))

(external
  parameter: (patt (ident) @variable.parameter)
  (#set! priority 130))

(import
  "import" @keyword)

(import_path
  path: (ident) @module)

(import_path
  module: (ident) @module
  (#set! priority 140))

(assign
  kind: (let_keyword) @keyword)

(cond
  "if" @keyword)

(match
  "match" @keyword)

(lambda
  "fun" @keyword)

(call
  callee: (expr (ident) @function.call)
  (#set! priority 130))

(call
  callee: (expr (module_access) @function.call)
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

":" @punctuation.delimiter

(ident) @variable
