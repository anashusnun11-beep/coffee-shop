// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const links = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
  links.classList.toggle("open", !open);
});

links.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    links.classList.remove("open");
  }
});

// Header shadow on scroll
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Menu tabs (with arrow-key support)
const tabs = [...document.querySelectorAll('[role="tab"]')];

function selectTab(tab) {
  tabs.forEach((t) => {
    const selected = t === tab;
    t.setAttribute("aria-selected", String(selected));
    t.tabIndex = selected ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
  });
  tab.focus();
}

tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") selectTab(tabs[(i + 1) % tabs.length]);
    if (e.key === "ArrowLeft") selectTab(tabs[(i - 1 + tabs.length) % tabs.length]);
  });
});

// Open / closed status based on local time
const hours = {
  0: [8, 16],      // Sunday
  6: [7.5, 18],    // Saturday
  default: [6.5, 18],
};

function updateOpenStatus() {
  const el = document.getElementById("open-status");
  const now = new Date();
  const [open, close] = hours[now.getDay()] || hours.default;
  const time = now.getHours() + now.getMinutes() / 60;
  const isOpen = time >= open && time < close;
  el.textContent = isOpen ? "Open now — come on in" : "Closed right now — see you soon";
  el.className = "open-status " + (isOpen ? "open" : "closed");
}
updateOpenStatus();
setInterval(updateOpenStatus, 60_000);

// Newsletter signup (demo only — no backend)
const form = document.getElementById("signup");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = form.querySelector(".form-msg");
  const email = form.email.value.trim();
  msg.textContent = `Thanks! Your free-drink coupon is on its way to ${email}.`;
  form.reset();
});

// Reveal sections as they scroll into view
const revealTargets = document.querySelectorAll(".feature, .section-head, .item, .story-grid > *, .review, .visit-grid > *");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
