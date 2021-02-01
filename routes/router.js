'use strict';
// TODO 変数名と値が全体で一致するようにする
const express = require('express');
const config = require('../config.json');
const { convertReqCookieIntoArray, formatReqCookie } = require('../models/assigntmentFunc');
const isLocalhost = require('../models/isLocalhost');
const makeResultPieceMap = require('../models/makeResultPieceMap');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', (req, res, next) => {
  res.render('form1');
});

router.get('/form/1', (req, res, next) => {
  res.render('form1', {
    members: req.cookies[config.KEY_MEMBERS] ? formatReqCookie(req.cookies[config.KEY_MEMBERS]) : '',
    pieces: req.cookies[config.KEY_PIECES] ? formatReqCookie(req.cookies[config.KEY_PIECES]) : '',
  });
});

router.post('/form/1', (req, res, next) => {
  const members = encodeURIComponent(req.body[config.KEY_MEMBERS])
    .slice(0, config.PARAM_MAX_INPUT_SIZE);
  const pieces = encodeURIComponent(req.body[config.KEY_PIECES])
    .slice(0, config.PARAM_MAX_INPUT_SIZE);
  const location = typeof window === 'object' ? window.location : {};
  const host = typeof location === 'object' ? location.host : '';

  if (!isLocalhost(host)) {
    res.cookie(config.KEY_MEMBERS, members, {
      secure: true, httpOnly: true, sameSite: true,
    });
    res.cookie(config.KEY_PIECES, pieces, {
      secure: true, httpOnly: true, sameSite: true,
    });
  } else {
    res.cookie(config.KEY_MEMBERS, members, {
      httpOnly: true, sameSite: true,
    });
    res.cookie(config.KEY_PIECES, pieces, {
      httpOnly: true, sameSite: true,
    });
  }
  res.redirect('/form/2');
});

router.post('/form/1:clear', (req, res, next) =>{
  res.clearCookie(config.KEY_MEMBERS);
  res.clearCookie(config.KEY_PIECES);
  res.redirect('/form/1');
});

router.get('/form/2', (req, res, next) => {
  res.render('form2', {
    memberCnt: convertReqCookieIntoArray(req.cookies[config.KEY_MEMBERS]).length,
    pieceCnt: convertReqCookieIntoArray(req.cookies[config.KEY_PIECES]).length,
    pieces: convertReqCookieIntoArray(req.cookies[config.KEY_PIECES]),

  });
});

router.post('/form/2', (req, res, next) => {
  const location = typeof window === 'object' ? window.location : {};
  const host = typeof location === 'object' ? location.host : '';
  const resultPieceMap = makeResultPieceMap(
    req, convertReqCookieIntoArray(req.cookies[config.KEY_MEMBERS]),
  );
  const inputValueArray = Object.keys(req.body).length ? Object.entries(req.body).toString().split(',') : decodeURIComponent(req.cookies[config.KEY_INPUT_VALUE_ARRAY]).split(',');

  if (!isLocalhost(host)) {
    res.cookie(config.KEY_INPUT_VALUE_ARRAY, encodeURIComponent(inputValueArray.toString()), {
      secure: true, httpOnly: true, sameSite: true,
    });
  } else {
    res.cookie(config.KEY_INPUT_VALUE_ARRAY, encodeURIComponent(inputValueArray.toString()), {
      httpOnly: true, sameSite: true,
    });
  }
  res.render('result', {
    pieces: convertReqCookieIntoArray(req.cookies[config.KEY_PIECES]),
    result: resultPieceMap,
    assigntmenMapKey: config.KEY_ASSIGNTMENT_MAP,
  });
});

router.post('/retry', (req, res, next) => {
  res.redirect(req.get('/form/2'));
});

module.exports = router;
