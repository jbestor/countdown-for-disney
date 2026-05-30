module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Transpile private class fields (#field) using WeakMaps (loose:false).
      // react-native 0.81 ships source files with private fields that Expo Go
      // Hermes cannot parse natively. WeakMap mode needs no @babel/runtime
      // helpers, avoiding conflicts with Metro's inlineRequires transform.
      ['@babel/plugin-transform-class-properties', { loose: false }],
      ['@babel/plugin-transform-private-methods', { loose: false }],
    ],
  };
};
