(() => {
  "use strict";
  const C = window.UNIVEX_CONFIG || {};
  const SKIP = "[data-instagram],[data-instagram-handle],#current-year,#message-count,#form-status";
  const SEL = "h1,h2,h3,p,li,a,label,small,strong,button,span";
  const PRIM = "h1,h2,h3,p,li,a,label,small,strong,button";
  const pageName = (p = location.pathname) => (p.split("/").pop() || "index.html").replace(/\.html$/, "") || "index";

  function isCand(el) {
    if (el.closest(SKIP) || el.querySelector("img") || el.matches(".menu-toggle,.skip-link")) return false;
    if (el.tagName === "SPAN" && el.parentElement.closest(PRIM) && !el.matches(".brand-name")) return false;
    return !!el.textContent.trim();
  }
  function fields(doc, page) {
    const cnt = {}, out = [];
    doc.body.querySelectorAll(SEL).forEach((el) => {
      if (!isCand(el) || [...el.querySelectorAll(SEL)].some(isCand)) return;
      const z = el.closest("header") ? "global.header" : el.closest("footer") ? "global.footer" : el.closest("#contato") ? "global.contato" : page;
      cnt[z] = (cnt[z] || 0) + 1;
      out.push({ key: `${z}.${cnt[z]}`, el });
    });
    return out;
  }
  function clean(html) {
    const t = document.createElement("template");
    t.innerHTML = html;
    t.content.querySelectorAll("script,iframe,object,embed,style,link,meta").forEach((n) => n.remove());
    t.content.querySelectorAll("*").forEach((n) => [...n.attributes].forEach((a) => {
      if (/^on/i.test(a.name) || /^\s*javascript:/i.test(a.value)) n.removeAttribute(a.name);
    }));
    return t.innerHTML;
  }
  async function load() {
    if (!C.supabaseUrl || !C.supabaseKey) return {};
    try {
      const r = await fetch(`${C.supabaseUrl}/rest/v1/site_content?select=key,value`, { headers: { apikey: C.supabaseKey } });
      return Object.fromEntries((await r.json()).map((x) => [x.key, x.value]));
    } catch (e) { return {}; }
  }
  window.CMS = { fields, clean, load, pageName };
  if (window.CMS_NO_AUTO) return;

  load().then((data) => {
    const page = pageName();
    fields(document, page).forEach(({ key, el }) => { if (key in data) el.innerHTML = clean(data[key]); });
    document.querySelectorAll("img").forEach((img) => {
      const k = "img:" + img.getAttribute("src");
      if (data[k]) img.src = data[k];
    });
    if (data[page + ":title"]) document.title = data[page + ":title"];
    const y = document.getElementById("current-year");
    if (y) y.textContent = String(new Date().getFullYear());
  });
})();
