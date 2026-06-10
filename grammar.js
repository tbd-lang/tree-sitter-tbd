/**
 * tree-sitter grammar for an OCaml-ish language.
 */

const PREC = {
    bind: 1, // let / let! / let? / local fun / lambda / when..is
    seq: 2, // then
    pipe: 3, // |>
    or: 4, // ||
    and: 5, // &&
    compare: 6, // == != >= <= > <
    cons: 7, // ::
    add: 8, // + -
    mul: 9, // * /
    call: 11,
    member: 12, // Module.field
};

module.exports = grammar({
    name: "tbd",

    word: ($) => $.lower_ident,

    extras: ($) => [/\s/, $.comment],

    rules: {
        source_file: ($) =>
            repeat(
                choice(
                    $.import_declaration,
                    $.extern_definition,
                    $.function_definition,
                ),
            ),

        // ---- top level ----
        import_declaration: ($) =>
            seq(
                "import",
                field("path", repeat(seq($.lower_ident, "."))),
                field("module", $.upper_ident),
            ),

        extern_definition: ($) =>
            seq(
                optional("pub"),
                "extern",
                field("name", $.lower_ident),
                field("parameters", $.parameters),
                "=",
                field("erlang", $.string),
            ),

        function_definition: ($) =>
            seq(
                optional("pub"),
                "fun",
                field("name", $.lower_ident),
                field("parameters", $.parameters),
                "=",
                field("body", $._expression),
            ),

        parameters: ($) => seq("(", commaSep($._pattern), ")"),

        // ---- expressions ----
        _expression: ($) =>
            choice(
                $.let_expression,
                $.let_function_expression,
                $.lambda_expression,
                $.match_expression,
                $.seq_expression,
                $.binary_expression,
                $.call_expression,
                $._primary_expression,
            ),

        _primary_expression: ($) =>
            choice(
                $.parenthesized_expression,
                $.record_expression,
                $.list_expression,
                $.qualified_identifier,
                $.boolean,
                $.lower_ident,
                $.upper_ident,
                $.integer,
                $.float,
                $.char,
                $.string,
            ),

        let_expression: ($) =>
            prec.right(
                PREC.bind,
                seq(
                    field("kind", choice("let", "let!", "let?")),
                    field("pattern", $._pattern),
                    "=",
                    field("value", $._expression),
                    "in",
                    field("body", $._expression),
                ),
            ),

        let_function_expression: ($) =>
            prec.right(
                PREC.bind,
                seq(
                    "fun",
                    field("name", $.lower_ident),
                    field("parameters", $.parameters),
                    "=",
                    field("value", $._expression),
                    "in",
                    field("body", $._expression),
                ),
            ),

        lambda_expression: ($) =>
            prec.right(
                PREC.bind,
                seq(
                    "fun",
                    field("parameters", $.parameters),
                    "->",
                    field("body", $._expression),
                ),
            ),

        match_expression: ($) =>
            prec.right(
                PREC.bind,
                seq(
                    "when",
                    field("value", $._expression),
                    "is",
                    optional("|"),
                    sep1("|", $.match_arm),
                ),
            ),

        match_arm: ($) =>
            prec.right(
                seq(
                    field("pattern", $._pattern),
                    optional(seq("and", field("guard", $._expression))),
                    "->",
                    field("body", $._expression),
                ),
            ),

        seq_expression: ($) =>
            prec.right(
                PREC.seq,
                seq(
                    field("first", $._expression),
                    "then",
                    field("second", $._expression),
                ),
            ),

        binary_expression: ($) => {
            const ops = [
                ["|>", PREC.pipe, "left"],
                ["||", PREC.or, "left"],
                ["&&", PREC.and, "left"],
                [
                    choice("==", "!=", ">=", "<=", ">", "<"),
                    PREC.compare,
                    "left",
                ],
                ["::", PREC.cons, "right"],
                [choice("+", "-"), PREC.add, "left"],
                [choice("*", "/"), PREC.mul, "left"],
            ];
            return choice(
                ...ops.map(([op, p, assoc]) =>
                    (assoc === "left" ? prec.left : prec.right)(
                        p,
                        seq(
                            field("left", $._expression),
                            field("operator", op),
                            field("right", $._expression),
                        ),
                    ),
                ),
            );
        },

        call_expression: ($) =>
            prec.left(
                PREC.call,
                seq(
                    field("function", $._expression),
                    field("arguments", $.arguments),
                ),
            ),

        arguments: ($) => seq("(", commaSep($._expression), ")"),

        qualified_identifier: ($) =>
            prec(
                PREC.member,
                seq(
                    field("module", $.upper_ident),
                    ".",
                    field("name", $.lower_ident),
                ),
            ),

        parenthesized_expression: ($) => seq("(", $._expression, ")"),
        record_expression: ($) => seq("{", commaSep($._expression), "}"),
        list_expression: ($) => seq("[", commaSep($._expression), "]"),

        // ---- patterns ----
        _pattern: ($) =>
            choice(
                $.wildcard_pattern,
                $.cons_pattern,
                $.constructor_pattern,
                $.record_pattern,
                $.list_pattern,
                $.parenthesized_pattern,
                $.boolean,
                $.lower_ident,
                $.integer,
                $.float,
                $.char,
                $.string,
            ),

        wildcard_pattern: (_) => "_",

        cons_pattern: ($) =>
            prec.right(
                PREC.cons,
                seq(field("head", $._pattern), "::", field("tail", $._pattern)),
            ),

        constructor_pattern: ($) =>
            prec.right(
                seq(
                    field("constructor", $.upper_ident),
                    optional(seq("(", commaSep($._pattern), ")")),
                ),
            ),

        record_pattern: ($) => seq("{", commaSep($._pattern), "}"),
        list_pattern: ($) => seq("[", commaSep($._pattern), "]"),
        parenthesized_pattern: ($) => seq("(", $._pattern, ")"),

        // ---- terminals ----
        boolean: (_) => choice("true", "false"),
        lower_ident: (_) => /[a-z][a-zA-Z0-9_]*/,
        upper_ident: (_) => /[A-Z][a-zA-Z0-9_]*/,
        integer: (_) => /\d+/,
        float: (_) => /\d+\.\d+|\.\d+/,
        char: (_) => /'(\\.|[^'\\])'/,
        string: (_) => /"(\\.|[^"\\])*"/,

        // line comment: # ... to end of line
        comment: (_) => token(/#[^\n]*/),
    },
});

function commaSep(rule) {
    return optional(commaSep1(rule));
}
function commaSep1(rule) {
    return seq(rule, repeat(seq(",", rule)));
}
function sep1(sep, rule) {
    return seq(rule, repeat(seq(sep, rule)));
}
