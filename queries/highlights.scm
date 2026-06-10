; Comments
(comment) @comment

; Literals
(string) @string
(char) @character
(integer) @number
(float) @number.float
(boolean) @boolean

; Keywords
[
  "let"
  "let!"
  "let?"
  "in"
  "then"
] @keyword

"import" @keyword.import
"extern" @keyword.function
"fun" @keyword.function

[
  "when"
  "is"
  "and"
] @keyword.conditional

"pub" @keyword.modifier

; Operators
[
  "|>"
  "||"
  "&&"
  "=="
  "!="
  ">="
  "<="
  ">"
  "<"
  "::"
  "+"
  "-"
  "*"
  "/"
  "="
  "->"
] @operator

; Punctuation
[ "(" ")" "{" "}" "[" "]" ] @punctuation.bracket
[ "," "|" "." ] @punctuation.delimiter

; --- Fallbacks (overridden by the specific captures below) ---
(lower_ident) @variable
(upper_ident) @constructor

; Definitions
(import_declaration module: (upper_ident) @module)
(extern_definition name: (lower_ident) @function)
(function_definition name: (lower_ident) @function)
(let_function_expression name: (lower_ident) @function)

; Parameters
(parameters (lower_ident) @variable.parameter)

; Qualified names: Module.name
(qualified_identifier name: (lower_ident) @function)
(qualified_identifier module: (upper_ident) @module)

; Calls
(call_expression
  function: (lower_ident) @function.call)
(call_expression
  function: (qualified_identifier name: (lower_ident) @function.call))

; Constructor patterns
(constructor_pattern constructor: (upper_ident) @constructor)

; Wildcard
(wildcard_pattern) @variable.builtin
