// ═══════════════════════════════════════════════════════════════════
// PAGE-DIGEST.JS — Daily Current Affairs Digest
// ═══════════════════════════════════════════════════════════════════

function pgDigest() {
  var w = el("div", { cls: "fd" });
  w.appendChild(makeNav("digest"));

  var CATS = [
    { id: "national",  label: "National",   icon: "🇮🇳", color: "#4F8EF7", desc: "Top stories from across India — politics, society, governance and major national events.", topics: ["Politics", "Governance", "Society", "Infrastructure", "Defence"], sym: ["🏛️","🗳️","🚆","🛡️","📜","🏙️"] },
    { id: "govt",      label: "Govt / PIB", icon: "🏛️", color: "#8b5cf6", desc: "Official government press releases, cabinet decisions, new schemes and policy announcements.", topics: ["Cabinet", "Schemes", "Policy", "PIB", "Ministry"], sym: ["📋","⚖️","🔔","🗂️","📢","🏗️"] },
    { id: "economy",   label: "Economy",    icon: "📈", color: "#f59e0b", desc: "RBI updates, GDP data, budget news, trade, markets and India's economic developments.", topics: ["RBI", "GDP", "Budget", "Trade", "Markets"], sym: ["💰","🏦","📊","💹","🪙","💴"] },
    { id: "science",   label: "Science",    icon: "🔬", color: "#4ade80", desc: "ISRO missions, DRDO breakthroughs, health, technology and scientific discoveries in India.", topics: ["ISRO", "DRDO", "Health", "Technology", "Space"], sym: ["🚀","⚛️","🧬","🛸","🔭","💡"] },
    { id: "world",     label: "World",      icon: "🌐", color: "#f87171", desc: "India's foreign relations, global summits, UN updates and major international events.", topics: ["UN", "G20", "Foreign Policy", "Summits", "Global"], sym: ["✈️","🌍","🤝","🗺️","🌐","🕊️"] }
  ];

  // Single container — we swap content in-place instead of re-calling go()
  var contentWrap = el("div", {});

  // ── MAIN CATEGORY LIST ──
  function showMain() {
    contentWrap.innerHTML = "";
    var wrap = el("div", { css: { maxWidth: "780px", margin: "0 auto", paddingBottom: "48px" } });

    var hd = el("div", { css: { textAlign: "center", marginBottom: "32px" } });
    hd.appendChild(el("div", { css: { fontSize: ".6rem", color: "var(--subtle)", textTransform: "uppercase", letterSpacing: ".18em", fontWeight: "700", marginBottom: "10px", fontFamily: "var(--font-display)" }, txt: "Stay Informed" }));
    hd.appendChild(el("div", { css: { fontSize: "1.9rem", fontWeight: "800", letterSpacing: "-.04em", fontFamily: "var(--font-display)" }, txt: "Daily Current Affairs" }));
    hd.appendChild(el("div", { css: { fontSize: ".85rem", color: "var(--muted)", marginTop: "8px" }, txt: "Live news from top sources — updated every day" }));
    wrap.appendChild(hd);

    CATS.forEach(function (cat, idx) {
      var isOdd = idx % 2 === 0;
      var row = el("div", {
        css: {
          display: "flex", alignItems: "stretch", gap: "0",
          marginBottom: "20px", borderRadius: "20px", overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,.25)", cursor: "pointer", minHeight: "180px",
          transition: "all .25s ease"
        },
        onclick: function () { showSub(cat); }
      });
      row.addEventListener("mouseenter", function () { this.style.transform = "translateY(-4px)"; this.style.boxShadow = "0 16px 48px rgba(0,0,0,.35)"; });
      row.addEventListener("mouseleave", function () { this.style.transform = "translateY(0)"; this.style.boxShadow = "0 8px 32px rgba(0,0,0,.25)"; });

      var symPanel = el("div", { css: { width: "180px", flexShrink: "0", background: "var(--card2)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", order: isOdd ? "0" : "2", borderRight: isOdd ? "1px solid var(--border)" : "none", borderLeft: isOdd ? "none" : "1px solid var(--border)" } });
      symPanel.appendChild(el("div", { css: { fontSize: "5rem", opacity: ".15", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }, txt: cat.icon }));
      var positions = [[10,10],[60,5],[80,55],[15,70],[50,80],[75,20]];
      cat.sym.forEach(function (sym, si) {
        var pos = positions[si] || [50, 50];
        symPanel.appendChild(el("div", { css: { position: "absolute", fontSize: "1.3rem", opacity: ".25", left: pos[0] + "%", top: pos[1] + "%" } }, sym));
      });
      symPanel.appendChild(el("div", { css: { position: "relative", zIndex: "1", fontSize: "3.5rem", filter: "drop-shadow(0 4px 12px rgba(0,0,0,.2))" } }, cat.icon));

      var content = el("div", { css: { flex: "1", background: "var(--card)", padding: "28px 32px", display: "flex", flexDirection: "column", justifyContent: "center", order: "1", borderLeft: isOdd ? "none" : "3px solid " + cat.color, borderRight: isOdd ? "3px solid " + cat.color : "none" } });
      var ctop = el("div", { css: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" } });
      ctop.appendChild(el("div", { css: { fontSize: "1.4rem", fontWeight: "800", letterSpacing: "-.04em", fontFamily: "var(--font-display)", color: "var(--text)" }, txt: cat.label }));
      ctop.appendChild(el("span", { css: { fontSize: ".65rem", fontWeight: "700", padding: "3px 10px", borderRadius: "6px", background: cat.color + "20", color: cat.color, letterSpacing: ".06em", fontFamily: "var(--font-display)" } }, "LIVE"));
      content.appendChild(ctop);
      content.appendChild(el("div", { css: { fontSize: ".92rem", color: "var(--muted)", lineHeight: "1.65", marginBottom: "14px", fontWeight: "300" }, txt: cat.desc }));

      var chips = el("div", { css: { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" } });
      cat.topics.forEach(function (t) {
        chips.appendChild(el("span", { css: { fontSize: ".68rem", fontWeight: "600", padding: "3px 10px", borderRadius: "6px", background: cat.color + "18", color: cat.color, border: "1px solid " + cat.color + "28", fontFamily: "var(--font-display)", letterSpacing: "0.02em" } }, t));
      });
      content.appendChild(chips);
      content.appendChild(el("span", { css: { fontSize: ".82rem", fontWeight: "700", color: cat.color, fontFamily: "var(--font-display)" } }, "Read Latest News →"));

      if (isOdd) { row.appendChild(symPanel); row.appendChild(content); }
      else { row.appendChild(content); row.appendChild(symPanel); }
      wrap.appendChild(row);
    });

    contentWrap.appendChild(wrap);
    window.scrollTo(0, 0);
  }

  // ── SUBPAGE ──
  function showSub(cat) {
    // Push a recoverable state BEFORE swapping content
    // digestView:"main" means: if popstate fires with this state, show main
    history.pushState({ page: "digest", sub: null, digestView: "main" }, "");

    contentWrap.innerHTML = "";
    window.scrollTo(0, 0);

    var wrap = el("div", { css: { maxWidth: "780px", margin: "0 auto", paddingBottom: "48px" } });

    var topBar = el("div", { css: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" } });

    var backBtn = el("button", {
      css: {
        padding: "10px 18px", borderRadius: "12px", border: "1.5px solid var(--border2)",
        background: "var(--bg2)", color: "var(--text)", fontWeight: "600",
        fontSize: ".9rem", cursor: "pointer", fontFamily: "var(--font-body)",
        transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px", flexShrink: "0"
      },
      onclick: function () { history.back(); }
    });
    backBtn.innerHTML = '<span style="font-size:1.1rem;line-height:1;">←</span> Back';
    backBtn.addEventListener("mouseenter", function () { this.style.background = "var(--border)"; });
    backBtn.addEventListener("mouseleave", function () { this.style.background = "var(--bg2)"; });

    var titleWrap = el("div");
    titleWrap.appendChild(el("div", { css: { fontSize: ".7rem", color: cat.color, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: "700", marginBottom: "2px" } }, "Daily Digest"));
    titleWrap.appendChild(el("div", { css: { fontSize: "1.5rem", fontWeight: "800", fontFamily: "var(--font-display)" } }, cat.icon + " " + cat.label + " News"));

    topBar.appendChild(backBtn);
    topBar.appendChild(titleWrap);
    wrap.appendChild(topBar);

    var panel = el("div", { css: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px", boxShadow: "var(--shadow-card)" } });
    var newsWrap = el("div", {});
    newsWrap.innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);font-size:.9rem">⏳ Fetching latest news...</div>';
    panel.appendChild(newsWrap);
    wrap.appendChild(panel);
    contentWrap.appendChild(wrap);

    // Fetch
    var todayStr = new Date().toDateString();
    var cacheKey = "digest_daily_" + cat.id;
    var cachedData = Sv.get(cacheKey) || { date: "", articles: [] };
    if (cachedData.date !== todayStr) cachedData = { date: todayStr, articles: [] };

    var feeds    = (typeof CA_FEEDS    !== "undefined" && CA_FEEDS[cat.id])    ? CA_FEEDS[cat.id]    : [];
    var fallback = (typeof CA_FALLBACK !== "undefined" && CA_FALLBACK[cat.id]) ? CA_FALLBACK[cat.id] : [];

    function renderArticles(articles) {
      newsWrap.innerHTML = "";
      if (!articles || !articles.length) {
        newsWrap.innerHTML = '<div style="padding:30px;text-align:center;color:var(--muted)">No articles found for today.</div>';
        return;
      }
      articles.slice(0, 50).forEach(function (a, i) {
        var isLast = i === Math.min(articles.length, 50) - 1;
        var item = el("div", { css: { padding: "14px 10px", borderBottom: isLast ? "none" : "1px solid var(--border)", cursor: "pointer", transition: "all 0.2s" }, onclick: function () { if (a.url && a.url !== "#") window.open(a.url, "_blank"); } });
        item.addEventListener("mouseenter", function () { this.style.background = "var(--card2)"; this.style.borderRadius = "10px"; this.style.transform = "translateX(4px)"; });
        item.addEventListener("mouseleave", function () { this.style.background = "transparent"; this.style.transform = "translateX(0)"; });

        var row = el("div", { css: { display: "flex", gap: "12px", alignItems: "flex-start" } });
        row.appendChild(el("div", { css: { minWidth: "8px", height: "8px", borderRadius: "50%", background: cat.color, marginTop: "8px", flexShrink: "0", boxShadow: "0 0 8px " + cat.color + "60" } }));

        var txt = el("div", { css: { flex: "1" } });
        txt.appendChild(el("div", { css: { fontSize: ".95rem", fontWeight: "600", lineHeight: "1.5", color: "var(--text)", marginBottom: "6px" }, txt: a.title }));

        var meta = el("div", { css: { display: "flex", gap: "10px", alignItems: "center" } });
        if (a.source) meta.appendChild(el("span", { css: { fontSize: ".7rem", color: cat.color, fontWeight: "700", background: cat.color + "15", padding: "3px 8px", borderRadius: "6px" } }, a.source));
        if (a.pubDate) {
          var d = new Date(a.pubDate);
          if (!isNaN(d)) meta.appendChild(el("span", { css: { fontSize: ".7rem", color: "var(--subtle)" } }, d.toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })));
        }
        txt.appendChild(meta);
        row.appendChild(txt);
        item.appendChild(row);
        newsWrap.appendChild(item);
      });
    }

    if (cachedData.articles.length > 0) renderArticles(cachedData.articles);

    function tryFeed(i) {
      if (i >= feeds.length) { if (cachedData.articles.length === 0) renderArticles(fallback); return; }
      fetch(feeds[i].url)
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.items && data.items.length) {
            var newArticles = data.items.map(function (item) {
              return { title: item.title, url: item.link, source: feeds[i].name, pubDate: item.pubDate };
            });
            var allArticles = newArticles.concat(cachedData.articles);
            var uniqueArticles = [], seenUrls = {};
            allArticles.forEach(function (a) {
              if (a.url && !seenUrls[a.url]) { seenUrls[a.url] = true; uniqueArticles.push(a); }
            });
            uniqueArticles.sort(function (a, b) {
              return (new Date(b.pubDate).getTime() || 0) - (new Date(a.pubDate).getTime() || 0);
            });
            cachedData.articles = uniqueArticles;
            Sv.set(cacheKey, cachedData);
            renderArticles(uniqueArticles);
          } else { tryFeed(i + 1); }
        })
        .catch(function () { tryFeed(i + 1); });
    }
    tryFeed(0);
  }

  // ── POPSTATE LISTENER ──
  // Listens for hardware back button while digest is mounted.
  // Auto-cleans itself when the digest page is removed from DOM.
  function onPopState(e) {
    if (!w.isConnected) {
      window.removeEventListener("popstate", onPopState);
      return;
    }
    if (e.state && e.state.digestView === "main") {
      showMain();
    }
  }
  window.addEventListener("popstate", onPopState);

  // Initial view
  if (sub) {
    var initCat = CATS.find(function (c) { return c.id === sub; });
    if (initCat) { showSub(initCat); } else { showMain(); }
    sub = null;
  } else {
    showMain();
  }

  w.appendChild(contentWrap);
  return w;
}