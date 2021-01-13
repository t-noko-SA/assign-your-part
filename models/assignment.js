'use strict';

// function hoge(req){

//   const members = parseInputs(decodeURIComponent(req.cookies.members));
//   const pieces = parseInputs(decodeURIComponent(req.cookies.pieces));
  
//   return form2MapMap;
// };



function makePieceMap(req){
  
  // inputValueArray: 下表の要素が左上から右下の順に格納される

  // |pieceId	|part	|playerCount|
  // +----------+-----+----------|
  // |n0	      |1    |1         |
  // |n0	      |2    |1         |
  // |n1	      |1    |2         |
  // |n1	      |2    |0         |

  const pieceNameArray = convertInputValuesIntoArray(req.cookies.pieces) // => [ABC, DEF, GHI...] 曲ID [n0, n1, n2...] に1対1で対応
  const inputValueArray = Object.entries(req.body).toString().split(','); // => [n0,1,1,n0,2,1,n1,1,2,n1...] 曲ID(n0), パート(1), パート人数(1), 曲ID(n0), パート(2), パート人数(1), 曲ID(n1), ...
  const pieceMap = new Map(); // => {ABC: playerCountMap, DEF: playerCountMap...}
  // playerCountMap => key: part, value: playerCount

  const pieceIdArray = inputValueArray.filter((value, idx, array) => idx % 3 === 0); // => [n0,n0,n1...] 表のpieceId の要素を昇順に格納
  const partArray = inputValueArray.filter((value, idx, array) => idx % 3 === 1); // => [1,2,1 ...] 表のpart の要素を昇順に格納　(曲ID n0 のパート1, 曲ID n0 のパート2, 曲ID n1 のパート1...)
  const playerCountArray = inputValueArray.filter((value, idx, array) => idx % 3 === 2); // => [1,1,2...] 表のplayerCount の要素を昇順に格納　(曲ID n0 のパート1の人数, 曲ID n0 のパート2の人数, 曲ID n2 のパート1の人数)

  pieceNameArray.forEach((pieceName, pieceNameIdx) => {
    const playerCountMap = fetchPlayerCountMap(pieceNameIdx);
    pieceMap.set(pieceName, playerCountMap); // ["ABC",{}]
  });  
  
  pieceNameArray.forEach(pieceName => {
    console.log(pieceName, pieceMap.get(pieceName));
    }
  );
  
  return pieceMap;

  function fetchPlayerCountMap(pieceNameIdx){//TODO もっとわかりやすくできないか考える
    const i = pieceNameIdx * 3;
    const playerCountMap = new Map();
    const partArrayForEachPiece = partArray.slice(i, pieceIdArray.lastIndexOf(pieceIdArray[i]) + 1);
    const playerCountArrayForEachPiece = playerCountArray.slice(i, pieceIdArray.lastIndexOf(pieceIdArray[i]) + 1);
    
    partArrayForEachPiece.forEach((v,i) =>{
      return playerCountMap.set(v, playerCountArrayForEachPiece[i]);
    });

    return playerCountMap;
  };
  
};

function assignParts(pieceMap, memberArray){
  const pieceSum = pieceMap.size;
  const memberSum = memberArray.length;  
  const playerSum = countPlayerSum(pieceMap);
  const restSum = pieceSum * memberSum - playerSum;
  const orderMap = new Map;

  console.log('restSum', restSum);

  if (restSum){
    pieceMap.forEach((playerCountMap, pieceName) => {
      orderMap.set(pieceName, countPlayer(playerCountMap))
    })
  };
  console.log(orderMap);//OK
  return 'hoge';
};

function countPlayer (playerCountMap) {
  let playerSum = 0;
  playerCountMap.forEach(playerCount => {
    playerSum = playerSum + Number(playerCount);
  });
  return playerSum;
}

function countPlayerSum (pieceMap) {
  let playerSum = 0;
  pieceMap.forEach(playerCountMap => {
    playerSum = playerSum + countPlayer (playerCountMap);
  });
  return playerSum;
};



function convertInputValuesIntoArray(inputValues) {
  return decodeURIComponent(inputValues).trim().split('\n').map((s) => s.trim()).filter((s) => s !== "");
};

module.exports = {convertInputValuesIntoArray, makePieceMap, assignParts};

