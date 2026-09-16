(function () {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;

      var hash = a.getAttribute("href");
      if (hash === "#" || hash === "") return;

      var target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", hash);
      }
    });

    window.addEventListener("load", function () {
      if (location.hash) {
        var el = document.querySelector(location.hash);
        if (el) {
          setTimeout(function () {
            el.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    });
  })();

   (function () {
        function setStatus(msg) {
          document.querySelectorAll("#share-status").forEach(function (el) {
            el.textContent = msg;
            clearTimeout(el._timer);
            el._timer = setTimeout(function () {
              el.textContent = "";
            }, 5000);
          });
        }
        function currentUrl() {
          return window.location.href;
        }
        async function copiarEnlace() {
          const url = currentUrl();
          try {
            if (navigator.clipboard && window.isSecureContext) {
              await navigator.clipboard.writeText(url);
              setStatus("✓ Enlace copiado correctamente.");
              return true;
            }
          } catch (e) {}
          try {
            const ta = document.createElement("textarea");
            ta.value = url;
            ta.setAttribute("readonly", "");
            ta.style.position = "fixed";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand("copy");
            document.body.removeChild(ta);
            if (ok) {
              setStatus("✓ Enlace copiado correctamente.");
              return true;
            }
          } catch (e) {}
          setStatus(
            "No se pudo copiar automáticamente. Usa la opción Compartir del navegador.",
          );
          return false;
        }
        async function compartir() {
          const url = currentUrl();
          const data = {
            title: "Conferencia Anual Barrio Los Teques 2026",
            text: "¡Te damos la bienvenida! Conferencia Anual Barrio Los Teques 2026. Mira la invitación digital:",
            url: url,
          };
          if (typeof navigator.share === "function") {
            try {
              await navigator.share(data);
              setStatus("✓ Invitación compartida.");
              return;
            } catch (e) {
              if (e && e.name === "AbortError") return;
            }
          }
          const waUrl =
            "https://wa.me/?text=" + encodeURIComponent(data.text + " " + url);
          const w = window.open(waUrl, "_blank", "noopener,noreferrer");
          if (w) {
            setStatus("✓ WhatsApp abierto con el mensaje preparado.");
            return;
          }
          await copiarEnlace();
        }
        document.querySelectorAll(".share-action").forEach(function (btn) {
          btn.addEventListener("click", compartir);
        });
        document.querySelectorAll(".share-copy").forEach(function (btn) {
          btn.addEventListener("click", copiarEnlace);
        });
      })();