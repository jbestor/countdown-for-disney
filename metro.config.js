const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Inject our polyfill as the very first pre-module so it runs BEFORE
// react-native/Libraries/Core/InitializeCore.js (which calls
// setUpDefaultReactNativeEnvironment → setUpPerformance → Performance.js,
// which references DOMException before RN has registered it as a global).
const originalGetModules = config.serializer.getModulesRunBeforeMainModule;
config.serializer.getModulesRunBeforeMainModule = (entryFilePath) => {
  const existing = typeof originalGetModules === 'function'
    ? originalGetModules(entryFilePath)
    : [];
  return [
    path.resolve(__dirname, 'polyfills.js'),
    ...existing,
  ];
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
