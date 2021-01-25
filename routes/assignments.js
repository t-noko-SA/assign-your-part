'use strict';
const config = require('../config.json');
const express = require('express');
const { convertInputValuesIntoArray,makePieceMap, assignParts} = require('../models/assignment');
const router = express.Router();

router.get('/form/1', (req, res, next) => {  
  res.render('form1',{
    members : req.cookie(config.KEY_MEMBERS),
    pieces : res.cookie(config.KEY_PIECES)
  });
});

router.post('/form/1', (req, res, next) => {
  const inputLimit = 1000;
  const members = req.body[config.KEY_MEMBERS].slice(0, inputLimit);
  const pieces = req.body[config.KEY_PIECES].slice(0, inputLimit);

  res.cookie(config.KEY_MEMBERS,encodeURIComponent(members),{
    httpOnly: true, sameSite: true
  });
  res.cookie(config.KEY_PIECES,encodeURIComponent(pieces),{
    httpOnly: true, sameSite: true
  });
  
  res.redirect('/form/2');
});

router.get('/form/2', (req, res, next) => {
  res.render('form2', {
    memberCnt : convertInputValuesIntoArray(req.cookies[config.KEY_MEMBERS]).length, 
    pieceCnt : convertInputValuesIntoArray(req.cookies[config.KEY_PIECES]).length,
    pieces : convertInputValuesIntoArray(req.cookies[config.KEY_PIECES])
  });

});

router.post('/form/2', (req, res, next) => {
  const memberArray = convertInputValuesIntoArray(req.cookies[config.KEY_MEMBERS]);
  const pieceMap = makePieceMap(req)[0];
  const resultPieceMap = assignParts(pieceMap, memberArray);//TODO modelsに移す    
  console.log('resultPieceMap', resultPieceMap);
  res.cookie(config.KEY_INPUT_VALUE_ARRAY, encodeURIComponent(makePieceMap(req)[1].toString()),{
    httpOnly: true, sameSite: true
  });
  res.render('result',{
    pieces : convertInputValuesIntoArray(req.cookies[config.KEY_PIECES]),
    result : resultPieceMap,
    assigntmenMapKey : config.KEY_ASSIGNTMENT_MAP
  });
});

router.post('/retry', (req, res, next) => {
  res.redirect(req.get('/form/2'));
})

module.exports = router;