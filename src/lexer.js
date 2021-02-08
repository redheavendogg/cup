const tokenKind = module.exports.tokenKind = {
    IDENT: 'ident',
    STRING_LIT: 'string_lit',
    CHAR_LIT: 'char_lit',
    INT_LIT: 'int_lit',
    FLOAT_LIT: 'float_lit',
    TAG: 'tag',
    MOD: 'mod',
    USE: 'use',
    STRUCT: 'struct',
    ENUM: 'enum',
    UNION: 'union',
    PROP: 'prop',
    DEF: 'def',
    SUB: 'sub',
    THIS: 'this',
    TYPE: 'type',
    WHERE: 'where',

    TRUE: 'true',
    FALSE: 'false',
    NULL: 'null',

    IF: 'if',
    ELIF: 'elif',
    ELSE: 'else',
    DO: 'do',
    WHILE: 'while',
    FOR: 'for',
    IN: 'in',
    MATCH: 'match',
    CASE: 'case',
    BACK: 'back',
    NEXT: 'next',
    DELAY: 'delay',
    JUMP: 'jump',

    SEMICOLON: 'semicolon',
    COLON: 'colon',
    DOUBLE_COLON: 'double_colon',
    COMMA: 'comma',
    DOT: 'dot',
    ARROW: 'arrow',
    QUESTION_MARK: 'question_mark',
    TILDE: 'tilde',
    HASH: 'hash',
    LEFT_PAREN: 'left_paren',
    RIGHT_PAREN: 'right_paren',
    LEFT_BRACE: 'left_brace',
    RIGHT_BRACE: 'right_brace',
    LEFT_BRACKET: 'left_bracket',
    RIGHT_BRACKET: 'right_bracket',

    AT: 'at',
    DOLLAR: 'dollar',
    RANGE: 'range',
    RANGE_INCL: 'range_incl',
    ASSIGN: 'assign',
    EQUAL: 'equal',
    NOT: 'not',
    NOT_EQUAL: 'not_equal',
    AND: 'and',
    OR: 'or',
    LESS: 'less',
    LESS_EQUAL: 'less_equal',
    GREATER: 'greater',
    GREATER_EQUAL: 'greater_equal',
    ADD: 'add',
    ADD_ASSIGN: 'add_assign',
    SUBTRACT: 'substract',
    SUBTRACT_ASSIGN: 'substract_assign',
    MULTIPLY: 'multiply',
    MULTIPLY_ASSIGN: 'multiply_assign',
    DIVIDE: 'divide',
    DIVIDE_ASSIGN: 'divide_assign',
    MODULO: 'modulo',
    MODULO_ASSIGN: 'modulo_assign'
}

keywords = {
    'tag': tokenKind.TAG,
    'mod': tokenKind.MOD,
    'use': tokenKind.USE,
    'struct': tokenKind.STRUCT,
    'enum': tokenKind.ENUM,
    'union': tokenKind.UNION,
    'prop': tokenKind.PROP,
    'def': tokenKind.DEF,
    'sub': tokenKind.SUB,
    'this': tokenKind.THIS,
    'type': tokenKind.TYPE,
    'where': tokenKind.WHERE,
    'true': tokenKind.TRUE,
    'false': tokenKind.FALSE,
    'null': tokenKind.NULL,
    'if': tokenKind.IF,
    'elif': tokenKind.ELIF,
    'else': tokenKind.ELSE,
    'do': tokenKind.DO,
    'while': tokenKind.WHILE,
    'for': tokenKind.FOR,
    'in': tokenKind.IN,
    'match': tokenKind.MATCH,
    'case': tokenKind.CASE,
    'back': tokenKind.BACK,
    'next': tokenKind.NEXT,
    'delay': tokenKind.DELAY,
    'jump': tokenKind.JUMP,
};

function isWhitespace(c) { return c.charCodeAt() === 0 || /\s/.test(c); }

function isAlpha(c) { c = c.charCodeAt(); return (c > 64 && c < 91) || (c > 96 && c < 123); }

function isNumeric(c) { c = c.charCodeAt(); return c > 47 && c < 58; }

function isAlphaNumeric(c) { c = c.charCodeAt(); return (c > 47 && c < 58) || (c > 64 && c < 91) || (c > 96 && c < 123); }

function addToValue(is_literal, value, char) {
    if (is_literal === 2 && value.length === 4) {
        throw `at ${i} too many characters in character literal`;
    }
    return value + char;
}

module.exports.lex = function (input) {
    let tokens = [];
    let is_comment = 0;
    let is_literal = 0;
    let value = '';

    for (let i = 0; i <= input.length; ++i) {
        char = input[i];

        if (char === '`') {
            is_comment = 1;
            continue;
        }

        if (is_comment) {
            if (char === '\n') {
                is_comment = 0;
            }
            continue;
        }

        let kind = null;

        if (is_literal === 3 || is_literal === 4) {
            is_literal -= 2;
        }

        if (is_literal === 1 || is_literal === 2) {
            if (char === undefined) {
                throw `at ${i - 1} expected end of ${is_literal == 1 ? 'string' : 'char'} literal`;
            }
            else if (is_literal == 1 && char == '"') {

            }
            else if (is_literal == 2 && char == '\'') {

            }
            else {
                value = addToValue(is_literal, value, char);
                continue;
            }
        }

        if (isWhitespace(char)) {
            kind = 0;
        } else {
            switch (char) {
                case '"':
                    if (is_literal == 1) {
                        kind = tokenKind.STRING_LIT;
                        is_literal = 0;
                    }
                    else {
                        kind = 0;
                        is_literal = 3;
                    }
                    break;
                case '\'':
                    if (is_literal == 2) {
                        kind = tokenKind.CHAR_LIT;
                        is_literal = 0;
                    }
                    else {
                        kind = 0;
                        is_literal = 4;
                    }
                    break;
                case ';':
                    kind = tokenKind.SEMICOLON;
                    break;
                case ':':
                    if (value && i + 1 < input.length && input[i + 1] === ':') {
                        kind = tokenKind.DOUBLE_COLON;
                        ++i;
                    }
                    else {
                        kind = tokenKind.COLON;
                    }
                    break;
                case ',':
                    kind = tokenKind.COMMA;
                    break;
                case '.':
                    if (i + 1 < input.length && input[i + 1] === '.') {
                        if (i + 2 < input.length && input[i + 2] === '.') {
                            kind = tokenKind.RANGE_INCL;
                            ++i;
                        } else {
                            kind = tokenKind.RANGE;
                        }
                        ++i;
                    } else if (is_literal !== 5 || (i + 1 < input.length && (input[i + 1] === '_' || isAlpha(input[i + 1])))) {
                        kind = tokenKind.DOT;
                    }
                    break;
                case '?':
                    kind = tokenKind.QUESTION_MARK;
                    break;
                case '~':
                    kind = tokenKind.TILDE;
                    break;
                case '#':
                    kind = tokenKind.HASH;
                    break;
                case '(':
                    kind = tokenKind.LEFT_PAREN;
                    break;
                case ')':
                    kind = tokenKind.RIGHT_PAREN;
                    break;
                case '{':
                    kind = tokenKind.LEFT_BRACE;
                    break;
                case '}':
                    kind = tokenKind.RIGHT_BRACE;
                    break;
                case '[':
                    kind = tokenKind.LEFT_BRACKET;
                    break;
                case ']':
                    kind = tokenKind.RIGHT_BRACKET;
                    break;
                case '@':
                    kind = tokenKind.AT;
                    break;
                case '$':
                    kind = tokenKind.DOLLAR;
                    break;
                case '=':
                    if (i + 1 < input.length && input[i + 1] === '=') {
                        kind = tokenKind.EQUAL;
                        ++i;
                    } else {
                        kind = tokenKind.ASSIGN;
                    }
                    break;
                case '!':
                    if (i + 1 < input.length && input[i + 1] === '=') {
                        kind = tokenKind.NOT_EQUAL;
                        ++i;
                    } else {
                        kind = tokenKind.NOT;
                    }
                    break;
                case '&':
                    kind = tokenKind.AND;
                    break;
                case '|':
                    kind = tokenKind.OR;
                    break;
                case '<':
                    if (i + 1 < input.length && input[i + 1] === '=') {
                        kind = tokenKind.LESS_EQUAL;
                        ++i;
                    } else {
                        kind = tokenKind.LESS;
                    }
                    break;
                case '>':
                    if (i + 1 < input.length && input[i + 1] === '=') {
                        kind = tokenKind.GREATER_EQUAL;
                        ++i;
                    } else {
                        kind = tokenKind.GREATER;
                    }
                    break;
                case '+':
                    if (i + 1 < input.length && input[i + 1] === '=') {
                        kind = tokenKind.ADD_ASSIGN;
                        ++i;
                    } else {
                        kind = tokenKind.ADD;
                    }
                    break;
                case '-':
                    if (i + 1 < input.length) {
                        switch (input[i + 1]) {
                            case '>':
                                kind = tokenKind.ARROW;
                                ++i;
                                break;
                            case '=':
                                kind = tokenKind.SUBTRACT_ASSIGN;
                                ++i;
                                break;
                        }
                    } else {
                        kind = tokenKind.SUBTRACT;
                    }
                    break;
                case '*':
                    if (i + 1 < input.length && input[i + 1] === '=') {
                        kind = tokenKind.MULTIPLY_ASSIGN;
                        ++i;
                    } else {
                        kind = tokenKind.MULTIPLY;
                    }
                    break;
                case '/':
                    if (i + 1 < input.length && input[i + 1] === '=') {
                        kind = tokenKind.DIVIDE_ASSIGN;
                        ++i;
                    } else {
                        kind = tokenKind.DIVIDE;
                    }
                    break;
                case '%':
                    if (i + 1 < input.length && input[i + 1] === '=') {
                        kind = tokenKind.MODULO_ASSIGN;
                        ++i;
                    } else {
                        kind = tokenKind.MODULO;
                    }
                    break;
            }
        }

        if (kind === null) {
            if (char === '_' || char === '.' || char === ':' || isAlphaNumeric(char)) {
                if (value.length === 0 && isNumeric(char)) {
                    is_literal = 5;
                }
                else if (is_literal === 5 || is_literal === 6) {
                    if (char === '.' && is_literal === 5) {
                        is_literal = 6;
                    }
                    else if (char === '_' || isNumeric(char)) {

                    } else {
                        throw `at ${i - value.size} invalid identifier name starting with a digit`;
                    }
                }

                if ((is_literal !== 5 && is_literal !== 6) || char !== '_') {
                    value = addToValue(is_literal, value, char);
                }
            }
            else {
                throw `at ${i} unexpected symbol '${char}'`;
            }
        } else {
            if (value && kind !== tokenKind.STRING_LIT && kind !== tokenKind.CHAR_LIT) {
                const value_kind = keywords[value];

                if (value_kind === undefined) {
                    let token = {};
                    switch (is_literal) {
                        case 5:
                            token.kind = tokenKind.INT_LIT;
                            break;
                        case 6:
                            token.kind = tokenKind.FLOAT_LIT;
                            if (value[value.length - 1] === '.') {
                                throw `at ${i - 1} expected a value after the decimal point`;
                            }
                            break;
                        default:
                            token.kind = tokenKind.IDENT;
                            break;
                    }
                    token.value = value;
                    token.index = i - value.length;
                    tokens.push(token);
                }
                else {
                    let token = { kind: value_kind, index: i - value_kind.length };
                    tokens.push(token);
                }

                value = '';
            }

            if (kind) {
                let token = { kind: kind };
                if (kind === tokenKind.STRING_LIT || kind === tokenKind.CHAR_LIT) {
                    token.value = value;
                    token.index = i - value.length;
                    value = '';
                }
                else {
                    token.index = i - kind.length + 1;
                }
                tokens.push(token);
            }
        }
    }

    return tokens;
};