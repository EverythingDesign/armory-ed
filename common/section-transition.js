function ditherTransition(sectionFrom, sectionTo, trigger, startD, endD) {
  const sourceBuiltTl = gsap.timeline({
    scrollTrigger: {
      trigger: trigger,
      start: startD,
      end: endD,
      // markers: true,
      scrub: true,
    },
  });
  sourceBuiltTl
    .to(".progress_fixed", {
      opacity: 0,
    })
    .to(
      sectionFrom,
      {
        opacity: 0,
        pointerEvents: "none",
      },
      "<"
    )
    .to(sectionTo, {
      opacity: 1,
    })
    .to(
      window.CloudShaderAPI,
      {
        progress: 1,
        duration: 1,
      },
      "<"
    );
}

gsap.registerPlugin(ScrollTrigger);

function droneTransition() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "[drone-transition-trigger]",
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
    },
  });

  // Fade out the video section
  tl.to(
    "#drone-view",
    {
      opacity: 0,
      ease: "none",
    },
    0
  ); // The '0' makes it start at the exact beginning of the timeline

  // Fade in the content section at the same time
  tl.to("[redefine-content-sec]", {
    opacity: 1,
    ease: "none",
  })
    .to(
      '[static-content="1"]',
      {
        opacity: 1,
        ease: "none",
      },
      "<"
    )
    .to(
      '[static-content="1"] h2 .word',
      {
        opacity: 1,
        color: startColor,
        stagger: 0.1,
        ease: "none",
      },
      "<"
    )
    .to('[static-content="1"] h2 .word', {
      opacity: 1,
      color: endColor,
      stagger: 0.1,
      ease: "none",
    })
    .to('[static-content="1"]', {
      opacity: 0,
      ease: "none",
    })
    .to(
      '[static-content="2"]',
      {
        opacity: 1,
        ease: "none",
      },
      "-=0.9"
    )
    .to('[static-content="2"] h2 .word', {
      opacity: 1,
      color: startColor,
      stagger: 0.1,
      ease: "none",
    })
    .to('[static-content="2"] h2 .word', {
      opacity: 1,
      color: endColor,
      stagger: 0.1,
      ease: "none",
    })
    .to(
      '[static-content="2"] .u-button-wrapper',
      {
        opacity: 1,
        ease: "none",
      },
      "<"
    );
}