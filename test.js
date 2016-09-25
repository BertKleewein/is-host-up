// Copyright (c) Bert Kleewein. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var isHostUp = require('./index.js');
var assert = require('chai').assert;
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var sinon = require('sinon');

var FakeNmap = function() {
  
  this.stdout = new EventEmitter();

  EventEmitter.call(this);
};
util.inherits(FakeNmap, EventEmitter);

var thisFakeNmap;
var FakeSpawn = sinon.spy(function() {
  thisFakeNmap = new FakeNmap();
  return thisFakeNmap;
});

describe ('is-host-up', function() {

  beforeEach(function(done) {
    FakeSpawn.reset();
    done();
  });

  afterEach(function(done) {
    thisFakeNmap = null;
    done();
  });

  it ('asserts if ip is falsy', function(done) {
    assert.throws(function() {
      isHostUp(null, function() {}, FakeSpawn);
    });
    done();
  });

  it ('asserts if done is falsy', function(done) {
    assert.throws(function() {
      isHostUp('foo', null, FakeSpawn);
    });
    done();
  });

  it ('calls nmap correctly', function(done) {
    isHostUp('foo',function() {}, FakeSpawn);
    assert(FakeSpawn.withArgs('nmap', ['-Pn', 'foo']).calledOnce);
    done();
  });

  it ('calls done with error on error', function (done) {
    isHostUp('foo', function(err) {
      assert.isDefined(err);
      done();
    }, FakeSpawn);
    thisFakeNmap.stdout.emit('data','bar');
    thisFakeNmap.emit('error', 'foo');
  });

  it ('calls done with false if no host found', function(done) {
    isHostUp('foo', function(err, isUp) {
      assert.isNull(err);
      assert.isFalse(isUp);
      done();
    }, FakeSpawn);
    thisFakeNmap.emit('exit');
  });

  it ('calls done with true if host found', function(done) {
    isHostUp('foo', function(err, isUp) {
      assert.isNull(err);
      assert.isTrue(isUp);
      done();
    }, FakeSpawn);
    thisFakeNmap.stdout.emit('data', '(1 host up)');
  });

});
