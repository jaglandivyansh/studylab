/**
 * StudyLab - Premium Page Digest (page-digest.js)
 * Features: Daily Streak, Inshorts-style Swipeable Cards, Skeleton Loading, AI-style Context Tags
 */

// 1. Core DOM Helper
function el(tag, options) {
    var element = document.createElement(tag);
    if (!options) return element;
    if (options.id) element.id = options.id;
    if (options.className) element.className = options.className;
    if (options.txt) element.textContent = options.txt;
    if (options.html) element.innerHTML = options.html;
    if (options.onclick) element.onclick = options.onclick;
    if (options.src) element.src = options.src;
    if (options.href) element.href = options.href;
    if (options.target) element.target = options.target;
    if (options.css) {
        for (var key in options.css) {
            element.style[key] = options.css[key];
        }
    }
    return element;
}

// 2. CSS Variables & Reset (Ensures premium look works immediately)
(function injectStyles() {
    if (document.getElementById('studylab-digest-styles')) return;
    var style = document.createElement('style');
    style.id = 'studylab-digest-styles';
    style.innerHTML = `
        :root {
            --bg: #f8f9fa;
            --bg2: #f1f3f5;
            --card: #ffffff;
            --border: #dee2e6;
            --border2: #e9ecef;
            --text: #212529;
            --muted: #6c757d;
            --subtle: #adb5bd;
        }
        /* Hide scrollbar for the swipe container to look clean */
        .swipe-container::-webkit-scrollbar { display: none; }
        .swipe-container { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            :root {
                --bg: #121212;
                --bg2: #1e1e1e;
                --card: #1a1a1a;
                --border: #2d2d2d;
                --border2: #333333;
                --text: #f8f9fa;
                --muted: #adb5bd;
                --subtle: #6c757d;
            }
        }
    `;
    document.head.appendChild(style);
})();

// 3. Global App State & Categories
var appState = {
    cache: {},
    container: null
};

// Exam-Focused Categories
var categories = [
    { id: "national", label: "National", icon: "🇮🇳", color: "#E1306C", feeds: [{ name: "The Hindu", url: "https://www.thehindu.com/news/national/feeder/default.rss" }] },
    { id: "economy", label: "Economy", icon: "📈", color: "#28a745", feeds: [{ name: "Livemint", url: "https://www.livemint.com/rss/economy" }] },
    { id: "world", label: "World", icon: "🌍", color: "#007bff", feeds: [{ name: "BBC", url: "http://feeds.bbci.co.uk/news/world/rss.xml" }] }
];

// 4. Gamification: Daily Progress Tracker
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

// 5. Main View: Category Grid
function showMain() {
    appState.container.innerHTML = "";
    var wrap = el("div", { css: { padding: "20px", maxWidth: "800px", margin: "0 auto" } });

    // Premium Header
    var hd = el("div", { css: { textAlign: "center", marginBottom: "32px", position: "relative" } });
    hd.appendChild(el("div", { 
        css: { fontSize: ".65rem", color: "var(--subtle)", textTransform: "uppercase", letterSpacing: ".18em", fontWeight: "700", marginBottom: "10px" }, 
        txt: "StudyLab — Your Ultimate Competitive Exam Partner" 
    }));
    hd.appendChild(el("div", { 
        css: { fontSize: "2.2rem", fontWeight: "800", letterSpacing: "-.04em", color: "var(--text)" }, 
        txt: "Daily Current Affairs" 
    }));

    // Daily Goal Tracker
    var stats = getDailyProgress();
    var progressWrap = el("div", { 
        css: { display: "inline-flex", alignItems: "center", gap: "10px", marginTop: "16px", padding: "8px 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" } 
    });
    progressWrap.appendChild(el("span", { css: { fontSize: "1.2rem" }, txt: "🎯" }));
    progressWrap.appendChild(el("div", { 
        css: { fontSize: ".85rem", fontWeight: "600", color: "var(--text)" }, 
        txt: `Daily Goal: ${stats.read} / 5 Articles Read` 
    }));
    hd.appendChild(progressWrap);
    wrap.appendChild(hd);

    // Category Grid
    var grid = el("div", { css: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" } });
    
    categories.forEach(function (cat) {
        var card = el("div", {
            css: {
                padding: "24px", background: "var(--card)", border: "2px solid var(--border)", borderRadius: "12px",
                cursor: "pointer", position: "relative", overflow: "hidden", transition: "transform 0.2s ease"
            },
            onclick: function () { showSub(cat); }
        });
        
        card.onmouseenter = function() { card.style.borderColor = cat.color; card.style.transform = "translateY(-4px)"; };
        card.onmouseleave = function() { card.style.borderColor = "var(--border)"; card.style.transform = "translateY(0)"; };

        card.appendChild(el("div", { css: { fontSize: "2rem", marginBottom: "12px" }, txt: cat.icon }));
        card.appendChild(el("div", { css: { fontSize: "1.1rem", fontWeight: "700", color: "var(--text)" }, txt: cat.label }));
        
        // Background Icon
        card.appendChild(el("div", {
            css: { position: "absolute", bottom: "-10px", right: "-10px", fontSize: "5rem", opacity: "0.05", pointerEvents: "none" },
            txt: cat.icon
        }));

        grid.appendChild(card);
    });

    wrap.appendChild(grid);
    appState.container.appendChild(wrap);
}

// 6. Sub View: Article Feed
function showSub(cat) {
    appState.container.innerHTML = "";
    var wrap = el("div", { css: { padding: "20px", maxWidth: "600px", margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column" } });

    // Header for sub-view
    var header = el("div", { css: { display: "flex", alignItems: "center", marginBottom: "20px", gap: "12px" } });
    
    var backBtn = el("button", {
        css: { padding: "8px 16px", background: "var(--bg2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
        txt: "← Back",
        onclick: showMain
    });
    
    header.appendChild(backBtn);
    header.appendChild(el("h2", { css: { margin: "0", fontSize: "1.5rem", color: "var(--text)", flex: "1" }, txt: cat.icon + " " + cat.label }));
    wrap.appendChild(header);

    var newsWrap = el("div", { id: "newsWrap", css: { flex: "1" } });
    wrap.appendChild(newsWrap);
    appState.container.appendChild(wrap);

    // Skeleton Loader
    newsWrap.innerHTML = `
        <div style="height: 75vh; border: 2px solid var(--border); border-radius: 16px; background: var(--card); overflow: hidden; display: flex; flex-direction: column;">
            <div style="height: 45%; background: var(--border2); opacity: 0.5;"></div>
            <div style="padding: 24px; flex: 1;">
                <div style="width: 30%; height: 12px; background: var(--border); margin-bottom: 20px; border-radius: 4px;"></div>
                <div style="width: 90%; height: 24px; background: var(--border2); margin-bottom: 12px; border-radius: 4px;"></div>
                <div style="width: 70%; height: 24px; background: var(--border2); margin-bottom: 24px; border-radius: 4px;"></div>
                <div style="width: 100%; height: 100px; background: var(--bg2); border-left: 4px solid var(--border); border-radius: 4px;"></div>
            </div>
        </div>
    `;

    // 7. Fetch Logic
    if (appState.cache[cat.id]) {
        renderArticles(appState.cache[cat.id], cat, newsWrap);
    } else {
        var feedUrl = cat.feeds[0].url;
        var apiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feedUrl);
        
        fetch(apiUrl)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.status === 'ok') {
                    var newArticles = data.items.map(function (item) {
                        return {
                            title: item.title,
                            url: item.link,
                            source: cat.feeds[0].name,
                            pubDate: item.pubDate,
                            description: item.description || item.contentSnippet || "", 
                            image: item.thumbnail || (item.enclosure && item.enclosure.link) || ""
                        };
                    });
                    appState.cache[cat.id] = newArticles;
                    renderArticles(newArticles, cat, newsWrap);
                } else {
                    newsWrap.innerHTML = '<div style="padding:20px;text-align:center;color:red;">Error loading news.</div>';
                }
            })
            .catch(function(err) {
                newsWrap.innerHTML = '<div style="padding:20px;text-align:center;color:red;">Network Error.</div>';
            });
    }
}

// 8. Render UI: Swipeable Cards
function renderArticles(articles, cat, newsWrap) {
    newsWrap.innerHTML = "";
    
    if (!articles || !articles.length) {
        newsWrap.innerHTML = '<div style="padding:30px;text-align:center;color:var(--muted)">No articles found for today.</div>';
        return;
    }

    var swipeContainer = el("div", {
        className: "swipe-container",
        css: {
            height: "75vh", 
            maxHeight: "800px",
            overflowY: "scroll",
            scrollSnapType: "y mandatory", 
            borderRadius: "16px",
            border: "2px solid var(--border)",
            background: "var(--bg)", 
            position: "relative"
        }
    });

    articles.slice(0, 15).forEach(function (a) {
        var card = el("div", {
            css: {
                height: "100%",
                width: "100%",
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                borderBottom: "2px solid var(--border)",
                backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                backgroundColor: "var(--card)"
            }
        });

        // Hero Image
        var imgUrl = a.image || "https://via.placeholder.com/600x300/1A1A1A/FFFFFF?text=" + encodeURIComponent(cat.label);
        var hero = el("div", {
            css: {
                height: "45%",
                width: "100%",
                backgroundImage: `url('${imgUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderBottom: "2px solid var(--border)"
            }
        });
        card.appendChild(hero);

        // Content Area
        var content = el("div", { css: { padding: "24px", flex: "1", display: "flex", flexDirection: "column", background: "var(--card)" } });
        
        var meta = el("div", { css: { display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: ".75rem", fontWeight: "700", textTransform: "uppercase" } });
        meta.appendChild(el("span", { css: { color: cat.color }, txt: a.source }));
        
        var d = new Date(a.pubDate);
        meta.appendChild(el("span", { css: { color: "var(--subtle)" }, txt: !isNaN(d) ? d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Today" }));
        content.appendChild(meta);

        content.appendChild(el("h2", { 
            css: { fontSize: "1.4rem", fontWeight: "800", lineHeight: "1.3", marginBottom: "16px", color: "var(--text)" }, 
            txt: a.title 
        }));

        // Context Box
        var summaryBox = el("div", { css: { background: "var(--bg2)", padding: "16px", borderLeft: `4px solid ${cat.color}`, marginBottom: "auto", borderRadius: "0 8px 8px 0" } });
        summaryBox.appendChild(el("div", {
            css: { fontSize: ".7rem", fontWeight: "800", color: cat.color, marginBottom: "8px", textTransform: "uppercase", letterSpacing: ".05em" },
            txt: "💡 Exam Relevance & Context"
        }));
        
        var cleanDesc = a.description.replace(/<\/?[^>]+(>|$)/g, ""); 
        summaryBox.appendChild(el("div", {
            css: { fontSize: ".9rem", lineHeight: "1.6", color: "var(--text)" },
            txt: cleanDesc ? (cleanDesc.substring(0, 140) + "...") : "Key developments in this sector. Crucial for upcoming General Awareness sections."
        }));
        content.appendChild(summaryBox);

        // Action Bar
        var actionBar = el("div", { css: { display: "flex", gap: "12px", marginTop: "20px" } });
        var readBtn = el("button", {
            css: { flex: "1", padding: "14px", background: cat.color, color: "#fff", fontWeight: "700", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: ".95rem" },
            txt: "Read Full Article →",
            onclick: function() {
                updateDailyProgress();
                if (a.url) window.open(a.url, "_blank");
            }
        });
        
        actionBar.appendChild(readBtn);
        content.appendChild(actionBar);
        card.appendChild(content);
        swipeContainer.appendChild(card);
    });

    // End Card
    var endCard = el("div", {
        css: { height: "100%", width: "100%", scrollSnapAlign: "start", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--card)", textAlign: "center", padding: "40px" }
    });
    endCard.appendChild(el("div", { css: { fontSize: "3rem", marginBottom: "16px" }, txt: "🎉" }));
    endCard.appendChild(el("div", { css: { fontSize: "1.5rem", fontWeight: "800", marginBottom: "8px", color: "var(--text)" }, txt: "You're all caught up!" }));
    endCard.appendChild(el("div", { css: { fontSize: ".9rem", color: "var(--muted)" }, txt: "Check back tomorrow for more updates." }));
    swipeContainer.appendChild(endCard);

    newsWrap.appendChild(swipeContainer);
    
    newsWrap.appendChild(el("div", {
        css: { textAlign: "center", fontSize: ".8rem", color: "var(--muted)", marginTop: "12px", fontWeight: "600" },
        txt: "↕ Scroll vertically to view next article"
    }));
}

// 9. Auto-Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Looks for common container IDs, defaults to document.body if none found
    var target = document.getElementById('app') || document.getElementById('root') || document.getElementById('digest-container') || document.body;
    
    if (target === document.body) {
        // If attaching to body, wrap it in a clean div so it doesn't break existing layout
        appState.container = document.createElement('div');
        appState.container.id = 'digest-wrapper';
        document.body.appendChild(appState.container);
    } else {
        appState.container = target;
    }
    
    showMain();
});
