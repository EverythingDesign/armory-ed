gsap.registerPlugin(Flip);

const btn = document.querySelector(".switch-view_btn");
const viewThumb = document.querySelector(".view-thumb");
const mapTarget = document.querySelector("[map-target]");
const mapSource = document.querySelector("[map-source]");
const mapOg = document.querySelector("[map-og]");
const btnLabel = document.querySelector(".switch-view_txt .u-text-style-h6");
const locLabel = document.querySelector('[product_label="location"]');
const mapTag = document.querySelector(".map-tag");
const mapTagCta = document.querySelector(".map-tag .cta-block");

const ORANGE = "#ff4d17";
const WHITE = "#ffffff";
const OP = "transparent";
const GREY = "#646464";

let isImage = false;
let animating = false;

btn.addEventListener("click", () => {
  if (animating) return;
  animating = true;

  const expanding = isImage ? mapOg : mapSource;
  const disappearing = isImage ? mapSource : mapOg;
  const goingToMap = expanding === mapOg;

  const switchTxt = btn.querySelector(".switch-view_txt");
  const state = Flip.getState(expanding);

  mapTarget.appendChild(expanding);
  expanding.style.position = "absolute";
  expanding.style.inset = "0";
  expanding.style.zIndex = "2";

  gsap.to(switchTxt, { opacity: 0, duration: 0.2, ease: "power2.out" });

  if (locLabel && !goingToMap) {
    gsap.to(locLabel, { opacity: 0, duration: 0.3, ease: "power2.out" });
  }

  // Swap .map-tag / .cta-block colors in sync with the Flip
  if (mapTag) {
    gsap.to(mapTag, {
      color: WHITE,
      backgroundColor: goingToMap ? OP : ORANGE,
      borderColor: goingToMap ? GREY : ORANGE,
      duration: 0.72,
      ease: "power3.inOut",
    });
  }
  if (mapTagCta) {
    gsap.to(mapTagCta, {
      backgroundColor: goingToMap ? ORANGE : WHITE,
      duration: 0.72,
      ease: "power3.inOut",
    });
  }

  Flip.from(state, {
    duration: 0.72,
    ease: "power3.inOut",
    onComplete() {
      viewThumb.appendChild(disappearing);
      disappearing.style.position = "";
      disappearing.style.inset = "";
      disappearing.style.zIndex = "";

      expanding.style.position = "";
      expanding.style.inset = "";
      expanding.style.zIndex = "";

      gsap.to(switchTxt, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      if (locLabel && goingToMap) {
        gsap.to(locLabel, { opacity: 1, duration: 0.3, ease: "power2.out" });
      }

      btnLabel.textContent = isImage
        ? "Change to image view"
        : "Change to map view";
      isImage = !isImage;
      animating = false;
    },
  });
});