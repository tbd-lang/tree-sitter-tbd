; Keywords
"function" @keyword.function
"let" @keyword
"in" @keyword
"if" @keyword.conditional
"else" @keyword.conditional

; Operators
"::" @operator
(comparison_op) @operator
(additive_op) @operator
(multiplicative_op) @operator
"=" @operator

; Punctuation
"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"," @punctuation.delimiter
";" @punctuation.delimiter
":" @punctuation.delimiter

; Literals
(integer) @number
(float) @number.float
(string) @string
(unit) @constant.builtin

; Function definitions
(function_def name: (identifier) @function)

; Function calls
(application_expr func: (identifier) @function.call)

; Parameters
(param_list (identifier) @variable.parameter)

; Let bindings
(let_expr name: (identifier) @variable)

; General identifiers
(identifier) @variable

; Comments
(comment) @comment
