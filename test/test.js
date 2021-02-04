/* eslint-disable linebreak-style */
'use strict';

const makeResultPieceMap = require('../models/makeResultPieceMap');
const testReq1 = {
  body: {
    'n0,1': '1',
    'n0,2': '1',
    'n0,3': '1',
    'n1,1': '2',
    'n1,2': '1',
    'n1,3': '0',
  },
  cookies: {
    pieces: 'PieceNo1of2\nPieceNo2of2',
    members: 'MemberNo1of3\nMemberNo2of3\nMemberNo3of3',
  },
};
const testPieceArray = ['PieceNo1of2', 'PieceNo2of2'];
const testMemberArray = ['MemberNo1of3', 'MemberNo2of3', 'MemberNo3of3'];

describe('#makeResultPieceMap()', () => {
  test('AllInputMemberAndPiecesAreOutput', () => {
    const resultPieceMap = makeResultPieceMap(testReq1);
    const resultPieceArray = [];
    let resultPlayerArray = [];
    resultPieceMap.forEach(((piece) => {
      resultPieceArray.push(piece.get('pieceName'));
      console.log(piece);
      piece.get('assigntmentMap').forEach(((part) => {
        console.log('part', part);
        resultPlayerArray = resultPlayerArray.concat(part.slice());
      }));
      console.log('resultPlayerArray', resultPlayerArray);
      expect(resultPlayerArray.sort().toString()).toBe(testMemberArray.sort().toString());
      console.log(resultPlayerArray, testMemberArray);
      resultPlayerArray.length = 0;
    }));
    console.log(resultPieceArray, testPieceArray);
    expect(resultPieceArray.sort().toString()).toBe(testPieceArray.sort().toString());
  });
});
