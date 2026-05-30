// Stub for react-native/Libraries/Core/setUpPerformance.js
// The real file loads Performance.js which imports several classes that use
// private class fields (#field syntax). These fail in Expo Go's Hermes build
// because the Babel transform isn't applied to react-native/src/private/ in
// the Metro pre-module pipeline.
// This stub provides the minimal performance.now() shim that RN actually needs.
'use strict';
if (!global.performance) {
  global.performance = {
    mark: function () {},
    measure: function () {},
    now: function () {
      var performanceNow = global.nativePerformanceNow || Date.now;
      return performanceNow();
    },
    getEntriesByName: function () { return []; },
    getEntriesByType: function () { return []; },
    clearMarks: function () {},
    clearMeasures: function () {},
  };
}
