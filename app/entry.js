'use strict';
const $ = require('jquery');
const global = Function('return this;')();
const config = require('../config.json');
global.jQuery = $;
// window.onload = handleOnload();

// function handleOnload(){
//   displayCounterOnLoad();//全てのpieceに対して実行する
//   $('label').on("click",function(e){
//     // console.log('e.target', e.target);
//     if($(e.target).is('input')){displayCounter($(e.currentTarget))}
//     });
//   }

// //TODO セレクタをきれいにする
// //TODO displayCounterとdisplayCounterOnloadの共通部分をまとめる
// //TODO 定数をconfigに移す

// function displayCounter($ct){
//   const limit = $('.piece').eq(0).children('.part').length;
//   const $target = $ct.parent().parent().find(':checked');
//   const $counter = $ct.parent().parent().find('.counter');
//   console.log($ct);
//   let sum = 0;
//     // $ct.children('input').checked = true;
//     for( let i = 0; i < $target.length; i++){
//       const num = $target[i].value;
//       sum = sum + Number(num);
//       console.log($target, $target[i].value, i, sum);
//     };
//     if(sum>limit){
//       $counter[0].innerHTML= '<font color="red">' + `プレイヤー${sum}人/メンバー${limit}人中　曲のプレイヤー数の合計がメンバー数が超えています` +'</font>';
//       $('[id^=bt-submit]').prop("disabled", true);
//     }else{
//       $counter[0].innerHTML= `プレイヤー${sum}人/メンバー${limit}人中`;
//       $('[id^=bt-submit]').prop("disabled", false);
//     }
// }

// function displayCounterOnLoad(){
//   const limit = $('.piece').eq(0).children('.part').length;
//   for (let i = 0; i < $('.piece').length; i ++ ){
//     let sum = 0;
//     for (let j = 0; j < $('.piece').eq(i).find('.part').length; j ++ ){
//       const num = $('.piece').eq(i).find('.part').find(':checked')[j].value
//       sum = sum + Number(num);
//       // console.log('i',i,'j',j);
//     }
//     $('.piece').eq(i).find('.counter')[0].innerHTML=`プレイヤー${sum}人/メンバー${limit}人中`;
//   }
// }