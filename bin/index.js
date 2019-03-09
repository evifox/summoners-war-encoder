"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aes_js_1 = __importDefault(require("aes-js"));
const atob_1 = __importDefault(require("atob"));
const btoa_1 = __importDefault(require("btoa"));
const pako_1 = __importDefault(require("pako"));
function* range(length, selector) {
    for (let i = 0; i < length; i++)
        yield selector(i);
}
const pwd = 'Gr4S2eiNl7zq5MrU';
const key = Array.from(range(pwd.length, index => pwd.charCodeAt(index)));
const iv = Array.from(range(pwd.length, () => 0x00));
function getEncryptor() {
    return new aes_js_1.default.ModeOfOperation.cbc(key, iv);
}
function encrypt(message) {
    const padding = 16 - (message.length % 16);
    const bytes = range(message.length + padding, index => index < message.length ? message.charCodeAt(index) : padding);
    return String.fromCharCode(...getEncryptor().encrypt(Array.from(bytes)));
}
function decrypt(message) {
    const bytes = range(message.length, index => message.charCodeAt(index));
    message = String.fromCharCode(...getEncryptor().decrypt(Array.from(bytes)));
    const padding = message.charCodeAt(message.length - 1);
    return message.slice(0, message.length - padding);
}
function encryptRequest(message) {
    return btoa_1.default(encrypt(message));
}
exports.encryptRequest = encryptRequest;
function decryptRequest(message) {
    return decrypt(atob_1.default(message));
}
exports.decryptRequest = decryptRequest;
function decryptResponse(message) {
    message = decrypt(atob_1.default(message));
    const bytes = range(message.length, index => message.charCodeAt(index));
    return pako_1.default.inflate(Array.from(bytes), { to: 'string' });
}
exports.decryptResponse = decryptResponse;
