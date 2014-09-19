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

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var PromiseMe = require('../index.js');

var should = chai.should();
chai.use(chaiAsPromised);

describe('PromiseMe', function(){
  it('should return promise for zero args with success', function() {
    var test = "test";

    var mock = new PromiseMe({
      'justASuccessfulCallback' : function(callback) {
        callback(null, test);
      }
    });

    return mock.justASuccessfulCallback().should.eventually.equal(test);
  });

  it('should return promise for some args with success', function() {
    var testArg1 = "testArg1";
    var testArg2 = "testArg2";

    var mock = new PromiseMe({
      'justASuccessfulCallbackWithArgs' : function(arg1, arg2, callback) {
        callback(null, arg1 + arg2);
      }
    });

    return mock.justASuccessfulCallbackWithArgs(testArg1, testArg2).should.eventually.equal(testArg1 + testArg2);
  });

  it('should fail if there is an error', function() {
    var testErr = new Error("It's gone horribly wrong!");

    var mock = new PromiseMe({
      'justAFailingCallback' : function(callback) {
        callback(testErr, null);
      }
    });

    return mock.justAFailingCallback().should.be.rejectedWith(testErr);
  });

  it('should allow to call with a normal callback too', function(done) {
    var test = "test";

    var mock = new PromiseMe({
      'justASuccessfulCallback' : function(callback) {
        callback(null, test);
      }
    });

    var result = mock.justASuccessfulCallback(function(err, data) {
      if(err) throw err;

      data.should.equal(test);

      done();
    });

    should.not.exist(result);
  });
})
