import fs from "fs";
import path from "path";

/**
 * Reads top-level files in a directory
 * @param directory
 */
export const readFilesInDirectory = (directory: string): Promise<Array<string>> => {
    return new Promise((resolve, reject) => {
        fs.readdir('roms', (error, files) => {
            if (error)
                reject(error);

            const resolvedFiles = files
                .map(file => path.join(directory, file))
                .filter(file => fs.statSync(file));

            return resolve(resolvedFiles);
        });
    });
};