// ═══════════════════════════════════════════════════════════════════
// PAGE-DIGEST.JS — Daily Current Affairs Digest (Multi-Day Flexbox UI)
// ═══════════════════════════════════════════════════════════════════

function pgDigest() {
    var w = el("div", { cls: "fd" });
    
    // 1. Keep your existing navigation
    if (typeof makeNav === "function") {
        w.appendChild(makeNav("digest"));
    }

    // 2. Inject Premium CSS Variables & Clamping
    if (!document.getElementById('studylab-digest-styles')) {
        var style = document.createElement('style');
        style.id = 'studylab-digest-styles';
        style.innerHTML = `
            :root { --bg2: #f1f3f5; --border2: #e9ecef; }
            @media (prefers-color-scheme: dark) { :root { --bg2: #1e1e1e; --border2: #333333; } }
            .swipe-container::-webkit-scrollbar { display: none; }
            .swipe-container { -ms-overflow-style: none; scrollbar-width: none; }
            .clamp-title {
                display: -webkit-box;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;  
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    function decodeHTML(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    // 3. Your Original Categories
    var CATS = [
        { id: "national", label: "National", icon: "🇮🇳", color: "#4F8EF7", desc: "Top stories from across India.", topics: ["Politics", "Governance", "Society"], sym: ["🏛️","🗳️","🚆"] },
        { id: "govt", label: "Govt / PIB", icon: "🏛️", color: "#8b5cf6", desc: "Official press releases and schemes.", topics: ["Cabinet", "Schemes", "Policy"], sym: ["📋","⚖️","🔔"] },
        { id: "economy", label: "Economy", icon: "📈", color: "#f59e0b", desc: "RBI, GDP, budget and markets.", topics: ["RBI", "GDP", "Budget"], sym: ["💰","🏦","📊"] },
        { id: "science", label: "Science", icon: "🔬", color: "#4ade80", desc: "ISRO, DRDO and health.", topics: ["ISRO", "DRDO", "Health"], sym: ["🚀","⚛️","🧬"] },
        { id: "world", label: "World", icon: "🌐", color: "#f87171", desc: "Foreign relations and global summits.", topics: ["UN", "G20", "Foreign Policy"], sym: ["✈️","🌍","🤝"] }
    ];

    var contentWrap = el("div", { css: { height: "100%" } });

    function getDailyProgress() {
        var today = new Date().toDateString();
        var stats = JSON.parse(localStorage.getItem('sl_digest_stats') || '{"date":"","read":0}');
        if (stats.date !== today) stats = { date: today, read: 0 };
        return stats;
    }
    function updateDailyProgress() {
        var stats = getDailyProgress();
        stats.read += 1;
        localStorage.setItem('sl_digest_stats', JSON.stringify(stats));
    }

    // 5. MAIN VIEW
    function showMain() {
        contentWrap.innerHTML = "";
        var wrap = el("div", { css: { maxWidth: "780px", margin: "0 auto", paddingBottom: "110px", paddingTop: "20px", paddingLeft: "16px", paddingRight: "16px" } });

        var hd = el("div", { css: { textAlign: "center", marginBottom: "32px" } });
        hd.appendChild(el("div", { css: { fontSize: ".65rem", color: "var(--subtle)", textTransform: "uppercase", letterSpacing: ".18em", fontWeight: "700", marginBottom: "10px", fontFamily: "var(--font-display)" }, txt: "StudyLab — Your Ultimate Competitive Exam Partner" }));
        hd.appendChild(el("div", { css: { fontSize: "1.9rem", fontWeight: "800", letterSpacing: "-.04em", fontFamily: "var(--font-display)", color: "var(--text)" }, txt: "Daily Current Affairs" }));
        
        var stats = getDailyProgress();
        var progressWrap = el("div", { css: { display: "inline-flex", alignItems: "center", gap: "10px", marginTop: "16px", padding: "8px 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" } });
        progressWrap.appendChild(el("span", { css: { fontSize: "1.2rem" }, txt: "🎯" }));
        progressWrap.appendChild(el("div", { css: { fontSize: ".85rem", fontWeight: "600", color: "var(--text)" }, txt: "Daily Goal: " + stats.read + " / 5 Articles Read" }));
        hd.appendChild(progressWrap);
        wrap.appendChild(hd);

        CATS.forEach(function (cat) {
            var row = el("div", { css: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "16px", background: "var(--card)", border: "2px solid var(--border)", borderRadius: "16px", padding: "20px", cursor: "pointer", transition: "all 0.2s" }, onclick: function () { showSub(cat); } });
            row.addEventListener("mouseenter", function () { this.style.borderColor = cat.color; this.style.transform = "translateY(-4px)"; });
            row.addEventListener("mouseleave", function () { this.style.borderColor = "var(--border)"; this.style.transform = "translateY(0)"; });

            var iconBox = el("div", { css: { fontSize: "3rem", filter: "drop-shadow(0 4px 12px rgba(0,0,0,.1))" }, txt: cat.icon });
            var txtBox = el("div", { css: { flex: "1" } });
            txtBox.appendChild(el("div", { css: { fontSize: "1.3rem", fontWeight: "800", fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: "4px" }, txt: cat.label }));
            txtBox.appendChild(el("div", { css: { fontSize: ".9rem", color: "var(--muted)" }, txt: cat.desc }));

            row.appendChild(iconBox);
            row.appendChild(txtBox);
            row.appendChild(el("div", { css: { fontSize: "1.5rem", color: cat.color }, txt: "→" }));
            wrap.appendChild(row);
        });

        contentWrap.appendChild(wrap);
        window.scrollTo(0, 0);
    }

    // 6. SUB VIEW & SMART FETCHING
    function showSub(cat) {
        history.pushState({ page: "digest", sub: null, digestView: "main" }, "");
        contentWrap.innerHTML = "";
        window.scrollTo(0, 0);

        var wrap = el("div", { 
            css: { 
                maxWidth: "780px", 
                margin: "0 auto", 
                padding: "20px 16px 110px 16px",
                height: "100vh",
                minHeight: "calc(100vh - 70px)",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box"
            } 
        });

        var topBar = el("div", { css: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", flexShrink: "0" } });
        var backBtn = el("button", { css: { padding: "10px 18px", borderRadius: "12px", border: "1.5px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }, onclick: function () { history.back(); } });
        backBtn.innerHTML = '← Back';
        var titleWrap = el("div");
        titleWrap.appendChild(el("div", { css: { fontSize: "1.5rem", fontWeight: "800", fontFamily: "var(--font-display)", color: "var(--text)" } }, cat.icon + " " + cat.label + " News"));
        topBar.appendChild(backBtn);
        topBar.appendChild(titleWrap);
        wrap.appendChild(topBar);

        var newsWrap = el("div", { css: { flex: "1", minHeight: "0", display: "flex", flexDirection: "column" } });
        wrap.appendChild(newsWrap);
        contentWrap.appendChild(wrap);

        // --- CACHE MERGING LOGIC ---
        var todayStr = new Date().toDateString();
        var cacheKey = "digest_daily_" + cat.id;
        var cachedData = (typeof Sv !== 'undefined' && Sv.get) ? Sv.get(cacheKey) : null;
        
        // Instead of wiping the cache, we safely initialize it if it doesn't exist
        if (!cachedData || !Array.isArray(cachedData.articles)) {
            cachedData = { date: "", articles: [] };
        }

        var feeds = (typeof CA_FEEDS !== "undefined" && CA_FEEDS[cat.id]) ? CA_FEEDS[cat.id] : [];
        var fallback = (typeof CA_FALLBACK !== "undefined" && CA_FALLBACK[cat.id]) ? CA_FALLBACK[cat.id] : [];

        // 1. Instantly render whatever we have in cache to avoid blank loading screens
        if (cachedData.articles.length > 0) {
            renderArticles(cachedData.articles, cat, newsWrap);
        } else {
            newsWrap.innerHTML = `
                <div style="height: 100%; border: 2px solid var(--border); border-radius: 16px; background: var(--card); overflow: hidden; display: flex; flex-direction: column;">
                    <div style="height: 25%; background: var(--border); opacity: 0.3;"></div>
                    <div style="padding: 24px; flex: 1;">
                        <div style="width: 30%; height: 12px; background: var(--border); margin-bottom: 20px; border-radius: 4px;"></div>
                        <div style="width: 90%; height: 24px; background: var(--border); margin-bottom: 12px; border-radius: 4px;"></div>
                        <div style="width: 70%; height: 24px; background: var(--border); margin-bottom: 24px; border-radius: 4px;"></div>
                    </div>
                </div>
            `;
        }

        // 2. If we haven't fetched *today*, fetch in background and merge with history
        if (cachedData.date !== todayStr || cachedData.articles.length === 0) {
            function tryFeed(i) {
                if (i >= feeds.length) {
                    if (cachedData.articles.length === 0) renderArticles(fallback, cat, newsWrap);
                    return;
                }
                fetch(feeds[i].url)
                    .then(function (r) { return r.json(); })
                    .then(function (data) {
                        if (data.items && data.items.length) {
                            var newArticles = data.items.map(function (item) {
                                return { 
                                    title: decodeHTML(item.title), 
                                    url: item.link, 
                                    source: feeds[i].name, 
                                    pubDate: item.pubDate,
                                    description: decodeHTML(item.description || item.contentSnippet || ""),
                                    image: item.thumbnail || (item.enclosure && item.enclosure.link) || "" 
                                };
                            });

                            // MERGE: Combine new articles with old cached articles
                            var combinedArticles = newArticles.concat(cachedData.articles);
                            
                            // DEDUPLICATE: Remove identical articles using URL
                            var uniqueArticles = [];
                            var seenUrls = {};
                            combinedArticles.forEach(function(a) {
                                if (a.url && !seenUrls[a.url]) {
                                    seenUrls[a.url] = true;
                                    uniqueArticles.push(a);
                                }
                            });

                            // SORT: Newest to oldest
                            uniqueArticles.sort(function(a, b) {
                                return new Date(b.pubDate) - new Date(a.pubDate);
                            });

                            // RETAIN: Keep the top 40 articles (plenty for 3+ days)
                            cachedData.articles = uniqueArticles.slice(0, 40);
                            cachedData.date = todayStr;
                            
                            if (typeof Sv !== 'undefined' && Sv.set) Sv.set(cacheKey, cachedData);
                            
                            // Re-render UI with merged multi-day list
                            renderArticles(cachedData.articles, cat, newsWrap);
                        } else {
                            tryFeed(i + 1);
                        }
                    })
                    .catch(function () { tryFeed(i + 1); });
            }
            tryFeed(0);
        }
    }

    // 7. INSHORTS-STYLE SWIPE CARDS UI
    function renderArticles(articles, cat, newsWrap) {
        newsWrap.innerHTML = "";
        if (!articles || !articles.length) {
            newsWrap.innerHTML = '<div style="padding:30px;text-align:center;color:var(--muted)">No articles found for today.</div>';
            return;
        }

        var swipeContainer = el("div", {
            className: "swipe-container",
            css: { 
                height: "100%", 
                width: "100%",
                overflowY: "scroll", 
                scrollSnapType: "y mandatory", 
                borderRadius: "16px", 
                border: "2px solid var(--border)", 
                background: "var(--card)", 
                position: "relative" 
            }
        });

        // Allow user to swipe through up to 30 items (spans multiple days easily)
        articles.slice(0, 30).forEach(function (a) {
            var card = el("div", { css: { height: "100%", width: "100%", scrollSnapAlign: "start", display: "flex", flexDirection: "column", borderBottom: "2px solid var(--border)", background: "var(--card)", boxSizing: "border-box" } });

            var heroCss = { height: "25%", width: "100%", backgroundSize: "cover", backgroundPosition: "center", borderBottom: "2px solid var(--border)", flexShrink: "0" };
            if (a.image && a.image !== "") {
                heroCss.backgroundImage = "url('" + a.image + "')";
            } else {
                heroCss.background = "linear-gradient(135deg, " + cat.color + "30, var(--bg2))";
                heroCss.display = "flex"; heroCss.alignItems = "center"; heroCss.justifyContent = "center";
            }
            
            var hero = el("div", { css: heroCss });
            if (!a.image || a.image === "") hero.appendChild(el("div", { css: { fontSize: "3rem", opacity: "0.6" }, txt: cat.icon }));
            card.appendChild(hero);

            var content = el("div", { css: { padding: "16px", flex: "1", display: "flex", flexDirection: "column", overflowY: "auto" } });
            
            var meta = el("div", { css: { display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: ".75rem", fontWeight: "700", textTransform: "uppercase", flexShrink: "0" } });
            meta.appendChild(el("span", { css: { color: cat.color }, txt: a.source || cat.label }));
            
            var d = new Date(a.pubDate);
            meta.appendChild(el("span", { css: { color: "var(--subtle)" }, txt: !isNaN(d) ? d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Today" }));
            content.appendChild(meta);

            var titleNode = el("div", { className: "clamp-title", css: { fontSize: "1.15rem", fontWeight: "800", lineHeight: "1.3", marginBottom: "12px", color: "var(--text)", fontFamily: "var(--font-display)", flexShrink: "0" }, txt: a.title });
            content.appendChild(titleNode);

            var summaryBox = el("div", { css: { background: "var(--bg2)", padding: "12px 16px", borderLeft: "4px solid " + cat.color, marginBottom: "16px", borderRadius: "0 8px 8px 0" } });
            summaryBox.appendChild(el("div", { css: { fontSize: ".7rem", fontWeight: "800", color: cat.color, marginBottom: "6px", textTransform: "uppercase" }, txt: "💡 Context & Details" }));
            
            var cleanDesc = (a.description || "").replace(/<\/?[^>]+(>|$)/g, ""); 
            summaryBox.appendChild(el("div", { css: { fontSize: ".85rem", lineHeight: "1.5", color: "var(--text)" }, txt: cleanDesc ? (cleanDesc.substring(0, 110) + "...") : "Tap to read the full update and understand its impact." }));
            content.appendChild(summaryBox);

            var actionBar = el("div", { css: { display: "flex", marginTop: "auto", flexShrink: "0", paddingBottom: "4px" } });
            var readBtn = el("button", { css: { flex: "1", padding: "12px", background: cat.color, color: "#fff", fontWeight: "700", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: ".9rem" }, txt: "Read Full Article →", onclick: function() { updateDailyProgress(); if (a.url) window.open(a.url, "_blank"); } });
            actionBar.appendChild(readBtn);
            
            content.appendChild(actionBar);
            card.appendChild(content);
            swipeContainer.appendChild(card);
        });

        newsWrap.appendChild(swipeContainer);
        newsWrap.appendChild(el("div", { css: { textAlign: "center", fontSize: ".75rem", color: "var(--muted)", marginTop: "8px", fontWeight: "600", flexShrink: "0" }, txt: "↕ Scroll vertically to view older news" }));
    }

    function onPopState(e) {
        if (!w.isConnected) { window.removeEventListener("popstate", onPopState); return; }
        if (e.state && e.state.digestView === "main") showMain();
    }
    window.addEventListener("popstate", onPopState);

    showMain();
    w.appendChild(contentWrap);
    return w;
}
