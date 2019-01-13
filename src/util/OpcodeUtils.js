"use strict";
exports.__esModule = true;
exports.parseOpcode = function (opcode) {
    return {
        msb: (opcode & 0xF000) >> 12,
        lsb: (opcode & 0x000F),
        x: (opcode & 0x0F00) >> 8,
        y: (opcode & 0x00F0) >> 4,
        kk: (opcode & 0x0FF),
        nnn: (opcode & 0x0FFF)
    };
};
//Return the hexidecimal representation of a number
exports.toHexString = function (n) {
    return n.toString(16).toUpperCase();
};
//Return the binary representation of a number
exports.toBinString = function (n, pad) {
    if (pad === void 0) { pad = 0; }
    return n.toString(2).padStart(pad, '0');
};
exports.toOpcodeString = function (n) {
    return "0x" + exports.toHexString(n).padStart(4, '0');
};
exports.getOpcodesFromBuffer = function (buffer) {
    var _tempBuffer = [];
    //pad the buffer so that an uneven buffer will have the correct final opcode
    var bufferLength = buffer.length % 2 === 0 ? buffer.length : buffer.length + 1;
    for (var i = 0; i < buffer.length; i += 2) {
        var HIGH = buffer[i] << 8;
        var LOW = buffer[i + 1] || 0;
        _tempBuffer.push(HIGH | LOW);
    }
    return new Uint16Array(_tempBuffer);
};
