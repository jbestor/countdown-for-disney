module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // These three plugins must all use the same loose mode.
      // babel-preset-expo includes @babel/plugin-transform-private-property-in-object
      // with loose:true, so all three must be loose:true or Babel throws a config error
      // and silently passes files through untransformed — leaving private fields (#field)
      // that Hermes can parse but whose module-scope behavior causes ReferenceErrors.
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ],
  };
};
