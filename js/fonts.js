(function () {
  document.querySelectorAll('link[rel="preload"][as="style"]').forEach(function (el) {
    el.rel = 'stylesheet';
  });
})();
