import fs from 'fs';
import path from 'path';

export const writeFile = (filepath: string, filename: string, data: any): Promise<true> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(filepath, filename), data, error => {
            if (error)
                reject(error);

            resolve(true);
        });
    });
}