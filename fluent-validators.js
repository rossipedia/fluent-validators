"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

var Validator = (function() {
  function Validator(fn, invalidMessage, args) {
    if (args === void 0) {
      args = [];
    }
    this.fn = fn;
    this.invalidMessage = invalidMessage;
    this.args = args;
  }
  return Validator;
})();

function apply(v, value) {
  return v.fn.apply(v, [value].concat(v.args));
}

var Composite = (function() {
  function Composite(first, second) {
    this.first = first;
    this.second = second;
    this.args = [];
  }
  Composite.prototype.fn = function(value) {
    if (!apply(this.first, value)) {
      this.invalidMessage = this.first.invalidMessage;
      return false;
    }
    if (!apply(this.second, value)) {
      this.invalidMessage = this.second.invalidMessage;
      return false;
    }
    return true;
  };
  return Composite;
})();

function defineValidators(validatorMap) {
  var ValidatorBuilder = (function() {
    function ValidatorBuilder(v) {
      this.v = v;
    }
    ValidatorBuilder.prototype.add = function(fn, invalidMessage, args) {
      var validator = new Validator(fn, invalidMessage, args);
      if (this.v) {
        return new ValidatorBuilder(new Composite(this.v, validator));
      }
      this.v = validator;
      return this;
    };
    ValidatorBuilder.prototype.validate = function(value, label) {
      if (!this.v) {
        throw new Error("No validation rules defined");
      }
      var result = apply(this.v, value);
      if (!result) {
        return label + " " + this.v.invalidMessage;
      }
    };
    return ValidatorBuilder;
  })();
  var map = validatorMap(function(fn, invalidMessage) {
    if (!fn) throw new Error("No validation function supplied for validator");
    if (!invalidMessage)
      throw new Error("No invalid message supplied for validator");
    return function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      var b = this;
      var msg =
        typeof invalidMessage === "string"
          ? invalidMessage
          : invalidMessage.apply(void 0, args);
      return b.add(fn, msg, args);
    };
  });
  var descMap = {};
  for (var key in map) {
    descMap[key] = { value: map[key] };
  }
  Object.defineProperties(ValidatorBuilder.prototype, descMap);
  return function() {
    return new ValidatorBuilder();
  }; // I know what I'm doing here
}

exports.defineValidators = defineValidators;
