export enum LexerTokenCategory {
  INDIVIDUAL = 'INDIVIDUAL',
  VARIABLE = 'VARIABLE',
  FUNCTION = 'FUNCTION',
  KEYWORD = 'KEYWORD',
  DEPRECATED_KEYWORD = 'DEPRECATED_KEYWORD',
  COMMAND = 'COMMAND',
  DEPRECATED_COMMAND = 'DEPRECATED_COMMAND',
  COMMA = 'COMMA',
  DOUBLE_QUOTE = 'DOUBLE_QUOTE',
  COMMENT_MARKER = 'COMMENT_MARKER',
  COMMENT = 'COMMENT',
  COMPARISON = 'COMPARISON',
  ASSIGNMENT = 'ASSIGNMENT',
  BRACKET_OPEN = 'BRACKET_OPEN',
  BRACKET_CLOSE = 'BRACKET_CLOSE',
  LABEL_DOT = 'DOT',
  LABEL = 'LABEL',
  TYPE = 'TYPE',
  TYPE_FIELD_DOT = 'TYPE_FIELD_DOT',
  BACKSLASH = 'BACKSLASH',
  EMPTY = 'EMPTY',
  ALGEBRAIC = 'ALGEBRAIC',
  BITWISE_INVERT = 'BITWISE_INVERT',
  COLON = 'COLON',
  INTEGER = 'INTEGER',
  FLOAT = 'FLOAT',
  STRING = 'STRING',
  UNIDENTIFIED = 'UNIDENTIFIED',
  GLOBAL = 'GLOBAL',
  LOCAL = 'LOCAL',
  DIM = 'DIM',
  CONST = 'CONST'
}