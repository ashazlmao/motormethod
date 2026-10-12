/* =========================================================
   MAIN: responsive navigation and small global interactions
   ========================================================= */
(() => {
  "use strict";

  const body = document.body;
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const year = document.querySelector("[data-current-year]");
  const header = document.querySelector("[data-header]");

  body.classList.add("js-ready");

  if (year) year.textContent = new Date().getFullYear();

  const setMenuState = (isOpen) => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(isOpen));
    menu.classList.toggle("is-open", isOpen);
    body.classList.toggle("nav-open", isOpen);
  };

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const currentlyOpen = toggle.getAttribute("aria-expanded") === "true";
      setMenuState(!currentlyOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuState(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        toggle.getAttribute("aria-expanded") === "true" &&
        !menu.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        setMenuState(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) setMenuState(false);
    }, { passive: true });
  }

  // Mark the section currently in view in the navigation.
  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
          if (isCurrent) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Header gets a subtle state after the first scroll.
  if (header) {
    const updateHeader = () => header.classList.toggle("has-scrolled", window.scrollY > 30);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }
})();
