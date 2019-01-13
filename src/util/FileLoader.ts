export const loadFile = (filePath: string): Promise<Uint8Array> => {
    let rom = '../roms/' + filePath;
    let request = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
        request.open('GET', rom, true);
        request.responseType = 'arraybuffer';
        request.send(null);

        request.onload = (evt) => {
            resolve(new Uint8Array(request.response));
        };

        request.onerror = (evt) => {
            reject(new Error(`Couldn't load ${rom}`));
        };
    });
};