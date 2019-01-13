import {readInterface} from "./readInterface";

/**
 * Prompt a user for input, resolve the input
 */
export default (prompt : string = '>'): Promise<string> => {
    return new Promise((res, rej) => {
        try {
            readInterface.question(prompt, answer => {
                res(answer)
            })
        } catch (error) {
            rej(error);
        }
    });
};
