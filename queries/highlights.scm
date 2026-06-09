; Keywords
[
  "fun"
  "let"
  "let!"
  "let?"
  "in"
  "when"
  "is"
  "then"
  "and"
  "pub"
] @keyword

; Operators
[
  "->"
  "|>"
  "="
  "::"
  "&&"
  "||"
  ">="
  "<="
  ">"
  "<"
  "=="
  "!="
  "+"
  "-"
  "*"
  "/"
] @operator

; Punctuation
[ "(" ")" "{" "}" "[" "]" ] @punctuation.bracket
[ "," "." "|" ]             @punctuation.delimiter

; Function definition name
(fun_def name: (lower_ident) @function)

; Local function name
(expr_fun name: (lower_ident) @function)

; Call sites
(expr_call
  callee: (lower_ident) @function.call)

(expr_call
  module: (upper_ident) @module
  name:   (lower_ident) @function.call)

; Lambda
(expr_lambda "->" @operator)

; Constructors / modules
(upper_ident) @type.enum.variant

(patt_constructor name: (upper_ident) @type.enum.variant)

; Variables / identifiers
(lower_ident) @variable

; Literals
(literal_string) @string
(literal_char)   @character
(literal_int)    @number
(literal_float)  @number.float

; Wildcard
(patt_wildcard) @variable.builtin

; Comments
(comment) @comment @spell
