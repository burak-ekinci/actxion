// React Native AsyncStorage shim for web
const AsyncStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
  getAllKeys: async () => [],
  multiGet: async () => [],
  multiSet: async () => {},
  multiRemove: async () => {},
  clear: async () => {},
};

module.exports = AsyncStorage;
