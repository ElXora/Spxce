document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".navbar-container");
  if (!container || window.location.pathname === "/go") return;
  const links = [
    ["/", '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>', "Home"],
    ["/science", '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10v5M4.5 12.5h5"/><circle cx="15.5" cy="11.5" r=".6"/><circle cx="18" cy="14" r=".6"/>', "Games"],
    ["/math", '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>', "Apps"],
    ["/settings", '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>', "Settings"],
    ["/more", '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>', "More"],
  ];
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  container.innerHTML = `
<nav class="navbar dock">
  <a href="/" class="dock-logo" aria-label="Spxce"><img src="/media/logo.png" alt="Spxce" /></a>
  <span class="dock-sep"></span>
  ${links
    .map(
      ([h, i, t]) =>
        `<a href="${h}" class="navbar-link dock-item${path === h ? " active" : ""}" data-label="${t}" aria-label="${t}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${i}</svg></a>`,
    )
    .join("")}
</nav>`;
});
