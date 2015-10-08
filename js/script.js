var enableClick = false;
var index = 10;

var data = {
  '10': [
    'Testing'
  , 'testing...'
  , 'Hm.'
  , 'This is a longer thing. I want to see what it does when it tries to wrap.'
  ]
, '11': [
    'This is the second one'
  , 'Double test'
  ]
, '12': [
    'This is the third'
  ]
};

$(document).ready(function () {

  nextImage(index);
  nextLabels(index);
  window.setTimeout(function () {
    $('figure').children().removeClass('loading');
    enableClick = true;
  }, 3000);

  $('#scene').on('click', handleClick);
});

function handleClick() {
  if(enableClick && data.hasOwnProperty(index+1))
    loadNext(++index);
}

function loadNext (index) {
  enableClick = false;
  $('figcaption').addClass('shutter');             // captions out first
  window.setTimeout(function () {                  // after 2s
    $('img').addClass('shutter');                  // shutter image
    window.setTimeout(function () {                // after 2.5s (2 + buffer)
      nextImage(index);                            // swap image
      nextLabels(index);                           // swap captions
      window.setTimeout(function () {              // after 500ms
        $('img').removeClass('shutter');           // unshutter image
        window.setTimeout(function () {            // after 2s
          $('figcaption').removeClass('shutter');  // unshutter captions
          window.setTimeout(function () {          // after 2s
            enableClick = true;                    // enable click
          }, 2000);  // wait for caption in
        }, 2000);    // lag after image in
      }, 500);       // wait for swap
    }, 2500);        // wait for image out
  }, 2000);          // lag after caption out
  
}

function nextImage (index) {
  $('#image').css({
    'background-image': 'url(./img/' + index + '.png)'
  });
}

function nextLabels (index) {
  var copy = data[index];
  $('figcaption').empty();  
  for (var i = 0; i < copy.length; i++)
    $('figcaption').append('<p><span>' + copy[i] + '</span></p>');
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