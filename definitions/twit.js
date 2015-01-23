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

var TwitDefinition = {
  get : PromisifyMe.promisifyCallbackFn,
  post : PromisifyMe.promisifyCallbackFn,
  getAuth : PromisifyMe.dontPromisify,
  setAuth : PromisifyMe.dontPromisify,
  stream : PromisifyMe.dontPromisify
};

module.exports = TwitDefinition;
