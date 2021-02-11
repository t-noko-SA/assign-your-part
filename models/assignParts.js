/* eslint-disable linebreak-style */
/* eslint-disable lines-around-directive */

const config = require('../config.json');
const assigntmentFunc = require('./assigntmentFunc');

function assignParts(pieceMap, memberArray) {
  const memberMap = assigntmentFunc.makeMemberMap(pieceMap, memberArray);
  const unAssignedMemberMap = assigntmentFunc.makeUnAssignedMemberMap(memberArray, memberMap);
  const sortedPieceArray = assigntmentFunc.makeSortedPieceArray(pieceMap);

  sortedPieceArray.forEach((pieceName) => {
    const piece = pieceMap.get(pieceName);
    const playerArray = assigntmentFunc.makePlayerArray(piece, memberMap, unAssignedMemberMap);
    const playerCountMap = piece.get(config.KEY_PLAYER_COUNT);
    piece.set(config.KEY_PLAYER_ARRAY, playerArray);
    // console.log(pieceName);
    const assigntmentMap = assigntmentFunc.makeAssigntmentMap(playerArray, playerCountMap);
    // console.log('assigntmentMap', assigntmentMap);
    piece.set(config.KEY_ASSIGNTMENT_MAP, assigntmentMap);
  });
  return pieceMap;
}
module.exports = assignParts;
