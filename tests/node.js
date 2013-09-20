var brofist = require('brofist')
var minimal = require('brofist-minimal')
var specs   = require('./specs')

brofist.run(specs, minimal()).otherwise(function() {
  process.exit(1)
})