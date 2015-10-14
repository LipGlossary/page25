var enableClick = false;
var index = 10;

var data =
  { '10': [ 'Testing'
          , 'testing...'
          , 'Hm.'
          , 'This is a longer thing. I want to see what it does when it tries to wrap.'
          ]
  , '11': [ 'This is the second one'
          , 'Double test'
          ]
  , '12': [ 'This is the third' ]
  };

var start;
var fi = 0;  // frames index
var frames = [
  { wait: 0,
    func: function () {
      enableClick = false;
      $('body').addClass('disable');
    }
  },
  { wait: 500,
    func: function () { $('figcaption').addClass('shutter'); }
  },
  { wait: 2000,
    func: function () { $('#image').addClass('shutter'); }
  },
  { wait: 2500,
    func: function () {
      nextImage(index);
      nextLabels(index);
    }
  },
  { wait: 500,
    func: function () { $('#image').removeClass('shutter'); }
  },
  { wait: 2000,
    func: function () { $('figcaption').removeClass('shutter'); }
  },
  { wait: 2000,
    func: function () {
      enableClick = true;
      $('body').removeClass('disable');
    }
  }
];

$(document).ready(function () {
  nextImage(index);
  nextLabels(index);
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
  if(enableClick && data.hasOwnProperty(index+1)) {
    index++;
    start = performance.now();
    window.requestAnimationFrame(playFrameQueue);
  }
}

function playFrameQueue (timeStamp) {
  var frame = frames[fi];
  var wait = frame.wait;
  if (timeStamp - start <= wait) window.requestAnimationFrame(playFrameQueue);
  else {
    frame.func();
    fi++;
    start = timeStamp;
    if (frames[fi]) window.requestAnimationFrame(playFrameQueue);
    else fi = 0;
  }
}

function nextImage (index) {
  $('#image').css({
    'background-image': 'url(/images/' + index + '.png)'
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
