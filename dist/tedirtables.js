(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.tedirtables = factory());
}(this, (function () { 'use strict';

  var version = "0.0.1-development-1";

  function tedirtables () {
    console.log('version ' + version);
  }

  return tedirtables;

})));
