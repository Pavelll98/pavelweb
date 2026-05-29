document.addEventListener("DOMContentLoaded", function () {
  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  var pauseIcon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
  var playIcon  = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>';

  document.querySelectorAll('.por-card').forEach(function (card) {
    var frame  = card.querySelector('.por-frame');
    var scroll = card.querySelector('.por-scroll');
    var flashEndHandler = null;

    var icon = document.createElement('div');
    icon.className = 'por-play-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = pauseIcon;
    frame.appendChild(icon);

    function startFlash() {
      stopFlash();
      card.classList.add('is-icon-flashing');
      flashEndHandler = function () {
        card.classList.remove('is-icon-flashing');
        flashEndHandler = null;
      };
      icon.addEventListener('animationend', flashEndHandler, { once: true });
    }

    function stopFlash() {
      if (flashEndHandler) {
        icon.removeEventListener('animationend', flashEndHandler);
        flashEndHandler = null;
      }
      card.classList.remove('is-icon-flashing');
    }

    if (!isTouch) {
      card.addEventListener('mouseenter', function () {
        if (!scroll.classList.contains('is-paused')) {
          scroll.classList.add('is-scrolling');
          startFlash();
        }
      });
      card.addEventListener('mouseleave', function () {
        if (!scroll.classList.contains('is-paused')) {
          scroll.classList.remove('is-scrolling');
          stopFlash();
        }
      });
    }

    frame.addEventListener('click', function () {
      if (scroll.classList.contains('is-paused')) {
        scroll.classList.remove('is-paused');
        card.classList.remove('is-anim-paused');
        icon.innerHTML = pauseIcon;
        if (!isTouch && card.matches(':hover')) {
          scroll.classList.add('is-scrolling');
          startFlash();
        }
      } else if (scroll.classList.contains('is-scrolling')) {
        scroll.classList.add('is-paused');
        card.classList.add('is-anim-paused');
        stopFlash();
        icon.innerHTML = playIcon;
      } else if (isTouch) {
        scroll.classList.add('is-scrolling');
        icon.innerHTML = pauseIcon;
        startFlash();
      }
    });

    scroll.addEventListener('animationend', function () {
      scroll.classList.remove('is-scrolling', 'is-paused');
      card.classList.remove('is-anim-paused');
      stopFlash();
      icon.innerHTML = pauseIcon;
    });
  });
});
