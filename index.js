// Polyfills must be required (not imported) so they run before any ES module
// initialization. import statements are hoisted; require() runs in order.
require('./polyfills');
require('expo-router/entry');
