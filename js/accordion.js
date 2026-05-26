document.addEventListener("DOMContentLoaded", function () {
  ['proc-accordion', 'faq-accordion'].forEach(function (id) {
    var steps = document.querySelectorAll('#' + id + ' .proc-step');
    steps.forEach(function (step) {
      var btn = step.querySelector('.proc-row');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var isOpen = step.classList.contains('is-open');
        steps.forEach(function (s) {
          s.classList.remove('is-open');
          var b = s.querySelector('.proc-row');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          step.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });
});
