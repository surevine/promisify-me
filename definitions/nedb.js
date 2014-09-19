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

var PromisifyMe = require('../index');

var CursorDefinition = {
  limit : PromisifyMe.dontPromisify,
  skip : PromisifyMe.dontPromisify,
  sort :  PromisifyMe.dontPromisify,
  projection : PromisifyMe.dontPromisify,
  project : PromisifyMe.dontPromisify,
  exec : PromisifyMe.promisifyCallbackFn
}

var promisifyQueryFunction = function(argCount) {
  return function(fn) {
    var promissyFn = PromisifyMe.promisifyCallbackFn(fn);

    return function() {
      if(arguments.length <= argCount) {
        var cursor = fn.apply(this, arguments);

        if(!cursor) {
          return cursor;
        } else {
          return PromisifyMe(cursor, CursorDefinition);
        }
      } else {
        return promissyFn.apply(this, arguments.splice(arguments.length - 2, 1));
      }
    }
  }
};

var NeDBDefinition = {
  find : promisifyQueryFunction(2),
  findOne : promisifyQueryFunction(2),
  count : promisifyQueryFunction(2),
  loadDatabase : PromisifyMe.promisifyCallbackFn,
  insert : PromisifyMe.promisifyCallbackFn,
  update : PromisifyMe.promisifyCallbackFn,
  remove : PromisifyMe.promisifyCallbackFn,
  ensureIndex : PromisifyMe.promisifyCallbackFn,
  addToIndexes : PromisifyMe.dontPromisify,
  removeFromIndexes : PromisifyMe.dontPromisify,
  updateIndexes : PromisifyMe.dontPromisify,
  getCandidates : PromisifyMe.dontPromisify,
  createNewId : PromisifyMe.dontPromisify,
  prepareDocumentForInsertion : PromisifyMe.dontPromisify
};

module.exports = NeDBDefinition;
