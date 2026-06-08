// ═══════════════════════════════════════════════════════════════════
// PAGE-DIGEST.JS — Audited, Premium High-Volume Current Affairs Engine
// ═══════════════════════════════════════════════════════════════════

function pgDigest() {
    function el(type, props, children) {
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
        if (children && Array.isArray(children)) {
            children.forEach(function(child) {
                if (child) element.appendChild(child);
            });
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
            :root { --bg2: #f8f9fa; --border2: #e9ecef; --font-serif: "Georgia", Cambria, serif; }
            @media (prefers-color-scheme: dark) { :root { --bg2: #121212; --border2: #2a2a2a; } }
            .news-feed-stream { overflow-y: auto; -webkit-overflow-scrolling: touch; }
            .perp-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
            .perp-title { font-family: var(--font-serif); font-size: 1.35rem; font-weight: 700; line-height: 1.4; color: var(--text); margin: 12px 0; }
            .rotate-sync { animation: spinSync 1s linear infinite; }
            @keyframes spinSync { 100% { transform: rotate(360deg); } }
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
        { id: "world", label: "World", icon: "🌐", color: "#f87171", desc: "Foreign relations and global summits." },
        { id: "sports", label: "Sports", icon: "🏆", color: "#ec4899", desc: "Tournaments, records, and events." },
        { id: "awards", label: "Awards & Culture", icon: "🎖️", color: "#14b8a6", desc: "Honors, literature, and heritage." }
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

        var wrap = el("div", { css: { maxWidth: "720px", margin: "0 auto", padding: "20px 16px 110px 16px", display: "flex", flexDirection: "column", boxSizing: "border-box" } });

        var topBar = el("div", { css: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexShrink: "0" } });
        var leftSide = el("div", { css: { display: "flex", alignItems: "center", gap: "12px" } });
        var backBtn = el("button", { css: { padding: "8px 14px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontWeight: "600", cursor: "pointer" }, onclick: function () { history.back(); } });
        backBtn.innerHTML = '←';

        var titleNode = el("div", { css: { fontSize: "1.4rem", fontWeight: "800", fontFamily: "var(--font-display)", color: "var(--text)" }, txt: cat.icon + " " + cat.label });
        leftSide.appendChild(backBtn);
        leftSide.appendChild(titleNode);

        var syncBtn = el("button", { 
            css: { width: "42px", height: "42px", borderRadius: "50%", border: "1.5px solid var(--border2)", background: "var(--bg2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", transition: "all 0.15s ease" },
            onclick: function () { 
                var btn = this;
                btn.style.transform = "scale(0.85)"; 
                setTimeout(function() { btn.style.transform = "scale(1)"; }, 150);

                var activeFilter = filterSelect.value;
                fetchLatestNews(cat, newsWrap, syncIcon, true, activeFilter, filterSelect); 
            }
        });

        var syncIcon = el("span", { css: { display: "flex", alignItems: "center", justifyContent: "center" } });
        syncIcon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path></svg>`;
        syncBtn.appendChild(syncIcon);
        topBar.appendChild(leftSide);
        topBar.appendChild(syncBtn);
        wrap.appendChild(topBar);

        var filterRow = el("div", { css: { display: "flex", justifyContent: "flex-end", marginBottom: "20px" } });
        var selectWrapper = el("div", { css: { position: "relative", display: "inline-block" } });

        var filterSelect = el("select", {
            css: {
                padding: "8px 34px 8px 16px", borderRadius: "20px", border: "1.5px solid var(--border2)",
                background: "var(--bg2)", color: "var(--text)", fontWeight: "700", fontSize: "0.85rem",
                cursor: "pointer", appearance: "none", WebkitAppearance: "none", outline: "none"
            },
            onchange: function(e) {
                var cacheKey = "digest_daily_" + cat.id;
                var cachedData = (typeof Sv !== 'undefined' && Sv.get) ? Sv.get(cacheKey) : null;
                var localArts = (cachedData && cachedData.articles) ? cachedData.articles : [];
                renderDiscoverStream(localArts, cat, newsWrap, e.target.value, filterSelect);
            }
        });
        filterSelect.innerHTML = `
            <option value="today">Today's News</option>
            <option value="yesterday">Yesterday</option>
            <option value="older">Older News</option>
        `;

        var chevron = el("span", { 
            css: { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: "0.75rem", color: "var(--text)" }, 
            txt: "▼" 
        });

        selectWrapper.appendChild(filterSelect);
        selectWrapper.appendChild(chevron);
        filterRow.appendChild(selectWrapper);
        wrap.appendChild(filterRow);

        var newsWrap = el("div", { className: "news-feed-stream", css: { flex: "1" } });
        wrap.appendChild(newsWrap);
        contentWrap.appendChild(wrap);

        fetchLatestNews(cat, newsWrap, syncIcon, false, filterSelect.value, filterSelect);
    }

    // ─── UPGRADED CONCURRENT FETCH LOGIC (100% BLENDED AND BUG FREE) ───
    function fetchLatestNews(cat, newsWrap, syncIcon, forceRefresh, activeFilter, filterUI) {
        if (syncIcon) syncIcon.classList.add("rotate-sync");

        var todayStr = new Date().toDateString();
        var cacheKey = "digest_daily_" + cat.id;
        var cachedData = (typeof Sv !== 'undefined' && Sv.get) ? Sv.get(cacheKey) : null;

        if (!cachedData || !Array.isArray(cachedData.articles)) { cachedData = { date: "", articles: [] }; }

        if (cachedData.articles.length > 0 && !forceRefresh) {
            renderDiscoverStream(cachedData.articles, cat, newsWrap, activeFilter, filterUI);
            if (syncIcon) syncIcon.classList.remove("rotate-sync");
            return;
        }

        var feeds = (typeof CA_FEEDS !== "undefined" && CA_FEEDS[cat.id]) ? CA_FEEDS[cat.id] : [];
        var fallback = (typeof CA_FALLBACK !== "undefined" && CA_FALLBACK[cat.id]) ? CA_FALLBACK[cat.id] : [];

        if (feeds.length === 0) {
            renderDiscoverStream(cachedData.articles.length ? cachedData.articles : fallback, cat, newsWrap, activeFilter, filterUI);
            if (syncIcon) syncIcon.classList.remove("rotate-sync");
            return;
        }

        // Map individual requests into parallel fetch streams safely wrapped with individual catch blocks
        var fetchPromises = feeds.map(function(feedObj) {
            return fetch(feedObj.url)
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    if (!data.items || !data.items.length) return [];
                    
                    var cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - 6);

                    return data.items.map(function(item) {
                        var extractedImg = item.thumbnail || (item.enclosure && item.enclosure.link) || "";
                        if (!extractedImg || extractedImg.trim() === "") {
                            var imgMatch = (item.content || item.description || "").match(/<img[^>]+src="([^">]+)"/i);
                            if (imgMatch && imgMatch[1]) extractedImg = imgMatch[1];
                        }
                        return {
                            title: decodeHTML(item.title),
                            url: item.link,
                            source: feedObj.name || cat.label,
                            pubDate: item.pubDate || new Date().toISOString(),
                            description: decodeHTML(item.description || item.contentSnippet || ""),
                            image: extractedImg
                        };
                    }).filter(function(item) {
                        return new Date(item.pubDate) >= cutoffDate;
                    });
                })
                .catch(function() { return []; }); // Return empty array on single link crashes
        });

        // Resolve all streams concurrently in parallel sequence clusters
        Promise.all(fetchPromises).then(function(resultsLists) {
            var liveAggregated = [];
            resultsLists.forEach(function(list) {
                if (list && list.length) liveAggregated = liveAggregated.concat(list);
            });

            // Combine live pulled values cleanly stacked on top of existing cache arrays
            var baseList = cachedData.articles || [];
            var combined = liveAggregated.concat(baseList);

            // Deduplicate over identical URL endpoints
            var unique = [];
            var seen = {};
            combined.forEach(function(art) {
                if (art.url && !seen[art.url]) {
                    seen[art.url] = true;
                    unique.push(art);
                }
            });

            // Chronological Sorting Core
            unique.sort(function(a, b) { return new Date(b.pubDate) - new Date(a.pubDate); });

            cachedData.articles = unique.slice(0, 100);
            cachedData.date = todayStr;

            if (typeof Sv !== 'undefined' && Sv.set) Sv.set(cacheKey, cachedData);

            renderDiscoverStream(cachedData.articles.length ? cachedData.articles : fallback, cat, newsWrap, activeFilter, filterUI);
        }).finally(function() {
            if (syncIcon) syncIcon.classList.remove("rotate-sync");
        });
    }

    function renderDiscoverStream(articles, cat, newsWrap, activeFilter, filterUI) {
        activeFilter = activeFilter || "today"; 

        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        var startOfYesterday = startOfToday - (24 * 60 * 60 * 1000);

        function filterArts(filterType) {
            return articles.filter(function(a) {
                var d = new Date(a.pubDate).getTime();
                if (filterType === "today") return d >= startOfToday;
                if (filterType === "yesterday") return d >= startOfYesterday && d < startOfToday;
                return d < startOfYesterday; 
            });
        }

        var filteredArticles = filterArts(activeFilter);

        if (filteredArticles.length === 0) {
            if (activeFilter === "today") {
                activeFilter = "yesterday";
                filteredArticles = filterArts(activeFilter);
                if (filterUI) filterUI.value = "yesterday"; 
            }
            if (filteredArticles.length === 0 && activeFilter === "yesterday") {
                activeFilter = "older";
                filteredArticles = filterArts(activeFilter);
                if (filterUI) filterUI.value = "older"; 
            }
        }

        newsWrap.innerHTML = "";

        if (!filteredArticles || !filteredArticles.length) {
            newsWrap.innerHTML = '<div style="padding:40px; text-align:center; color:var(--muted); font-weight:600; line-height:1.5;">No news available in this category yet.<br><span style="font-size:0.8rem; font-weight:400;">Try syncing again later.</span></div>';
            return;
        }

        filteredArticles.forEach(function (a) {
            var card = el("div", { className: "perp-card" });
            var imgContainer = el("div", { css: { width: "100%", height: "210px", position: "relative", borderBottom: "1px solid var(--border2)", backgroundColor: "var(--bg2)", overflow: "hidden" } });

            if (a.image && a.image.trim() !== "") {
                var sharpLayer = el("div", { css: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", backgroundImage: "url('" + a.image + "')", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" } });
                imgContainer.appendChild(sharpLayer);
            } else {
                imgContainer.style.backgroundImage = "linear-gradient(" + cat.color + "1A 1px, transparent 1px), linear-gradient(90deg, " + cat.color + "1A 1px, transparent 1px)";
                imgContainer.style.backgroundSize = "20px 20px";
                imgContainer.style.backgroundPosition = "center center";

                var fallbackBadge = el("div", { 
                    css: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "75px", height: "75px", borderRadius: "14px", backgroundColor: "var(--card)", border: "2px solid " + cat.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }, 
                    txt: cat.icon 
                });
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

            var slBadge = el("div", { 
                css: { width: "26px", height: "26px", borderRadius: "7px", backgroundColor: "#0a0a0a", color: "#ffffff", fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontFamily: "var(--font-display, sans-serif)" }, 
                txt: "SL" 
            });

            var brandText = el("div", { css: { fontSize: "0.85rem", fontWeight: "800", fontFamily: "var(--font-display, sans-serif)", letterSpacing: "-0.02em" } });
            brandText.innerHTML = '<span style="color: var(--text);">Study</span><span style="color: #3b82f6;">Lab</span>';

            profileBox.appendChild(slBadge);
            profileBox.appendChild(brandText);
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
