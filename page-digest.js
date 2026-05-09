// ═══════════════════════════════════════════════════════════════════
// PAGE-DIGEST.JS — Daily Current Affairs Digest
// Large vertical cards like subject cards, one per news category
// ═══════════════════════════════════════════════════════════════════

function pgDigest() {
  var w = el("div", { cls: "fd" });
  w.appendChild(makeNav("digest"));

  var wrap = el("div", { css: { maxWidth: "780px", margin: "0 auto", paddingBottom: "48px" } });

  // ── HEADER ──
  var hd = el("div", { css: { textAlign: "center", marginBottom: "32px" } });
  hd.appendChild(el("div", { css: { fontSize: ".6rem", color: "var(--subtle)", textTransform: "uppercase", letterSpacing: ".18em", fontWeight: "700", marginBottom: "10px", fontFamily: "var(--font-display)" }, txt: "Stay Informed" }));
  hd.appendChild(el("div", { css: { fontSize: "1.9rem", fontWeight: "800", letterSpacing: "-.04em", fontFamily: "var(--font-display)" }, txt: "Daily Current Affairs" }));
  hd.appendChild(el("div", { css: { fontSize: ".85rem", color: "var(--muted)", marginTop: "8px" }, txt: "Live news from top sources — updated every day" }));
  wrap.appendChild(hd);

  var CATS = [
    { id: "national",  label: "National",   icon: "🇮🇳", color: "#4F8EF7", desc: "Top stories from across India — politics, society, governance and major national events.", topics: ["Politics", "Governance", "Society", "Infrastructure", "Defence"], sym: ["🏛️","🗳️","🚆","🛡️","📜","🏙️"] },
    { id: "govt",      label: "Govt / PIB", icon: "🏛️", color: "#8b5cf6", desc: "Official government press releases, cabinet decisions, new schemes and policy announcements.", topics: ["Cabinet", "Schemes", "Policy", "PIB", "Ministry"], sym: ["📋","⚖️","🔔","🗂️","📢","🏗️"] },
    { id: "economy",   label: "Economy",    icon: "📈", color: "#f59e0b", desc: "RBI updates, GDP data, budget news, trade, markets and India's economic developments.", topics: ["RBI", "GDP", "Budget", "Trade", "Markets"], sym: ["💰","🏦","📊","💹","🪙","💴"] },
    { id: "science",   label: "Science",    icon: "🔬", color: "#4ade80", desc: "ISRO missions, DRDO breakthroughs, health, technology and scientific discoveries in India.", topics: ["ISRO", "DRDO", "Health", "Technology", "Space"], sym: ["🚀","⚛️","🧬","🛸","🔭","💡"] },
    { id: "world",     label: "World",      icon: "🌐", color: "#f87171", desc: "India's foreign relations, global summits, UN updates and major international events.", topics: ["UN", "G20", "Foreign Policy", "Summits", "Global"], sym: ["✈️","🌍","🤝","🗺️","🌐","🕊️"] }
  ];

  CATS.forEach(function (cat, idx) {
    var isOdd = idx % 2 === 0;
    var row = el("div", {
      css: {
        display: "flex", alignItems: "stretch", gap: "0",
        marginBottom: "20px", borderRadius: "20px", overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,.25)", cursor: "pointer", minHeight: "180px",
        transition: "all .25s ease"
      },
      onclick: function () { openDigestCategory(cat, row); }
    });
    row.addEventListener("mouseenter", function () { this.style.transform = "translateY(-4px)"; this.style.boxShadow = "0 16px 48px rgba(0,0,0,.35)"; });
    row.addEventListener("mouseleave", function () { this.style.transform = "translateY(0)"; this.style.boxShadow = "0 8px 32px rgba(0,0,0,.25)"; });

    // Symbol panel
    var symPanel = el("div", { css: { width: "180px", flexShrink: "0", background: "var(--card2)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", order: isOdd ? "0" : "2", borderRight: isOdd ? "1px solid var(--border)" : "none", borderLeft: isOdd ? "none" : "1px solid var(--border)" } });
    symPanel.appendChild(el("div", { css: { fontSize: "5rem", opacity: ".15", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }, txt: cat.icon }));
    var positions = [[10,10],[60,5],[80,55],[15,70],[50,80],[75,20]];
    cat.sym.forEach(function (sym, si) {
      var pos = positions[si] || [50, 50];
      symPanel.appendChild(el("div", { css: { position: "absolute", fontSize: "1.3rem", opacity: ".25", left: pos[0] + "%", top: pos[1] + "%" } }, sym));
    });
    symPanel.appendChild(el("div", { css: { position: "relative", zIndex: "1", fontSize: "3.5rem", filter: "drop-shadow(0 4px 12px rgba(0,0,0,.2))" } }, cat.icon));

    // Content panel
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

  w.appendChild(wrap);
  return w;
}

// ── OPEN CATEGORY NEWS ──
function openDigestCategory(cat, parentRow) {
  // Remove any existing news panel
  var existing = document.getElementById("digest-news-panel");
  if (existing) existing.remove();

  var panel = el("div", { css: {
    background: "var(--card)", border: "1px solid var(--border)",
    borderRadius: "16px", padding: "22px", marginTop: "12px",
    marginBottom: "8px"
  }});
  panel.id = "digest-news-panel";

  // Panel header
  var ph = el("div", { css: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" } });
  ph.appendChild(el("div", { css: { fontSize: "1rem", fontWeight: "700", color: cat.color } }, cat.icon + " " + cat.label + " News"));
  var closeBtn = el("button", { cls: "btn btng", css: { padding: "4px 10px", fontSize: ".75rem" }, onclick: function () { panel.remove(); } }, "✕ Close");
  ph.appendChild(closeBtn);
  panel.appendChild(ph);

  // Loading state
  var newsWrap = el("div", {});
  newsWrap.innerHTML = '<div style="padding:30px;text-align:center;color:var(--muted);font-size:.85rem">⏳ Fetching latest news...</div>';
  panel.appendChild(newsWrap);

  // Insert panel after clicked row
  parentRow.parentNode.insertBefore(panel, parentRow.nextSibling);

  // Fetch news
  var feeds = CA_FEEDS[cat.id] || [];
  var fallback = CA_FALLBACK[cat.id] || [];

  function renderArticles(articles) {
    newsWrap.innerHTML = "";
    if (!articles || !articles.length) {
      newsWrap.innerHTML = '<div style="padding:20px;text-align:center;color:var(--muted)">No articles found.</div>';
      return;
    }
    articles.slice(0, 8).forEach(function (a, i) {
      var item = el("div", { css: { padding: "12px 0", borderBottom: i < articles.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }, onclick: function () { if (a.url && a.url !== "#") window.open(a.url, "_blank"); } });
      item.addEventListener("mouseenter", function () { this.style.background = "var(--card2)"; this.style.borderRadius = "8px"; this.style.padding = "12px 8px"; });
      item.addEventListener("mouseleave", function () { this.style.background = ""; this.style.padding = "12px 0"; });

      var row = el("div", { css: { display: "flex", gap: "10px", alignItems: "flex-start" } });
      row.appendChild(el("div", { css: { minWidth: "6px", height: "6px", borderRadius: "50%", background: cat.color, marginTop: "7px", flexShrink: "0" } }));
      var txt = el("div", { css: { flex: "1" } });
      txt.appendChild(el("div", { css: { fontSize: ".88rem", fontWeight: "600", lineHeight: "1.55", color: "var(--text)", marginBottom: "4px" }, txt: a.title }));
      var meta = el("div", { css: { display: "flex", gap: "8px", alignItems: "center" } });
      if (a.source) meta.appendChild(el("span", { css: { fontSize: ".68rem", color: cat.color, fontWeight: "600", background: cat.color + "15", padding: "2px 7px", borderRadius: "4px" } }, a.source));
      if (a.pubDate) {
        var d = new Date(a.pubDate);
        if (!isNaN(d)) meta.appendChild(el("span", { css: { fontSize: ".68rem", color: "var(--subtle)" } }, d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })));
      }
      txt.appendChild(meta);
      row.appendChild(txt);
      item.appendChild(row);
      newsWrap.appendChild(item);
    });
  }

  // Try fetching from feeds
  var tried = 0;
  function tryFeed(i) {
    if (i >= feeds.length) { renderArticles(fallback); return; }
    fetch(feeds[i].url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.items && data.items.length) {
          var articles = data.items.map(function (item) {
            return { title: item.title, url: item.link, source: feeds[i].name, pubDate: item.pubDate };
          });
          renderArticles(articles);
        } else { tryFeed(i + 1); }
      })
      .catch(function () { tryFeed(i + 1); });
  }
  tryFeed(0);
}