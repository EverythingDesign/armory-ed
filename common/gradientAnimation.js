gsap.registerPlugin(ScrollTrigger);

function createRadialTransition(
  targetElement,
  triggerElement,
  triggerStart,
  triggerEnd
) {
  const element = document.querySelector(targetElement);
  if (!element) return;

  function ease(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  const setGradient = (p) => {
    const e = ease(p);

    const coreAlpha = e * 0.82;
    const coreH = 18 + e * 16;
    const coreY = -2 - (1 - e) * 8;

    const ambAlpha = e * 0.52;
    const ambH = 30 + e * 28;

    const deepAlpha = e * 0.22;

    // Fix horizontal squish on mobile
    const ratio = window.innerHeight / window.innerWidth;
    const scale = Math.max(1, ratio * 1.2);

    const w1 = 55 * scale;
    const w2 = 125 * scale;
    const w3 = 160 * scale;

    element.style.background = `
      radial-gradient(ellipse ${w1}% ${coreH}% at 50% ${coreY}%,
        rgba(255,148,45,${coreAlpha}) 0%,
        rgba(200,72,12,${coreAlpha * 0.5}) 45%,
        transparent 75%),
      radial-gradient(ellipse ${w2}% ${ambH}% at 50% ${coreY - 8}%,
        rgba(170,50,8,${ambAlpha}) 0%,
        rgba(80,20,3,${ambAlpha * 0.4}) 55%,
        transparent 85%),
      radial-gradient(ellipse ${w3}% 65% at 50% -25%,
        rgba(100,28,5,${deepAlpha}) 0%,
        transparent 80%)
    `;
  };

  setGradient(0);

  ScrollTrigger.create({
    trigger: triggerElement,
    start: triggerStart,
    end: triggerEnd,
    scrub: true,
    onUpdate: (self) => {
      setGradient(self.progress);
    },
  });
}

function createRadialTransitionFromBottom(
  targetElement,
  triggerElement,
  triggerStart,
  triggerEnd
) {
  const element = document.querySelector(targetElement);
  if (!element) return;

  function ease(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  const setGradient = (p) => {
    const e = ease(p);

    const coreAlpha = e * 0.82;
    const coreH = 18 + e * 16;
    const coreY = 95 + (1 - e) * 15;

    const ambAlpha = e * 0.52;
    const ambH = 30 + e * 28;

    const deepAlpha = e * 0.22;

    // Fix horizontal squish on mobile
    const ratio = window.innerHeight / window.innerWidth;
    const scale = Math.max(1, ratio * 1.2);

    const w1 = 55 * scale;
    const w2 = 125 * scale;
    const w3 = 160 * scale;

    element.style.background = `
      radial-gradient(ellipse ${w1}% ${coreH}% at 50% ${coreY}%,
        rgba(255,148,45,${coreAlpha}) 0%,
        rgba(200,72,12,${coreAlpha * 0.5}) 45%,
        transparent 75%),
      radial-gradient(ellipse ${w2}% ${ambH}% at 50% ${coreY + 12}%,
        rgba(170,50,8,${ambAlpha}) 0%,
        rgba(80,20,3,${ambAlpha * 0.4}) 55%,
        transparent 85%),
      radial-gradient(ellipse ${w3}% 65% at 50% 125%,
        rgba(100,28,5,${deepAlpha}) 0%,
        transparent 80%)
    `;
  };

  setGradient(0);

  ScrollTrigger.create({
    trigger: triggerElement,
    start: triggerStart,
    end: triggerEnd,
    scrub: true,
    onUpdate: (self) => {
      setGradient(self.progress);
    },
  });
}
function createRadialTransitionFromCenter(
  targetElement,
  triggerElement,
  triggerStart,
  triggerEnd
) {
  const element = document.querySelector(targetElement);
  if (!element) return;

  function ease(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  const setGradient = (p) => {
    const e = ease(p);

    const coreAlpha = e * 0.82;
    const ambAlpha = e * 0.52;
    const deepAlpha = e * 0.22;

    // Cover behavior: size off the larger container dimension
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    const w1 = size * 0.55;
    const h1 = size * 0.4;
    const w2 = size * 1.1;
    const h2 = size * 0.75;
    const w3 = size * 1.4;
    const h3 = size * 1.0;

    element.style.background = `
      radial-gradient(ellipse ${w1}px ${h1}px at 50% 50%,
        rgba(255,148,45,${coreAlpha}) 0%,
        rgba(200,72,12,${coreAlpha * 0.5}) 45%,
        transparent 75%),
      radial-gradient(ellipse ${w2}px ${h2}px at 50% 50%,
        rgba(170,50,8,${ambAlpha}) 0%,
        rgba(80,20,3,${ambAlpha * 0.4}) 55%,
        transparent 85%),
      radial-gradient(ellipse ${w3}px ${h3}px at 50% 50%,
        rgba(100,28,5,${deepAlpha}) 0%,
        transparent 80%)
    `;
  };

  setGradient(0);

  ScrollTrigger.create({
    trigger: triggerElement,
    start: triggerStart,
    end: triggerEnd,
    scrub: true,
    onUpdate: (self) => {
      setGradient(self.progress);
    },
  });
}