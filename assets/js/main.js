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
     Language — English by default for every visitor; Uzbek is
     opt-in and remembered. Only the keys below are swapped, so
     product names and technology names stay as they are.
     ========================================================= */
  const LANG_KEY = "qa-lang";

  const UZ = {
    "role.line": "Backend dasturchi <i>·</i> AI muhandisi",
    "tagline": "Bir nechta real platformani ishga tushirganman — 5+ yil dasturlash tajribasi va sun’iy intellekt bilan 1+ yil ish tajribasi.",
    "cta.cv": "CV yuklab olish",
    "cta.portfolio": "Ishlarni ko‘rish",

    "nav.about": "Men haqimda",
    "nav.skills": "Ko‘nikmalar",
    "nav.services": "Xizmatlar",
    "nav.portfolio": "Portfolio",

    "about.lead": "Bir necha yildan beri dasturlash bilan, asosan backend yo‘nalishida ishlab kelaman. Bir nechta ishlab turgan loyiha qurganman, so‘nggi bir yil ichida esa sun’iy intellekt bilan ishlayapman. Dasturlash men uchun ham qiziqish, ham kundalik ishimning bir qismi.",

    "skills.title": "Nimalar bilan ishlayman",
    "skills.lead": "Bu yerdagi har bir texnologiya real loyihalarda sinovdan o‘tgan.",
    "skills.programming": "Dasturlash",
    "skills.framework": "Freymvork",
    "skills.server": "Server",
    "skills.ai": "AI agentlari",
    "tool.cli": "Buyruqlar qatori",
    "tool.aitools": "AI vositalari",
    "lang.label": "Tillar",
    "lang.en": "Ingliz tili — B1",
    "lang.ru": "Rus tili — A2",

    "services.title": "Qanday yordam bera olaman",
    "services.lead": "Kichik vazifadan to‘liq loyihagacha — men qamrab oladigan yo‘nalishlar.",
    "svc.web": "Veb ishlab chiqish",
    "svc.web.d": "Biznesingizga moslab sayt yaratish, optimallashtirish va texnik qo‘llab-quvvatlash.",
    "svc.bot": "Telegram botlar",
    "svc.bot.d": "Avtomatlashtirish, mijozlar bilan ishlash va biznes jarayonlari uchun botlar.",
    "svc.win": "Windows xizmati",
    "svc.win.d": "Windows tizimlarini o‘rnatish, sozlash va nosozliklarni bartaraf etish.",
    "svc.linux": "Linux xizmati",
    "svc.linux.d": "Linux serverlari va kompyuterlarini sozlash, joylashtirish va texnik qo‘llab-quvvatlash.",
    "svc.ai": "AI yechimlari",
    "svc.ai.d": "Vazifalarni avtomatlashtirish va qaror qabul qilishni yaxshilash uchun AI integratsiyasi.",
    "svc.sci": "Ilmiy matn yozish",
    "svc.sci.d": "Ilmiy maqola va tadqiqotlarni yozish, tuzilmalash va tahrirlashda yordam.",
    "svc.docs": "Hujjatlashtirish",
    "svc.docs.d": "Dasturiy loyihalar uchun tushunarli texnik hujjatlar.",
    "svc.setup": "Dasturlarni sozlash",
    "svc.setup.d": "Kompyuter dasturlarini o‘rnatish, sozlash va nosozliklarni bartaraf etish.",
    "svc.design": "Grafik dizayn",
    "svc.design.d": "Ijodiy grafik dizayn — logotip, brending va marketing materiallari.",
    "services.cta": "Loyihangizni muhokama qilamiz",

    "pf.title": "Tanlangan ishlar",
    "pf.lead": "Batafsil ma’lumot uchun kartani bosing.",
    "filter.all": "Hammasi",
    "filter.app": "Ilova",
    "filter.web": "Veb",
    "tag.web": "Veb",
    "tag.app": "Ilova",

    "pf.exami.s": "Ta’lim markazlari va maktablar uchun reyting tizimi",
    "pf.muzrabot.s": "1-son texnikumning rasmiy sayti — texnikummt.uz",
    "pf.eduexam.s": "Onlayn imtihon va test tizimi",
    "pf.terdpi.s": "Institut o‘quv jarayoni platformasi — monitoring.terdpi.uz",
    "pf.mustaqil.s": "Mustaqil ta’lim tizimi — mustaqil.terdpi.uz",
    "pf.uzfor.s": "O‘zbek tilidagi forum va hamjamiyat",
    "pf.termiz.s": "Telegram bot + Web App test platformasi",
    "pf.eduplat.s": "Zamonaviy o‘quv tizimi",
    "pf.courses.s": "Video kurslar platformasi",
    "pf.mobile.s": "Ta’lim uchun ilova",
    "pf.driving.s": "Haydovchilar uchun imtihon mashqi platformasi",

    "modal.visit": "Saytga o‘tish",
    "modal.close": "Yopish",
  };

  /* The markup ships in English, so that is the fallback dictionary. */
  const i18nNodes = Array.from(document.querySelectorAll("[data-i18n]"));
  const EN = {};
  i18nNodes.forEach((el) => {
    const key = el.dataset.i18n;
    if (!(key in EN)) EN[key] = el.innerHTML;
  });

  let lang = localStorage.getItem(LANG_KEY) === "uz" ? "uz" : "en";

  function applyLang(next) {
    lang = next;
    const dict = next === "uz" ? UZ : EN;
    i18nNodes.forEach((el) => {
      const value = dict[el.dataset.i18n];
      if (value !== undefined) el.innerHTML = value;
    });
    root.setAttribute("lang", next);

    /* Keep an open project dialog in step with the switch. */
    const openCard = document.querySelector(".portfolio-item.is-open");
    if (openCard) {
      const desc = document.getElementById("modal-desc");
      if (desc) desc.textContent = (next === "uz" && openCard.dataset.descUz) || openCard.dataset.desc;
    }
    document.querySelectorAll(".lang-btn").forEach((b) => {
      const on = b.dataset.lang === next;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    localStorage.setItem(LANG_KEY, next);
  }

  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.addEventListener("click", () => applyLang(b.dataset.lang));
  });
  if (lang === "uz") applyLang("uz");

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
      mDesc.textContent = (lang === "uz" && item.dataset.descUz) || item.dataset.desc;
      if (item.dataset.url) {
        mLink.href = item.dataset.url;
        mLink.hidden = false;
      } else {
        mLink.hidden = true;
      }
      grid.querySelectorAll(".portfolio-item.is-open").forEach((c) => c.classList.remove("is-open"));
      item.classList.add("is-open");
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    };

    const closeModal = () => {
      grid.querySelectorAll(".portfolio-item.is-open").forEach((c) => c.classList.remove("is-open"));
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
