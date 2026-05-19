gsap.registerPlugin(SplitText);
function runIntroAnimations(blockSelector, eColor, splitType = "word") {
  const startColor = "#ff4d17";
  let endColor = eColor;

  const contentBlock = document.querySelector(blockSelector);
  
  const userSplitType = contentBlock.getAttribute("data-split-type") || splitType;
  const heading = contentBlock.querySelector("h1");
  let textSplit;
  
  if (heading) {
    if (userSplitType === "char" || userSplitType === "chars") {
      const st = new SplitText(heading, { type: "chars", charsClass: "char" });
      textSplit = st.chars;
    } else {
      const st = new SplitText(heading, { type: "words", wordsClass: "word" });
      textSplit = st.words;
    }
  } else {
    textSplit = contentBlock.querySelectorAll(
      userSplitType === "char" || userSplitType === "chars" ? "h1 .char" : "h1 .word"
    );
  }

  const subheadingBlocks = contentBlock.querySelectorAll(
    "[subheading] .text-subheading"
  );
  gsap.set(subheadingBlocks, { opacity: 0 });

  if (!textSplit || textSplit.length === 0) return;

  const tl = gsap.timeline();

  const initialFrame = document.querySelector("[initial-frame='true']");
  if (initialFrame) {
    tl.to(
      initialFrame,
      {
        transform: "scale(1.06)",
        ease: "power2.out",
        duration: 0.8,
      },
      "<"
    );
  }

  const staggerAmount = userSplitType === "char" || userSplitType === "chars" ? 0.04 : 0.1;

  tl.to(
    textSplit,
    {
      opacity: 1,
      color: startColor,
      duration: 0.3,
      ease: "power2.inOut",
      stagger: staggerAmount,
    },
    "<"
  )
    .to(
      textSplit,
      {
        color: endColor,
        duration: 0.3,
        stagger: staggerAmount,
        ease: "power2.inOut",
      },
      0.4
    )
    .to(
      subheadingBlocks,
      {
        opacity: 1,
        duration: 0.6,
        ease: "power2.inOut",
      },
      "<"
    );
  if (document.querySelector(".nav_component")) {
    tl.to(
      ".nav_component",
      {
        y: "0%",
      },
      "<"
    );
  }
  if (document.querySelector(".progress_fixed")) {
    tl.to(".progress_fixed", {
      opacity: 1,
    });
  }
}

function runBlockAnimations(sectionSelector) {
  let startT1 = window.innerWidth > 991 ? "top bottom" : "top 80%";
  let endT1 = window.innerWidth > 991 ? "bottom bottom" : "top center";
  let startT2 = window.innerWidth > 991 ? "top bottom" : "top 90%";
  let endT2 = window.innerWidth > 991 ? "bottom bottom" : "top center";
  const startColor = "#ff4d17";
  const endColor = "#ffffff";

  const section = document.querySelector(sectionSelector);

  const textAnimateEl = section.querySelector("[animate-block]");
  // console.log(textAnimateEl);
  if (!textAnimateEl) return;

  const textSplit = textAnimateEl.querySelector("h2");
  const paraWrap = textAnimateEl.querySelectorAll(
    "[subheading] .text-subheading"
  );
  const textAnimateTrigger = section.querySelector("[text-trig='1']");
  const textAnimateTrigger2 = section.querySelector("[text-trig='2']");

  if (textSplit) {
    new SplitText(textSplit, {
      type: "words",
      wordsClass: "word",
      autoSplit: true,
      onSplit: function (self) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: textAnimateTrigger,
            start: startT1,
            end: endT1,
            scrub: true,
            // markers: true,
          },
        });
        const words = self.words;
        tl.to(textSplit, { opacity: 1, duration: 0 })
          .to(words, {
            opacity: 1,
            color: startColor,
            duration: 0.3,
            ease: "power2.inOut",
            stagger: 0.1,
          })
          .to(
            words,
            {
              color: endColor,
              duration: 0.3,
              stagger: 0.1,
              ease: "power2.inOut",
            },
            0.3
          );

        gsap
          .timeline({
            scrollTrigger: {
              trigger: textAnimateTrigger2,
              start: startT2,
              end: endT2,
              scrub: true,
            },
          })
          .to(
            paraWrap,
            {
              y: "0%",
              opacity: 1,
              ease: "power2.out",
            },
            "<"
          );
      },
    });
  }
}

function runHeadingAnimations(
  headingSelector,
  triggerSelector,
  triggerStartD,
  triggerEndD,
  triggerStartM,
  triggerEndM
) {
  const startM = triggerStartM ?? triggerStartD;
  const endM = triggerEndM ?? triggerEndD;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const start = isMobile ? startM : triggerStartD;
  const end = isMobile ? endM : triggerEndD;

  const el = document.querySelector(headingSelector);
  //
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerSelector,
      start: start,
      end: end,
      scrub: true,
      // markers: true,
    },
  });

  tl.to(el.querySelectorAll(".word"), {
    opacity: 1,
    color: startColor,
    duration: 0.3,
    ease: "power2.inOut",
    stagger: 0.1,
  }).to(
    el.querySelectorAll(".word"),
    {
      color: endColor,
      duration: 0.3,
      stagger: 0.1,
      ease: "power2.inOut",
    },
    0.3
  );
}
function runHeadingBlockAnimations(
  headingSelector,
  subParaSelector,
  triggerSelector,
  triggerStartD,
  triggerEndD,
  triggerStartM,
  triggerEndM
) {
  const startM = triggerStartM ?? triggerStartD;
  const endM = triggerEndM ?? triggerEndD;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const start = isMobile ? startM : triggerStartD;
  const end = isMobile ? endM : triggerEndD;

  const el = document.querySelector(headingSelector);
  const subEl = document.querySelector(subParaSelector);
  //
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerSelector,
      start: start,
      end: end,
      scrub: true,
      // markers: true,
    },
  });

  tl.to(el.querySelectorAll(".word"), {
    opacity: 1,
    color: startColor,
    duration: 0.3,
    ease: "power2.inOut",
    stagger: 0.1,
  })
    .to(
      el.querySelectorAll(".word"),
      {
        color: endColor,
        duration: 0.3,
        stagger: 0.1,
        ease: "power2.inOut",
      },
      0.3
    )
    .to(
      subEl,
      {
        opacity: 1,
        duration: 0.3,
        ease: "power2.inOut",
      },
      0.5
    );
}