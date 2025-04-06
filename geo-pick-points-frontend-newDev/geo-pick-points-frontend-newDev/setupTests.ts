// jest-dom adds custom jest matchers for asserting on DOM nodes.

// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

console.log(global.TextEncoder);
// Globale Definition für TextEncoder und TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({}),
        ok: true,
    })
) as jest.Mock;