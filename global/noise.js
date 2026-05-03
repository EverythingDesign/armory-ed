/*** ANIMATED NOISE â€” Shift5-style 2D canvas, pattern-tiled, gated per renderer ***/
(function () {
  // ---------- Tunables ----------
  const OPACITY = 0.1;
  const FPS = 24;
  const DENSITY = 0.75;
  const GRAIN_PX = 1;
  const TILE_DOTS = 160;
  const COMPOSITE = "source-over";
  const PACKED_COLOR = 4092788479 >>> 0;
  const NAV_OPEN_SELECTOR = "[nav-menu].is-expanded";

  // ---------- Pixel ratio + working tile size ----------
  const dpr = window.devicePixelRatio || 1;
  const UPSCALE = Math.max(1, Math.round(GRAIN_PX * dpr));
  const TILE_SIZE = TILE_DOTS * UPSCALE;

  // ---------- Shared source + working tile ----------
  const sourceTile = document.createElement("canvas");
  sourceTile.width = TILE_DOTS;
  sourceTile.height = TILE_DOTS;
  const sourceCtx = sourceTile.getContext("2d", { alpha: true });

  const tile = document.createElement("canvas");
  tile.width = TILE_SIZE;
  tile.height = TILE_SIZE;
  const tileCtx = tile.getContext("2d", { alpha: true });

  function regenerateTile() {
    const img = sourceCtx.createImageData(TILE_DOTS, TILE_DOTS);
    const buf = new Uint32Array(img.data.buffer);
    for (let i = 0; i < buf.length; i++) {
      if (Math.random() < DENSITY) buf[i] = PACKED_COLOR;
    }
    sourceCtx.putImageData(img, 0, 0);
    tileCtx.imageSmoothingEnabled = false;
    tileCtx.clearRect(0, 0, TILE_SIZE, TILE_SIZE);
    tileCtx.drawImage(sourceTile, 0, 0, TILE_SIZE, TILE_SIZE);
  }

  // ---------- Per-container renderer ----------
  function createRenderer(container) {
    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;";
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      console.warn("2D canvas not supported â€” noise skipped for", container);
      return null;
    }

    function resize() {
      const W = container.clientWidth || window.innerWidth;
      const H = container.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
    }
    window.addEventListener("resize", resize);
    resize();

    return {
      container,
      isNav: container.classList.contains("is-nav"),
      blit() {
        ctx.save();
        ctx.globalCompositeOperation = COMPOSITE;
        ctx.globalAlpha = OPACITY;
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = ctx.createPattern(tile, "repeat");
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      },
    };
  }

  const containers = document.querySelectorAll(".noise-bg, .noise");
  if (!containers.length) return;

  const renderers = Array.from(containers).map(createRenderer).filter(Boolean);
  if (!renderers.length) return;

  // ---------- Gating state ----------
  // Each renderer is "should run" if its gates pass.
  // Gates: navOpen (global), inView (per non-nav renderer), document visibility.
  let navOpen = false;
  const inView = new WeakMap(); // renderer -> bool (only relevant for non-nav)

  function shouldBeActive(r) {
    if (document.hidden) return false;
    if (r.isNav) return navOpen;
    return !navOpen && !!inView.get(r);
  }

  function applyState(r) {
    if (shouldBeActive(r)) activate(r);
    else deactivate(r);
  }

  function applyAll() {
    renderers.forEach(applyState);
  }

  // ---------- Shared rAF loop, FPS-gated, self-terminating ----------
  const msPerFrame = 1000 / FPS;
  const active = new Set();
  let rafId = null;
  let lastDraw = 0;

  function loop(ts) {
    if (ts - lastDraw >= msPerFrame) {
      lastDraw = ts;
      regenerateTile();
      active.forEach((r) => r.blit());
    }
    rafId = active.size > 0 ? requestAnimationFrame(loop) : null;
  }

  function activate(r) {
    if (active.has(r)) return;
    active.add(r);
    if (rafId == null) {
      lastDraw = 0;
      rafId = requestAnimationFrame(loop);
    }
  }

  function deactivate(r) {
    active.delete(r);
  }

  // ---------- Wire up gates ----------
  const navRenderers = renderers.filter((r) => r.isNav);

  // Nav: mutation-observe to detect open/close, then re-evaluate everyone.
  if (navRenderers.length) {
    const checkOpen = () => !!document.querySelector(NAV_OPEN_SELECTOR);
    const syncNav = () => {
      const next = checkOpen();
      if (next === navOpen) return;
      navOpen = next;
      applyAll();
    };
    navOpen = checkOpen(); // initial

    const observeTargets = [
      document.body,
      document.querySelector(".nav_component"),
    ].filter(Boolean);
    const mo = new MutationObserver(syncNav);
    observeTargets.forEach((t) =>
      mo.observe(t, { attributes: true, attributeFilter: ["class"] })
    );
  }

  // Non-nav: IntersectionObserver tracks viewport presence.
  renderers.forEach((r) => {
    if (r.isNav) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.set(r, entry.isIntersecting);
        applyState(r);
      },
      { rootMargin: "100px 0px" }
    );
    io.observe(r.container);
  });

  // Initial pass (nav state may already be open, or sections may already be in-view).
  applyAll();

  // ---------- Manual nav hooks ----------
  window.navNoise = {
    start() {
      if (navOpen) return;
      navOpen = true;
      applyAll();
    },
    stop() {
      if (!navOpen) return;
      navOpen = false;
      applyAll();
    },
  };

  // ---------- Pause when tab is hidden ----------
  document.addEventListener("visibilitychange", applyAll);
})();