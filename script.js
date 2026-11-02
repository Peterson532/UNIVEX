(() => {
  "use strict";
  document.documentElement.classList.add("js-ready");

  const config = window.UNIVEX_CONFIG || {};
  const contactEmail = typeof config.email === "string" ? config.email.trim() : "";
  const whatsappNumber = typeof config.whatsapp === "string" ? config.whatsapp.replace(/\D/g, "") : "";
  const instagramUser = typeof config.instagram === "string" ? config.instagram.replace(/^@/, "").trim() : "";

  // Mobile navigation
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (menuToggle && navLinks) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      navLinks.classList.remove("is-open");
    };
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      navLinks.classList.toggle("is-open", open);
    });
    navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  }

  function isConfiguredEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !/exemplo|example|seuemail|seudominio/i.test(value);
  }

  function setFormStatus(text, isError = false) {
    const status = document.getElementById("form-status");
    if (!status) return;
    status.textContent = text;
    status.classList.toggle("is-error", isError);
    status.setAttribute("role", isError ? "alert" : "status");
  }

  // WhatsApp
  const whatsappLink = document.getElementById("whatsapp-link");
  if (whatsappLink) {
    if (/^\d{10,15}$/.test(whatsappNumber)) {
      whatsappLink.href = `https://wa.me/${whatsappNumber}`;
      whatsappLink.target = "_blank";
      whatsappLink.rel = "noopener noreferrer";
    } else {
      whatsappLink.href = "#contato";
      whatsappLink.addEventListener("click", (event) => {
        event.preventDefault();
        setFormStatus("O WhatsApp ainda não está configurado. Defina o número no arquivo config.js antes de publicar.", true);
      });
    }
  }

  // Instagram
  const instagramLinks = document.querySelectorAll("[data-instagram]");
  instagramLinks.forEach((link) => {
    if (instagramUser) {
      link.href = `https://instagram.com/${instagramUser}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      const handle = link.querySelector("[data-instagram-handle]");
      if (handle) handle.textContent = `@${instagramUser}`;
    } else {
      link.href = "#contato";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        setFormStatus("O Instagram ainda não foi configurado. Defina o usuário no arquivo config.js antes de publicar.", true);
      });
    }
  });

  // Email
  const emailLink = document.getElementById("email-link");
  if (emailLink) {
    if (isConfiguredEmail(contactEmail)) {
      emailLink.href = `mailto:${contactEmail}`;
    } else {
      emailLink.href = "#contato";
      emailLink.addEventListener("click", (event) => {
        event.preventDefault();
        setFormStatus("O e-mail de recebimento ainda não foi configurado. Defina-o no arquivo config.js antes de publicar.", true);
      });
    }
  }

  // Form
  const form = document.getElementById("contact-form");
  const message = document.getElementById("mensagem");
  const count = document.getElementById("message-count");

  if (message && count) {
    const updateCount = () => { count.textContent = `${message.value.length}/1500`; };
    message.addEventListener("input", updateCount);
    updateCount();
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      if (!isConfiguredEmail(contactEmail)) {
        setFormStatus("Suas respostas estão preenchidas, mas ainda não foram enviadas. Configure um e-mail real em config.js para ativar o recebimento.", true);
        return;
      }

      const data = new FormData(form);
      const subject = `Contato pelo site UNIVEX — ${String(data.get("tipo-projeto") || "Novo projeto")}`;
      const body = [
        "Olá, UNIVEX! Gostaria de conversar sobre um projeto.",
        "",
        `Nome: ${String(data.get("nome") || "").trim()}`,
        `E-mail para retorno: ${String(data.get("email") || "").trim()}`,
        `Tipo de projeto: ${String(data.get("tipo-projeto") || "")}`,
        "",
        "Sobre a ideia:",
        String(data.get("mensagem") || "").trim()
      ].join("\n");
      setFormStatus("Abrindo seu aplicativo de e-mail com a mensagem preenchida. Revise e envie para concluir.");
      window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  // Reveal on scroll
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();