(comment) @comment

(string) @string

(integer) @number

(bool) @boolean

(constructor) @constructor

(module) @module

(call
  callee: (symbol) @function.call)

(call
  argument: (symbol) @variable)

(list
  (symbol) @variable
  (string) @string
  (integer) @number
  (bool) @boolean
  (constructor) @constructor
  (module) @module)

(tuple
  (symbol) @variable
  (string) @string
  (integer) @number
  (bool) @boolean
  (constructor) @constructor
  (module) @module)

(call
  callee: (symbol) @keyword
  (#any-of? @keyword
    "module"
    "function"
    "public"
    "match"
    "if"
    "let"
    "fun")
  (#set! priority 120))


[
  "("
  ")"
] @punctuation.paren

[
  "["
  "]"
] @punctuation.bracket

[
  "{"
  "}"
] @punctuation.brace
