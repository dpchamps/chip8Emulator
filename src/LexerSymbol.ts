//chars
export const HEX_RADIX = 'h';
export const OCT_RADIX = 'o';
export const BIN_RADIX = 'n';
//symbols
export const REGISTER = /\$/;
export const WHITESPACE = /[\s,]/;
export const DIGIT = /[0-9a-f]/i;
export const CHAR = /[a-z]/i;
export const RADIX = new RegExp(`[${HEX_RADIX}${OCT_RADIX}${BIN_RADIX}]`);
export const COMMENT = /;/;
export const LABEL = /:/;
export const NEWLINE = /\n/;
