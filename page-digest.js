// ═══════════════════════════════════════════════════════════════════
// PAGE-DIGEST.JS — Audited, Fully Functional Current Affairs Engine
// ═══════════════════════════════════════════════════════════════════

function pgDigest() {
    // Standard secure DOM element creator abstraction helper
    function el(type, props) {
        var element = document.createElement(type);
        if (props) {
            if (props.cls) element.className = props.cls;
            if (props.className) element.className = props.className;
            if (props.txt) element.textContent = props.txt;
            if (props.onclick) element.onclick = props.onclick;
            if (props.css) {
                for (var key in props.css) {
                    element.style[key] = props.css[key];
                }
            }
        }
        return element;
    }

    var w = el("div", { cls: "fd" });

    if (typeof makeNav === "function") {
        w.appendChild(makeNav("digest"));
    }

    if (!document.getElementById('studylab-digest-styles')) {
        var style = document.createElement('style');
        style.id = 'studylab-digest-styles';
        style.innerHTML = `
            :root { 
                --bg2: #f8f9fa; 
                --border2: #e9ecef; 
                --font-serif: "Georgia", Cambria, serif;
            }
            @media (prefers-color-scheme: dark) { 
                :root { 
                    --bg2: #121212; 
                    --border2: #2a2a2a; 
                } 
            }
            .news-feed-stream {
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
            .perp-card {
                background: var(--card);
                border: 1px solid var(--border);
                border-radius: 16px;
                overflow: hidden;
                margin-bottom: 24px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            }
            .perp-title {
                font-family: var(--font-serif);
                font-size: 1.35rem;
                font-weight: 700;
                line-height: 1.4;
                color: var(--text);
                margin: 12px 0;
            }
            .rotate-sync {
                animation: spinSync 1s linear infinite;
            }
            @keyframes spinSync {
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    function decodeHTML(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    var CATS = [
        { id: "national", label: "National", icon: "🇮🇳", color: "#4F8EF7", desc: "Top stories from across India." },
        { id: "govt", label: "Govt / PIB", icon: "🏛️", color: "#8b5cf6", desc: "Official press releases and schemes." },
        { id: "economy", label: "Economy", icon: "📈", color: "#f59e0b", desc: "RBI, GDP, budget and markets." },
        { id: "science", label: "Science", icon: "🔬", color: "#4ade80", desc: "ISRO, DRDO and health." },
        { id: "world", label: "World", icon: "🌐", color: "#f87171", desc: "Foreign relations and global summits." }
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
            var row = el("div", { css: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", cursor: "pointer" }, onclick: function () { showSub(cat); } });

            var iconBox = el("div", { css: { fontSize: "3rem" }, txt: cat.icon });
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

    function showSub(cat) {
        history.pushState({ page: "digest", sub: null, digestView: "main" }, "");
        contentWrap.innerHTML = "";
        window.scrollTo(0, 0);

        var wrap = el("div", { 
            css: { 
                maxWidth: "720px", 
                margin: "0 auto", 
                padding: "20px 16px 110px 16px",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box"
            } 
        });

        var topBar = el("div", { css: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexShrink: "0" } });
        
        var leftSide = el("div", { css: { display: "flex", alignItems: "center", gap: "12px" } });
        var backBtn = el("button", { css: { padding: "8px 14px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontWeight: "600", cursor: "pointer" }, onclick: function () { history.back(); } });
        backBtn.innerHTML = '←';
        
        var titleNode = el("div", { css: { fontSize: "1.4rem", fontWeight: "800", fontFamily: "var(--font-display)", color: "var(--text)" }, txt: cat.icon + " " + cat.label });
        leftSide.appendChild(backBtn);
        leftSide.appendChild(titleNode);

        var syncBtn = el("button", { 
            css: { padding: "8px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: "600", color: "var(--text)" },
            onclick: function () { fetchLatestNews(cat, newsWrap, syncIcon, true, 0); }
        });
        var syncIcon = el("span", { css: { display: "inline-block", transition: "transform 0.2s" }, txt: "🔄" });
        syncBtn.appendChild(syncIcon);
        syncBtn.appendChild(el("span", { txt: "Refresh" }));

        topBar.appendChild(leftSide);
        topBar.appendChild(syncBtn);
        wrap.appendChild(topBar);

        var newsWrap = el("div", { className: "news-feed-stream", css: { flex: "1" } });
        wrap.appendChild(newsWrap);
        contentWrap.appendChild(wrap);

        // Fixed signature call parameters matching initialization loop index
        fetchLatestNews(cat, newsWrap, syncIcon, false, 0);
    }

    function fetchLatestNews(cat, newsWrap, syncIcon, forceRefresh, index) {
        if (syncIcon) syncIcon.classList.add("rotate-sync");

        var todayStr = new Date().toDateString();
        var cacheKey = "digest_daily_" + cat.id;
        var cachedData = (typeof Sv !== 'undefined' && Sv.get) ? Sv.get(cacheKey) : null;

        if (!cachedData || !Array.isArray(cachedData.articles)) {
            cachedData = { date: "", articles: [] };
        }

        if (cachedData.articles.length > 0 && !forceRefresh) {
            renderDiscoverStream(cachedData.articles, cat, newsWrap);
            if (syncIcon) syncIcon.classList.remove("rotate-sync");
            return;
        }

        var feeds = (typeof CA_FEEDS !== "undefined" && CA_FEEDS[cat.id]) ? CA_FEEDS[cat.id] : [];
        var fallback = (typeof CA_FALLBACK !== "undefined" && CA_FALLBACK[cat.id]) ? CA_FALLBACK[cat.id] : [];

        if (feeds.length === 0 || index >= feeds.length) {
            renderDiscoverStream(cachedData.articles.length ? cachedData.articles : fallback, cat, newsWrap);
            if (syncIcon) syncIcon.classList.remove("rotate-sync");
            return;
        }

        fetch(feeds[index].url)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.items && data.items.length) {
                    var cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - 6); // Safety boundary: Keeps full 5 days + buffer

                    var parsed = data.items.map(function (item) {
                        return { 
                            title: decodeHTML(item.title), 
                            url: item.link, 
                            source: feeds[index].name || cat.label, 
                            pubDate: item.pubDate || new Date().toISOString(),
                            description: decodeHTML(item.description || item.contentSnippet || ""),
                            image: item.thumbnail || (item.enclosure && item.enclosure.link) || "" 
                        };
                    }).filter(function(item) {
                        return new Date(item.pubDate) >= cutoffDate;
                    });

                    var baseList = forceRefresh ? [] : cachedData.articles;
                    var combined = parsed.concat(baseList);

                    var unique = [];
                    var seen = {};
                    combined.forEach(function(art) {
                        if (art.url && !seen[art.url]) {
                            seen[art.url] = true;
                            unique.push(art);
                        }
                    });

                    unique.sort(function(a, b) {
                        return new Date(b.pubDate) - new Date(a.pubDate);
                    });

                    cachedData.articles = unique.slice(0, 100);
                    cachedData.date = todayStr;

                    if (typeof Sv !== 'undefined' && Sv.set) Sv.set(cacheKey, cachedData);

                    renderDiscoverStream(cachedData.articles, cat, newsWrap);
                } else {
                    fetchLatestNews(cat, newsWrap, syncIcon, forceRefresh, index + 1);
                }
            })
            .catch(function () { 
                fetchLatestNews(cat, newsWrap, syncIcon, forceRefresh, index + 1); 
            })
            .finally(function() {
                if (index === feeds.length - 1 && syncIcon) {
                    syncIcon.classList.remove("rotate-sync");
                }
            });
    }

    function renderDiscoverStream(articles, cat, newsWrap) {
        newsWrap.innerHTML = "";
        if (!articles || !articles.length) {
            newsWrap.innerHTML = '<div style="padding:40px; text-align:center; color:var(--muted); font-weight:600;">No articles available. Tap refresh to update.</div>';
            return;
        }

        articles.forEach(function (a) {
            var card = el("div", { className: "perp-card" });

            var imgContainer = el("div", { css: { width: "100%", height: "210px", backgroundSize: "cover", backgroundPosition: "center", position: "relative", borderBottom: "1px solid var(--border2)", background: "var(--bg2)" } });
            if (a.image && a.image.trim() !== "") {
                imgContainer.style.backgroundImage = "url('" + a.image + "')";
            } else {
                imgContainer.style.background = "linear-gradient(145deg, " + cat.color + "15, var(--bg2))";
                var fallbackBadge = el("div", { css: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "3.5rem", opacity: "0.25" }, txt: cat.icon });
                imgContainer.appendChild(fallbackBadge);
            }
            card.appendChild(imgContainer);

            var textBlock = el("div", { css: { padding: "20px" } });

            var metaRow = el("div", { css: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" } });
            metaRow.appendChild(el("span", { css: { color: cat.color }, txt: a.source }));
            
            var parsedTime = new Date(a.pubDate);
            var dateOption = { month: "short", day: "numeric" };
            if (parsedTime.getFullYear() !== new Date().getFullYear()) dateOption.year = "numeric";
            var timeStr = !isNaN(parsedTime) ? parsedTime.toLocaleDateString("en-IN", dateOption) : "Recent";
            
            metaRow.appendChild(el("span", { css: { color: "var(--subtle)" }, txt: timeStr }));
            textBlock.appendChild(metaRow);

            var titleEl = el("div", { className: "perp-title", txt: a.title });
            textBlock.appendChild(titleEl);

            var summaryTxt = (a.description || "").replace(/<\/?[^>]+(>|$)/g, "").trim();
            if (!summaryTxt) summaryTxt = "Tap below to open the complete reference brief and view historical government announcements updates.";
            if (summaryTxt.length > 160) summaryTxt = summaryTxt.substring(0, 155) + "...";

            var descEl = el("p", { css: { fontSize: "0.9rem", color: "var(--muted)", lineHeight: "1.55", margin: "10px 0 20px 0" }, txt: summaryTxt });
            textBlock.appendChild(descEl);

            var bottomRow = el("div", { css: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border2)", paddingTop: "14px", marginTop: "10px" } });
            
            var profileBox = el("div", { css: { display: "flex", alignItems: "center", gap: "8px" } });
            profileBox.appendChild(el("div", { css: { width: "22px", height: "22px", borderRadius: "50%", background: cat.color, color: "#fff", fontSize: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }, txt: cat.icon }));
            profileBox.appendChild(el("span", { css: { fontSize: "0.75rem", color: "var(--text)", fontWeight: "600" }, txt: "StudyLab Prep" }));
            bottomRow.appendChild(profileBox);

            var readBtn = el("button", { 
                css: { padding: "8px 14px", background: "none", border: "1px solid " + cat.color, color: cat.color, borderRadius: "8px", fontWeight: "700", fontSize: "0.8rem", cursor: "pointer" }, 
                txt: "Read Full Brief",
                onclick: function() { 
                    updateDailyProgress(); 
                    if (a.url) window.open(a.url, "_blank"); 
                } 
            });
            bottomRow.appendChild(readBtn);
            
            textBlock.appendChild(bottomRow);
            card.appendChild(textBlock);
            newsWrap.appendChild(card);
        });
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
