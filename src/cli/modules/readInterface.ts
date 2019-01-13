import readline from 'readline';

export const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});