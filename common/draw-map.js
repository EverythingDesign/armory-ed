/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€                                                       
     MAP SVG â€” Random Pixel Fade-In + Location Label                                                     
     Requires: GSAP + ScrollTrigger (loaded globally)                                                    
     â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

(function () {
  "use strict";

  /* â”€â”€ 1. Locate the map section and the SVG image container â”€â”€ */
  const mapSection = document.querySelector("#map");
  const mapOg = document.querySelector("[map-og]");
  const svgImg = mapOg ? mapOg.querySelector(".u-image") : null;

  if (!mapOg || !svgImg) return;

  /* â”€â”€ 2. Fetch the SVG and embed it inline â”€â”€ */
  const svgUrl =
    "https://cdn.prod.website-files.com/69a7c1ed095ff6a8c899c4b8/69e0be6668344e5615cdd6fd_word_map.svg";

  fetch(svgUrl)
    .then((r) => r.text())
    .then((svgText) => {
      /* Replace the <img> with the inline SVG */
      const wrapper = document.querySelector("[map-container]");
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, "image/svg+xml");
      const svgEl = doc.querySelector("svg");

      if (!svgEl) return;

      /* Make the SVG fill its container exactly like the img did */
      svgEl.setAttribute("width", "100%");
      svgEl.setAttribute("height", "100%");

      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        svgEl.setAttribute("viewBox", "600 0 740 800");
        svgEl.setAttribute("preserveAspectRatio", "xMidYMid slice");
      } else {
        svgEl.setAttribute("viewBox", "0 0 1440 830");
        svgEl.setAttribute("preserveAspectRatio", "xMaxYMid slice");
      }

      svgEl.style.cssText =
        "width:100%;height:100%;display:block;position:absolute;inset:0;";

      svgImg.style.display = "none"; // hide original img (keep in DOM for SEO)
      wrapper.style.position = "relative";
      wrapper.style.overflow = "hidden";
      wrapper.appendChild(svgEl);

      /* â”€â”€ 3. Gather all <path> elements â”€â”€ */
      const paths = Array.from(svgEl.querySelectorAll("path"));
      if (!paths.length) return;

      /* â”€â”€ 4. Set all paths invisible â”€â”€ */
      gsap.set(paths, { opacity: 0 });

      /* Prep the label so it doesn't flash in the wrong place */
      const label = mapSection
        ? mapSection.querySelector('[product_label="location"]')
        : null;
      if (label) {
        label.style.position = "absolute";
        label.style.left = "0px";
        label.style.top = "0px";
        label.style.pointerEvents = "none";
        gsap.set(label, { opacity: 0 });
      }

      /* â”€â”€ 5. ScrollTrigger â€” fade in when section enters viewport â”€â”€ */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: mapSection || mapOg,
            start: "top center",
            once: true,
          },
          onComplete: () => initLabel(svgEl, wrapper, label),
        })
        .to(paths, {
          opacity: 1,
          duration: 0.3,
          ease: "none",
          stagger: {
            each: 0.0002,
            from: "random",
          },
        });
    })
    .catch((err) => console.warn("[MapAnim] SVG fetch failed:", err));

  /* â”€â”€ 6. Position the location label under the Haryana dot â”€â”€ */
  function initLabel(svgEl, container, label) {
    const dot = svgEl.querySelector("#orange-haryana");
    if (!dot || !label) return;

    const GAP = 8;

    function placeLabel() {
      const d = dot.getBoundingClientRect();
      const c = container.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;

      label.style.left =
        d.left - c.left + d.width / 2 - label.offsetWidth / 2 + "px";

      label.style.top = isMobile
        ? d.top - c.top + d.height + GAP + "px" // below on mobile
        : d.top - c.top - label.offsetHeight - GAP + "px"; // above on desktop
    }

    placeLabel();
    new ResizeObserver(placeLabel).observe(container);
    window.addEventListener("resize", placeLabel);

    gsap.to(label, { opacity: 1, duration: 0.3 });
  }
})();