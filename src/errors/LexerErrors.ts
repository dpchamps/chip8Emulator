export class LexerError extends Error {
    lineNumber: number;
    columnNumber: number;
    context: string;

    constructor(lineNumber: number, columnNumber: number, context: string, message: string) {
        super(message);

        this.lineNumber = lineNumber;
        this.columnNumber = columnNumber;
        this.context = context;
        this.message = message;
    }

    toString() {
        return `[LEXER ERROR] - The lexer encountered an error.
(@line ${this.lineNumber}, col ${this.columnNumber}): ${this.context}.
${this.message}`;
    }
}