module.exports = grammar({
    name: "tbd",

    extras: ($) => [/\s/, $.comment],
    word: ($) => $.ident,

    rules: {
        source_file: ($) => repeat($.stmt),

        comment: (_) => token(seq("--", /.*/)),

        stmt: ($) => choice($.import, $.external, $.function),

        import: ($) => seq("(", "import", repeat1($.import_path), ")"),
        import_path: ($) =>
            seq(
                field("path", repeat(seq($.ident, "/"))),
                field("module", $.ident),
            ),

        external: ($) =>
            seq(
                "(",
                "external",
                "(",
                field("name", $.ident),
                repeat(field("parameter", $.patt)),
                ")",
                $.string,
                ")",
            ),

        function: ($) =>
            seq(
                "(",
                "function",
                "(",
                field("name", $.ident),
                repeat(field("parameter", $.patt)),
                ")",
                repeat1($.expr),
                ")",
            ),

        patt: ($) =>
            choice(
                $.call,
                $.list,
                $.tuple,
                $.map,
                $.binary,
                $.unit,
                $.boolean,
                $.numeric,
                $.variant,
                $.string,
                $.ident,
            ),

        expr: ($) =>
            choice(
                $.function,
                $.lambda,
                $.assign,
                $.cond,
                $.match,
                $.call,
                $.list,
                $.tuple,
                $.map,
                $.binary,
                $.op,
                $.unit,
                $.boolean,
                $.numeric,
                $.module_access,
                $.variant,
                $.string,
                $.ident,
            ),
        assign: ($) =>
            seq("(", field("kind", $.let_keyword), $.patt, $.expr, ")"),
        let_keyword: (_) => token(choice("let", "let!", "let?")),

        cond: ($) => seq("(", "if", $.expr, $.expr, $.expr, ")"),

        match: ($) => seq("(", "match", $.expr, repeat1($.match_branch), ")"),
        match_branch: ($) => seq("(", $.patt, repeat1($.expr), ")"),

        call: ($) =>
            seq(
                "(",
                field("callee", $.expr),
                repeat(field("argument", $.expr)),
                ")",
            ),

        lambda: ($) =>
            seq("(", "fun", "(", repeat($.patt), ")", repeat1($.expr), ")"),

        list: ($) => seq("[", repeat($.expr), "]"),

        tuple: ($) => seq("{", repeat($.expr), "}"),

        map: ($) =>
            seq(
                token("#{"),
                repeat(seq(field("key", $.expr), field("value", $.expr))),
                "}",
            ),

        binary: ($) =>
            seq(
                token("<<"),
                repeat(seq($.expr, "|", $.binary_option)),
                token(">>"),
            ),

        binary_option: (_) =>
            token(choice(seq(choice("u", "i", "f"), /[0-9]+/), "binary")),

        op: (_) =>
            token(
                choice(
                    "+",
                    "-",
                    "*",
                    "/",
                    "++",
                    "::",
                    "->",
                    "=",
                    "<>",
                    ">",
                    ">=",
                    "<",
                    "<=",
                ),
            ),

        unit: (_) => seq("(", ")"),
        boolean: (_) => token(choice("true", "false")),
        numeric: (_) => token(/([0-9]+(\.[0-9]+)?|\.[0-9]+)([eE][+-]?[0-9]+)?/),
        module_access: ($) =>
            prec(
                2,
                seq(
                    field("path", repeat(seq($.ident, "/"))),
                    field("module", $.ident),
                    token.immediate(":"),
                    field("function", $.ident),
                ),
            ),
        variant: ($) => seq(":", field("name", $.ident)),
        string: (_) => token(seq('"', repeat(choice(/[^"\\]/, /\\./)), '"')),
        escape: (_) =>
            token.immediate(
                seq(
                    "\\",
                    choice(
                        /["\\nrt]/,
                        seq("x", /[0-9a-fA-F]{2}/),
                        seq("u", /[0-9a-fA-F]{4}/),
                    ),
                ),
            ),
        ident: (_) => token(/[a-z_]+[A-Za-z0-9_\-]*/),
    },
});
