// This module runs as the FIRST pre-module in the Metro bundle, before
// react-native/Libraries/Core/InitializeCore.js executes. It stubs any
// Web/DOM globals that React Native 0.81 references during its own setup
// but hasn't registered yet via polyfillGlobal().
//
// DOMException is the primary culprit: Performance.js imports it from
// react-native/src/private/webapis/errors/DOMException.js, and that module
// uses the identifier as a bare global in some code paths before the class
// definition is fully hoisted in the bundle.

if (typeof global.DOMException === 'undefined') {
  var _DOMExceptionCodes = {
    INDEX_SIZE_ERR: 1, DOMSTRING_SIZE_ERR: 2, HIERARCHY_REQUEST_ERR: 3,
    WRONG_DOCUMENT_ERR: 4, INVALID_CHARACTER_ERR: 5, NO_DATA_ALLOWED_ERR: 6,
    NO_MODIFICATION_ALLOWED_ERR: 7, NOT_FOUND_ERR: 8, NOT_SUPPORTED_ERR: 9,
    INUSE_ATTRIBUTE_ERR: 10, INVALID_STATE_ERR: 11, SYNTAX_ERR: 12,
    INVALID_MODIFICATION_ERR: 13, NAMESPACE_ERR: 14, INVALID_ACCESS_ERR: 15,
    VALIDATION_ERR: 16, TYPE_MISMATCH_ERR: 17, SECURITY_ERR: 18,
    NETWORK_ERR: 19, ABORT_ERR: 20, URL_MISMATCH_ERR: 21,
    QUOTA_EXCEEDED_ERR: 22, TIMEOUT_ERR: 23, INVALID_NODE_TYPE_ERR: 24,
    DATA_CLONE_ERR: 25,
  };

  function DOMException(message, name) {
    this.message = message || '';
    this.name = name || 'Error';
    this.code = _DOMExceptionCodes[this.name] || 0;
  }
  DOMException.prototype = Object.create(Error.prototype);
  DOMException.prototype.constructor = DOMException;

  // Add static code constants (mirrors the class body in RN's DOMException.js)
  for (var _k in _DOMExceptionCodes) {
    DOMException[_k] = _DOMExceptionCodes[_k];
    DOMException.prototype[_k] = _DOMExceptionCodes[_k];
  }

  global.DOMException = DOMException;
}
