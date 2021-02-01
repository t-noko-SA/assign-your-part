/* eslint-disable linebreak-style */
'use strict;'
const makePieceMap = require('./makePieceMap');
const assigntmentFunc = require('./assigntmentFunc');
const assignParts = require('./assignParts');
const config = require('../config.json');

function makeResultPieceMap(req) {
  const unassignedPieceMap = makePieceMap(req);
  const memberArray = assigntmentFunc.convertReqCookieIntoArray(req.cookies[config.KEY_MEMBERS]);
  const resultPieceMap = assignParts(unassignedPieceMap, memberArray);
  return resultPieceMap;
}

module.exports = makeResultPieceMap;
