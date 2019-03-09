import aes from 'aes-js';
import atob from 'atob';
import btoa from 'btoa';
import pako from 'pako';

function* range<TResult>(
  length: number,
  selector: (index: number) => TResult
): IterableIterator<TResult> {
  for (let i = 0; i < length; i++) yield selector(i);
}

const pwd = 'Gr4S2eiNl7zq5MrU';
const key = Array.from(range(pwd.length, index => pwd.charCodeAt(index)));
const iv = Array.from(range(pwd.length, () => 0x00));

function getEncryptor() {
  return new aes.ModeOfOperation.cbc(key, iv);
}

function encrypt(message: string): string {
  const padding = 16 - (message.length % 16);
  const bytes = range(message.length + padding, index =>
    index < message.length ? message.charCodeAt(index) : padding
  );
  return String.fromCharCode(...getEncryptor().encrypt(Array.from(bytes)));
}

function decrypt(message: string): string {
  const bytes = range(message.length, index => message.charCodeAt(index));
  message = String.fromCharCode(...getEncryptor().decrypt(Array.from(bytes)));
  const padding = message.charCodeAt(message.length - 1);
  return message.slice(0, message.length - padding);
}

export function encryptRequest(message: string): string {
  return btoa(encrypt(message));
}

export function decryptRequest(message: string): string {
  return decrypt(atob(message));
}

export function decryptResponse(message: string): string {
  message = decrypt(atob(message));
  const bytes = range(message.length, index => message.charCodeAt(index));
  return pako.inflate(Array.from(bytes), { to: 'string' });
}
