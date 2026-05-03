(function () {
  const float = document.querySelector("[d-1]");
  const floatBtn = document.querySelectorAll("[open-founder-note]");
  const ow1 = document.querySelector("[o-w-1]");
  const ow2 = document.querySelector("[o-w-2]");
  if (!float) return;

  const isDesktop = window.innerWidth >= 992;

  const ent = gsap.timeline();
  const expandWidth = "30vw";
  let expandHeight;

  if (isDesktop && window.innerWidth <= 1024 && window.innerHeight > 1000) {
    expandHeight = "16vh";
  } else {
    expandHeight = "30vh";
  }

  ent.to(float, {
    height: expandHeight,
    duration: 0.75,
    delay: 0.2,
    ease: "power1.out",
  });

  if (isDesktop) {
    ent.to(float, {
      width: expandWidth,
      duration: 0.75,
      ease: "power1.out",
    });
  }

  ent
    .to(floatBtn, {
      opacity: 1,
      duration: 0.75,
      ease: "power1.out",
    })
    .to(
      ".nav_component",
      {
        y: "0%",
        duration: 1,
        ease: "expo.out",
      },
      "<"
    );

  if (isDesktop) {
    ent
      .to(ow1, { left: "10%", duration: 1, ease: "expo.out" }, "<")
      .to(ow2, { right: "6%", duration: 1, ease: "expo.out" }, "<");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const careerIntro = document.querySelector("#career-intro");
  const careerGallery = document.querySelector("#career-gallery");
  const careerGalleryBG = document.querySelector(
    "#career-gallery .u-background-slot .orange-radial"
  );
  const eImg1 = document.querySelector("[e-img-1]");
  const eImg2 = document.querySelector("[e-img-2]");
  const eImg3 = document.querySelector("[e-img-3]");

  const transTl = gsap.timeline({
    scrollTrigger: {
      trigger: "[c-hero-1]",
      start: "top 80%",
      end: "top 60%",
      scrub: 1,
    },
  });

  transTl
    .to(careerIntro, { opacity: 0, pointerEvents: "none" })
    .to(careerGallery, { opacity: 1, pointerEvents: "auto" }, "<");

  const images = gsap.utils.toArray(".p-img");
  const total = images.length;

  const batch1Size = Math.ceil(total / 2);
  const batch2Size = total - batch1Size;

  const lastIndex = total - 1;
  const lastStart =
    lastIndex < batch1Size
      ? (lastIndex / batch1Size) * 0.5
      : 3.0 + ((lastIndex - batch1Size) / batch2Size) * 0.5;
  const timelineEnd = lastStart + 2.5 + 1.5;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "[c-hero-1]",
      start: "top 60%",
      end: "bottom 50%",
      scrub: true,
    },
  });

  tl.to(
    ".p-img",
    {
      z: "+=1000",
      ease: "power1.inOut",
      duration: timelineEnd,
    },
    0
  );

  images.forEach((img, i) => {
    let startTime;
    let fadeOutStartTime;

    if (i < batch1Size) {
      startTime = (i / batch1Size) * 0.5;
      fadeOutStartTime = startTime + 2.5;
    } else {
      const batchIndex = i - batch1Size;
      startTime = 3.0 + (batchIndex / batch2Size) * 0.5;
      fadeOutStartTime = startTime + 2.5;
    }

    gsap.set(img, { opacity: 0, filter: "blur(5px)" });

    tl.to(
      img,
      {
        opacity: 1,
        filter: "blur(0px)",
        ease: "power2.out",
        duration: 1,
      },
      startTime
    );

    tl.to(
      img,
      {
        opacity: 0,
        filter: "blur(5px)",
        ease: "power2.in",
        duration: 1.5,
      },
      fadeOutStartTime
    );
  });

  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: "[c-hero-2]",
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
    },
  });

  const dur = 1;

  tl2
    .to(careerGalleryBG, { opacity: 0.4 })
    .to(
      "#c-head-1",
      {
        opacity: 1,
        scale: 0.9,
        duration: dur,
        ease: "power1.inOut",
      },
      "<"
    )
    .to("#c-head-1", {
      opacity: 0,
      scale: 1,
      duration: dur,
      ease: "power1.inOut",
    })
    .to("#c-head-2", { opacity: 1, duration: dur, ease: "power1.inOut" })
    .to(eImg1, { opacity: 1, duration: dur }, "<")
    .to("#c-head-2", { opacity: 0, duration: dur, ease: "power1.inOut" })
    .to("#c-head-3", { opacity: 1, duration: dur, ease: "power1.inOut" })
    .to(eImg1, { opacity: 0, duration: dur }, "<")
    .to(eImg2, { opacity: 1, duration: dur }, "<")
    .to("#c-head-3", { opacity: 0, duration: dur, ease: "power1.inOut" })
    .to(eImg2, { opacity: 0, duration: dur }, "<")
    .to("#c-head-4", { opacity: 1, duration: dur, ease: "power1.inOut" })
    .to(eImg3, { opacity: 1, duration: dur }, "<")
    .to("#c-head-4", { opacity: 0, duration: dur, ease: "power1.inOut" })
    .to("[c-head-5]", { opacity: 1, duration: dur, ease: "power1.inOut" })
    .to(eImg3, { opacity: 0, duration: dur }, "<")
    .to(careerGalleryBG, { opacity: 1 });
});