/*
 * Promisify Me
 * Turn ordinary async APIs into shiny promise based ones
 *
 * Copyright 2014 Surevine Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Q = require('q');
var Spritzr = require('spritzr');

var PromisifyMe = function(delegate, definition) {
  if(typeof definition == 'string') {
    definition = require('./definitions/' + definition);
  }

  if(typeof delegate == 'function') {
    var adapter = function() {
      this.$super.apply(this, arguments);
    };

    for(var i in delegate.prototype) {
      if(definition && definition[i]) {
        adapter.prototype[i] = definition[i](delegate.prototype[i]);
      } else {
        // By default we best-guess functions and do nothing with properties
        if(typeof delegate.prototype[i] == 'function') {
          // The default is to have a best guess (based on how it's called)
          adapter.prototype[i] = PromisifyMe.promisifyBestGuess(delegate.prototype[i]);
        }
      }
    }

    Spritzr.extend(adapter, delegate);

    return adapter;
  } else {
    var adapterFn = function() {};

    adapterFn.prototype = (function() {
      var proto = function() {
        this.constructor = adapterFn
      };

      proto.prototype = delegate;

      return new proto();
    })();

    var adapter = new adapterFn();

    for(var i in delegate) {
      if(definition && definition[i]) {
        adapter[i] = definition[i](delegate[i]);
      } else {
        // By default we best-guess functions and do nothing with properties
        if(typeof delegate[i] == 'function') {
          // The default is to have a best guess (based on how it's called)
          adapter[i] = PromisifyMe.promisifyBestGuess(delegate[i]);
        }
      }
    }

    return adapter;
  }
}

PromisifyMe.promisifyCallbackFn = function(fn) {
  return function() {
    // If the last argument is a funtion, then we'll just use the callback
    // based method
    if((arguments.length > 0)
      && (typeof arguments[arguments.length - 1] == 'function')) {
        return fn.apply(this, arguments);
      }

      var deferred = Q.defer();

      var args = Array.prototype.slice.call(arguments, 0);

      args.push(function(err, data) {
        if(err) {
          deferred.reject(err);
        } else {
          deferred.resolve(data);
        }
      });

      fn.apply(this, args);

      return deferred.promise;
    }
  }

  PromisifyMe.promisifyBestGuess = function(fn) {
    var cbFunction = PromisifyMe.promisifyCallbackFn(fn);

    return function() {
      // If we have passed equal to or more than the expected number of
      // parameters then we assume we have nothing to do.
      if(arguments.length >= fn.length) {
        return fn.apply(this, arguments);
      } else {
        return cbFunction.apply(this, arguments);
      }
    }
  };

  PromisifyMe.dontPromisify = function(fn) {
    return fn;
  }

  module.exports = PromisifyMe;
