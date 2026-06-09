module.exports = grammar({
  name: 'tbd',

  extras: $ => [
    /\s/,
    $.comment,
  ],


  rules: {

    // -------------------------------------------------------------------------
    // Top level
    // -------------------------------------------------------------------------

    source_file: $ => repeat($._top_level),

    _top_level: $ => $.fun_def,

    fun_def: $ => seq(
      optional('pub'),
      'fun',
      field('name', $.lower_ident),
      field('params', $.param_list),
      '=',
      field('body', $._expr),
    ),

    param_list: $ => seq(
      '(',
      commaSep($.pattern),
      ')',
    ),

    // -------------------------------------------------------------------------
    // Expressions
    // -------------------------------------------------------------------------

    _expr: $ => choice(
      $.expr_let,
      $.expr_let_result,
      $.expr_let_option,
      $.expr_seq,
      $.expr_fun,
      $.expr_lambda,
      $.expr_when,
      $.expr_call,
      $.expr_binop,
      $.expr_pipe,
      $._expr_atom,
    ),

    // let <patt> = <expr> in <expr>
    expr_let: $ => seq(
      'let',
      field('pattern', $.pattern),
      '=',
      field('value', $._expr),
      'in',
      field('body', $._expr),
    ),

    // let! <patt> = <expr> in <expr>
    expr_let_result: $ => seq(
      'let!',
      field('pattern', $.pattern),
      '=',
      field('value', $._expr),
      'in',
      field('body', $._expr),
    ),

    // let? <patt> = <expr> in <expr>
    expr_let_option: $ => seq(
      'let?',
      field('pattern', $.pattern),
      '=',
      field('value', $._expr),
      'in',
      field('body', $._expr),
    ),

    // <expr> then <expr>
    expr_seq: $ => prec.right(1, seq(
      field('left', $._expr),
      'then',
      field('right', $._expr),
    )),

    // fun <lower_ident>(patt[]) = <expr> in <expr>
    expr_fun: $ => seq(
      'fun',
      field('name', $.lower_ident),
      field('params', $.param_list),
      '=',
      field('body', $._expr),
      'in',
      field('rest', $._expr),
    ),

    // fun(patt[]) -> <expr>
    expr_lambda: $ => seq(
      'fun',
      field('params', $.param_list),
      '->',
      field('body', $._expr),
    ),

    // when <expr> is [|] <branch>+
    expr_when: $ => prec.left(seq(
      'when',
      field('subject', $._expr),
      'is',
      field('branches', repeat1($.when_branch)),
    )),

    when_branch: $ => seq(
      '|',
      field('pattern', $.pattern),
      optional(seq('and', field('guard', $._expr))),
      '->',
      field('body', $._expr),
    ),

    // [Module.]fn(args)
    expr_call: $ => prec(10, seq(
      field('callee', choice(
        seq(field('module', $.upper_ident), '.', field('name', $.lower_ident)),
        $.lower_ident,
        seq('(', $._expr, ')'),
      )),
      '(',
      field('args', commaSep($._expr)),
      ')',
    )),

    // binary operators (including cons ::)
    expr_binop: $ => choice(
      prec.right(2,  seq($._expr, '::', $._expr)),   // cons
      prec.left(3,  seq($._expr, '&&', $._expr)),
      prec.left(3,  seq($._expr, '||', $._expr)),
      prec.left(4,  seq($._expr, choice('>=', '<=', '>', '<', '==', '!='), $._expr)),
      prec.left(5,  seq($._expr, choice('+', '-'), $._expr)),
      prec.left(6,  seq($._expr, choice('*', '/'), $._expr)),
    ),

    // pipe operator |>
    expr_pipe: $ => prec.left(1, seq(
      field('left', $._expr),
      '|>',
      field('right', $._expr),
    )),

    _expr_atom: $ => choice(
      $.expr_tuple,
      $.expr_list,
      $.literal_char,
      $.literal_string,
      $.literal_float,
      $.literal_int,
      $.lower_ident,
      $.upper_ident,
      seq('(', $._expr, ')'),
    ),

    // tuple: { a, b, c }
    expr_tuple: $ => seq(
      '{',
      commaSep1($._expr),
      '}',
    ),

    // list: [ a, b, c ]
    expr_list: $ => seq(
      '[',
      commaSep($._expr),
      ']',
    ),

    // -------------------------------------------------------------------------
    // Patterns
    // -------------------------------------------------------------------------

    pattern: $ => choice(
      $.patt_wildcard,
      $.patt_cons,
      $.patt_tuple,
      $.patt_list,
      $.patt_constructor,
      $.literal_char,
      $.literal_string,
      $.literal_float,
      $.literal_int,
      $.lower_ident,
      $.upper_ident,
    ),

    patt_wildcard: $ => '_',

    // cons pattern: a :: b
    patt_cons: $ => prec.right(2, seq(
      field('head', $.pattern),
      '::',
      field('tail', $.pattern),
    )),

    // tuple pattern: { a, b }
    patt_tuple: $ => seq(
      '{',
      commaSep1($.pattern),
      '}',
    ),

    // list pattern: [ a, b ]
    patt_list: $ => seq(
      '[',
      commaSep($.pattern),
      ']',
    ),

    // constructor pattern: Foo or Foo(a, b)
    patt_constructor: $ => prec(1, seq(
      field('name', $.upper_ident),
      optional(seq(
        '(',
        commaSep1($.pattern),
        ')',
      )),
    )),

    // -------------------------------------------------------------------------
    // Literals
    // -------------------------------------------------------------------------

    literal_char: $ => seq("'", /[^']/, "'"),

    literal_string: $ => seq('"', /[^"]*/, '"'),

    // float: .5 or 1.5
    literal_float: $ => choice(
      /\d+\.\d*/,
      /\.\d+/,
    ),

    literal_int: $ => /\d+/,

    // -------------------------------------------------------------------------
    // Identifiers
    // -------------------------------------------------------------------------

    lower_ident: $ => /[a-z_][a-zA-Z0-9_]*/,

    upper_ident: $ => /[A-Z][a-zA-Z0-9_]*/,

    // -------------------------------------------------------------------------
    // Comments (adjust to your syntax)
    // -------------------------------------------------------------------------

    comment: $ => token(seq('#', /.*/)),

  },
});

// helpers
function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}
