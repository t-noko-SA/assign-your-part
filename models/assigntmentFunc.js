/* eslint-disable linebreak-style */
/* eslint-disable max-len */

const config = require('../config.json');

function sumPlayer(playerCountMap) {
  let playerSum = 0;
  console.log('playerCountMap in sumPlayer', playerCountMap);
  playerCountMap.forEach((playerCount) => {
    playerSum += Number(playerCount);
  });
  console.log('playerSum', playerSum);
  return playerSum;
}
exports.sumPlayer = sumPlayer;

function countPlayerTotal(pieceMap) {
  let playerTotal = 0;
  pieceMap.forEach((piece) => {
    playerTotal += sumPlayer(piece.get(config.KEY_PLAYER_COUNT));
  });
  return playerTotal;
}

function chooseIndex(arrayLength) {
  const choosedIndex = Math.floor(Math.random() * arrayLength);
  return choosedIndex;
}

function chooseExtraPlayer(memberArray, memberSum, playerTotal) {
  const extraPlayerArray = [];
  const extraPlayerSum = playerTotal % memberSum;
  const coppiedMemberArray = Array.from(memberArray);

  if (extraPlayerSum === 0) {
    return extraPlayerArray;
  }
  let i = extraPlayerSum;
  while (i > 0) {
    const choosedIndex = chooseIndex(coppiedMemberArray.length);
    extraPlayerArray.push(coppiedMemberArray[choosedIndex]);
    coppiedMemberArray.splice(choosedIndex, 1);
    i -= 1;
  }

  // console.log('extraPlayerArray', extraPlayerArray);
  return extraPlayerArray;
}

function makeMemberInfoMap(memberName, memberSum, playerTotal, extraPlayerArray) {
  const memberInfoMap = new Map();
  const playingPieceSum = extraPlayerArray.includes(memberName) ? Math.floor(playerTotal / memberSum) + 1 : Math.floor(playerTotal / memberSum);
  memberInfoMap.set(config.KEY_PLAYER_NAME, memberName);
  memberInfoMap.set(config.KEY_PLYAING_PIECE_SUM, playingPieceSum);

  return memberInfoMap;
}

function makeMemberMap(pieceMap, memberArray) {
  const memberSum = memberArray.length;
  const playerTotal = countPlayerTotal(pieceMap);
  const memberMap = new Map();
  const extraPlayerArray = chooseExtraPlayer(memberArray, memberSum, playerTotal);

  memberArray.forEach((memberName) => {
    const memberInfoMap = makeMemberInfoMap(memberName, memberSum, playerTotal, extraPlayerArray);
    memberMap.set(memberName, memberInfoMap);
  });
  return memberMap;
}
exports.makeMemberMap = makeMemberMap;

function makeUnAssignedMemberMap(memberArray, memberMap) {
  const unAssignedMemberMap = new Map();
  memberArray.forEach((memberName) => {
    unAssignedMemberMap.set(memberName, memberMap.get(memberName).get(config.KEY_PLYAING_PIECE_SUM));
  });
  return unAssignedMemberMap;
}
exports.makeUnAssignedMemberMap = makeUnAssignedMemberMap;

function makePlayerArray(piece, memberMap, unAssignedMemberMap) {
  const playerArray = [];
  const unAssignedMemberArray = Array.from(unAssignedMemberMap.keys());
  // console.log('unAssignedMemberArray',unAssignedMemberArray);
  const playerSum = piece.get(config.KEY_PLAYER_SUM);
  let i = playerSum;
  while (i > 0) {
    const choosedIndex = chooseIndex(unAssignedMemberArray.length);
    const choosedMember = unAssignedMemberArray[choosedIndex];
    playerArray.push(choosedMember);
    unAssignedMemberArray.splice(unAssignedMemberArray.indexOf(choosedMember), 1);
    // console.log('choosedMember', choosedMember, 'unAssignedMemberArray', unAssignedMemberArray);
    unAssignedMemberMap.set(choosedMember, Number(unAssignedMemberMap.get(choosedMember)) - 1);
    if (unAssignedMemberMap.get(choosedMember) === 0) {
      unAssignedMemberMap.delete(choosedMember);
      // console.log('deleted', choosedMember, 'unAssignedMemberMap', unAssignedMemberMap);
    }
    // console.log('unAssignedMemberMap', unAssignedMemberMap);
    i -= 1;
  }

  // console.log('pieceName', piece.get(config.KEY_PIECE_NAME),'playerArray', playerArray, 'unAssignedMemberArray', unAssignedMemberArray)// playerArray.push()
  return playerArray;
}
exports.makePlayerArray = makePlayerArray;

function makeAssigntmentMap(playerArray, playerCountMap) {
  const assigntmentMap = new Map();
  let playerArrayIdx = 0;

  playerCountMap.forEach((playerCount, part, array) => {
    const partPlayerArray = [];
    for (let i = playerCount; i > 0; i -= 1) {
      // console.log('playerArray[playerArrayIdx]', playerArray[playerArrayIdx]);
      partPlayerArray.push(playerArray[playerArrayIdx]);
      playerArrayIdx += 1;
    }
    if (partPlayerArray.length > 0) {
      assigntmentMap.set(part, partPlayerArray);
    }
  });
  return assigntmentMap;
}
exports.makeAssigntmentMap = makeAssigntmentMap;

function makeSortedPieceArray(pieceMap) {
  const pieceArray = Array.from(pieceMap.keys());
  const tempArray = pieceArray.map((pieceName) => (
    { key: pieceName, value: pieceMap.get(pieceName).get(config.KEY_PLAYER_SUM) }
  ));
  const sortedPieceArray = tempArray.sort((a, b) => {
    if (a.value < b.value) return 1;
    if (a.value > b.value) return -1;
    if (a.value === b.value) return Math.floor(Math.random() * 3) - 1;// -> -1 or 0 or 1
  }).map((v) => v.key);
  // console.log('tempArray', tempArray);
  // console.log('sortedPieceArray', sortedPieceArray);
  return sortedPieceArray;
}
exports.makeSortedPieceArray = makeSortedPieceArray;

function convertReqCookieIntoArray(inputValues) {
  const arr = decodeURIComponent(inputValues).slice(0, config.PARAM_MAX_INPUT_SIZE).trim().split('\n')
    .map((s) => s.trim())
    .filter((s) => s !== '');

  if (arr.length > config.PARAM_MAX_INPUT_LENGTH) {
    arr.length = config.PARAM_MAX_INPUT_LENGTH;
  }
  return Array.from(new Set(arr));
}
exports.convertReqCookieIntoArray = convertReqCookieIntoArray;

function formatReqCookie(reqCookie) { // cookie -> req.cookies['members']
  return decodeURIComponent(reqCookie).slice(0, config.PARAM_MAX_INPUT_SIZE);
}
exports.formatReqCookie = formatReqCookie;
