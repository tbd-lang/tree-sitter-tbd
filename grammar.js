module.exports = grammar({
    name: "tbd",

    extras: ($) => [/\s/, $.comment],
    word: ($) => $.symbol,

    rules: {
        source_file: ($) => repeat($.stmt),

        comment: (_) => token(seq("--", /.*/)),

        stmt: ($) => choice($.function),

        function: ($) => seq(paren("function", paren($.symbol), $.symbol)),

        symbol: (_) =>
            token(/[a-z_+\-*/=<>!?$%&~^:][A-Za-z0-9_+\-*/=<>!?$%&~^:.]*/),
    },
});

function paren(rule) {
    return seq("(", rule, ")");
}
