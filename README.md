Futurism
========

[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)
[![Build Status](https://secure.travis-ci.org/killdream/futurism.png?branch=master)](https://travis-ci.org/killdream/futurism)
[![Dependencies Status](https://david-dm.org/killdream/futurism.png)](https://david-dm.org/killdream/futurism)

A fast, sorta sane and impure implementation of monadic Promises for
JavaScript. No Promises/A+ bullshit or compatibility.


## Example

```js
var Future = require('futurism')
var a = new Future()
var b = a.map(function(v){ return v + 1 })

a.fulfill(10)
b.map(function(v) { console.log('ok:', v) })
 .orElse(function(v){ console.log('failed:', v) })

// => ok: 11
```


## Installing

Just grab it from NPM:

    $ npm install futurism
    
    
## Test

On Node:

    $ npm test


## Licence

MIT.
