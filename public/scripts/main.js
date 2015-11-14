var enableClick = false;
var index = '';
var data = {};

window.onpopstate = function (event) {
  if ( event.state ) { index = event.state.index; }
  else {
    index = '100';
    window.history.pushState(null, 'page25', '/100');
  }
  getNext(index, data);
};

var start;
var fi = 0;  // frames index
var frames =
  [ { wait: 0
    , func: function () {
        enableClick = false;
        $('body').addClass('disable');
      }
    }
  , { wait: 0
    , func: function () { $('figcaption').addClass('shutter'); }
    }
  , { wait: 500
    , func: function () { $('#image').addClass('shutter'); }
    }
  , { wait: 1500
    , func: function () {
        nextImage(index);
        nextLabels(index);
      }
    }
  , { wait: 500,
      func: function () { $('#image').removeClass('shutter'); }
    }
  , { wait: 500,
      func: function () { $('figcaption').removeClass('shutter'); }
    }
  , { wait: 1500,
      func: function () {
        enableClick = true;
        $('body').removeClass('disable');
      }
    }
  ];

$(document).ready(function () {
  index = window.location.pathname.substring(1);
  tweakLabels($('figcaption').find('p'));
  window.requestAnimationFrame(loading);
});

function loading(timeStamp) {
  if(timeStamp < 5000) window.requestAnimationFrame(loading);
  else {
    $('body').removeClass('loading');
    enableClick = true;
    $('body').on('click', handleClick);
  }
}

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
     window.requestAnimationFrame(playFrameQueue);
   };
}

function playFrameQueue (timeStamp) {
  var frame = frames[fi];
  var wait = frame.wait;
  if (timeStamp - start <= wait) window.requestAnimationFrame(playFrameQueue);
  else {
    frame.func();
    if (frames[++fi]) {
      start = timeStamp;
      window.requestAnimationFrame(playFrameQueue);
    }
    else { fi = 0; }
  }
}

function nextImage (index) {
  $('#image').css({
    'background-image': 'url(' + data[index].image + ')'
  });
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
