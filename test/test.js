/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-undef */

'use strict';

const makeResultPieceMap = require('../models/makeResultPieceMap');
const assigntmentFunc = require('../models/assigntmentFunc');

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

describe('#makeResultPieceMap', () => {
  test('AllInputMemberAndPiecesAreOutput', () => {
    const resultPieceMap = makeResultPieceMap(testReq1);
    const resultPieceArray = [];
    let resultPlayerArray = [];
    resultPieceMap.forEach(((piece) => {
      resultPieceArray.push(piece.get('pieceName'));
      piece.get('assigntmentMap').forEach(((part) => {
        resultPlayerArray = resultPlayerArray.concat(part.slice());
      }));
      expect(resultPlayerArray.sort().toString()).toBe(testMemberArray.sort().toString());
      resultPlayerArray.length = 0;
    }));
    expect(resultPieceArray.sort().toString()).toBe(testPieceArray.sort().toString());
  });
});

describe('#assigntmentFunc', () => {
  const testMemberArrayCopied = Array.from(testMemberArray);
  test('ExtraPlayersAreChoosed', () => {
    const extraPlayerArray = assigntmentFunc
      .chooseExtraPlayer(testMemberArrayCopied, testMemberArrayCopied.length,
        testMemberArrayCopied.length - 1);
    extraPlayerArray.forEach((player) => {
      // expect(testMemberArrayCopied.includes(player)).toBe(true);
      expect(testMemberArrayCopied).toContain(player);
      testMemberArrayCopied.splice(testMemberArrayCopied.find(v => v = player), 1);
    });
  });
});
