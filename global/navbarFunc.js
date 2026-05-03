document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".menu_hamburger");
  const navMenu = document.querySelector("[nav-menu]");
  const blurBG = document.querySelector(".blur-bg");
  const jobBlock = document.querySelector(".nav-job");
  const contactBlock = document.querySelector(".nav_contact");
  const linksBlock = document.querySelector(".nav_links_wrap");

  const popupTriggers = document.querySelectorAll("[open-founder-note]");
  const founderNote = document.querySelector(".founder_notes_wrap");

  let isMenuExpanded = false;

  function openMenu() {
    lenis.stop();
    window.navNoise?.start();
    hamburger.classList.add("is-active");
    navMenu.classList.add("is-expanded");
    blurBG.classList.add("is-active");
    jobBlock.classList.add("show");
    contactBlock.classList.add("show");
    linksBlock.classList.add("show");
  }

  function closeMenu() {
    lenis.start();
    window.navNoise?.stop();
    hamburger.classList.remove("is-active");
    navMenu.classList.remove("is-expanded");
    blurBG.classList.remove("is-active");
    jobBlock.classList.remove("show");
    contactBlock.classList.remove("show");
    linksBlock.classList.remove("show");
  }

  document.querySelectorAll("[open-menu]").forEach((button) => {
    button.addEventListener("click", function () {
      isMenuExpanded = !isMenuExpanded;
      if (isMenuExpanded) openMenu();
      else closeMenu();
    });
  });

  document.querySelectorAll("[close-menu]").forEach(function (button) {
    button.addEventListener("click", function () {
      isMenuExpanded = false;
      closeMenu();
      if (founderNote) {
        founderNote.style.opacity = "0";
        setTimeout(() => {
          founderNote.classList.remove("is-active");
        }, 400);
      }
    });
  });

  if (popupTriggers && founderNote) {
    popupTriggers.forEach((popupTrigger) => {
      popupTrigger.addEventListener("click", () => {
        founderNote.classList.toggle("is-active");
        blurBG.classList.toggle("is-active");

        if (founderNote.classList.contains("is-active")) {
          founderNote.style.opacity = "1";
          lenis.stop();
        } else {
          founderNote.style.opacity = "0";
          lenis.start();
        }
      });
    });
  }
});