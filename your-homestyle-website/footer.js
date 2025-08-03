document.addEventListener("DOMContentLoaded", () => {
  // Dynamic year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Footer time‑of‑day theme (IST)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 5.5 * 3600000).getHours();
  const footer = document.querySelector(".site-footer");
  if (footer) {
    footer.classList.remove("daytime","evening","night");
    if (ist >= 6 && ist < 17)        footer.classList.add("daytime");
    else if (ist >= 17 && ist < 19)  footer.classList.add("evening");
    else                             footer.classList.add("night");
  }
});
