'use strict';
//参考: Node.jsのSPAでlocalhostのときのみRollbarの通知をとめる
//https://wp-kyoto.net/disabled-rollbar-when-localhost/
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
