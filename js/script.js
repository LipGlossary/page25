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
  $('#image').removeClass('shutter');
  window.setTimeout(function (done) {
    $('figcaption').removeClass('shutter');
    done();
  }, 1000, function () {
    enableClick = true;
  });

  $('#scene').on('click', handleClick);
});

function handleClick() {
  if(enableClick && data.hasOwnProperty(index+1))
    loadNext(++index);
}

function loadNext (index) {
  enableClick = false;
  $('figcaption').addClass('shutter');           // captions out first
  window.setTimeout(function () {                // after 1s
    $('img').addClass('shutter');                // shutter image
    window.setTimeout(function () {              // after 2s
      nextImage(index);                          // swap image
      nextLabels(index);                         // swap captions
      $('img').removeClass('shutter');           // unshutter image
      window.setTimeout(function (done) {        // after 1s
        $('figcaption').removeClass('shutter');  // unshutter captions
        done();
      }, 1000, function () {                     // delay for caption in & when done
        enableClick = true;                      // enable click
      });
    }, 2000);                                    // delay for image in
  }, 1000);                                      // delay for image out
  
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