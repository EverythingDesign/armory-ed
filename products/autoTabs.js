/**
 * Reusable Autoplay Tabs Function
 * @param {string} wrapperSelector - The selector for the container holding tabs and videos
 * @param {number} duration - Autoplay duration in milliseconds
 * @param {number} startIndex - Index of the tab to start active (0-based)
 */
function initAutoplayTabs(wrapperSelector, duration = 8000, startIndex = 0) {
  const wrappers = document.querySelectorAll(wrapperSelector);

  wrappers.forEach((wrapper) => {
    const tabLinks = Array.from(wrapper.querySelectorAll(".tab_link"));
    const tabVids = Array.from(wrapper.querySelectorAll(".is-tab-vid"));

    if (!tabLinks.length || !tabVids.length) return;

    let currentIndex = 0;
    let isPaused = true;
    let progress = 0;
    let lastTime = 0;
    let animationFrameId;

    function resetAll() {
      tabLinks.forEach((link) => {
        link.classList.remove("is-active");
        const progressLine = link.querySelector(".progress_line");
        if (progressLine) progressLine.style.width = "0%";
      });
      tabVids.forEach((vid) => {
        vid.classList.remove("is-active");
        if (vid.tagName.toLowerCase() === "video") vid.pause();
      });
    }

    function goToTab(index) {
      cancelAnimationFrame(animationFrameId);
      resetAll();

      tabLinks[index].classList.add("is-active");
      if (tabVids[index]) {
        tabVids[index].classList.add("is-active");
        if (tabVids[index].tagName.toLowerCase() === "video") {
          tabVids[index].currentTime = 0;
          if (!isPaused) tabVids[index].play().catch(() => {});
        }
      }

      currentIndex = index;
      progress = 0;

      if (!isPaused) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    }

    function updateProgress(time) {
      if (isPaused) return;

      const deltaTime = time - lastTime;
      lastTime = time;

      progress += deltaTime / duration;

      if (progress >= 1) {
        const nextIndex = (currentIndex + 1) % tabLinks.length;
        goToTab(nextIndex);
        return;
      }

      const currentProgressLine =
        tabLinks[currentIndex].querySelector(".progress_line");
      if (currentProgressLine) {
        currentProgressLine.style.width = `${progress * 100}%`;
      }

      animationFrameId = requestAnimationFrame(updateProgress);
    }

    tabLinks.forEach((link, index) => {
      link.addEventListener("click", () => {
        if (currentIndex === index && link.classList.contains("is-active"))
          return;
        goToTab(index);
      });
    });

    // Clamp startIndex so an out-of-range value doesn't break things
    const safeStart = Math.min(Math.max(startIndex, 0), tabLinks.length - 1);
    goToTab(safeStart);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (isPaused) {
              isPaused = false;
              lastTime = performance.now();
              animationFrameId = requestAnimationFrame(updateProgress);

              if (
                tabVids[currentIndex] &&
                tabVids[currentIndex].tagName.toLowerCase() === "video"
              ) {
                tabVids[currentIndex].play().catch(() => {});
              }
            }
          } else {
            isPaused = true;
            if (
              tabVids[currentIndex] &&
              tabVids[currentIndex].tagName.toLowerCase() === "video"
            ) {
              tabVids[currentIndex].pause();
            }
          }
        });
      },
      { threshold: 0 }
    );

    const targetToObserve = wrapper.closest("section") || wrapper;
    observer.observe(targetToObserve);
  });
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // 3rd argument = starting tab index (0 = first, 1 = second, etc.)
  initAutoplayTabs(".video_media_wrap", 8000, 1);
});
