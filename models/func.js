'use strict';

var config = require('../config.json');

function makePieceMap(req){
  
  // inputValueArray: 下表の要素が左上から右下の順に格納される

  // |pieceId	|part	|playerCount|
  // +----------+-----+----------|
  // |n0	      |1    |1         |
  // |n0	      |2    |1         |
  // |n1	      |1    |2         |
  // |n1	      |2    |0         |

  // 'ABC' => Map {
  //   'pieceName' => 'ABC',
  //   'playerCount' => Map { 1 => '1', 2 => '1', 3 => '1' },
  //   'playerSum' => 3,
  //   'playerArray' => [ 'Yoko', 'Paul', 'John' ],
  //   'assigntmentMap' => Map { 1 => [Array], 2 => [Array], 3 => [Array] } },
  // 'DEF' => Map {
  const memberSum = convertInputValuesIntoArray(req.cookies[config.KEY_MEMBERS]).length;
  const pieceNameArray = convertInputValuesIntoArray(req.cookies[config.KEY_PIECES]) // => 例[ABC, DEF, GHI...] 曲ID(n0, n1, n2...) に1対1で対応
  const inputValueArray = Object.keys(req.body).length ? Object.entries(req.body).toString().split(',') : decodeURIComponent(req.cookies[config.KEY_INPUT_VALUE_ARRAY]).split(',');
  const pieceMap = new Map(); // => {ABC: playerCountMap, DEF: playerCountMap...}
  // const pieceIdArray = inputValueArray.filter((value, idx, array) => idx % 3 === 0); // => [n0,n0,n1...] 表のpieceId の要素を昇順に格納
  // const partArray = inputValueArray.filter((value, idx, array) => idx % 3 === 1); // => [1,2,1 ...] 表のpart の要素を昇順に格納　(曲ID n0 のパート1, 曲ID n0 のパート2, 曲ID n1 のパート1...)
  const playerCountArray = inputValueArray.filter((value, idx, array) => idx % 3 === 2); // => [1,1,2...] 表のplayerCount の要素を昇順に格納　(曲ID n0 のパート1の人数, 曲ID n0 のパート2の人数, 曲ID n2 のパート1の人数)

  pieceNameArray.forEach((pieceName, pieceNameIdx) => {
    const playerCountMap = makePlayerCountMap(pieceNameIdx);    
    // console.log('playerCountMap', playerCountMap);
    const pieceInfoMap = new Map([
      [config.KEY_PIECE_NAME, pieceName],
      [config.KEY_PLAYER_COUNT, playerCountMap],
      [config.KEY_PLAYER_SUM, sumPlayer(playerCountMap)]
    ]);

    pieceMap.set(pieceName, pieceInfoMap); 
    // console.log('pieceInfoMap', pieceInfoMap)

    function makePlayerCountMap(pieceNameIdx){
      const playerCountMap = new Map();
      const peaceStartIdx = memberSum * pieceNameIdx;

      playerCountArray.filter((v,i) => {
        return i >= peaceStartIdx && i <= peaceStartIdx + memberSum - 1;
      }).forEach((v,i) => {
        playerCountMap.set( i + 1 , v);
      })
      return playerCountMap;
    }
  });   

  pieceNameArray.forEach((pieceName) => {
    // console.log(pieceName, pieceMap.get(pieceName).get(config.KEY_PLAYER_COUNT));
    }
  );
  
  return [pieceMap, inputValueArray];  
};

function assignParts(pieceMap, memberArray){
  const memberMap = makeMemberMap(pieceMap, memberArray);
  const unAssignedMemberMap = makeUnAssignedMemberMap(memberArray, memberMap);  
  const sortedPieceArray = makeSortedPieceArray(pieceMap);

  sortedPieceArray.forEach(pieceName =>{
    const piece = pieceMap.get(pieceName);
    const playerArray = makePlayerArray(piece, memberMap, unAssignedMemberMap);
    const playerCountMap = piece.get(config.KEY_PLAYER_COUNT);
    piece.set(config.KEY_PLAYER_ARRAY, playerArray);
    // console.log(pieceName);
    const assigntmentMap = makeAssigntmentMap(playerArray, playerCountMap);
    // console.log('assigntmentMap', assigntmentMap);
    piece.set(config.KEY_ASSIGNTMENT_MAP, assigntmentMap);
    });
  return pieceMap;
};

function makeMemberMap(pieceMap, memberArray){
  const memberSum = memberArray.length;  
  const playerTotal = countPlayerTotal(pieceMap);
  const memberMap = new Map();
  const extraPlayerArray = chooseExtraPlayer(memberArray, memberSum, playerTotal);

  memberArray.forEach(memberName => {
    const memberInfoMap = makeMemberInfoMap(memberName, memberSum, playerTotal, extraPlayerArray);
    memberMap.set(memberName, memberInfoMap);
  });
  return memberMap;
}

function makeMemberInfoMap(memberName, memberSum, playerTotal, extraPlayerArray){
  const memberInfoMap = new Map();
  const playingPieceSum = extraPlayerArray.includes(memberName) ? Math.floor(playerTotal / memberSum) + 1 : Math.floor(playerTotal / memberSum);
  memberInfoMap.set(config.KEY_PLAYER_NAME, memberName);  
  memberInfoMap.set(config.KEY_PLYAING_PIECE_SUM, playingPieceSum);

  return memberInfoMap;
}

function makeUnAssignedMemberMap(memberArray, memberMap){
  const unAssignedMemberMap = new Map;
  memberArray.forEach(memberName => {
    unAssignedMemberMap.set(memberName, memberMap.get(memberName).get(config.KEY_PLYAING_PIECE_SUM));
  });
  return unAssignedMemberMap;
}

function chooseExtraPlayer(memberArray, memberSum, playerTotal){
  const extraPlayerArray = [];
  const extraPlayerSum = playerTotal % memberSum;
  const coppiedMemberArray = Array.from(memberArray);
  
  if(extraPlayerSum === 0) {
    return extraPlayerArray;    
  } else {
    let i = extraPlayerSum;
    while (i > 0) {
      const choosedIndex = chooseIndex(coppiedMemberArray.length);
      extraPlayerArray.push(coppiedMemberArray[choosedIndex]);
      coppiedMemberArray.splice(choosedIndex, 1);
      i--;
    }
  }  
  // console.log('extraPlayerArray', extraPlayerArray);
  return extraPlayerArray;
}

function chooseIndex(arrayLength){
  const choosedIndex = Math.floor( Math.random() * arrayLength);
  return choosedIndex;
}

function makePlayerArray(piece, memberMap, unAssignedMemberMap){
  const playerArray = [];
  const unAssignedMemberArray = Array.from(unAssignedMemberMap.keys());//TODO debug
  // console.log('unAssignedMemberArray',unAssignedMemberArray);
  const playerSum = piece.get(config.KEY_PLAYER_SUM);//OK
  let i = playerSum;
  while (i > 0) {
    const choosedIndex = chooseIndex(unAssignedMemberArray.length);
    const choosedMember = unAssignedMemberArray[choosedIndex];
    playerArray.push(choosedMember);
    unAssignedMemberArray.splice(unAssignedMemberArray.indexOf(choosedMember),1);//TODO 同名がいたときに不具合が出る
    // console.log('choosedMember', choosedMember, 'unAssignedMemberArray', unAssignedMemberArray);
    unAssignedMemberMap.set(choosedMember, Number(unAssignedMemberMap.get(choosedMember))-1);
    if (unAssignedMemberMap.get(choosedMember)===0) {
      unAssignedMemberMap.delete(choosedMember);
      // console.log('deleted', choosedMember, 'unAssignedMemberMap', unAssignedMemberMap);
    }
    // console.log('unAssignedMemberMap', unAssignedMemberMap);
    i--;
  }
  
  // console.log('pieceName', piece.get(config.KEY_PIECE_NAME),'playerArray', playerArray, 'unAssignedMemberArray', unAssignedMemberArray)// playerArray.push()
  return playerArray;
}

function makeAssigntmentMap(playerArray, playerCountMap){
  const assigntmentMap = new Map;
  let playerArrayIdx = 0;

  playerCountMap.forEach((playerCount,part,array) =>{
    const partPlayerArray = [];
    for (let i = playerCount; i > 0; i --){
      // console.log('playerArray[playerArrayIdx]', playerArray[playerArrayIdx]);
      partPlayerArray.push(playerArray[playerArrayIdx]);
      playerArrayIdx++;
    };
    if (partPlayerArray.length > 0) {
      assigntmentMap.set(part, partPlayerArray);
    };
  })
  return assigntmentMap;
}

function sumPlayer (playerCountMap) {
  let playerSum = 0;
  // console.log('playerCountMap', playerCountMap);
  playerCountMap.forEach(playerCount => {
    playerSum = playerSum + Number(playerCount);
  });  
  return playerSum;
};

function countPlayerTotal (pieceMap) {
  let playerTotal = 0;
  pieceMap.forEach(piece => {
    playerTotal = playerTotal + sumPlayer (piece.get(config.KEY_PLAYER_COUNT));
  });
  return playerTotal;
};

function makeSortedPieceArray (pieceMap) {
  const pieceArray = Array.from(pieceMap.keys()); 
  let tempArray = pieceArray.map((pieceName) => (
    {key: pieceName, value: pieceMap.get(pieceName).get(config.KEY_PLAYER_SUM)}
  ));
  const sortedPieceArray = tempArray.sort((a, b) => {
    if(a.value < b.value) return 1;
    if(a.value > b.value) return -1;
    if(a.value = b.value) return Math.floor(Math.random() * 3) -1;// -> -1 or 0 or 1
  }).map(v => v.key);
  // console.log('tempArray', tempArray);
  // console.log('sortedPieceArray', sortedPieceArray);
  return sortedPieceArray;
};

function convertInputValuesIntoArray(inputValues) {
  // const arr = decodeURIComponent(inputValuesOrReqCookies).trim().split('\n').map((s) => s.trim()).filter((s) => s !== "");
  const arr = decodeURIComponent(inputValues).slice(0, config.PARAM_MAX_INPUT_SIZE).trim().split('\n').map((s) => s.trim()).filter((s) => s !== "");

  if(arr.length>config.PARAM_MAX_INPUT_LENGTH){
    arr.length=config.PARAM_MAX_INPUT_LENGTH;
  };
  return Array.from(new Set(arr));//重複排除
};

function formatReqCookie(reqCookie){ //cookie -> req.cookies['members']
  return decodeURIComponent(reqCookie).slice(0,config.PARAM_MAX_INPUT_SIZE);
};

module.exports = {convertInputValuesIntoArray, makePieceMap, assignParts, formatReqCookie};