'use strict';
//TODO名前をrooterに変更
//TODO 変数名と値が全体で一致するようにする
const config = require('../config.json');
const express = require('express');
const { convertInputValuesIntoArray,makePieceMap, assignParts} = require('../models/assignment');
const router = express.Router();

router.get('/form/1', (req, res, next) => {  
  // const storedMembers = decodeURIComponent(req.cookies[config.KEY_MEMBERS]).length < config.PARAM_MAX_INPUT_SIZE ? decodeURIComponent(req.cookies[config.KEY_MEMBERS]) : "";
  // const storedPieces = decodeURIComponent(req.cookies[config.KEY_PIECES]).length < config.PARAM_MAX_INPUT_SIZE? decodeURIComponent(req.cookies[config.KEY_PIECES]) : "";
  // console.log('req.cookies[config.KEY_MEMBERS]).length', req.cookies[config.KEY_MEMBERS].length);
  console.log('members',decodeURIComponent(req.cookies[config.KEY_MEMBERS]).slice(0,config.PARAM_MAX_INPUT_SIZE));
  res.render('form1',{
    // members : decodeURIComponent(req.cookies[config.KEY_MEMBERS]).slice(0,config.PARAM_MAX_INPUT_SIZE)||"",
    members : req.cookies[config.KEY_MEMBERS]? decodeURIComponent(req.cookies[config.KEY_MEMBERS]).slice(0,config.PARAM_MAX_INPUT_SIZE):"",
    pieces : req.cookies[config.KEY_PIECES]? decodeURIComponent(req.cookies[config.KEY_PIECES]).slice(0,config.PARAM_MAX_INPUT_SIZE):""
  });
});

router.post('/form/1', (req, res, next) => {
  const members = req.body[config.KEY_MEMBERS].slice(0, config.PARAM_MAX_INPUT_SIZE);//TODO 重複メンバーは除外する(mapのキーになる為)
  const pieces = req.body[config.KEY_PIECES].slice(0, config.PARAM_MAX_INPUT_SIZE);
  
  res.cookie(config.KEY_MEMBERS,encodeURIComponent(members),{
    httpOnly: true, sameSite: true
  });
  res.cookie(config.KEY_PIECES,encodeURIComponent(pieces),{
    httpOnly: true, sameSite: true
  });
  
  res.redirect('/form/2');
});

router.post('/form/1:clear',(req, res, next) =>{
  res.clearCookie(config.KEY_MEMBERS);
  res.clearCookie(config.KEY_PIECES);
  res.redirect('/form/1');
})

router.get('/form/2', (req, res, next) => {
  res.render('form2', {//TODO req.cookiesを使っている箇所、長いcookie切る/メンバーの重複削除　そもそもcookie使うか考える
    memberCnt : convertInputValuesIntoArray(req.cookies[config.KEY_MEMBERS]).length, 
    pieceCnt : convertInputValuesIntoArray(req.cookies[config.KEY_PIECES]).length,
    pieces : convertInputValuesIntoArray(req.cookies[config.KEY_PIECES])
  });

});

router.post('/form/2', (req, res, next) => {
  const memberArray = convertInputValuesIntoArray(req.cookies[config.KEY_MEMBERS]);//cookie使わない?
  const pieceMap = makePieceMap(req)[0];
  const resultPieceMap = assignParts(pieceMap, memberArray);//TODO modelsに移す    
  // console.log('resultPieceMap', resultPieceMap);
  // console.log('pieces', req.body[config.KEY_PIECES].slice(0, config.PARAM_MAX_INPUT_SIZE));
  res.cookie(config.KEY_INPUT_VALUE_ARRAY, encodeURIComponent(makePieceMap(req)[1].toString()),{
    httpOnly: true, sameSite: true
  });
  res.render('result',{
    pieces : convertInputValuesIntoArray(req.cookies[config.KEY_PIECES].slice(0,config.PARAM_MAX_INPUT_SIZE)),
    result : resultPieceMap,
    assigntmenMapKey : config.KEY_ASSIGNTMENT_MAP
  });
});

router.post('/retry', (req, res, next) => {
  res.redirect(req.get('/form/2'));
})

module.exports = router;