module.exports = grammar({
    name: "tbd",

    rules: {
        source_file: ($) => repeat($._top_level),

        _top_level: ($) => choice($.extern_definition),

        extern_definition: ($) =>
            seq(
                optional("pub"),
                "extern",
                $.identifier,
                $.parameter_list,
                "=",
                $.string,
            ),

        parameter_list: ($) => seq("(", repeat($.pattern), ")"),

        pattern: ($) => choice($.identifier),

        identifier: ($) => /[a-z]+/,

        string: ($) => /"[^"]*"/,
    },
});
