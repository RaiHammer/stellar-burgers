import '@testing-library/jest-dom';

// Типизация для глобальных объектов
declare global {
  namespace NodeJS {
    interface Global {
      TextEncoder: typeof import('util').TextEncoder;
      TextDecoder: typeof import('util').TextDecoder;
    }
  }
}

// Только в Node.js среде добавляем полифилы
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Моки для методов, которых нет в jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
