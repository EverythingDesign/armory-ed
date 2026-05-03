function initSwiper(
  swiperClassName,
  spaceBetween,
  slidesPerView = 1,
  navigationNext = null,
  navigationPrev = null,
  paginationEl = null,
  scrollbarEl = null,
  breakpoints = {},
  extraOptions = {}
) {
  const swiper = new Swiper(swiperClassName, {
    grabCursor: true,
    spaceBetween: spaceBetween,
    keyboard: true,
    speed: 800,
    slidesPerView: slidesPerView,
    a11y: {
      enabled: true,
      slideRole: "listitem",
    },

    mousewheel: {
      forceToAxis: true,
      sensitivity: 0.25,
    },

    // Navigation â€” only added when both selectors are provided
    ...(navigationNext && navigationPrev
      ? {
          navigation: {
            nextEl: navigationNext,
            prevEl: navigationPrev,
          },
        }
      : {}),

    // Pagination â€” only added when selector is provided
    ...(paginationEl
      ? {
          pagination: {
            el: paginationEl,
            clickable: true,
            dynamicBullets: true,
          },
          //   pagination: {
          //     //...
          //     renderBullet: function (index, className) {
          //       return '<span class="' + className + '">' + (index + 1) + '</span>';
          //     },
          //   },
        }
      : {}),

    // Scrollbar â€” only added when selector is provided
    ...(scrollbarEl
      ? {
          scrollbar: {
            el: scrollbarEl,
            draggable: true,
            hide: false,
          },
        }
      : {}),

    breakpoints,

    // Merge any extra Swiper options last so they can override anything above
    ...extraOptions,
  });

  return swiper;
}

function enableHoverScroll(swiper, options = {}) {
  const { zoneSize = 120, interval = 800, acceleration = true } = options;

  const el = swiper.el; // the .swiper root element
  let timer = null;
  let cursorOverlay = null;

  // â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function stop() {
    clearInterval(timer);
    timer = null;
    removeOverlay();
  }

  function start(direction, depth) {
    if (timer) return;

    // depth 0â†’1 (0 = edge of zone, 1 = very edge of container)
    // shrink the interval so it speeds up as you push toward the edge
    const speed = acceleration
      ? Math.max(100, interval * (1 - depth * 0.75))
      : interval;

    timer = setInterval(() => {
      direction === "next" ? swiper.slideNext() : swiper.slidePrev();
    }, speed);
  }

  // â”€â”€ visual cursor overlay â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function showOverlay(side) {
    if (cursorOverlay) return;
    cursorOverlay = document.createElement("div");
    Object.assign(cursorOverlay.style, {
      position: "absolute",
      top: "0",
      [side]: "0",
      width: `${zoneSize}px`,
      height: "100%",
      zIndex: "20",
      pointerEvents: "none",
      borderRadius: side === "left" ? "10px 0 0 10px" : "0 10px 10px 0",
      background:
        side === "right"
          ? "linear-gradient(to left,  rgba(232,255,71,0.08), transparent)"
          : "linear-gradient(to right, rgba(232,255,71,0.08), transparent)",
      transition: "opacity 0.2s",
    });
    el.style.position = "relative"; // ensure overlay positions correctly
    el.appendChild(cursorOverlay);
  }

  function removeOverlay() {
    if (cursorOverlay) {
      cursorOverlay.remove();
      cursorOverlay = null;
    }
  }

  // â”€â”€ cursor arrow indicator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let cursorEl = null;

  function showCursor(side) {
    if (cursorEl) return;
    cursorEl = document.createElement("div");
    cursorEl.innerHTML = side === "right" ? "â†’" : "â†";
    Object.assign(cursorEl.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: "9999",
      fontSize: "22px",
      fontFamily: "monospace",
      color: "#e8ff47",
      background: "rgba(0,0,0,0.55)",
      border: "1.5px solid #e8ff47",
      borderRadius: "50%",
      width: "44px",
      height: "44px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: "translate(-50%, -50%)",
      transition: "opacity 0.15s",
      opacity: "0",
    });
    document.body.appendChild(cursorEl);
    requestAnimationFrame(() => {
      cursorEl.style.opacity = "1";
    });
  }

  function moveCursor(x, y) {
    if (!cursorEl) return;
    cursorEl.style.left = `${x}px`;
    cursorEl.style.top = `${y}px`;
  }

  function hideCursor() {
    if (!cursorEl) return;
    cursorEl.style.opacity = "0";
    setTimeout(() => {
      cursorEl?.remove();
      cursorEl = null;
    }, 150);
  }

  // â”€â”€ main mouse handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function onMouseMove(e) {
    const rect = el.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const width = rect.width;

    const inRight = localX > width - zoneSize;
    const inLeft = localX < zoneSize;

    if (inRight) {
      const depth = (localX - (width - zoneSize)) / zoneSize; // 0â†’1
      showOverlay("right");
      showCursor("right");
      moveCursor(e.clientX, e.clientY);
      stop();
      start("next", depth);
      el.style.cursor = "none";
    } else if (inLeft) {
      const depth = 1 - localX / zoneSize; // 0â†’1
      showOverlay("left");
      showCursor("left");
      moveCursor(e.clientX, e.clientY);
      stop();
      start("prev", depth);
      el.style.cursor = "none";
    } else {
      stop();
      hideCursor();
      el.style.cursor = "grab";
    }
  }

  function onMouseLeave() {
    stop();
    hideCursor();
    el.style.cursor = "grab";
  }

  // â”€â”€ attach â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  el.addEventListener("mousemove", onMouseMove);
  el.addEventListener("mouseleave", onMouseLeave);

  // â”€â”€ teardown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return function destroy() {
    el.removeEventListener("mousemove", onMouseMove);
    el.removeEventListener("mouseleave", onMouseLeave);
    stop();
    hideCursor();
  };
}