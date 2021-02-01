/* eslint-disable linebreak-style */
'use strict';

function displayCounterOnLoad() {
  const limit = $('.piece').eq(0).children('.part').length;
  for (let i = 0; i < $('.piece').length; i += 1) {
    let sum = 0;
    for (let j = 0; j < $('.piece').eq(i).find('.part').length; j += 1) {
      const num = $('.piece').eq(i).find('.part').find(':checked')[j].value;
      sum += Number(num);
      // console.log('i',i,'j',j);
    }
    $('.piece').eq(i).find('.counter')[0].innerHTML = `プレイヤー${sum}人/メンバー${limit}人中`;
  }
}

function displayCounter($ct) {
  const limit = $('.piece').eq(0).children('.part').length;
  const $target = $ct.parent().parent().find(':checked');
  const $counter = $ct.parent().parent().find('.counter');
  let sum = 0;
  // $ct.children('input').checked = true;
  for (let i = 0; i < $target.length; i += 1) {
    const num = $target[i].value;
    sum += Number(num);
  }
  if (sum > limit) {
    $counter[0].innerHTML = `<font color="red">${`プレイヤー${sum}人/メンバー${limit}人中 プレイヤー数の合計がメンバー数が超えています`}</font>`;
    $('[id^=bt-submit]').prop('disabled', true);
  } else {
    $counter[0].innerHTML = `プレイヤー${sum}人/メンバー${limit}人中`;
    $('[id^=bt-submit]').prop('disabled', false);
  }
}

function handleOnload() {
  displayCounterOnLoad();
  $('label').on('click', (e) => {
    if ($(e.target).is('input')) { displayCounter($(e.currentTarget)); }
  });
}

window.onload = handleOnload();
