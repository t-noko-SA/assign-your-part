'use strict';
//TODO 変数名と値が全体で一致するようにする
const config = require('../config.json');
const express = require('express');
const { convertInputValuesIntoArray,makePieceMap, assignParts, formatReqCookie} = require('../models/assignment');
const isLocalhost = require('../models/isLocalhost');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', { title: 'パート決めアプリ' });
});

router.post('/', (req, res, next) => {
  res.render('form1');
});

router.get('/form/1', (req, res, next) => {  
  console.log('members',formatReqCookie(req.cookies[config.KEY_MEMBERS]));
  res.render('form1',{
    members : req.cookies[config.KEY_MEMBERS]? formatReqCookie(req.cookies[config.KEY_MEMBERS]):"",
    pieces : req.cookies[config.KEY_PIECES]? formatReqCookie(req.cookies[config.KEY_PIECES]):""
  });
});

router.post('/form/1', (req, res, next) => {
  const members = req.body[config.KEY_MEMBERS].slice(0, config.PARAM_MAX_INPUT_SIZE);//TODO 重複メンバーは除外する(mapのキーになる為)
  const pieces = req.body[config.KEY_PIECES].slice(0, config.PARAM_MAX_INPUT_SIZE);
  console.log('members', members);
  console.log('pieces', pieces);
  const location = typeof window === 'object' ? window.location : {};
  const host = typeof location === 'object' ? location.host : '';    

  if(!isLocalhost(host)){
    res.cookie(config.KEY_MEMBERS,encodeURIComponent(members),{      
      secure: true, httpOnly: true, sameSite: true
    });
    res.cookie(config.KEY_PIECES,encodeURIComponent(pieces),{      
      secure: true, httpOnly: true, sameSite: true
    });    
  }else{
    res.cookie(config.KEY_MEMBERS,encodeURIComponent(members),{      
      httpOnly: true, sameSite: true
    });
    res.cookie(config.KEY_PIECES,encodeURIComponent(pieces),{
      httpOnly: true, sameSite: true
    });
  }
  res.redirect('/form/2');
  });

    

router.post('/form/1:clear',(req, res, next) =>{
  res.clearCookie(config.KEY_MEMBERS);
  res.clearCookie(config.KEY_PIECES);
  res.redirect('/form/1');
})

router.get('/form/2', (req, res, next) => {
  console.log('memberCnt',convertInputValuesIntoArray(req.cookies[config.KEY_MEMBERS]).length, 'pieceCnt', convertInputValuesIntoArray(req.cookies[config.KEY_PIECES]).length)
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
  const location = typeof window === 'object' ? window.location : {};
  const host = typeof location === 'object' ? location.host : '';      
  // console.log('resultPieceMap', resultPieceMap);
  // console.log('pieces', req.body[config.KEY_PIECES].slice(0, config.PARAM_MAX_INPUT_SIZE));
  if(!isLocalhost(host)){
    res.cookie(config.KEY_INPUT_VALUE_ARRAY, encodeURIComponent(makePieceMap(req)[1].toString()),{
      secure: true, httpOnly: true, sameSite: true
    });
  }else{
    res.cookie(config.KEY_INPUT_VALUE_ARRAY, encodeURIComponent(makePieceMap(req)[1].toString()),{
      httpOnly: true, sameSite: true
    });  
  }
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