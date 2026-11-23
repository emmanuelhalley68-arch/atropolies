"use strict";

/*
  ATROPOLIS FRONT-END DEMO
  This file is a static front end. Do not treat browser-side controls as secure
  authentication, upload moderation, payment processing, analytics or storage.
  Production requires HTTPS hosting, server-side validation, database, access
  control, rate limiting, CSRF protection, secure sessions and monitored backups.
*/
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const toast = (message) => {
  const node = $("#toast");
  node.textContent = message;
  node.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => node.classList.remove("show"), 3200);
};

function navigate() {
  const raw = location.hash.replace(/^#/, "") || "home";
  const target = document.getElementById(raw);
  $$(".page").forEach(page => page.classList.toggle("active", page === target));
  if (!target) $("#not-found").classList.add("active");
  $("#primary-navigation").classList.remove("open");
  $("#menu-toggle").setAttribute("aria-expanded", "false");
  window.scrollTo({top:0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
}
window.addEventListener("hashchange", navigate);
window.addEventListener("DOMContentLoaded", navigate);

$("#menu-toggle").addEventListener("click", () => {
  const nav = $("#primary-navigation");
  const open = nav.classList.toggle("open");
  $("#menu-toggle").setAttribute("aria-expanded", String(open));
});
$("#theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const enabled = document.body.classList.contains("dark");
  $("#theme-toggle").setAttribute("aria-pressed", String(enabled));
  toast(enabled ? "Dark mode enabled for this session." : "Light mode enabled.");
});
$("#search-focus").addEventListener("click", () => {
  location.hash = "home";
  window.setTimeout(() => $("#site-search").focus(), 80);
});

const searchableCards = () => $$(".searchable");
function performSearch(query) {
  const q = query.trim().toLowerCase();
  const matches = searchableCards().filter(card => (card.innerText + " " + (card.dataset.search || "")).toLowerCase().includes(q));
  $("#search-heading").textContent = `Results for “${query}” — ${matches.length} result(s)`;
  const output = $("#search-output");
  output.innerHTML = "";
  matches.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.remove("hidden");
    output.appendChild(clone);
  });
  if (!matches.length) output.innerHTML = '<div class="empty-state">No matching content yet. Try a different search term.</div>';
  location.hash = "search-results";
}
$("#global-search").addEventListener("submit", event => {
  event.preventDefault();
  const query = $("#site-search").value;
  if (query.trim()) performSearch(query);
});
function applySearch(inputSelector, cardSelector) {
  const input = $(inputSelector);
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    $$(cardSelector).forEach(card => card.classList.toggle("hidden", !(`${card.innerText} ${card.dataset.search || ""}`).toLowerCase().includes(q)));
  });
}
applySearch("#pdf-search", ".pdf-card");
applySearch("#game-search", ".game-card");
applySearch("#movie-search", ".movie-card");

$$(".filter-btn").forEach(button => button.addEventListener("click", () => {
  const group = button.dataset.group;
  $$(`.filter-btn[data-group="${group}"]`).forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  const value = button.dataset.filter;
  const selector = group === "pdf" ? ".pdf-card" : group === "game" ? ".game-card" : ".movie-card";
  const key = group === "pdf" ? "category" : group === "game" ? "game" : "kind";
  $$(selector).forEach(card => card.classList.toggle("hidden", value !== "all" && card.dataset[key] !== value));
}));

$("#pdf-sort").addEventListener("change", event => {
  const grid = $("#pdf-grid");
  const cards = $$(".pdf-card", grid);
  if (event.target.value === "az") cards.sort((a,b) => a.dataset.title.localeCompare(b.dataset.title));
  else cards.sort((a,b) => a.dataset.title.localeCompare(b.dataset.title));
  cards.forEach(card => grid.appendChild(card));
});

document.addEventListener("click", async event => {
  const download = event.target.closest(".download-placeholder");
  if (download) { toast("This is a sample listing. Add the real authorised PDF file before enabling downloads."); return; }
  const save = event.target.closest(".save-btn");
  if (save) {
    const active = save.getAttribute("aria-pressed") !== "true";
    save.setAttribute("aria-pressed", String(active));
    save.textContent = active ? "★ Saved" : "☆ Save";
    toast(active ? "Saved in this page session only." : "Removed from this page session.");
    return;
  }
  const share = event.target.closest(".share-btn");
  if (share) {
    const title = share.closest(".card").querySelector("h3")?.textContent || "Atropolis";
    const url = location.href;
    if (navigator.share) {
      try { await navigator.share({title, text:`Explore ${title} on Atropolis`, url}); } catch (_) {}
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(`${title} — ${url}`);
      toast("Share link copied.");
    } else toast("Use your browser's address bar to copy this page link.");
  }
  const review = event.target.closest(".review-open");
  if (review) {
    $("#review-dialog-title").textContent = review.dataset.title;
    $("#review-dialog").showModal();
  }
});
$("#close-review").addEventListener("click", () => $("#review-dialog").close());
$("#review-dialog").addEventListener("click", event => {
  if (event.target === $("#review-dialog")) $("#review-dialog").close();
});

function openWhatsApp(message) {
  const phone = "254795158813"; // Official Atropolis WhatsApp contact.
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
$("#quote-request").addEventListener("submit", event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  openWhatsApp(`Atropolis website quote request\nName: ${data.name}\nBusiness: ${data.business}\nWebsite type: ${data.type}\nBudget: ${data.budget}\nWhatsApp: ${data.phone}\nMessage: ${data.message || "Not provided"}`);
});
$("#construction-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  openWhatsApp(`Construction launch interest\nName: ${$("#c-name").value}\nPhone: ${$("#c-phone").value}\nProject: ${$("#c-project").value}`);
});
$("#idea-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const message = `Innovation idea\nName: ${$("#i-name").value}\nIdea: ${$("#i-title").value}\nProblem: ${$("#i-problem").value}`;
  const subject = encodeURIComponent("Atropolis innovation idea");
  window.location.href = `mailto:emmanuelhalley68@gmail.com?subject=${subject}&body=${encodeURIComponent(message)}`;
});
$("#contact-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const body = `Name: ${$("#ct-name").value}\nContact: ${$("#ct-contact").value}\nSubject: ${$("#ct-subject").value}\n\n${$("#ct-message").value}`;
  window.location.href = `mailto:emmanuelhalley68@gmail.com?subject=${encodeURIComponent("Atropolis enquiry")}&body=${encodeURIComponent(body)}`;
});
$("#report-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const body = `Name: ${$("#r-name").value}\nEmail: ${$("#r-email").value}\nOriginal work: ${$("#r-work").value}\nReported URL: ${$("#r-infringing").value}\nExplanation: ${$("#r-proof").value}`;
  window.location.href = `mailto:emmanuelhalley68@gmail.com?subject=${encodeURIComponent("Copyright / content report")}&body=${encodeURIComponent(body)}`;
});
$("#newsletter-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  toast("Demo only: connect a newsletter provider and obtain the required consent before collecting email addresses.");
  event.currentTarget.reset();
});
$("#year").textContent = new Date().getFullYear();
