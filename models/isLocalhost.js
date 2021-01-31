'use strict';
function isLocalhost(host = '') {
  if (!host)
    return true;
  if (/^localhost/.test(host))
    return true;
  if (/^http:\/\/localhost/.test(host))
    return true;
  if (/^https:\/\/localhost/.test(host))
    return true;
  return false;
}

module.exports=isLocalhost;
