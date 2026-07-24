((comment) @comment (#set! priority 127))

((string) @string (#set! priority 127))

((char) @character (#set! priority 127))

((numeric) @number (#set! priority 127))

((unit) @number (#set! priority 127))

((boolean) @boolean (#set! priority 127))

((variant) @constant
  (#set! priority 130))

((module_name) @module
  (#set! priority 140))

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

(external
  "(" @keyword
  "external" @keyword
  ")" @keyword
  (#set! priority 130))

(external_header
  "(" @function
  name: (ident) @function
  ")" @function
  (#set! priority 130))

(import
  "(" @keyword
  "import" @keyword
  ")" @keyword
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

(binary_segment
  "(" @punctuation.bracket
  type: (ident) @type 
  ")" @punctuation.bracket
  (#set! priority 140))

([
  "("
  ")"
  "["
  "]"
  "{"
  "}"
  "#{"
  "<<"
  ">>"
] @punctuation.bracket (#set! priority 125))

((ident) @variable (#set! priority 100))
