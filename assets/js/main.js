(function () {
  "use strict";

  const root = document.documentElement;

  /* ---------- Theme: light/dark with localStorage + system fallback ---------- */
  const THEME_KEY = "qa-theme";
  const stored = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", stored || (prefersDark ? "dark" : "light"));

  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ---------- Mobile nav ---------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("nav-toggle");
  if (nav && navToggle) {
    navToggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.addEventListener("click", (e) => {
      if (e.target.classList.contains("nav-link")) nav.classList.remove("open");
    });
  }

  /* ---------- Active link on scroll ---------- */
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === id));
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- Portfolio filter ---------- */
  const filterBar = document.getElementById("filters");
  const grid = document.getElementById("portfolio-grid");
  if (filterBar && grid) {
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      grid.querySelectorAll(".portfolio-item").forEach((item) => {
        item.classList.toggle("hidden", f !== "all" && item.dataset.cat !== f);
      });
    });
  }

  /* ---------- Portfolio modal ---------- */
  const modal = document.getElementById("modal");
  if (modal && grid) {
    const mImg = document.getElementById("modal-image");
    const mTitle = document.getElementById("modal-title");
    const mDesc = document.getElementById("modal-desc");
    const mLink = document.getElementById("modal-link");

    const openModal = (item) => {
      mImg.src = item.dataset.image;
      mImg.alt = item.dataset.title;
      mTitle.textContent = item.dataset.title;
      mDesc.textContent = item.dataset.desc;
      if (item.dataset.url) {
        mLink.href = item.dataset.url;
        mLink.hidden = false;
      } else {
        mLink.hidden = true;
      }
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    };

    const closeModal = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    };

    grid.addEventListener("click", (e) => {
      const item = e.target.closest(".portfolio-item");
      if (!item) return;
      openModal(item);
    });

    modal.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  /* ---------- Age ---------- */
  const ageEl = document.getElementById("my-age");
  if (ageEl) {
    const dob = new Date("2001-06-12");
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
    ageEl.textContent = age;
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
