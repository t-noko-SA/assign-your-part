/* eslint-disable linebreak-style */
'use strict';
const config = require('../config.json');
const { convertReqCookieIntoArray, sumPlayer } = require('./assigntmentFunc');

function makePieceMap(req) {
  const memberSum = convertReqCookieIntoArray(req.cookies[config.KEY_MEMBERS]).length;
  // => 例[ABC, DEF, GHI...] 曲ID(n0, n1, n2...) に1対1で対応
  const pieceNameArray = convertReqCookieIntoArray(req.cookies[config.KEY_PIECES]);
  const inputValueArray = Object.keys(req.body).length ? Object.entries(req.body).toString().split(',') : decodeURIComponent(req.cookies[config.KEY_INPUT_VALUE_ARRAY]).split(',');
  const pieceMap = new Map(); // => {ABC: playerCountMap, DEF: playerCountMap...}

  // const pieceIdArray = inputValueArray.filter((value, idx, array) => idx % 3 === 0); // => [n0,n0,n1...] 表のpieceId の要素を昇順に格納
  // const partArray = inputValueArray.filter((value, idx, array) => idx % 3 === 1); // => [1,2,1 ...] 表のpart の要素を昇順に格納　(曲ID n0 のパート1, 曲ID n0 のパート2, 曲ID n1 のパート1...)
  const playerCountArray = inputValueArray.filter((value, idx, array) => idx % 3 === 2); // => [1,1,2...] 表のplayerCount の要素を昇順に格納　(曲ID n0 のパート1の人数, 曲ID n0 のパート2の人数, 曲ID n2 のパート1の人数)

  pieceNameArray.forEach((pieceName, pieceNameIdx) => {
    function makePlayerCountMap(pieceNameIdx) {
      const playerCountMap = new Map();
      const peaceStartIdx = memberSum * pieceNameIdx;

      playerCountArray.filter((v, i) => i >= peaceStartIdx && i <= peaceStartIdx + memberSum - 1)
        .forEach((v, i) => {
          playerCountMap.set(i + 1, v);
        });
      return playerCountMap;
    }
    const playerCountMap = makePlayerCountMap(pieceNameIdx);
    const pieceInfoMap = new Map([
      [config.KEY_PIECE_NAME, pieceName],
      [config.KEY_PLAYER_COUNT, playerCountMap],
      [config.KEY_PLAYER_SUM, sumPlayer(playerCountMap)],
    ]);

    pieceMap.set(pieceName, pieceInfoMap);
    // console.log('pieceInfoMap', pieceInfoMap)
  });

  pieceNameArray.forEach((pieceName) => {
    console.log(pieceName, pieceMap.get(pieceName).get(config.KEY_PLAYER_COUNT));
  });

  return pieceMap;
}

module.exports = makePieceMap;
