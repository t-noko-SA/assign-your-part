'use strict';
const config = require('../config.json');
const express = require('express');
const $ = require('jquery');
const { convertInputValuesIntoArray, makePieceMap, assignParts, makeCookie, getCookie } = require('../models/assignment');
const router = express.Router();
const myFnc = require('../models/assignment');
// const Cookies = require('js-cookie');

router.get('/form/1', (req, res, next) => {
  res.render('form1');
});

router.post('/form/1', (req, res, next) => {
  const inputLimit = 1000;
  const members = req.body.members_field.slice(0, inputLimit);
  const pieces = req.body.pieces_field.slice(0, inputLimit);

  res.cookie('members',encodeURIComponent(members),{
    httpOnly: true, sameSite: true
  });
  res.cookie('pieces',encodeURIComponent(pieces),{
    httpOnly: true, sameSite: true
  });
  
  res.redirect('/form/2');
});

router.get('/form/2', (req, res, next) => {
  res.render('form2', {
    memberCnt : myFnc.convertInputValuesIntoArray(req.cookies.members).length, 
    pieceCnt : myFnc.convertInputValuesIntoArray(req.cookies.pieces).length,
    pieces : myFnc.convertInputValuesIntoArray(req.cookies.pieces)
  });

});

router.post('/form/2', (req, res, next) => {
  const memberArray = myFnc.convertInputValuesIntoArray(req.cookies.members);
  const pieceMap = makePieceMap(req);
  const resultPieceMap = assignParts(pieceMap, memberArray);//TODO modelsに移す    
  console.log('resultPieceMap', resultPieceMap);
  console.log('config.KEY_ASSIGNTMENT_MAP', config.KEY_ASSIGNTMENT_MAP);
  // console.log('test', resultPieceMap.get('ABC').get(config.KEY_ASSIGNTMENT_MAP));
  res.render('result',{
    pieces : myFnc.convertInputValuesIntoArray(req.cookies.pieces),
    // test : resultPieceMap.get('ABC').get(config.KEY_ASSIGNTMENT_MAP)
    result : resultPieceMap,
    assigntmenMapKey : config.KEY_ASSIGNTMENT_MAP
  });
});

router.get('/result', (req, res, next) => {
  //  const cookie = getCookie(req);
  // console.log('cookie', JSON.stringify(...cookie));//エラー
  //  const test = decodeURIComponent(cookie.pieces).split('\r\n');
  // const testCookie = req.cookies.resultPieceMap;
  // console.log('req.cookies.testCookie', req.cookies.testCookie);
  // console.log('testCookie', testCookie);
  res.render('result', {
    // pieces: decodeURIComponent(cookie.pieces).split(',')}
    pieces : myFnc.convertInputValuesIntoArray(req.cookies.pieces)

    // resultPieceMap : JSON.stringify(...myFnc.convertInputValuesIntoArray(req.cookies.resultPieceMap))
    // resultPieceMap : myFnc.convertInputValuesIntoArray(req.cookies.resultPieceMap),  //TODO 直す
    // pieces: "'ABC', 'EFG', 'HIJ'",
    // ABC_part: [1, 2],
  });
});

module.exports = router;