// Mobile-only (≤767px): TOC popup behavior

const mq = window.matchMedia("(max-width: 991px)");

function initMobileToc(
    popupElSource,
    popupElTarget,
    openTrigger,
    closeTrigger
) {
    const desktopToc = document.querySelector(popupElSource);

    const rsPopupToc = document.getElementById(popupElTarget);
    console.log(rsPopupToc);
    const popupBtn = document.getElementById(openTrigger);
    const popupCloseBtn = document.getElementById(closeTrigger);
    // const blurBgPop = document.querySelector(".blur-bg");

    if (!rsPopupToc) return;
    if (rsPopupToc.dataset.mobileInit === "true") return; // guard re-init
    rsPopupToc.dataset.mobileInit = "true";

    if (desktopToc) {
        rsPopupToc.appendChild(desktopToc);
    }

    if (popupBtn) {
        popupBtn.addEventListener("click", function () {
            rsPopupToc.classList.add("is-active");
            // lenis.stop();
        });
    }

    if (popupCloseBtn) {
        popupCloseBtn.addEventListener("click", function () {
            rsPopupToc.classList.remove("is-active");
            // lenis.start();
        });
    }
    // Click outside to dismiss
    document.addEventListener("click", function (e) {
        if (!rsPopupToc.classList.contains("is-active")) return;
        if (rsPopupToc.contains(e.target)) return;
        if (popupBtn && popupBtn.contains(e.target)) return;
        if (e.target.closest(".code-ref-link")) return;
        rsPopupToc.classList.remove("is-active");
        // lenis.start();
    });

    // Swipe down to dismiss
    let touchStartY = 0;
    rsPopupToc.addEventListener(
        "touchstart",
        function (e) {
            touchStartY = e.touches[0].clientY;
        },
        { passive: true }
    );
    rsPopupToc.addEventListener(
        "touchend",
        function (e) {
            const delta = e.changedTouches[0].clientY - touchStartY;
            if (delta > 50) {
                rsPopupToc.classList.remove("is-active");
                lenis.start();
            }
        },
        { passive: true }
    );
}
