module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Transpile private class field syntax (#field) down to WeakMap-based
      // code. Required because react-native 0.81.x source files use private
      // fields and some Hermes/JSC versions in Expo Go don't support them.
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
    ],
  };
};
