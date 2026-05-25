document.addEventListener("DOMContentLoaded", function () {

  /* ── 1. Scroll blur on nav ────────────────────────────────── */
  var header = document.querySelector(".site-header");
  if (header) {
    function onScroll() {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── 2. Active link ───────────────────────────────────────── */
  var pathname = window.location.pathname.replace(/\/$/, "") || "/index.html";
  document.querySelectorAll(".nav__link").forEach(function (link) {
    var href = (link.getAttribute("href") || "").replace(/\/$/, "");
    if (href === pathname || (pathname === "/" && href === "/index.html")) {
      link.classList.add("nav__link--active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ── 3. Hamburger toggle ──────────────────────────────────── */
  var burger     = document.querySelector(".nav__burger");
  var mobileMenu = document.getElementById("mobile-menu");

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var isOpen = !mobileMenu.hidden;
      mobileMenu.hidden = isOpen;
      burger.setAttribute("aria-expanded", String(!isOpen));
      burger.classList.toggle("nav__burger--open", !isOpen);
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".site-header") && !mobileMenu.hidden) {
        mobileMenu.hidden = true;
        burger.setAttribute("aria-expanded", "false");
        burger.classList.remove("nav__burger--open");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !mobileMenu.hidden) {
        mobileMenu.hidden = true;
        burger.setAttribute("aria-expanded", "false");
        burger.classList.remove("nav__burger--open");
        burger.focus();
      }
    });
  }

  /* ── 4. Smooth scroll for same-page anchors ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ── 5. Intersection Observer — staggered reveals ─────────── */
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

});
