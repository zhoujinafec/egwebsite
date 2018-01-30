/*eslint-disable*/
(function ($) {
  $.fn.wavify = function (options) {
    var settings = $.extend({
      container: options.container ? options.container : 'body',
      height: 200,
      amplitude: 100,
      speed: .15,
      bones: 3,
      color: 'rgba(255,255,255, 0.20)'
    }, options);

    var wave = this,
      width = $(settings.container).width(),
      height = $(settings.container).height(),
      points = [],
      lastUpdate,
      totalTime = 0;

    TweenLite.set(wave, {attr: {fill: settings.color}});

    function drawPoints(factor) {
      var points = [];

      for (var i = 0; i <= settings.bones; i++) {
        var x = i / settings.bones * width;
        var sinSeed = (factor + (i + i % settings.bones)) * settings.speed * 100;
        var sinHeight = Math.sin(sinSeed / 100) * settings.amplitude;
        var yPos = Math.sin(sinSeed / 100) * sinHeight + settings.height;
        points.push({x: x, y: yPos});
      }

      return points;
    }

    function drawPath(points) {
      var SVGString = 'M ' + points[0].x + ' ' + points[0].y;

      var cp0 = {
        x: (points[1].x - points[0].x) / 2,
        y: (points[1].y - points[0].y) + points[0].y + (points[1].y - points[0].y)
      };

      SVGString += ' C ' + cp0.x + ' ' + cp0.y + ' ' + cp0.x + ' ' + cp0.y + ' ' + points[1].x + ' ' + points[1].y;

      var prevCp = cp0;
      var inverted = -1;

      for (var i = 1; i < points.length - 1; i++) {
        var cpLength = Math.sqrt(prevCp.x * prevCp.x + prevCp.y * prevCp.y);
        var cp1 = {
          x: (points[i].x - prevCp.x) + points[i].x,
          y: (points[i].y - prevCp.y) + points[i].y
        };

        SVGString += ' C ' + cp1.x + ' ' + cp1.y + ' ' + cp1.x + ' ' + cp1.y + ' ' + points[i + 1].x + ' ' + points[i + 1].y;
        prevCp = cp1;
        inverted = -inverted;
      }

      SVGString += ' L ' + width + ' ' + height;
      SVGString += ' L 0 ' + height + ' Z';
      return SVGString;
    }

    function draw() {
      var now = window.Date.now();

      if (lastUpdate) {
        var elapsed = (now - lastUpdate) / 1000;
        lastUpdate = now;

        totalTime += elapsed;

        var factor = totalTime * Math.PI;
        TweenMax.to(wave, settings.speed, {
          attr: {
            d: drawPath(drawPoints(factor))
          },
          ease: Power1.easeInOut
        });

      } else {
        lastUpdate = now;
      }

      requestAnimationFrame(draw);
    }

    function debounce(func, wait, immediate) {
      var timeout;
      return function () {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
      };
    }

    var redraw = debounce(function () {
      wave.attr('d', '');
      points = [];
      totalTime = 0;
      width = $(settings.container).width();
      height = $(settings.container).height();
      lastUpdate = false;
      setTimeout(function () {
        draw();
      }, 50);
    }, 250);
    $(window).on('resize', redraw);

    return draw();
  };
}(jQuery));

(function () {
  // wave-animation
  var h1, h2, b1, b2, a1, a2; // eslint-disable-line
  if (window.matchMedia('(min-width: 575px)').matches) {
    h1 = 90; h2 = 80; b1 = 8; b2 = 6; a1 = 75; a2 = 60;
  } else {
    h1 = 50; h2 = 40; b1 = 4; b2 = 3; a1 = 48; a2 = 36;
  }
  if (window.matchMedia('(min-width: 1200px)').matches) {
    b1 = 9; b2 = 7;
  } else if (window.matchMedia('(min-width: 992px)').matches) {
    b1 = 8; b2 = 6;
  }
  $('#gl-brand-wave').wavify({
    height: h1,
    bones: b1,
    amplitude: a1,
    color: 'rgba(189,223,242,0.6)',
    speed: 0.05
  });
  $('#gl-brand-wave-two').wavify({
    height: h2,
    bones: b2,
    amplitude: a2,
    color: 'rgba(151,202,235,.4)',
    speed: 0.07
  });
}());
