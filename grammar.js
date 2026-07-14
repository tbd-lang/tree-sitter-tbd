module.exports = grammar({
    name: "tbd",

    extras: ($) => [/\s/, $.comment],
    word: ($) => $.ident,

    rules: {
        source_file: ($) => repeat($.stmt),

        comment: (_) => choice(token(seq("--", /.*/)), token(seq("#!", /.*/))),

        stmt: ($) => choice($.import, $.external, $.function),

        import: ($) => seq("(", "import", repeat1($.import_path), ")"),
        import_path: ($) => seq($.ident, repeat(seq("/", $.ident))),

        external: ($) => seq("(", "external", $.external_header, $.string, ")"),
        external_header: ($) =>
            seq(
                "(",
                field("name", $.ident),
                repeat(field("parameter", $.ident)),
                ")",
            ),

        function: ($) =>
            seq("(", "function", $.function_header, $.function_body, ")"),
        function_header: ($) =>
            seq(
                "(",
                field("name", $.ident),
                repeat(field("parameter", $.patt)),
                ")",
            ),
        function_body: ($) => repeat1($.expr),

        patt: ($) =>
            choice(
                $.call,
                $.list,
                $.tuple,
                $.map,
                $.binary,
                $.unit,
                $.boolean,
                $.char,
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
                $.receive,
                $.call,
                $.list,
                $.tuple,
                $.map,
                $.binary,
                $.op,
                $.unit,
                $.boolean,
                $.char,
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
        receive: ($) => seq("(", "receive", repeat1($.match_branch), ")"),
        match_branch: ($) => seq("(", $.patt, repeat1($.expr), ")"),

        call: ($) =>
            seq(
                "(",
                field("callee", $.expr),
                repeat(field("argument", $.expr)),
                ")",
            ),

        lambda: ($) => seq("(", "fun", $.lambda_header, repeat1($.expr), ")"),
        lambda_header: ($) => seq("(", repeat(field("parameter", $.patt)), ")"),

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

        unit: (_) => token(seq("(", ")")),
        char: (_) => token(seq("'", choice(/[^'\\\n]/, /\\[nrt0'\\]/), "'")),
        boolean: (_) => token(choice("true", "false")),
        numeric: (_) => token(/([0-9]+(\.[0-9]+)?|\.[0-9]+)([eE][+-]?[0-9]+)?/),
        module_access: ($) =>
            prec(
                2,
                seq(
                    field("path", repeat(seq($.ident, "/"))),
                    field("module", $.ident),
                    token.immediate("."),
                    field("function", $.ident),
                ),
            ),
        variant: (_) => token(seq(":", /[a-z_][A-Za-z0-9_-]*/)),
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
        ident: (_) => token(/[a-z_][A-Za-z0-9_-]*/),
    },
});
