const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Stub react-native initialization modules that cascade-fail in Expo Go SDK 54.
// Expo Go provides its own equivalents for all of these.
const STUBS = {
  // Loads Performance + 5 classes with private fields
  'setUpPerformance': path.resolve(__dirname, 'stubs/setUpPerformance.js'),
  // Loads react-devtools-core + FuseboxSessionObserver with private fields
  'setUpReactDevTools': path.resolve(__dirname, 'stubs/setUpReactDevTools.js'),
  // Loads HMRClient which conflicts with Expo Go's own HMR
  'setUpDeveloperTools': path.resolve(__dirname, 'stubs/setUpDeveloperTools.js'),
};

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  for (const [name, stubPath] of Object.entries(STUBS)) {
    if (moduleName.endsWith('/' + name)) {
      return { filePath: stubPath, type: 'sourceFile' };
    }
  }
  if (typeof originalResolveRequest === 'function') {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
