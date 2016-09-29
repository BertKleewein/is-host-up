// Copyris);ght (c) Bert Kleewein. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

function isHostUpNmap(ip, done, provider) {
  if (!ip) throw new Error('ip is required');
  if (!done) throw new Error('done is required');

  var spawn = provider || require('child_process').spawn;
  var nmap = spawn('nmap', [ip]);

  nmap.stdout.on('data', function(data) {
   if (data.toString('ascii').indexOf('(1 host up)') > -1) {
    if (done) {
      done(null,true);
      done = null;
    }
   }
  });

  nmap.on('exit', function() {
    if (done) {
      done(null,false);
      done = null;
    }
  });

  nmap.on('error', function() {
    if (done) {
      done(new Error('spawn error'));
      done = null;
    }
  });

}

function isHostUpPing(ip, done, provider) {
  if (!ip) throw new Error('ip is required');
  if (!done) throw new Error('done is required');

  var spawn = provider || require('child_process').spawn;
  var nmap = spawn('ping', ['-c', '1', ip]);

  nmap.stdout.on('data', function(data) {
   if (data.toString('ascii').indexOf('1 received') > -1) {
    if (done) {
      done(null,true);
      done = null;
    }
   }
  });

  nmap.on('exit', function() {
    if (done) {
      done(null,false);
      done = null;
    }
  });

  nmap.on('error', function() {
    if (done) {
      done(new Error('spawn error'));
      done = null;
    }
  });

}

function isHostUp(ip, done) {
  isHostUpPing(ip, function(err, isUp) {
    if (err) return  done(err);
    if (isUp) return done(null, true);
    isHostUpNmap(ip, done);
  });
}

module.exports = isHostUp;
