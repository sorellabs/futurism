var spec = require('brofist')()
var expect = require('chai').expect
var pinky = require('pinky')
var P = require('../../')

module.exports = spec('Promise(a)', function(it, spec) {

  function id(x){ return x }
  function inc(x) { return x + 1 }
  function incP(x) { return P.of(inc(x)) }
  function incInc(x) { return inc(inc(x)) }
  var p1 = P.of(1), p2 = P.of(2), p3 = P.of(3)

  spec('map(f)', function(it) {
    it('identity', function() {
      expect(p1.map(id).chain(id)).to.equal(p1.chain(id))
    })

    it('composition', function() {
      expect(p1.map(incInc).chain(id)).to.equal(p1.map(inc).map(inc).chain(id))
    })
  })

  spec('of(x)', function(it) {
    it('Should produce a Promise holding X', function() {
      expect(P.of(1).chain(id)).to.equal(1)
    })
  })

  spec('chain(f)', function(it) {
    it('associativity', function() {
      expect(p1.chain(incP).chain(incP).chain(id))
        .to.equal(p1.chain(function(a){ return incP(a).chain(incP) }).chain(id))
    })

    it('left identity', function() {
      expect(P.of(1).chain(inc)).to.equal(inc(1))
    })

    it('right identity', function() {
      expect(p1.chain(P.of).chain(id)).to.equal(p1.chain(id))
    })
  })

  spec('from(a)', function(it) {
    it('Given a Promise, shouldn\'t wrap.', function() {
      expect(P.from(p1)).to.equal(p1)
    })

    it('Given a Thenable (Promises/A+), should grab the flat value.', function() {
      var t1 = pinky(pinky(1))
      var done = pinky()
      P.from(t1).chain(function(a) {
        console.log(a)
        if (a === 1)  done.fulfill()
        else          done.reject('a ≠ 1')
      })
      return done
    })
  })

})