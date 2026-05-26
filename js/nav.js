document.addEventListener("DOMContentLoaded", function () {

  /* ── 1. Scroll blur on nav ────────────────────────────────── */
  var header = document.querySelector(".site-header");
  if (header) {
    function onScroll() {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(onScroll);
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

  /* ── 3. Side-drawer toggle ───────────────────────────────── */
  var burger     = document.querySelector(".nav__burger");
  var mobileMenu = document.getElementById("mobile-menu");

  if (burger && mobileMenu) {
    // Switch from HTML hidden attribute to CSS-driven drawer
    mobileMenu.removeAttribute("hidden");

    var overlay = document.createElement("div");
    overlay.className = "nav__overlay";
    document.body.appendChild(overlay);

    function openMenu() {
      mobileMenu.classList.add("is-open");
      overlay.classList.add("is-visible");
      burger.setAttribute("aria-expanded", "true");
      burger.classList.add("nav__burger--open");
      document.body.style.overflow = "hidden";
    }
    function closeMenu() {
      mobileMenu.classList.remove("is-open");
      overlay.classList.remove("is-visible");
      burger.setAttribute("aria-expanded", "false");
      burger.classList.remove("nav__burger--open");
      document.body.style.overflow = "";
    }

    burger.addEventListener("click", function (e) {
      e.stopPropagation();
      mobileMenu.classList.contains("is-open") ? closeMenu() : openMenu();
    });
    overlay.addEventListener("click", closeMenu);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
        closeMenu();
        burger.focus();
      }
    });

    // Swipe down to dismiss
    var touchStartY = 0;
    var touchCurrentY = 0;
    mobileMenu.addEventListener("touchstart", function (e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    mobileMenu.addEventListener("touchmove", function (e) {
      touchCurrentY = e.touches[0].clientY;
      var delta = Math.max(0, touchCurrentY - touchStartY);
      mobileMenu.style.transition = "none";
      mobileMenu.style.transform = "translateY(" + delta + "px)";
    }, { passive: true });
    mobileMenu.addEventListener("touchend", function () {
      mobileMenu.style.transition = "";
      var delta = Math.max(0, touchCurrentY - touchStartY);
      if (delta > 90) {
        closeMenu();
      } else {
        mobileMenu.style.transform = "";
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
