document.querySelectorAll('main > section, main > div, main > header').forEach(el => {
  el.classList.add('anim-hidden');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.replace('anim-hidden', 'anim-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.anim-hidden').forEach(el => observer.observe(el));
