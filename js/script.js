var index = 10;
var data = {
  '10': [
      'Testing',
      'testing...',
      'Hm.',
      'This is a longer thing. I want to see what it does when it tries to wrap.'
    ],
  '11': [
      'This is the second one',
      'Double test'
    ],
  '12': [
      'This is the third'
    ]
};

$(document).ready(function () {
  loadNext(index);
  $('#scene').on('click', function () {
    if(data[index+1]) loadNext(++index);
  });
});

function loadNext (index) {
  $('img').attr('src', './img/' + index + '.png');
  var copy = data[index];
  $('figcaption').children().fadeOut(1000);
  $('figcaption').empty();
  for (var i = 0; i < copy.length; i++) {
    $('figcaption').append('<p><span>' + copy[i] + '</span></p>');
  }
  tweakLabels($('figcaption').find('p'));
  $('figcaption').find('p').fadeIn(1000);
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