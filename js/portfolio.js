document.addEventListener("DOMContentLoaded", function () {
  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  var pauseIcon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
  var playIcon  = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>';

  document.querySelectorAll('.por-card').forEach(function (card) {
    var frame  = card.querySelector('.por-frame');
    var scroll = card.querySelector('.por-scroll');

    var icon = document.createElement('div');
    icon.className = 'por-play-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = pauseIcon;
    frame.appendChild(icon);

    if (!isTouch) {
      card.addEventListener('mouseenter', function () {
        if (!scroll.classList.contains('is-paused')) scroll.classList.add('is-scrolling');
      });
      card.addEventListener('mouseleave', function () {
        if (!scroll.classList.contains('is-paused')) scroll.classList.remove('is-scrolling');
      });
    }

    frame.addEventListener('click', function () {
      if (scroll.classList.contains('is-paused')) {
        scroll.classList.remove('is-paused');
        card.classList.remove('is-anim-paused');
        icon.innerHTML = pauseIcon;
        if (!isTouch && card.matches(':hover')) scroll.classList.add('is-scrolling');
      } else if (scroll.classList.contains('is-scrolling')) {
        scroll.classList.add('is-paused');
        card.classList.add('is-anim-paused');
        icon.innerHTML = playIcon;
      } else if (isTouch) {
        scroll.classList.add('is-scrolling');
        icon.innerHTML = pauseIcon;
      }
    });

    scroll.addEventListener('animationend', function () {
      scroll.classList.remove('is-scrolling', 'is-paused');
      card.classList.remove('is-anim-paused');
      icon.innerHTML = pauseIcon;
    });
  });
});
