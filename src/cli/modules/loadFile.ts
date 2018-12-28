import fs from 'fs';

export const loadFile = (filename: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (error, data) => {
            if (error)
                reject(error);

            resolve(data);
        });
    })
};