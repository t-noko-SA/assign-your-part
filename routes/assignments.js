'use strict';
const express = require('express');
const { makePieceMap ,assignParts } = require('../models/assignment');
const router = express.Router();
const myFnc = require('../models/assignment');

let app = express();

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
  // const pieceNameArray = myFnc.convertInputValuesIntoArray(req.cookies.pieces);
  const pieceMap = makePieceMap(req);
  console.log('makePieceMap(req)', pieceMap);
  const result = assignParts(pieceMap, memberArray);
  // res.cookie('pieces',encodeURIComponent(pieces),{
  //   httpOnly: true, sameSite: true
  // });
  // res.cookie('members',encodeURIComponent(members),{
  //   httpOnly: true, sameSite: true
  // });
  // res.cookie('parts',encodeURIComponent(members),{
  //   httpOnly: true, sameSite: true
  // });  
  res.redirect('/result')
});

router.get('/result', (req, res, next) => {
  res.render('results');
});

module.exports = router;