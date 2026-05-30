// DOMException is referenced by expo-notifications and fetch internals
// before React Native's own polyfill has a chance to register it.
if (typeof global.DOMException === 'undefined') {
  global.DOMException = class DOMException extends Error {
    constructor(message, name) {
      super(message);
      this.name = name ?? 'DOMException';
      this.code = 0;
    }
  };
}
