// ═══════════════════════════════════════════════════════════════════
// PAGE-DIGEST.JS — Daily Current Affairs Digest
// Fetches news from GNews API + generates MCQs via Claude AI
// ═══════════════════════════════════════════════════════════════════

var DIGEST_CACHE_KEY = "digest_cache";

function pgDigest() {
  var w = el("div", { css: { maxWidth: "700px", margin: "0 auto" } });

  function build(state, data) {
    w.innerHTML = "";

    // ── HEADER ──
    var hdr = el("div", {
      css: {
        display: "flex", alignItems: "center", gap: "12px",
        marginBottom: "24px", paddingBottom: "16px",
        borderBottom: "1.5px solid var(--border)"
      }
    });
    hdr.appendChild(el("button", {
      cls: "btn btng", css: { padding: "6px 12px" },
      onclick: function () { go("home"); }
    }, "← Back"));

    var hInfo = el("div", { css: { flex: "1" } });
    hInfo.appendChild(el("div", { css: { fontSize: "1rem", fontWeight: "600" }, txt: "📰 Daily Current Affairs Digest" }));
    hInfo.appendChild(el("div", { css: { fontSize: ".75rem", color: "var(--subtle)", marginTop: "1px" }, txt: "Top news + AI-generated MCQs for exam prep" }));
    hdr.appendChild(hInfo);

    // Refresh button
    var refBtn = el("button", {
      cls: "btn btng",
      css: { padding: "6px 12px", fontSize: ".8rem" },
      onclick: function () { loadDigest(true); }
    }, "🔄 Refresh");
    hdr.appendChild(refBtn);
    w.appendChild(hdr);

    // ── STATES ──
    if (state === "loading") {
      var loadBox = el("div", {
        css: {
          textAlign: "center", padding: "60px 20px",
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "16px"
        }
      });
      var spinner = el("div", { css: {
        width: "40px", height: "40px",
        border: "3px solid var(--border2)",
        borderTopColor: "#22c55e",
        borderRadius: "50%",
        animation: "digest-spin 0.8s linear infinite",
        margin: "0 auto 16px"
      }});
      loadBox.appendChild(spinner);
      loadBox.appendChild(el("div", { css: { fontSize: "1rem", fontWeight: "600", color: "var(--text)", marginBottom: "6px" }, txt: "Fetching today's news..." }));
      loadBox.appendChild(el("div", { css: { fontSize: ".85rem", color: "var(--muted)" }, txt: "Generating AI-powered MCQs for you" }));

      // Add spinner animation
      if (!document.getElementById("digest-spin-style")) {
        var st = document.createElement("style");
        st.id = "digest-spin-style";
        st.textContent = "@keyframes digest-spin { to { transform: rotate(360deg); } }";
        document.head.appendChild(st);
      }
      w.appendChild(loadBox);
      return;
    }

    if (state === "error") {
      var errBox = el("div", {
        css: {
          textAlign: "center", padding: "50px 20px",
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "16px"
        }
      });
      errBox.appendChild(el("div", { css: { fontSize: "2.5rem", marginBottom: "12px" }, txt: "⚠️" }));
      errBox.appendChild(el("div", { css: { fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }, txt: "Could not load digest" }));
      errBox.appendChild(el("div", { css: { fontSize: ".85rem", color: "var(--muted)", marginBottom: "20px" }, txt: data && data.msg ? data.msg : "Check your internet connection and try again." }));
      errBox.appendChild(el("button", { cls: "btn btnp", onclick: function () { loadDigest(true); } }, "Try Again"));
      w.appendChild(errBox);
      return;
    }

    if (state === "ready" && data) {
      // ── DATE BADGE ──
      var today = new Date();
      var dateStr = today.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      var dateBadge = el("div", {
        css: {
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
          borderRadius: "8px", padding: "6px 14px",
          fontSize: ".78rem", fontWeight: "600", color: "#22c55e",
          marginBottom: "20px"
        }
      }, "📅 " + dateStr);
      w.appendChild(dateBadge);

      // ── NEWS BULLETS SECTION ──
      var newsSection = el("div", {
        css: {
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "16px", padding: "22px", marginBottom: "20px",
          boxShadow: "var(--shadow-card)"
        }
      });

      // Section title
      var newsTitle = el("div", {
        css: {
          display: "flex", alignItems: "center", gap: "10px",
          marginBottom: "18px", paddingBottom: "12px",
          borderBottom: "1px solid var(--border)"
        }
      });
      newsTitle.appendChild(el("div", {
        css: {
          width: "32px", height: "32px", borderRadius: "8px",
          background: "rgba(34,197,94,0.15)", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: "1rem"
        }
      }, "📰"));
      newsTitle.appendChild(el("div", {}, [
        el("div", { css: { fontSize: ".95rem", fontWeight: "700", color: "var(--text)" }, txt: "Top News Bullets" }),
        el("div", { css: { fontSize: ".7rem", color: "var(--subtle)" }, txt: "Key stories for exam preparation" })
      ]));
      newsSection.appendChild(newsTitle);

      // News items
      data.bullets.forEach(function (item, i) {
        var bullet = el("div", {
          css: {
            display: "flex", gap: "12px", alignItems: "flex-start",
            padding: "12px 0",
            borderBottom: i < data.bullets.length - 1 ? "1px solid var(--border)" : "none"
          }
        });

        var num = el("div", {
          css: {
            minWidth: "24px", height: "24px", borderRadius: "6px",
            background: "rgba(34,197,94,0.15)", color: "#22c55e",
            fontSize: ".72rem", fontWeight: "700",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginTop: "1px"
          }
        }, String(i + 1));

        var textWrap = el("div", { css: { flex: "1" } });
        textWrap.appendChild(el("div", { css: { fontSize: ".9rem", lineHeight: "1.6", color: "var(--text)", fontWeight: "500" }, txt: item.headline }));
        if (item.detail) {
          textWrap.appendChild(el("div", { css: { fontSize: ".78rem", color: "var(--muted)", marginTop: "4px", lineHeight: "1.5" }, txt: item.detail }));
        }
        if (item.tag) {
          textWrap.appendChild(el("span", {
            css: {
              display: "inline-block", marginTop: "6px",
              fontSize: ".65rem", fontWeight: "700", textTransform: "uppercase",
              letterSpacing: ".06em", color: "#22c55e",
              background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: "4px"
            }
          }, item.tag));
        }

        bullet.appendChild(num);
        bullet.appendChild(textWrap);
        newsSection.appendChild(bullet);
      });

      w.appendChild(newsSection);

      // ── MCQ SECTION ──
      var mcqSection = el("div", {
        css: {
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "16px", padding: "22px",
          boxShadow: "var(--shadow-card)"
        }
      });

      var mcqTitle = el("div", {
        css: {
          display: "flex", alignItems: "center", gap: "10px",
          marginBottom: "18px", paddingBottom: "12px",
          borderBottom: "1px solid var(--border)"
        }
      });
      mcqTitle.appendChild(el("div", {
        css: {
          width: "32px", height: "32px", borderRadius: "8px",
          background: "rgba(99,102,241,0.15)", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: "1rem"
        }
      }, "🧠"));
      mcqTitle.appendChild(el("div", {}, [
        el("div", { css: { fontSize: ".95rem", fontWeight: "700", color: "var(--text)" }, txt: "AI-Generated MCQs" }),
        el("div", { css: { fontSize: ".7rem", color: "var(--subtle)" }, txt: "Practice questions based on today's news" })
      ]));
      mcqSection.appendChild(mcqTitle);

      // MCQ items
      data.mcqs.forEach(function (mcq, qi) {
        var answered = null;
        var qBox = el("div", {
          css: {
            marginBottom: qi < data.mcqs.length - 1 ? "22px" : "0",
            paddingBottom: qi < data.mcqs.length - 1 ? "22px" : "0",
            borderBottom: qi < data.mcqs.length - 1 ? "1px solid var(--border)" : "none"
          }
        });

        qBox.appendChild(el("div", {
          css: { fontSize: ".88rem", fontWeight: "600", lineHeight: "1.55", marginBottom: "12px", color: "var(--text)" },
          txt: "Q" + (qi + 1) + ". " + mcq.q
        }));

        var optWrap = el("div", { css: { display: "flex", flexDirection: "column", gap: "8px" } });

        mcq.o.forEach(function (opt, oi) {
          var optBtn = el("button", {
            css: {
              textAlign: "left", padding: "10px 14px", borderRadius: "10px",
              border: "1.5px solid var(--border2)", background: "var(--bg2)",
              color: "var(--text)", cursor: "pointer", fontSize: ".84rem",
              fontFamily: "inherit", lineHeight: "1.45", transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: "10px"
            }
          });

          var optLabel = el("span", {
            css: {
              minWidth: "22px", height: "22px", borderRadius: "6px",
              background: "var(--border)", color: "var(--muted)",
              fontSize: ".72rem", fontWeight: "700",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0"
            }
          }, ["A","B","C","D"][oi]);

          optBtn.appendChild(optLabel);
          optBtn.appendChild(el("span", {}, opt));

          optBtn.addEventListener("mouseenter", function () {
            if (answered === null) {
              this.style.borderColor = "#22c55e";
              this.style.background = "rgba(34,197,94,0.06)";
            }
          });
          optBtn.addEventListener("mouseleave", function () {
            if (answered === null) {
              this.style.borderColor = "var(--border2)";
              this.style.background = "var(--bg2)";
            }
          });

          optBtn.onclick = function () {
            if (answered !== null) return;
            answered = oi;

            // Style all options after answer
            var allOpts = optWrap.querySelectorAll("button");
            allOpts.forEach(function (ob, idx) {
              ob.style.cursor = "default";
              if (idx === mcq.a) {
                ob.style.borderColor = "#22c55e";
                ob.style.background = "rgba(34,197,94,0.12)";
                ob.style.color = "#22c55e";
                ob.querySelector("span").style.background = "#22c55e";
                ob.querySelector("span").style.color = "#fff";
              } else if (idx === oi && oi !== mcq.a) {
                ob.style.borderColor = "#f87171";
                ob.style.background = "rgba(248,113,113,0.1)";
                ob.style.color = "#f87171";
              }
            });

            // Show explanation
            if (mcq.exp) {
              var expBox = el("div", {
                css: {
                  marginTop: "10px", padding: "10px 14px",
                  background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: "8px", fontSize: ".78rem", color: "var(--muted)", lineHeight: "1.55"
                }
              }, "💡 " + mcq.exp);
              qBox.appendChild(expBox);
            }
          };

          optWrap.appendChild(optBtn);
        });

        qBox.appendChild(optWrap);
        mcqSection.appendChild(qBox);
      });

      w.appendChild(mcqSection);

      // ── FOOTER ──
      var footer = el("div", {
        css: {
          textAlign: "center", marginTop: "20px",
          fontSize: ".72rem", color: "var(--subtle)"
        }
      }, "📡 Powered by GNews API + Claude AI · Updates daily");
      w.appendChild(footer);
    }
  }

  // ── LOAD DIGEST ──
  function loadDigest(forceRefresh) {
    var todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Check cache
    if (!forceRefresh) {
      try {
        var cached = JSON.parse(localStorage.getItem(DIGEST_CACHE_KEY) || "null");
        if (cached && cached.date === todayKey && cached.data) {
          build("ready", cached.data);
          return;
        }
      } catch (e) {}
    }

    build("loading");

    // Fetch from GNews
    var url = "/api/news";
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (gdata) {
        if (!gdata.articles || !gdata.articles.length) {
          build("error", { msg: "No articles found from news API." });
          return;
        }

        // Build news context for Claude
        var newsContext = gdata.articles.map(function (a, i) {
          return (i + 1) + ". " + a.title + (a.description ? " — " + a.description : "");
        }).join("\n");

        // Call Claude API
        fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{
              role: "user",
              content: `You are an expert current affairs teacher for Indian competitive exams (UPSC, SSC, RRB).

Here are today's top news articles:
${newsContext}

Return ONLY a valid JSON object (no markdown, no backticks) in this exact format:
{
  "bullets": [
    {"headline": "short headline", "detail": "1 sentence exam-relevant context", "tag": "category like ECONOMY/POLITY/SCIENCE"},
    ...5 items
  ],
  "mcqs": [
    {"q": "question text", "o": ["option A", "option B", "option C", "option D"], "a": 0, "exp": "brief explanation"},
    ...3 items
  ]
}

Rules:
- bullets: 5 items, exam-focused, highlight key facts/numbers/names
- mcqs: 3 questions directly from the news, a = index of correct option (0-3)
- exp: one sentence explanation of correct answer
- Keep language simple and exam-oriented`
            }]
          })
        })
        .then(function (r) { return r.json(); })
        .then(function (aiResp) {
          try {
            var text = aiResp.content[0].text.trim();
            // Strip any markdown fences if present
            text = text.replace(/```json|```/g, "").trim();
            var parsed = JSON.parse(text);

            // Cache it
            localStorage.setItem(DIGEST_CACHE_KEY, JSON.stringify({
              date: todayKey,
              data: parsed
            }));

            build("ready", parsed);
          } catch (e) {
            build("error", { msg: "AI response could not be parsed. Try refreshing." });
          }
        })
        .catch(function () {
          build("error", { msg: "AI service unavailable. Please try again later." });
        });
      })
      .catch(function () {
        build("error", { msg: "Could not reach news server. Check your internet connection." });
      });
  }

  loadDigest(false);
  return w;
}
