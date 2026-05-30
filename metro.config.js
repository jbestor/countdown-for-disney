const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Inject DOMException polyfill as the very first pre-module so it runs
// before react-native/Libraries/Core/InitializeCore.js.
const originalGetModules = config.serializer.getModulesRunBeforeMainModule;
config.serializer.getModulesRunBeforeMainModule = (entryFilePath) => {
  const existing = typeof originalGetModules === 'function'
    ? originalGetModules(entryFilePath)
    : [];
  return [path.resolve(__dirname, 'polyfills.js'), ...existing];
};

// Replace setUpPerformance with a minimal stub.
// The real setUpPerformance loads Performance.js which imports five classes
// (MemoryInfo, ReactNativeStartupTiming, UserTiming, EventTiming,
// PerformanceEntry) all using private class fields (#field syntax).
// Babel's private-field transforms are not applied to react-native/src/private/
// in Metro's pre-module pipeline, causing cascading ReferenceErrors in Expo Go.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === 'react-native/Libraries/Core/setUpPerformance' ||
    moduleName.endsWith('/Core/setUpPerformance')
  ) {
    return {
      filePath: path.resolve(__dirname, 'stubs/setUpPerformance.js'),
      type: 'sourceFile',
    };
  }
  if (typeof originalResolveRequest === 'function') {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
