const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");

const menuButton = document.querySelector("#menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}
menuButton.addEventListener("click", () => {
  const open = mobileNav.hidden;
  mobileNav.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
});
mobileNav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
matchMedia("(min-width: 951px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

const dialog = document.querySelector("#consultation-dialog");
const form = document.querySelector("#consultation-form");
const concernField = document.querySelector("#consultation-concern");
const serviceDescriptions = {
  "General dermatology consultation":
    "Discuss any skin or hair concern, your symptoms, previous care, and questions with Dr. Apurva Aditi. An assessment helps determine appropriate next steps.",
  "Acne treatment":
    "Discuss recurring breakouts, previous acne care, and your current products. Your dermatologist can assess your concern and recommend an individual plan.",
  "Pigmentation treatment":
    "A consultation to review dark spots or uneven tone, your treatment history, and suitable care options.",
  "Dark circle reduction":
    "Discuss your under-eye concerns and whether a treatment approach is appropriate following assessment.",
  "Scars & open pores":
    "Review the appearance of scars and skin texture. Ask about available procedural options and the care they involve.",
  "Wrinkle treatments":
    "Discuss fine lines, your goals, and the available options, including the listed microneedling and anti-wrinkle injection services.",
  "Skin sagging treatments":
    "Explore your concerns about skin laxity and discuss whether options such as fillers or threads are suitable for you.",
  "Hair fall & hair loss":
    "Review the pattern and duration of hair loss, your medical and treatment history, and your scalp concerns with a dermatologist.",
  "Dandruff care":
    "A consultation about dandruff and scalp concerns, including your current haircare routine and previous treatments.",
  "Laser hair reduction":
    "Discuss the areas you want to treat, suitability, preparation, appointment planning, and aftercare before choosing laser hair reduction.",
  Facials:
    "Discuss your skin concerns and whether an in-clinic facial belongs in your care plan.",
  Peels:
    "Explore chemical peel options with your dermatologist. Ask about suitability, preparation, recovery, and follow-up.",
  "Lasers & resurfacing":
    "A consultation to discuss the listed Q-switch laser, microneedling, and resurfacing options in relation to your skin concern.",
  Dermafrac:
    "Ask what a Dermafrac session involves and whether it is appropriate for your skin and treatment goals.",
  "Skin rejuvenation":
    "Discuss the listed PRP and PDRN services, their suitability for you, and the appointment and aftercare requirements.",
  "Mesotherapy & exosomes":
    "Discuss mesotherapy and exosome treatment options, the evidence, alternatives, and suitability for your individual concern.",
  "Skincare routines":
    "Review your current products and discuss a skincare routine that fits your skin concerns and daily life.",
  "Skin tag & wart removal":
    "Have the specific skin concern assessed before discussing removal options, preparation, and aftercare.",
  "IV drips":
    "A medical consultation to discuss the reason for considering IV therapy, suitability, alternatives, and the care involved.",
  "Lymphatic drainage therapy":
    "Discuss your goals and whether a lymphatic drainage session is suitable as part of your care plan.",
};
function openConsultation(service, note) {
  document.querySelector("#dialog-title").textContent =
    service || "Request a consultation";
  document.querySelector("#dialog-copy").textContent = service
    ? serviceDescriptions[service] ||
      "Share this concern with Dr. Apurva Aditi and discuss your next steps in a consultation."
    : "Tell us about your skin or hair concern. Call the clinic or prepare an email enquiry to discuss appointment availability.";
  const serviceNote = document.querySelector("#dialog-service");
  serviceNote.hidden = !note;
  serviceNote.textContent = note || "";
  document.querySelector("#service-guidance").hidden =
    !serviceDescriptions[service];
  concernField.value = service || "";
  closeMenu();
  if (!dialog.open) dialog.showModal();
}
document
  .querySelectorAll("[data-consult]")
  .forEach((button) =>
    button.addEventListener("click", () => openConsultation()),
  );
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-treatment]");
  if (button) openConsultation(button.dataset.treatment, button.dataset.note);
});
document
  .querySelector("#dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    dialog.close();
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const message = `Hello Dr. Apurva Aditi,\n\nI would like to enquire about a consultation.\n\nName: ${values.get("name").trim()}\nPhone: ${values.get("phone").trim()}\nConcern: ${values.get("concern").trim() || "General skin and hair consultation"}\nNotes: ${values.get("message").trim() || "None"}\n\nPlease let me know the available appointments. Thank you.`;
  window.location.href = `mailto:apurva.mini@gmail.com?subject=${encodeURIComponent("Consultation enquiry — Skinic by Dr. Apurva")}&body=${encodeURIComponent(message)}`;
});

let activeFilter = "all";
const search = document.querySelector("#treatment-search");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const cards = [...document.querySelectorAll(".treatment-card")];
const normalise = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
function filterTreatments() {
  const query = normalise(search.value);
  let count = 0;
  cards.forEach((card) => {
    card.hidden = !(
      (activeFilter === "all" ||
        card.dataset.category.split(" ").includes(activeFilter)) &&
      normalise(card.textContent).includes(query)
    );
    if (!card.hidden) count++;
  });
  filterButtons.forEach((button) =>
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === activeFilter),
    ),
  );
  document.querySelector("#results-count").textContent =
    `${count} ${count === 1 ? "treatment & service" : "treatments & services"}`;
  document.querySelector("#empty-results").hidden = count !== 0;
}
filterButtons.forEach((button) =>
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterTreatments();
  }),
);
search.addEventListener("input", filterTreatments);
document.querySelector("#reset-search").addEventListener("click", () => {
  activeFilter = "all";
  search.value = "";
  filterTreatments();
  search.focus();
});
document.querySelectorAll("[data-browse]").forEach((button) =>
  button.addEventListener("click", () => {
    activeFilter = button.dataset.browse;
    search.value = "";
    filterTreatments();
    document.querySelector("#care-directory").open = true;
    document
      .querySelectorAll(".nav-dropdown")
      .forEach((menu) => (menu.open = false));
    document.querySelector("#care-directory").scrollIntoView({
      behavior: motionPreference.matches ? "instant" : "smooth",
    });
  }),
);
filterTreatments();

const concerns = {
  acne: {
    title: "Acne & breakouts",
    description:
      "Start with a consultation to discuss recurring breakouts, previous treatments, and your current skincare routine.",
    services: ["Acne treatment", "Skincare routines"],
    preparation:
      "Bring your current skincare product list and any previous acne prescriptions. Note when the breakouts started.",
  },
  pigmentation: {
    title: "Pigmentation & dark spots",
    description:
      "Discuss uneven tone, dark spots, or under-eye concerns. An individual assessment helps you understand the available care options.",
    services: [
      "Pigmentation treatment",
      "Dark circle reduction",
      "Skincare routines",
    ],
    preparation:
      "Bring a list of current products and any records of previous pigmentation treatments.",
  },
  hair: {
    title: "Hair fall & scalp problems",
    description:
      "Discuss hair shedding, thinning, or dandruff with a dermatologist. Share when it began and what you have already tried.",
    services: ["Hair fall & hair loss", "Dandruff care"],
    preparation:
      "Bring previous prescriptions or relevant reports and a list of the haircare products and medicines you use.",
  },
  scars: {
    title: "Scars & skin texture",
    description:
      "Start with an assessment of your scars and texture concerns. Discuss available procedures, suitability, and what recovery involves.",
    services: ["Scars & open pores", "Lasers & resurfacing", "Peels"],
    preparation:
      "Bring details of previous procedures and any current skincare products or prescriptions.",
  },
  tags: {
    title: "Skin tags & warts",
    description:
      "Book an assessment of the specific skin concern before discussing whether a removal procedure is appropriate.",
    services: ["Skin tag & wart removal"],
    preparation:
      "Note when you first noticed the concern and bring details of any earlier assessment or treatment.",
  },
  other: {
    title: "General skin & hair consultation",
    description:
      "You do not need to choose a treatment in advance. Describe your symptoms and questions to the dermatologist so you can discuss the right next step.",
    services: ["General dermatology consultation"],
    preparation:
      "Bring your medical and treatment history, current product list, and the questions you would like to discuss.",
  },
};
let selectedConcern = "acne";
function selectConcern(key) {
  selectedConcern = key;
  const concern = concerns[key];
  document
    .querySelectorAll("[data-concern]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.concern === key),
      ),
    );
  document.querySelector("#care-title").textContent = concern.title;
  document.querySelector("#care-description").textContent = concern.description;
  document.querySelector("#care-preparation").textContent = concern.preparation;
  const serviceList = document.querySelector("#care-services");
  serviceList.replaceChildren();
  concern.services.forEach((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "care-service";
    button.dataset.treatment = name;
    button.textContent = name;
    const card = cards.find((card) => card.dataset.treatment === name);
    button.dataset.note = card?.dataset.note || "";
    serviceList.append(button);
  });
  document
    .querySelector("#concern-appointment")
    .setAttribute("aria-label", `Request a consultation for ${concern.title}`);
}
document.querySelectorAll("[data-concern]").forEach((button) =>
  button.addEventListener("click", () => {
    selectConcern(button.dataset.concern);
    if (matchMedia("(max-width: 700px)").matches)
      document.querySelector("#care-panel").scrollIntoView({
        behavior: motionPreference.matches ? "instant" : "smooth",
        block: "start",
      });
  }),
);
document
  .querySelector("#concern-appointment")
  .addEventListener("click", () =>
    openConsultation(concerns[selectedConcern].title),
  );
document
  .querySelector("#appointment-request-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    openConsultation(document.querySelector("#quick-concern").value);
    form.elements.name.value = document
      .querySelector("#quick-name")
      .value.trim();
    form.elements.phone.value = document
      .querySelector("#quick-phone")
      .value.trim();
    const email = document.querySelector("#appointment-email").value.trim();
    const date = document.querySelector("#appointment-date").value;
    const time = document.querySelector("#appointment-time").value;
    form.elements.message.value = [
      email && `Reply email: ${email}`,
      date && `Preferred date: ${date}`,
      time && `Preferred time: ${time}`,
    ]
      .filter(Boolean)
      .join("\n");
  });
document
  .querySelector('.doctor-copy a[href="#doctor-background"]')
  ?.addEventListener("click", () => {
    document.querySelector("#doctor-background").open = true;
  });
selectConcern(selectedConcern);
document.querySelector("#back-top").addEventListener("click", () =>
  window.scrollTo({
    top: 0,
    behavior: motionPreference.matches ? "instant" : "smooth",
  }),
);

// Lightweight controls for the extracted reference galleries.
function connectReferenceScroller(track, controls, directionAttribute) {
  if (!track || controls.length < 2) return () => {};
  const previous = controls[0];
  const next = controls[1];
  function refresh() {
    const end = track.scrollWidth - track.clientWidth;
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = end <= 2 || track.scrollLeft >= end - 2;
  }
  controls.forEach((button) => {
    button.addEventListener("click", () => {
      const first = [...track.children].find((child) => !child.hidden);
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
      const distance = first
        ? first.getBoundingClientRect().width + gap
        : track.clientWidth;
      track.scrollBy({
        left: Number(button.getAttribute(directionAttribute)) * distance,
        behavior: motionPreference.matches ? "instant" : "smooth",
      });
    });
  });
  track.addEventListener("scroll", refresh, { passive: true });
  new ResizeObserver(refresh).observe(track);
  refresh();
  return refresh;
}

const galleryTrack = document.querySelector(".gallery-track");
const refreshGallery = connectReferenceScroller(
  galleryTrack,
  [...document.querySelectorAll("[data-gallery-direction]")],
  "data-gallery-direction",
);
document.querySelectorAll("[data-gallery-category]").forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.galleryCategory;
    document.querySelectorAll("[data-gallery-category]").forEach((tab) => {
      tab.setAttribute("aria-pressed", String(tab === button));
    });
    let count = 0;
    galleryTrack.querySelectorAll("[data-gallery-item]").forEach((card) => {
      card.hidden = category !== "all" && card.dataset.galleryItem !== category;
      if (!card.hidden) count += 1;
    });
    galleryTrack.scrollLeft = 0;
    document.querySelector("#gallery-status").textContent =
      `${button.textContent} · ${count} featured options`;
    refreshGallery();
  });
});

// Practical navigation for the reference-style menus and service directory.
const navMenus = [...document.querySelectorAll(".nav-dropdown")];
navMenus.forEach((menu) => {
  menu.addEventListener("toggle", () => {
    if (menu.open)
      navMenus.forEach((other) => {
        if (other !== menu) other.open = false;
      });
  });
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-dropdown"))
    navMenus.forEach((menu) => (menu.open = false));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") navMenus.forEach((menu) => (menu.open = false));
});
document.querySelectorAll('[href="#care-directory"]').forEach((link) => {
  link.addEventListener(
    "click",
    () => (document.querySelector("#care-directory").open = true),
  );
});
document.querySelectorAll("[data-find-concern]").forEach((button) => {
  button.addEventListener("click", () => {
    selectConcern(button.dataset.findConcern);
    navMenus.forEach((menu) => (menu.open = false));
    document.querySelector("#concerns").scrollIntoView({
      behavior: motionPreference.matches ? "instant" : "smooth",
    });
  });
});
const today = new Date();
document.querySelector("#appointment-date").min =
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

// Rounded banner carousel: crossfades, accessible inactive slides, manual controls,
// touch gestures, and automatic rotation that pauses while visitors interact.
const heroPanel = document.querySelector(".campaign-hero");
// Measure the real header/control heights so viewport fitting works at different
// browser zoom levels, breakpoints, and when device orientation changes.
const heroShell = document.querySelector(".campaign-shell");
const heroControls = document.querySelector(".campaign-controls");
const mastheadTop = document.querySelector(".topbar");
const mastheadInner = document.querySelector(".header-inner");
const mobileActionBar = document.querySelector(".mobile-care-bar");
function fitHeroViewport() {
  const headerHeight =
    mastheadTop.getBoundingClientRect().height +
    mastheadInner.getBoundingClientRect().height +
    1;
  const shellPadding = parseFloat(getComputedStyle(heroShell).paddingTop) || 0;
  const inset =
    headerHeight +
    shellPadding +
    heroControls.getBoundingClientRect().height +
    mobileActionBar.getBoundingClientRect().height +
    8;
  document.documentElement.style.setProperty(
    "--hero-viewport-inset",
    `${Math.ceil(inset)}px`,
  );
}
const heroSizingObserver = new ResizeObserver(fitHeroViewport);
[mastheadTop, mastheadInner, heroControls, mobileActionBar].forEach((element) =>
  heroSizingObserver.observe(element),
);
addEventListener("resize", fitHeroViewport, { passive: true });
fitHeroViewport();
const heroSlides = [...document.querySelectorAll("[data-hero-slide]")];
const heroDots = [...document.querySelectorAll("[data-hero-dot]")];
const pauseHeroButton = document.querySelector("#hero-pause");
let heroIndex = 0;
let heroTimer;
let userPausedHero = motionPreference.matches;
let hoveringHero = false;
let focusedHero = false;
let heroVisible = true;

function scheduleHero() {
  clearTimeout(heroTimer);
  if (
    userPausedHero ||
    motionPreference.matches ||
    hoveringHero ||
    focusedHero ||
    !heroVisible ||
    document.hidden
  )
    return;
  heroTimer = setTimeout(() => showHeroSlide(heroIndex + 1), 7000);
}
function showHeroSlide(nextIndex, announce = false) {
  heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, index) => {
    const active = index === heroIndex;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
    slide.inert = !active;
    heroDots[index].setAttribute("aria-pressed", String(active));
  });
  if (announce)
    document.querySelector("#hero-status").textContent =
      heroSlides[heroIndex].getAttribute("aria-label");
  scheduleHero();
}
function updateHeroPauseButton() {
  pauseHeroButton.setAttribute("aria-pressed", String(userPausedHero));
  pauseHeroButton.setAttribute(
    "aria-label",
    userPausedHero ? "Play automatic slides" : "Pause automatic slides",
  );
  pauseHeroButton.textContent = userPausedHero ? "▶" : "Ⅱ";
}
heroDots.forEach((button) =>
  button.addEventListener("click", () =>
    showHeroSlide(Number(button.dataset.heroDot), true),
  ),
);
document.querySelectorAll("[data-hero-direction]").forEach((button) => {
  button.addEventListener("click", () =>
    showHeroSlide(heroIndex + Number(button.dataset.heroDirection), true),
  );
});
pauseHeroButton.addEventListener("click", () => {
  userPausedHero = !userPausedHero;
  updateHeroPauseButton();
  scheduleHero();
});
heroPanel.addEventListener("mouseenter", () => {
  hoveringHero = true;
  scheduleHero();
});
heroPanel.addEventListener("mouseleave", () => {
  hoveringHero = false;
  scheduleHero();
});
heroPanel.addEventListener("focusin", () => {
  focusedHero = true;
  scheduleHero();
});
heroPanel.addEventListener("focusout", (event) => {
  focusedHero = heroPanel.contains(event.relatedTarget);
  scheduleHero();
});
document
  .querySelector(".campaign-shell")
  .addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    showHeroSlide(heroIndex + (event.key === "ArrowRight" ? 1 : -1), true);
  });
let heroTouchStart;
heroPanel.addEventListener(
  "touchstart",
  (event) => {
    heroTouchStart = event.touches[0]?.clientX;
  },
  { passive: true },
);
heroPanel.addEventListener(
  "touchend",
  (event) => {
    const end = event.changedTouches[0]?.clientX;
    if (
      heroTouchStart !== undefined &&
      end !== undefined &&
      Math.abs(end - heroTouchStart) > 60
    )
      showHeroSlide(heroIndex + (end < heroTouchStart ? 1 : -1), true);
    heroTouchStart = undefined;
  },
  { passive: true },
);
document.addEventListener("visibilitychange", scheduleHero);
motionPreference.addEventListener("change", () => {
  userPausedHero = motionPreference.matches;
  updateHeroPauseButton();
  scheduleHero();
  if (motionPreference.matches)
    document.documentElement.classList.remove("motion-ready");
});
if ("IntersectionObserver" in window) {
  new IntersectionObserver(
    ([entry]) => {
      heroVisible = entry.isIntersecting;
      scheduleHero();
    },
    { threshold: 0.1 },
  ).observe(heroPanel);
}
updateHeroPauseButton();
scheduleHero();

// Scroll entrances and credential counters, with a fully visible no-JS/reduced-motion fallback.
function animateCounter(element) {
  const target = Number(element.dataset.count);
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / 1250, 1);
    element.textContent = String(
      Math.round(target * (1 - Math.pow(1 - progress, 3))),
    );
    if (progress < 1 && !motionPreference.matches) requestAnimationFrame(tick);
    else element.textContent = String(target);
  }
  requestAnimationFrame(tick);
}
if ("IntersectionObserver" in window && !motionPreference.matches) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        entry.target.querySelectorAll("[data-count]").forEach(animateCounter);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -25px 0px" },
  );
  document.querySelectorAll("[data-reveal]").forEach((element) => {
    const siblings = [...element.parentElement.children].filter((child) =>
      child.hasAttribute("data-reveal"),
    );
    element.style.setProperty(
      "--reveal-delay",
      `${Math.min(siblings.indexOf(element), 3) * 100}ms`,
    );
    revealObserver.observe(element);
  });
  document.documentElement.classList.add("motion-ready");
}

// Gentle movement in the blurred clinic background while that section is visible.
const appointmentSection = document.querySelector(".appointment-backdrop");
const appointmentBackground = document.querySelector(
  ".appointment-background img",
);
let backgroundFrame = false;
function updateAppointmentBackground() {
  backgroundFrame = false;
  if (motionPreference.matches) {
    appointmentBackground.style.transform = "";
    return;
  }
  const rect = appointmentSection.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > innerHeight) return;
  const offset = Math.max(
    -25,
    Math.min(25, (innerHeight / 2 - rect.top - rect.height / 2) * 0.06),
  );
  appointmentBackground.style.transform = `translateY(${offset}px) scale(1.1)`;
}
addEventListener(
  "scroll",
  () => {
    if (!backgroundFrame) {
      backgroundFrame = true;
      requestAnimationFrame(updateAppointmentBackground);
    }
  },
  { passive: true },
);
updateAppointmentBackground();

// Footer email requests use a reviewable draft, with no simulated subscription.
const updatesDialog = document.querySelector("#footer-updates-dialog");
document
  .querySelector("#footer-updates-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const email = document.querySelector("#footer-email").value.trim();
    document.querySelector("#footer-request-email").textContent = email;
    const body = `Hello Skinic,\n\nI would like to request skin and hair care updates by email.\n\nMy email address: ${email}\n\nPlease let me know whether updates are available. Thank you.`;
    document.querySelector("#footer-updates-draft").href =
      `mailto:apurva.mini@gmail.com?subject=${encodeURIComponent("Email updates request — Skinic")}&body=${encodeURIComponent(body)}`;
    updatesDialog.showModal();
  });
document
  .querySelector("#footer-updates-close")
  .addEventListener("click", () => updatesDialog.close());
updatesDialog.addEventListener("click", (event) => {
  if (event.target !== updatesDialog) return;
  const rect = updatesDialog.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    updatesDialog.close();
});
