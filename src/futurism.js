// # Module futurism
//
// Fast, sorta-sane and impure monadic Promise implementation.
//
// Copyright (c) 2013 Quildreen "Sorella" Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Constants
var Nothing = {}


// Core implementation
function Promise() {
  this.success  = undefined;
  this.value    = Nothing;
  this.pending  = []
}

Promise.of = function(x) {
  return new Promise().fulfill(x) }

Promise.empty = function() {
  return new Promise() }

Promise.from = function(x) {
  return isPromise(x)?    x
  :      isThenable(x)?   promiseFromThenable(x)
  :      /* otherwise */  Promise.of(x) }

Promise.prototype = {
  of    : Promise.of
, empty : Promise.empty
, from  : Promise.from

, fulfill:
  function _fulfill(x) {
    moveTo(true, x, this)
    return this }

, reject:
  function _reject(x) {
    moveTo(false, x, this)
    return this }

, map:
  function _map(f) {
    return !this.success?   this
    :      /* otherwise */  Promise.of(f(this.value)) }

, chain:
  function _chain(f) {
    return !this.success?   this
    :      /* otherwise */  f(this.value) }

, orElse:
  function _orElse(f) {
    return this.success !== false?  this
    :      /* otherwise */          f(this.value) }

, concat:
  function _concat(promise) {
    return this.chain(function(a) {
                        return promise.chain(function(b) {
                                               return Promise.of([a, b]) })})}
}


// Nasty bits
function isPromise(x) {
  return x instanceof Promise }


function isThenable(x) {
  return x && typeof x.then == 'function' }


function promiseFromThenable(x) {
  var promise = new Promise()
  x.then(promise.fulfill.bind(promise), promise.reject.bind(promise))
  return promise }


function invokePendingCallbacks(promise) {
  var state   = promise.success? 'onSuccess' : 'onFailure'
  var value   = promise.value

  var pending = promise.pending, l = pending.length
  for (var i = 0; i < l; ++i)  pending[i][state](value)

  pending.length = 0 }


function moveTo(state, value, promise) {
  if (promise.value !== Nothing)  throw new Error('Promise already fulfilled.')
  promise.success = state
  promise.value   = value
  invokePendingCallbacks(promise) }


// Exports
module.exports = Promise