/**
 * align-refs.js
 *
 * 1. In #ref: every <p> that contains a <sup> gets id = sup's text
 *    (e.g. <p>...<sup>1</sup>...</p> → <p id="1">).
 * 2. In .article-rich-text: every <sup> is wrapped in
 *    <a class="code-ref-link" href="#KEY" data-code-ref="KEY">.
 * 3. Each #ref <p> is absolutely positioned so its top aligns with
 *    the matching <a>'s top.
 */
(function () {
    var REF_ID = "ref";
    var ARTICLE_SEL = ".article-rich-text";
    var LINK_SEL = "a.code-ref-link";
    var SUP_SEL = "sup";

    // Zero-width / invisible chars Webflow's rich-text editor sometimes
    // injects: ZWSP, ZWNJ, ZWJ, word joiner, BOM.
    var INVISIBLE_RE = /[\u200B-\u200D\u2060\uFEFF]/g;

    function cleanKey(str) {
        return (str || "").replace(INVISIBLE_RE, "").trim().toLowerCase();
    }

    function cleanText(str) {
        return (str || "").replace(INVISIBLE_RE, "");
    }

    function getKey(link) {
        var k = link.getAttribute("data-code-ref");
        if (!k) {
            var href = link.getAttribute("href") || "";
            k = href.charAt(0) === "#" ? decodeURIComponent(href.slice(1)) : href;
        }
        return cleanKey(k);
    }

    // For each <p> in #ref containing a <sup>, set the <p>'s id to
    // the <sup>'s trimmed (lowercased) text. Idempotent.
    function assignRefPIds() {
        var ref = document.getElementById(REF_ID);
        if (!ref) return;

        ref.querySelectorAll("p").forEach(function (p) {
            var sup = p.querySelector(SUP_SEL);
            if (!sup) return;

            // Strip invisibles from the visible sup text so it stays consistent.
            var cleaned = cleanText(sup.textContent);
            if (sup.textContent !== cleaned) sup.textContent = cleaned;

            var key = cleanKey(cleaned);
            if (!key) return;
            if (p.id !== key) p.id = key;
        });
    }

    // Build key → <p> map from #ref.
    function buildRefMap(refEl) {
        var map = new Map();
        if (!refEl) return map;
        refEl.querySelectorAll("p[id]").forEach(function (p) {
            map.set(cleanKey(p.id), p);
        });
        return map;
    }

    // Wrap every <sup> inside .article-rich-text in an <a.code-ref-link>.
    // Idempotent — won't double-wrap.
    function wrapSupRefs() {
        var sups = document.querySelectorAll(ARTICLE_SEL + " " + SUP_SEL);
        sups.forEach(function (sup) {
            if (sup.parentElement && sup.parentElement.closest(LINK_SEL)) return;

            // Strip invisibles from the visible sup text first.
            var cleaned = cleanText(sup.textContent);
            if (sup.textContent !== cleaned) sup.textContent = cleaned;

            var key = cleanKey(cleaned);
            if (!key) return;

            var a = document.createElement("a");
            a.className = "code-ref-link";
            a.href = "#" + key;
            a.setAttribute("data-code-ref", key);

            sup.parentNode.insertBefore(a, sup);
            a.appendChild(sup);
        });
    }

    function resetStyles(ref) {
        ref.style.width = "";
        ref.style.minHeight = "";
        ref.querySelectorAll("p").forEach(function (p) {
            p.style.position = "";
            p.style.top = "";
            p.style.left = "";
            p.style.right = "";
            p.style.width = "";
            p.style.margin = "";
        });
    }

    function alignRefBlocks() {
        var ref = document.getElementById(REF_ID);
        if (!ref) return;

        // Always reset first — so re-measurement reflects the current
        // grid track width, and so resize/reflow works correctly.
        resetStyles(ref);

        // Skip on small screens — stacked layout, no need to align.
        if (window.matchMedia("(max-width: 991px)").matches) {
            ref.style.position = "";
            return;
        }

        // Measure natural width while children are still in-flow.
        var naturalWidth = ref.getBoundingClientRect().width;
        if (naturalWidth) ref.style.width = naturalWidth + "px";

        if (getComputedStyle(ref).position === "static") {
            ref.style.position = "relative";
        }

        var refMap = buildRefMap(ref);
        if (!refMap.size) return;

        var refRect = ref.getBoundingClientRect();
        var links = document.querySelectorAll(ARTICLE_SEL + " " + LINK_SEL);
        var maxBottom = 0;

        links.forEach(function (link) {
            var p = refMap.get(getKey(link));
            if (!p) return;

            p.style.position = "absolute";
            p.style.left = "0";
            p.style.right = "0";
            p.style.margin = "0";

            var top = link.getBoundingClientRect().top - refRect.top;
            p.style.top = top + "px";

            var bottom = top + p.offsetHeight;
            if (bottom > maxBottom) maxBottom = bottom;
        });

        // Keep #ref tall enough so the last block stays within its wrap.
        ref.style.minHeight = maxBottom + "px";
    }

    window.assignRefPIds = assignRefPIds;
    window.wrapSupRefs = wrapSupRefs;
    window.alignRefBlocks = alignRefBlocks;

    var linkObserver = null;

    function getScrollableAncestor(el) {
        var node = el.parentElement;
        while (
            node &&
            node !== document.body &&
            node !== document.documentElement
        ) {
            var oy = getComputedStyle(node).overflowY;
            if (
                (oy === "auto" || oy === "scroll") &&
                node.scrollHeight > node.clientHeight
            ) {
                return node;
            }
            node = node.parentElement;
        }
        return null; // page-level scroll: skip, we don't want to fight the user
    }

    function scrollPIntoView(p) {
        var scroller = getScrollableAncestor(p);
        if (!scroller) return;
        var pRect = p.getBoundingClientRect();
        var sRect = scroller.getBoundingClientRect();
        if (pRect.top >= sRect.top && pRect.bottom <= sRect.bottom) return; // already visible
        var offset =
            pRect.top - sRect.top - (scroller.clientHeight - pRect.height) / 2;
        scroller.scrollBy({ top: offset, behavior: "smooth" });
    }

    function observeRefLinks() {
        var ref = document.getElementById(REF_ID);
        if (!ref) return;

        var refMap = buildRefMap(ref);
        if (!refMap.size) return;

        var links = document.querySelectorAll(ARTICLE_SEL + " " + LINK_SEL);
        if (!links.length) return;

        if (linkObserver) linkObserver.disconnect();

        var inView = new Set();
        var currentActive = null;

        linkObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) inView.add(entry.target);
                    else inView.delete(entry.target);
                });

                // Pick the in-view link whose top is closest to the viewport top.
                var topmost = null;
                var topmostY = Infinity;
                inView.forEach(function (link) {
                    var top = link.getBoundingClientRect().top;
                    if (top < topmostY) {
                        topmostY = top;
                        topmost = link;
                    }
                });

                var nextActive = topmost ? refMap.get(getKey(topmost)) : null;
                if (nextActive === currentActive) return;

                if (currentActive) currentActive.classList.remove("is-active");
                if (nextActive) {
                    nextActive.classList.add("is-active");
                    scrollPIntoView(nextActive);
                }
                currentActive = nextActive;
            },
            { root: null, threshold: 0 }
        );

        links.forEach(function (link) {
            linkObserver.observe(link);
        });
    }

    window.observeRefLinks = observeRefLinks;

    function debounce(fn, wait) {
        var t;
        return function () {
            clearTimeout(t);
            t = setTimeout(fn, wait);
        };
    }

    function runAll() {
        assignRefPIds();
        wrapSupRefs();
        alignRefBlocks();
        observeRefLinks();
    }
    window.runAlignRefs = runAll;

    function init() {
        // Order: assign ids in #ref → wrap sups in article → align → observe.
        assignRefPIds();
        wrapSupRefs();
        alignRefBlocks();
        requestAnimationFrame(alignRefBlocks);
        observeRefLinks();

        // After full load — fonts/images/late CMS injection.
        window.addEventListener("load", runAll);

        window.addEventListener("resize", debounce(alignRefBlocks, 100));

        // Re-run when article images finish loading.
        document.querySelectorAll(ARTICLE_SEL + " img").forEach(function (img) {
            if (!img.complete) img.addEventListener("load", alignRefBlocks);
        });

        // Re-run when article content size changes (fonts, expand/collapse, etc.)
        if (window.ResizeObserver) {
            var ro = new ResizeObserver(debounce(alignRefBlocks, 50));
            document.querySelectorAll(ARTICLE_SEL).forEach(function (el) {
                ro.observe(el);
            });
        }

        // Re-run when fonts settle.
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(runAll);
        }

        // Watch #ref for late content/id changes (CMS injection, etc.)
        var refEl = document.getElementById(REF_ID);
        if (refEl && window.MutationObserver) {
            var mo = new MutationObserver(
                debounce(function () {
                    assignRefPIds();
                    alignRefBlocks();
                    observeRefLinks();
                }, 50)
            );
            mo.observe(refEl, {
                subtree: true,
                childList: true,
                characterData: true,
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
