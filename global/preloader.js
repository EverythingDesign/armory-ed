(function () {
  const wrap = document.querySelector(".preloader");
  if (!wrap) return;

  // --- Public callback API ---
  // Register a function to run when the loader animation is done:
  //   window.onLoaderDone(fn)
  // If the loader is already done, fn is called immediately.
  let _done = false;
  const _callbacks = [];
  window.onLoaderDone = function (fn) {
    if (typeof fn !== "function") return;
    if (_done) {
      fn();
      return;
    }
    _callbacks.push(fn);
  };
  function _fireCallbacks() {
    _done = true;
    _callbacks.forEach(function (fn) {
      fn();
    });
    _callbacks.length = 0;
  }

  const scanner = wrap.querySelector(".scanner");
  const sweep = wrap.querySelector(".sweep");
  const scanRings = wrap.querySelectorAll(".scan-ring");
  const ticks = wrap.querySelectorAll(".tick");
  const blips = wrap.querySelectorAll(".blip");
  const shield = wrap.querySelector(".shield");
  const num = wrap.querySelector(".num");
  const barFill = wrap.querySelector(".bar-fill");
  const progress = wrap.querySelector(".progress");

  const tl = gsap.timeline({ paused: true, onComplete: () => wrap.remove() });

  // Phase 1: counter 0 â†’ 100, bar fills, radar/shield keep their CSS loops
  const counter = { v: 0 };
  tl.to(
    counter,
    {
      v: 100,
      duration: 1,
      ease: "power1.inOut",
      onUpdate: () => {
        if (num)
          num.textContent =
            String(Math.round(counter.v)).padStart(3, "0") + "%";
        if (barFill) barFill.style.width = counter.v + "%";
      },
    },
    0
  );

  // Brief hold at 100%
  tl.to({}, { duration: 0.2 });

  // Phase 2: extinguish radar embellishments
  const fx = [sweep, ...scanRings, ...blips, ...ticks].filter(Boolean);
  if (fx.length)
    tl.to(fx, { opacity: 0, duration: 0.5, ease: "power2.out" }, ">");

  // Progress bar drops out in parallel
  if (progress)
    tl.to(progress, { opacity: 0, duration: 0.4, ease: "power2.out" }, "<");

  // Shield gives a final pulse
  if (shield)
    tl.to(
      shield,
      {
        scale: 1.25,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        transformOrigin: "50% 50%",
      },
      "<0.1"
    );

  // Scanner ring collapses inward
  if (scanner)
    tl.to(
      scanner,
      {
        scale: 0.2,
        opacity: 0,
        duration: 0.8,
        ease: "power3.inOut",
        transformOrigin: "50% 50%",
      },
      "<"
    );

  // Preloader backdrop dissolves to reveal the page
  tl.to(wrap, { opacity: 0, duration: 0.6, ease: "power2.out" }, ">-0.4");

  // Fire callbacks 0.5s before the end so intro animations start early
  tl.call(_fireCallbacks, [], ">-0.5");

  tl.timeScale(1.8); // increase to go faster, decrease to go slower

  // Play as soon as the hero sequence signals ready (â‰ˆ first 30 frames loaded).
  // Fall back to a timeout so pages without a sequence still dismiss the loader.
  let _played = false;
  function _play() {
    if (_played) return;
    _played = true;
    tl.play();
  }

  window.addEventListener("seq:ready", _play, { once: true });

  // Fallback: if no seq:ready arrives within 2.5s, start anyway
  setTimeout(_play, 2500);
})();