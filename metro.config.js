const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Inject DOMException polyfill as the very first pre-module, before InitializeCore.
const originalGetModules = config.serializer.getModulesRunBeforeMainModule;
config.serializer.getModulesRunBeforeMainModule = (entryFilePath) => {
  const existing = typeof originalGetModules === 'function'
    ? originalGetModules(entryFilePath)
    : [];
  return [path.resolve(__dirname, 'polyfills.js'), ...existing];
};

// Stub react-native modules that use private class fields (#field) inside the
// Metro pre-module pipeline where Babel transforms don't apply reliably:
//   - setUpPerformance: loads 5 classes with private fields (MemoryInfo, etc.)
//   - setUpReactDevTools: loads react-devtools-core + FuseboxSessionObserver
//     (both have private fields); Expo Go provides its own DevTools bridge.
const STUBS = {
  'react-native/Libraries/Core/setUpPerformance': path.resolve(__dirname, 'stubs/setUpPerformance.js'),
  'react-native/Libraries/Core/setUpReactDevTools': path.resolve(__dirname, 'stubs/setUpReactDevTools.js'),
};

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  for (const [pattern, stubPath] of Object.entries(STUBS)) {
    if (moduleName === pattern || moduleName.endsWith('/' + pattern.split('/').slice(-1)[0])) {
      return { filePath: stubPath, type: 'sourceFile' };
    }
  }
  if (typeof originalResolveRequest === 'function') {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
