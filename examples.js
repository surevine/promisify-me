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

var PromisifyMe = require('./index');

/* Example 1 */
var Example1 = function() {};

// Waits for millis then reports actual time taken to callback
Example1.prototype.delay = function(millis, callback) {
  var start = new Date();
  setTimeout(function() {
    var now = new Date();
    callback(null, now.getTime() - start.getTime());
  }, millis);
};

var PromissyExample1 = PromisifyMe(Example1);

var test = new PromissyExample1();

test.delay(1000)
.then(function(actualDelay) {
  console.log('A 1000ms delay actually took ' + actualDelay + 'ms');
})
.done();

// You can also call it with a callback too for compatibility
test.delay(2000, function(err, actualDelay) {
  console.log('A 2000ms delay actually took ' + actualDelay + 'ms');
});

/* Example 2 */
var Example2 = function() {};

// Waits for millis then reports actual time taken to callback
Example2.prototype.causeError = function(callback) {
  setTimeout(function() {
    callback(new Error("Something bad!"));
  }, 1000);
};

var PromissyExample2 = PromisifyMe(Example2);

var test = new PromissyExample2();

test.causeError()
.then(function(actualDelay) {
  console.log('This won\'t get called as the error will happen');
})
.fail(function(err) {
  console.error(err);
});

/* Example 3 */
// We use the built in 'nedb' definition
var DataStore = PromisifyMe(require('nedb'), 'nedb');

var store = new DataStore();

var data = [
  { name: "Steve" },
  { name: "Dave" },
  { name: "Tony" }
]

store.insert(data)
.then(function(newRecords) {
  console.log('Inserted ' + newRecords.length + ' records');

  // Now we will retrieve them, ordered.
  var cursor = store.find({});

  // Find is a little different and almost always
  // returns a cursor so we can sort/skip/etc.
  cursor.sort({name: 1});

  // And it's exec() which gives us a promise
  return cursor.exec();
})
.then(function(data) {
  console.log('Found records:');

  data.forEach(function(record) {
    console.log(' -> ' + record.name);
  });
})
