var index = '';
var data  = {};

var enableClick = false;
var shutterDone = false;
var loadDone    = false;

window.onpopstate = function (event) {
  if ( event.state ) { index = event.state.index; }
  else {
    index = '100';
    window.history.pushState(null, 'page25', '/100');
  }
  getNext(index, data);
};

$(document).ready(function () {

  index = window.location.pathname.substring(1);
  tweakLabels($('figcaption').find('p'));
  window.requestAnimationFrame(loading);

  $('#image').on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',
                 '.shutter',
                 function () {
    if (loadDone) { swap(index); }
    else { shutterDone = true; }
  });

  $('.new-photo').on('load', function () {
    if (shutterDone) { swap(index); }
    else { loadDone = true; }
  });

  $('body').on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',
               '.unshutter',
               function () {
    enableClick = true;
    $('body').removeClass('disable');
  });
});

function loading(timeStamp) {
  if(timeStamp < 5000) window.requestAnimationFrame(loading);
  else {
    $('body').removeClass('loading');
    enableClick = true;
    $('body').on('click', handleClick);
  }
}

// TODO: Change this functionality to delegated events rather than tracking
// state here
function handleClick() {
  if(enableClick) {
    getNext(++index, data);
  }
}

function getNext (index, globalData) {
  $.ajax(
    { method: 'GET'
    , url: index
    , dataType: 'json'
    , statusCode:
        { 200: success
        , 304: success
        , 204: function (data, textStatus, jqXHR ) {
            enableClick = false;
            // do nothin'
          }
        }
    }
  );
  function success (data, textStatus, jqXHR ) {
     globalData[index] = data;
     window.history.pushState({index: index}, 'page25', '/' + index);
     start = performance.now();
     window.requestAnimationFrame(shutter);
   };
}

function shutter (timeStamp) {
  enableClick = false;
  $('body').addClass('disable');
  var img = $('<img src="' + data[index].image + '" class="new-photo" />');
  $('#image').append(img);
  $('figcaption, #image').addClass('shutter');
}

function swap (timeStamp) {
  loadDone = false;
  shutterDone = false;
  $('.old-photo').remove();
  $('.new-photo').addClass('old-photo').removeClass('new-photo');
  nextLabels(index);
  $('#image, figcaption').addClass('unshutter').removeClass('shutter');
}

function nextLabels (index) {
  var copy = data[index].text;
  $('figcaption').empty();
  for (var i = 0; i < copy.length; i++) {
    $('figcaption').append('<p><span>' + copy[i] + '</span></p>');
  }
  tweakLabels($('figcaption').find('p'));
}

function tweakLabels (labels) {
  labels.each(function (i) {
    var translate = getRandTranslate();
    var rotate = getRandRotate();
    $(this).css({
      'transform': 'translate(' + translate + ') rotate(' + rotate + ')'
    });
  });
}

function getRandTranslate () {
  return Math.random() * 50 - 25 + '%';
}
function getRandRotate () {
  return Math.random() * 5 - 2.5 + 'deg';
}
