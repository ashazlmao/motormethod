/* =========================================================
   ANIMATIONS: scroll reveals and full-page falling particles
   ========================================================= */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll("[data-reveal]");

  // Scroll reveal: elements become visible once they enter the viewport.
  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Fixed canvas means the particle layer spans the entire viewport while
  // remaining continuous as the document scrolls.
  const canvas = document.getElementById("particle-canvas");
  if (!canvas || reduceMotion) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame = 0;
  let lastFrame = 0;
  const frameInterval = 1000 / 30;
  const particleCount = Math.min(100, Math.max(36, Math.floor(window.innerWidth / 15)));
  const green = { r: 8, g: 203, b: 0 };

  const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.45,
      speed: Math.random() * 0.5 + 0.2,
      alpha: Math.random() * 0.27 + 0.08,
      drift: (Math.random() - 0.5) * 0.18
    }));
  };

  const draw = (timestamp) => {
    animationFrame = window.requestAnimationFrame(draw);
    if (timestamp - lastFrame < frameInterval) return;
    lastFrame = timestamp;

    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.y += particle.speed;
      particle.x += particle.drift;

      if (particle.y > height + 4) {
        particle.y = -4;
        particle.x = Math.random() * width;
      }
      if (particle.x < -4) particle.x = width + 4;
      if (particle.x > width + 4) particle.x = -4;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(${green.r}, ${green.g}, ${green.b}, ${particle.alpha})`;
      context.fill();
    });
  };

  const stopAnimation = () => {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };
  const startAnimation = () => {
    if (!animationFrame && !document.hidden) animationFrame = window.requestAnimationFrame(draw);
  };

  resizeCanvas();
  startAnimation();

  window.addEventListener("resize", resizeCanvas, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAnimation();
    else startAnimation();
  });
})();
