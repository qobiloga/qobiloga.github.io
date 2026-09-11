(function () {
  "use strict";

  const root = document.documentElement;

  /* ---------- Theme ----------
     The site always opens in light mode, whatever the operating system
     prefers. Dark is opt-in: once chosen it is remembered for next time. */
  const THEME_KEY = "qa-theme";
  const saved = localStorage.getItem(THEME_KEY);
  root.setAttribute("data-theme", saved === "dark" ? "dark" : "light");

  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      themeBtn.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* =========================================================
     Section nav — the sticky left column highlights whichever
     panel currently sits under the middle of the viewport.
     ========================================================= */
  const panels = Array.from(document.querySelectorAll(".panel"));
  const links = Array.from(document.querySelectorAll(".side-link"));
  const navToggle = document.getElementById("nav-toggle");
  const navScrim = document.getElementById("nav-scrim");

  /* ---------- Menu drawer (stacked layout only) ---------- */
  function setMenu(open) {
    document.body.classList.toggle("nav-open", open);
    if (!navToggle) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (navToggle) {
    navToggle.addEventListener("click", () =>
      setMenu(!document.body.classList.contains("nav-open")));
  }
  if (navScrim) navScrim.addEventListener("click", () => setMenu(false));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
  /* A wide window has no drawer, so never leave the page locked. */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) setMenu(false);
  });
  const progressBar = document.getElementById("scroll-bar");

  const panelIds = panels.map((p) => p.id);
  let activeId = panelIds[0];

  /* Which panel crosses the vertical middle of the screen? */
  function panelUnderCenter() {
    const mid = window.innerHeight / 2;
    let nearest = panels[0];
    let nearestDist = Infinity;

    for (const panel of panels) {
      const box = panel.getBoundingClientRect();
      if (box.top <= mid && box.bottom >= mid) return panel.id;

      const dist = Math.min(Math.abs(box.top - mid), Math.abs(box.bottom - mid));
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = panel;
      }
    }
    return nearest.id;
  }

  function setActive(id) {
    if (id === activeId) return;
    activeId = id;
    links.forEach((link) => link.classList.toggle("is-active", link.dataset.target === id));

  }

  function updateProgress() {
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.width = Math.min(100, Math.max(0, ratio * 100)) + "%";
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      setActive(panelUnderCenter());
      updateProgress();
      ticking = false;
    });
  }

  if (panels.length) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  links.forEach((link) => {
    link.addEventListener("click", () => {
      setMenu(false);
      const target = document.getElementById(link.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  /* ---------- Panels fade in the first time they are seen ---------- */
  if ("IntersectionObserver" in window && panels.length) {
    const revealer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 }
    );
    panels.forEach((panel) => revealer.observe(panel));
  } else {
    panels.forEach((panel) => panel.classList.add("is-visible"));
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

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
