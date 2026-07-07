module.exports = grammar({
    name: "tbd",

    extras: ($) => [/\s/, $.comment],

    word: ($) => $.symbol,

    rules: {
        source_file: ($) => repeat($._expr),

        comment: (_) => token(seq("--", /.*/)),

        _expr: ($) =>
            choice(
                $.call,
                $.list,
                $.tuple,
                $.integer,
                $.string,
                $.bool,
                $.constructor,
                $.module,
                $.symbol,
            ),

        call: ($) =>
            seq(
                "(",
                field("callee", $._expr),
                repeat(field("argument", $._expr)),
                ")",
            ),

        list: ($) => seq("[", repeat($._expr), "]"),

        tuple: ($) => seq("{", repeat($._expr), "}"),

        integer: (_) => token(/-?(0|[1-9][0-9]*)/),

        string: (_) => token(seq('"', repeat(choice(/[^"\\]/, /\\./)), '"')),

        bool: (_) => choice("true", "false"),

        constructor: (_) => token(/\$[A-Za-z0-9_-]*/),

        module: ($) => seq(token(/[A-Z][A-Za-z0-9_]*\./), $.call),

        symbol: (_) =>
            token(/[a-z_+\-*/=<>!?$%&~^:][A-Za-z0-9_+\-*/=<>!?$%&~^:.]*/),
    },
});
