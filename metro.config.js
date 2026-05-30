const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force transpilation of packages that use private class fields (#field syntax),
// which older Hermes versions in Expo Go cannot parse natively.
config.transformer.unstable_allowRequireContext = true;

const defaultBlockList = config.resolver.blockList ?? [];
config.resolver.blockList = defaultBlockList;

// Ensure node_modules that use modern JS syntax get transpiled through Babel.
// Add package names (without node_modules/) as needed.
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
