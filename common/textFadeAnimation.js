function createTextFade(
  targetSelector,
  triggerElement,
  triggerStart = "top bottom",
  triggerEnd = "bottom bottom"
) {
  let startColor = "#ff942d";
  let endColor = "#ffffff";
  const chars = document.querySelectorAll(`${targetSelector} .char`);
  if (chars.length === 0) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      start: triggerStart,
      end: triggerEnd,
      scrub: true,
    },
  });

  tl.to(chars, {
    opacity: 1,
    color: startColor,
    duration: 0.4,
    ease: "power2.inOut",
    stagger: 0.2,
  }).to(
    chars,
    {
      color: endColor,
      duration: 0.3,
      stagger: 0.2,
      ease: "power2.inOut",
    },
    0.3
  );
}