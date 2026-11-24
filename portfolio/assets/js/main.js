/* ==========================================================
   MAIN.JS — animações de entrada e transição de página
   ========================================================== */

(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Entrada dos elementos ao rolar ---------- */
  var items = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(function (el) { observer.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Virar página ao clicar em links internos ---------- */
  var turn = document.querySelector(".page-turn");

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!link || !turn || reduceMotion) return;

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;

    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) return;

    var url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();

    var isEnvelope = link.classList.contains("envelope");
    var wait = 0;

    if (isEnvelope) {
      link.classList.add("is-opening"); /* folhas sobem primeiro */
      wait = 350;
    }

    setTimeout(function () {
      turn.classList.add("is-leaving");
    }, wait);

    setTimeout(function () {
      window.location.href = link.href;
    }, wait + 480);
  });

  /* Botão "voltar" do navegador */
  window.addEventListener("pageshow", function (event) {
    if (event.persisted && turn) {
      turn.classList.remove("is-leaving");
      document.querySelectorAll(".is-opening").forEach(function (el) {
        el.classList.remove("is-opening");
      });
    }
  });
})();
