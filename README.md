# パート決めヘルパー

"パート決めヘルパー" は、アンサンブルや合奏における管楽器のパート決めを手助けします。

[パート決めヘルパー](https://protected-brushlands-21043.herokuapp.com/)

# こんな時に便利
- アンサンブルをいくつか演奏したいので、手っ取り早くランダムにパートを決めたい。
- パート構成の異なる複数の曲のパートを、ランダムで降り番も偏らないように割り振りたい。

# Usage
- STEP1: 曲とメンバーを入力
- STEP2: パート構成を入力
- STEP3: 結果発表！やり直しもできるよ。

# DEMO

![](https://raw.githubusercontent.com/t-noko-SA/assign-your-part/master/public/img/intro_v0-01.gif)

# Features

- パート構成が異なる複数の曲をまとめて割振！「この曲の1stはアシを付けるので2人必要」「この曲は2ndまでしかパートがないよ」
- 降り番は偏らないようにランダムで選ばれるので気まずさ解消！「ランダムじゃ仕方ないよね」
- 気に入らなければ何度でもやり直し可能！「...うーん」

# Requirement

* node  10.14.2
(https://github.com/t-noko-SA/assign-your-part/blob/master/package.json)

# Installation

yarn install

# 用語集
|             |                                                                                                                                                                                                                          |     | 
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- | 
| 用語        | 説明                                                                                                                                                                                                                     |     | 
| piece       | 曲                                                                                                                                                                                                                       |     | 
| player      | pieceに割り当てられた人。演奏者。                                                                                                                                                                                        |     | 
| member      | STEP1で入力された全ての人。playerも非playerも含む                                                                                                                                                                        |     | 
| part        | 演奏する楽譜(パート譜)の割り当て。1st, 2nd, 3rd, 4th...と続く。<br>[パート分けされた楽譜の例](https://commons.wikimedia.org/wiki/File:Mendelssohn_Opus_13_Intermezzo.jpg#/media/File:Mendelssohn_Opus_13_Intermezzo.jpg) |     | 
| playerCount | 各partに割り当てるplayerの数。STEP3で選択する                                                                                                                                                                            |     | 
| playerSum   | pieceに対するplayerの合計                                                                                                                                                                                                |     | 
| playerTotal | 全てのpieceのplayerの延べ人数                                                                                                                                                                                            |     | 
| assign      | memberをpartに割り当てること                                                                                                                                                                                             |     | 
| extraPlayer | 各memberに割り当てられる曲の数が同一にならない場合、より多く曲を演奏するplayer                                                                                                                                           |     | 
| 乗り番      | pieceに対してそのmemberが割り当てられていること。その曲は演奏する。                                                                                                                                                      |     | 
| 降り番      | pieceに対してそのmemberが割り当てられないこと。その曲は演奏しない。                                                                                                                                                    |     | 

# Object
```
    resultPieceMap Map { //曲ごとの割振結果
      'PieceNo1of2'// => Map {
        'pieceName'// => 'PieceNo1of2',//曲名
        'playerCount'// => Map { 1 => '1', 2 => '1', 3 => '1' },//パート => パート人数
        'playerSum' => 3,// => プレイヤーの合計
        'playerArray' => [ 'MemberNo2of3', 'MemberNo3of3', 'MemberNo1of3' ],// => プレイヤーの名前
        'assigntmentMap' => Map { 1 => [Array], 2 => [Array], 3 => [Array] } },// => パート毎のプレイヤー [Array] => [ 'MemberNo2of3', 'MemberNo3of3']
      'PieceNo2of2' => Map {//...
```
# Note

この作品は、「N予備校WEBアプリコンテスト2020冬」応募作品です
(https://progedu.github.io/webappcontest/2020/winter/entry/index.html)

# Author
* t-noko

# License
GNU General Public License v3.0
