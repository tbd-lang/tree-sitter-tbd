module.exports = grammar({
  name: "tbd",

  extras: ($) => [/\s/, $.comment],

  word: ($) => $.identifier,

  precedences: ($) => [
    [
      "call",
      "unary",
      "multiplicative",
      "additive",
      "cons",
      "comparative",
      "sequence",
      "if",
      "let",
    ],
  ],

  rules: {
    source_file: ($) => repeat($._top_level),

    _top_level: ($) => $.function_declaration,

    function_declaration: ($) =>
      seq(
        "fun",
        field("name", $.identifier),
        "(",
        optional(field("parameters", $.parameter_list)),
        ")",
        ":",
        field("body", $._expression),
      ),

    parameter_list: ($) => seq($.identifier, repeat(seq(",", $.identifier))),

    _expression: ($) =>
      choice(
        $.let_expression,
        $.if_expression,
        $.nested_function,
        $.sequence_expression,
        $._binary_or_atom,
      ),

    nested_function: ($) =>
      seq($.function_declaration, "in", field("body", $._expression)),

    let_expression: ($) =>
      prec.right(
        "let",
        seq(
          "let",
          field("name", $.identifier),
          "=",
          field("value", $._expression),
          "in",
          field("body", $._expression),
        ),
      ),

    if_expression: ($) =>
      prec.right(
        "if",
        seq(
          "if",
          field("condition", $._expression),
          ":",
          field("consequence", $._expression),
          optional(seq("else", ":", field("alternative", $._expression))),
        ),
      ),

    sequence_expression: ($) =>
      prec.right(
        "sequence",
        seq(
          field("left", $._binary_or_atom),
          ";",
          field("right", $._expression),
        ),
      ),

    _binary_or_atom: ($) => choice($.binary_expression, $._atom),

    binary_expression: ($) =>
      choice(
        prec.left(
          "comparative",
          seq(
            $._binary_or_atom,
            choice(">", "<", "==", "!=", ">=", "<="),
            $._binary_or_atom,
          ),
        ),
        prec.right("cons", seq($._binary_or_atom, "::", $._binary_or_atom)),
        prec.left(
          "additive",
          seq($._binary_or_atom, choice("+", "-"), $._binary_or_atom),
        ),
        prec.left(
          "multiplicative",
          seq($._binary_or_atom, choice("*", "/"), $._binary_or_atom),
        ),
      ),

    _atom: ($) =>
      choice(
        $.call_expression,
        $.list_expression,
        $.unit,
        $.number,
        $.string,
        $.identifier,
        $.parenthesized_expression,
      ),

    call_expression: ($) =>
      prec(
        "call",
        seq(
          field(
            "fun",
            choice($.identifier, $.call_expression, $.parenthesized_expression),
          ),
          "(",
          optional(field("arguments", $.argument_list)),
          ")",
        ),
      ),

    argument_list: ($) => seq($._expression, repeat(seq(",", $._expression))),

    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    list_expression: ($) =>
      seq(
        "[",
        optional(seq($._expression, repeat(seq(",", $._expression)))),
        "]",
      ),

    unit: ($) => seq("(", ")"),

    number: ($) => /\d+/,

    string: ($) => /"([^"\\]|\\.)*"/,

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*!?/,

    comment: ($) =>
      token(
        choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
      ),
  },
});
