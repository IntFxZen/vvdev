jest.mock('react-native-nitro-modules', () => ({}));

jest.mock('react-native-mmkv', () => ({
  createMMKV: () => {
    const store = new Map();
    return {
      getString: (key) => store.get(key),
      set: (key, value) => {
        store.set(key, value);
      },
    };
  },
}));

jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});
