(function () {
    const MIN_WIDTH = 768;

    function initCodeReferences() {
        const refs = document.getElementById("ref");

        const popup = document.getElementById("rs-popup-notes");

        function setActiveCode(target) {
            if (!refs) return;
            refs.querySelectorAll("p.is-active").forEach(function (c) {
                if (c !== target) c.classList.remove("is-active");
            });
            if (target) target.classList.add("is-active");
        }

        function centerInWindow(target) {
            const rect = target.getBoundingClientRect();
            const top =
                rect.top + window.scrollY - (window.innerHeight - rect.height) / 2;
            const y = Math.max(0, top);
            if (window.lenis && typeof window.lenis.scrollTo === "function") {
                window.lenis.scrollTo(y);
            } else {
                window.scrollTo({ top: y, behavior: "smooth" });
            }
        }

        function centerInPopup(target) {
            // pick the ref block (p or wrapping element) instead of the inline <code>
            const block = target.closest("p, li, [class*='ref']") || target;
            // let the popup finish opening before measuring
            requestAnimationFrame(function () {
                block.scrollIntoView({ block: "center", behavior: "smooth" });
            });
        }

        document.querySelectorAll(".article-rich-text").forEach(function (article) {
            article.querySelectorAll("sup").forEach(function (sup) {
                const text = sup.textContent.trim();
                if (!text) return;
                if (sup.parentNode && sup.parentNode.tagName === "A") return;

                const link = document.createElement("a");
                link.href = "#" + text;
                link.className = "code-ref-link";
                link.setAttribute("data-code-ref", text);

                link.addEventListener("click", function (e) {
                    e.preventDefault();

                    const target = document.getElementById(text);
                    setActiveCode(target);

                    if (window.innerWidth < MIN_WIDTH) {
                        if (popup) popup.classList.add("is-active");
                        if (target) centerInPopup(target);
                        return;
                    }

                    if (!target) return;
                    centerInWindow(target);
                });

                sup.parentNode.insertBefore(link, sup);
                link.appendChild(sup);
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCodeReferences);
    } else {
        initCodeReferences();
    }
})();
