'use strict';
const $ = require('jquery');
const global = Function('return this;')();
global.jQuery = $;

window.onload = handleOnload();

function handleOnload(){
  displayCounterOnLoad();//全てのpieceに対して実行する
  $('input').on("click",displayCounter);
};

//TODO セレクタをきれいにする
//TODO displayCounterとdisplayCounterOnloadの共通部分をまとめる
//TODO 定数をconfigに移す

function displayCounter(){
  const limit = $('.piece').eq(0).children('.part').length;
  const $target = $(this).parent().parent().parent().find(':checked');
  const $counter = $(this).parent().parent().parent().find('.counter');
  let sum = 0;
    for( let i = 0; i < $target.length; i++){
      const num = $target[i].value;
      sum = sum + Number(num);
    };
    if(sum>limit){
      $counter[0].innerHTML= '<font color="red">' + `プレイヤー${sum}人/メンバー${limit}人中　曲のプレイヤー数の合計がメンバー数が超えています` +'</font>';
      $('#bt-submit').prop("disabled", true);
    }else{
      $counter[0].innerHTML= `プレイヤー${sum}人/メンバー${limit}人中`;
      $('#bt-submit').prop("disabled", false);
    }
}

function displayCounterOnLoad(){
  const limit = $('.piece').eq(0).children('.part').length;
  for (let i = 0; i < $('.piece').length; i ++ ){
    let sum = 0;
    for (let j = 0; j < $('.piece').eq(i).find('.part').length; j ++ ){
      const num = $('.piece').eq(i).find('.part').find(':checked')[j].value
      sum = sum + Number(num);
      // console.log('i',i,'j',j);
    }
    $('.piece').eq(i).find('.counter')[0].innerHTML=`プレイヤー${sum}人/メンバー${limit}人中`;
  }
}