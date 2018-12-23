import readline from 'readline';

const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Prompt a user for input, resolve the input
 */
export default () :Promise<string> => {
    return new Promise((res, rej) => {
        try {
            readInterface.question(">", answer => {
                res(answer)
            })
        } catch (error) {
            rej(error);
        }
    });
};
