var index = '';
var data  = {};

var enableClick = false;
var loadDone, shutterDone;

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

  $(document).on(
    'animationend webkitAnimationEnd oAnimationEnd',
    '.loading figcaption',
    function () {
      $('body').removeClass('loading');
      enableClick = true;
    }
  );

  // TODO: Change this functionality to delegated events rather than tracking
  // state here
  $('body').on('click', function () {
    if (enableClick) {
      getNext(++index, data);
    }
  });

  $('body').on(
    'animationend webkitAnimationEnd oAnimationEnd',
    '.shutter #image',
    function () {
      if (loadDone) { swap(index); }
      else { shutterDone = true; }
    }
  );

});

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
    shutter();
  };
}

function shutter () {
  enableClick = false;
  $('body').addClass('disable');

  $('#image').imagesLoaded()
  .done(function () {
    if (shutterDone) { swap(index); }
    else { loadDone = true; }
  });

  var img = $('<img class="new-photo" src="' + data[index].image + '" />');
  $('.old-photo').after(img);
  $('figure').addClass('shutter');
}

function swap () {
  loadDone = false;
  shutterDone = false;
  $('.old-photo').remove();
  $('.new-photo').removeClass('new-photo').addClass('old-photo');
  nextLabels(index);
  $('figure').removeClass('shutter');
  $('body').removeClass('disable');
  enableClick = true;
}

function nextLabels (index) {
  var copy = data[index].text;
  $('figcaption').empty();
  for (var i = 0; i < copy.length; i++) {
    $('figcaption').append(`<p><span>${copy[i]}</span></p>`);
  }
  tweakLabels($('figcaption').find('p'));
}

function tweakLabels (labels) {
  labels.each(function (i) {
    var translate = getRandTranslate();
    var rotate = getRandRotate();
    $(this).css({
      'transform': `translate(${translate}) rotate(${rotate})`
    });
  });
}

function getRandTranslate () {
  return `${Math.random() * 50 - 25}%`;
}
function getRandRotate () {
  return `${Math.random() * 5 - 2.5}deg`;
}
