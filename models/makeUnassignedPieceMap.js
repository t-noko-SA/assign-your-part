/* eslint-disable linebreak-style */

const config = require('../config.json');
const { convertReqCookieIntoArray, sumPlayer } = require('./assigntmentFunc');

function makeUnassignedPieceMap(req) {
  const memberSum = convertReqCookieIntoArray(req.cookies[config.KEY_MEMBERS]).length;
  const pieceNameArray = convertReqCookieIntoArray(req.cookies[config.KEY_PIECES]);
  const pieceMap = new Map();
  const playerCountArray = Object.keys(req.body).length ? Array.from(Object.values(req.body)) : decodeURIComponent(req.cookies[config.KEY_INPUT_VALUE_ARRAY]).split(',');

  pieceNameArray.forEach((pieceName, idx) => {
    function makePlayerCountMap(pieceNameIdx) {
      const playerCountMap = new Map();
      const peaceStartIdx = memberSum * pieceNameIdx;

      playerCountArray.filter((v, i) => i >= peaceStartIdx && i <= peaceStartIdx + memberSum - 1)
        .forEach((v, i) => {
          playerCountMap.set(i + 1, v);
        });
      return playerCountMap;
    }
    const playerCountMap = makePlayerCountMap(idx);
    const pieceInfoMap = new Map([
      [config.KEY_PIECE_NAME, pieceName],
      [config.KEY_PLAYER_COUNT, playerCountMap],
      [config.KEY_PLAYER_SUM, sumPlayer(playerCountMap)],
    ]);

    pieceMap.set(pieceName, pieceInfoMap);
  });

  // pieceNameArray.forEach((pieceName) => {
  //   console.log(pieceName, pieceMap.get(pieceName).get(config.KEY_PLAYER_COUNT));
  // });

  return pieceMap;
}

module.exports = makeUnassignedPieceMap;
