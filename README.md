# Promisify Me

A small library to wrap objects and turn ordinary async callback based APIs into
shiny promise based ones (using the Q promise library)

## Usage
```js
var PromisifyMe = require('promisify-me');
```
Then we can replace simple success callbacks with promises
```js
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
```

Callback errors will reject the promise
```js
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
```

We can also tell it how we want the adapter to function using a definition
In this case we are using the built in 'nedb' definition, but we could equally
provide a definition object
```js
var DataStore = PromisifyMe(require('nedb'), 'nedb');

var store = new DataStore();

var data = [
  { name: "Steve" },
  { name: "Dave" },
  { name: "Tony" }
];

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
});
```

Currently the 'nedb' definition is the only built in one.

## How does it work?
By default a method will try to guess whether to provide a promise
based callback to the delegate object based on how you call it as follows:

* If the number of arguments you pass is >= the number of arguments defined in
the original function then the underlying function will be called directly with
no callback. Any return value will be passed through from the underlying
function.

* If the last argument supplied is a function then it assumes you are providing
your own callback and the function will be called directly. Any return value
will be passed through from the underlying function.

* If the last argument is not a function then a callback linked to a promise
will be appended to the arguments passed to the underlying function. The promise
linked to the callback will be returned.

So, as you can see there is plenty of room for error here, and hard to debug
issues, so it's best to provide a definition if possible.
