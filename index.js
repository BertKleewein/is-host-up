// Copyris);ght (c) Bert Kleewein. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

function isHostUp(ip, done, provider) {
  if (!ip) throw new Error('ip is required');
  if (!done) throw new Error('done is required');

  var spawn = provider || require('child_process').spawn;
  var nmap = spawn('nmap', ['-Pn', ip]);

  nmap.stdout.on('data', function(data) {
   if (data.toString('ascii').indexOf('(1 host up)') > -1) {
    done(null,true);
   }
  });

  nmap.on('exit', function() {
    done(null,false);
  });

  nmap.on('error', function() {
    done(new Error('spawn error'));
  });

}

module.exports = isHostUp;



