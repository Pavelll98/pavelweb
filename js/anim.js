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

// Showcase scroll animation — start only once the footer button enters the viewport
var showcaseFooter = document.querySelector('.showcase-footer');
var showcaseSection = document.querySelector('.showcase-section');
if (showcaseFooter && showcaseSection) {
  var showcaseAnim = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      showcaseSection.classList.add('showcase-anim-go');
      showcaseAnim.disconnect();
    }
  }, { threshold: 0 });
  showcaseAnim.observe(showcaseFooter);
}
