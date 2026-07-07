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

(map
  (symbol) @variable
  (string) @string
  (integer) @number
  (bool) @boolean
  (constructor) @constructor
  (module) @module)

(binary
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
    "fun"
    "import"
    "external")
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
