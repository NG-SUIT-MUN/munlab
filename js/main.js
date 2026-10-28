/* =========================================================
   Mun Lab — shared script
   - Header / footer (shared by every page)
   - Language switch (EN / JA)
   - Scroll "float up" animations
   - Neural-network background canvas
   ========================================================= */

(function () {
  "use strict";

  var root = document.documentElement;
  var page = document.body.getAttribute("data-page") || "";

  /* ---------- Shared header & footer ---------- */
  var NAV = [
    { id: "home",         href: "index.html",        en: "Home",         ja: "ホーム" },
    { id: "research",     href: "research.html",     en: "Research",     ja: "研究" },
    { id: "education",    href: "education.html",    en: "Education",    ja: "教育" },
    { id: "publications", href: "publications.html", en: "Publications", ja: "業績" },
    { id: "members",      href: "members.html",      en: "Members",      ja: "メンバー" }
  ];

  var LINKS = {
    email:   "ng_m@iwate-pu.ac.jp",
    ipu:     "https://www.soft.iwate-pu.ac.jp/labo/ng-suit-mun%e7%a0%94%e7%a9%b6%e5%ae%a4%e3%80%80ng-suit-mun%e3%80%80ng-suit-mun/"
  };

  function bi(en, ja) {
    return '<span data-l="en">' + en + '</span><span data-l="ja">' + ja + "</span>";
  }

  var brand =
    '<a class="brand" href="index.html" aria-label="Mun Lab home">' +
      '<span class="brand-logo"><img src="assets/logo.svg" alt="" width="42" height="42"></span>' +
      '<span class="brand-text"><span class="brand-name">Mun Lab <small style="font-weight:500;color:var(--ink-3)">ムン研</small></span>' +
      '<span class="brand-sub">' + bi("Iwate Prefectural University", "岩手県立大学") + "</span></span>" +
    "</a>";

  var headerSlot = document.getElementById("site-header");
  if (headerSlot) {
    headerSlot.outerHTML =
      '<header class="site-header"><div class="container header-inner">' + brand +
        '<button class="menu-toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
        '<nav class="nav" aria-label="Main">' +
          NAV.map(function (n) {
            return '<a href="' + n.href + '"' + (n.id === page ? ' class="active" aria-current="page"' : "") + ">" + bi(n.en, n.ja) + "</a>";
          }).join("") +
          '<div class="lang-switch" role="group" aria-label="Language">' +
            '<button type="button" data-set-lang="en">EN</button>' +
            '<button type="button" data-set-lang="ja">JP</button>' +
          "</div>" +
        "</nav>" +
      "</div></header>";
  }

  var footerSlot = document.getElementById("site-footer");
  if (footerSlot) {
    footerSlot.outerHTML =
      '<footer class="site-footer"><div class="container">' +
        '<div class="footer-grid">' +
          "<div>" + brand +
            "<p>" + bi("Faculty of Software and Information Science", "ソフトウェア情報学部") + "</p>" +
          "</div>" +
          "<div><h4>" + bi("Address", "所在地") + "</h4>" +
            '<address class="f-postal">' +
              bi("152-52 Sugo, Takizawa,<br>Iwate 020-0693, Japan", "〒020-0693<br>岩手県滝沢市巣子152-52") +
            "</address>" +
            '<dl class="f-rooms">' +
              "<dt>" + bi("Faculty Office", "教員研究室") + "</dt>" +
              "<dd>" + bi("Block A, 4th Floor, Room 21 (A-4-21)", "A棟4階21号室（A-4-21）") + "</dd>" +
              "<dt>" + bi("Student Lab", "学生研究室") + "</dt>" +
              "<dd>" + bi("Room A20 (Mun Lab)", "A20（ムン研）") + "</dd>" +
            "</dl>" +
          "</div>" +
          "<div><h4>" + bi("Contact", "お問い合わせ") + "</h4><ul>" +
            '<li><a href="mailto:' + LINKS.email + '">' + LINKS.email + "</a></li>" +
            '<li><a href="' + LINKS.ipu + '" target="_blank" rel="noopener">' + bi("IPU Lab Page", "大学の研究室紹介") + "</a></li>" +
          "</ul></div>" +
        "</div>" +
        '<div class="footer-bottom">' +
          '<nav class="footer-nav" aria-label="Footer">' +
            NAV.map(function (n) { return '<a href="' + n.href + '">' + bi(n.en, n.ja) + "</a>"; }).join("") +
          "</nav>" +
          '<div class="copyright">© ' + new Date().getFullYear() + " Mun Lab</div>" +
        "</div>" +
      "</div></footer>";
  }

  /* ---------- Language ---------- */
  function setLang(lang) {
    root.setAttribute("data-lang", lang);
    root.lang = lang;
    try { localStorage.setItem("lang", lang); } catch (e) {}
    document.querySelectorAll("[data-set-lang]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-set-lang") === lang);
    });
    var t = document.body.getAttribute("data-title-" + lang);
    if (t) document.title = t;
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-set-lang]");
    if (b) setLang(b.getAttribute("data-set-lang"));
  });
  setLang(root.getAttribute("data-lang") || "en");

  /* ---------- Header behaviour ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open);
    });
  }

  /* ---------- Split text into words for the float-up effect ---------- */
  document.querySelectorAll(".words").forEach(function (el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          // Latin text splits on spaces; Japanese splits into short chunks
          var parts = child.textContent.match(/[　-ヿ一-鿿＀-￯]{1,3}|[^\s　-ヿ一-鿿＀-￯]+|\s+/g) || [];
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var s = document.createElement("span");
            s.className = "w";
            s.style.setProperty("--i", Math.min(i++, 40));
            s.textContent = p;
            frag.appendChild(s);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          walk(child);
        }
      });
    })(el);
  });

  /* ---------- Reveal on scroll ---------- */
  var targets = document.querySelectorAll(".reveal, .words");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add("in"); });
  }

  /* ---------- Neural network canvas ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".net-canvas").forEach(function (canvas) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = [], w = 0, h = 0, mouse = { x: -9999, y: -9999 }, running = true;
    var LINK = 150;

    function resize() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(110, (w * h) / 14000));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.8 + 1.2
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        if (!reduceMotion) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > w) a.vx *= -1;
          if (a.y < 0 || a.y > h) a.vy *= -1;
        }
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = "rgba(47,151,224," + (0.22 * (1 - d / LINK)) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        // highlight connections near the mouse
        var mx = a.x - mouse.x, my = a.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
        if (md < 180) {
          ctx.strokeStyle = "rgba(27,123,194," + (0.35 * (1 - md / 180)) + ")";
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = md < 180 ? "rgba(27,123,194,.9)" : "rgba(47,151,224,.55)";
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      if (running && !reduceMotion) requestAnimationFrame(draw);
    }

    var host = canvas.parentElement;
    host.addEventListener("mousemove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      if (reduceMotion) draw();
    });
    host.addEventListener("mouseleave", function () { mouse.x = mouse.y = -9999; });

    // pause when off-screen to save battery
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        var vis = es[0].isIntersecting;
        if (vis && !running) { running = true; if (!reduceMotion) requestAnimationFrame(draw); }
        running = vis;
      }).observe(canvas);
    }

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { resize(); if (reduceMotion) draw(); }, 150);
    });

    resize();
    draw();
  });
})();
