/* eslint-disable linebreak-style */

const makeUnassignedPieceMap = require('./makeUnassignedPieceMap');
const assigntmentFunc = require('./assigntmentFunc');
const assignParts = require('./assignParts');
const config = require('../config.json');

function makeResultPieceMap(req) {
  const unassignedPieceMap = makeUnassignedPieceMap(req);
  const memberArray = assigntmentFunc.convertReqCookieIntoArray(req.cookies[config.KEY_MEMBERS]);
  const resultPieceMap = assignParts(unassignedPieceMap, memberArray);
  // console.log('resultPieceMap', resultPieceMap);
  return resultPieceMap;
}

module.exports = makeResultPieceMap;
