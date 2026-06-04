window.STUDYLAB_FEEDBACK_URL = "https://formspree.io/f/mzdyqbyz";

// ─── MODERN HERO SECTION ──────────────────────────────────────────
function makeModernHero() {
  var wrap = el("div", {
    css: {
      position: "relative", borderRadius: "24px", overflow: "hidden",
      marginBottom: "32px", padding: "48px 20px", textAlign: "center",
      background: "var(--card)", border: "1px solid var(--border)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
    }
  });

  var glow1 = el("div", { css: { position: "absolute", top: "-50px", left: "-50px", width: "200px", height: "200px", background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)", opacity: "0.15", filter: "blur(30px)", pointerEvents: "none" } });
  var glow2 = el("div", { css: { position: "absolute", bottom: "-50px", right: "-50px", width: "250px", height: "250px", background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)", opacity: "0.1", filter: "blur(40px)", pointerEvents: "none" } });
  wrap.appendChild(glow1);
  wrap.appendChild(glow2);

  var content = el("div", { css: { position: "relative", zIndex: "1", maxWidth: "600px", margin: "0 auto" } });

  var badge = el("div", {
    css: {
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "6px 14px", borderRadius: "100px",
      background: "var(--bg2)", border: "1px solid var(--border2)",
      fontSize: ".75rem", fontWeight: "700", color: "var(--text)",
      marginBottom: "20px", cursor: "pointer", transition: "transform 0.2s"
    },
    onclick: function() { go("skilltree"); }
  });
  badge.addEventListener("mouseenter", function() { this.style.transform = "scale(1.05)"; });
  badge.addEventListener("mouseleave", function() { this.style.transform = "scale(1)"; });
  badge.innerHTML = "<span style='color: #f59e0b'>✨</span> <span>New: RPG Skill Tree & Study Shorts</span> <span style='color: var(--muted)'>→</span>";
  content.appendChild(badge);

  content.appendChild(el("h1", {
    css: {
      fontSize: "clamp(2rem, 6vw, 2.8rem)", fontWeight: "800",
      letterSpacing: "-0.03em", fontFamily: "var(--font-display)",
      color: "var(--text)", lineHeight: "1.15", marginBottom: "16px"
    },
    htm: "Crack Your Exams with <br><span style='background: linear-gradient(135deg, #4F8EF7, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>Smarter Practice.</span>"
  }));

  content.appendChild(el("p", {
    css: {
      fontSize: ".95rem", color: "var(--muted)", lineHeight: "1.6",
      marginBottom: "32px", fontWeight: "400", maxWidth: "90%", margin: "0 auto 32px"
    },
    txt: "A free, distraction-free learning lab for UPSC, SSC, and State PCS. Master 4,000+ curated MCQs with instant AI-powered explanations."
  }));

  var ctaRow = el("div", { css: { display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "40px" } });
  
  var primaryBtn = el("button", {
    css: {
      padding: "12px 28px", borderRadius: "12px", border: "none",
      background: "linear-gradient(135deg, #4F8EF7, #3b82f6)", color: "#fff", fontWeight: "700",
      fontSize: ".95rem", cursor: "pointer", fontFamily: "var(--font-body)",
      boxShadow: "0 4px 14px rgba(79,142,247,0.35)", transition: "all 0.2s"
    },
    onclick: function() { document.getElementById('ss').scrollIntoView({behavior:'smooth', block:'start'}); }
  }, "Start Learning");
  primaryBtn.addEventListener("mouseenter", function() { this.style.transform = "translateY(-2px)"; this.style.boxShadow = "0 6px 20px rgba(79,142,247,0.45)"; });
  primaryBtn.addEventListener("mouseleave", function() { this.style.transform = "translateY(0)"; this.style.boxShadow = "0 4px 14px rgba(79,142,247,0.35)"; });
  
  var secondaryBtn = el("button", {
    css: {
      padding: "12px 28px", borderRadius: "12px", border: "1.5px solid var(--border2)",
      background: "var(--bg2)", color: "var(--text)", fontWeight: "600",
      fontSize: ".95rem", cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.2s"
    },
    onclick: function() { go("shorts"); }
  }, "⚡ Study Shorts");
  secondaryBtn.addEventListener("mouseenter", function() { this.style.background = "var(--border)"; });
  secondaryBtn.addEventListener("mouseleave", function() { this.style.background = "var(--bg2)"; });
  
  ctaRow.appendChild(primaryBtn);
  ctaRow.appendChild(secondaryBtn);
  content.appendChild(ctaRow);

  var trustStrip = el("div", {
    css: {
      display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap",
      paddingTop: "24px", borderTop: "1px solid var(--border)",
      fontSize: ".75rem", fontWeight: "600", color: "var(--subtle)",
      letterSpacing: "0.03em", textTransform: "uppercase"
    }
  });
  
  var features = [
    { icon: "🗺️", text: "RPG Skill Tree" },
    { icon: "⚡", text: "Study Shorts" },
    { icon: "🤖", text: "AI Tutors" }
  ];
  
  features.forEach(function(f) {
    var item = el("div", { css: { display: "flex", alignItems: "center", gap: "6px" } });
    item.appendChild(el("span", { css: { fontSize: "1rem" } }, f.icon));
    item.appendChild(el("span", {}, f.text));
    trustStrip.appendChild(item);
  });
  
  content.appendChild(trustStrip);
  wrap.appendChild(content);

  return wrap;
}

// ─── DEADLINE COUNTDOWN WIDGET ───────────────────────────────────
function makeDeadlineWidget() {
  var stored = Sv.get("gu_entries") || [];
  var allData = stored.concat(typeof GU_FALLBACK !== 'undefined' ? GU_FALLBACK : []);
  
  var now = new Date();
  now.setHours(0,0,0,0);
  var closestEntry = null;
  var closestDiff = Infinity;
  var isExam = false;

  allData.forEach(function(e) {
    var dateStr = e.lastDate || e.examDate;
    if(!dateStr) return;
    
    var cleanDateStr = dateStr.replace(/(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})/, '$3-$2-$1');
    var parsed = new Date(cleanDateStr);
    
    if (!isNaN(parsed) && parsed >= now) {
      var diff = parsed - now;
      if (diff < closestDiff) {
        closestDiff = diff;
        closestEntry = e;
        isExam = !!e.examDate;
      }
    }
  });

  if (!closestEntry || closestDiff === Infinity) return el("div", {css:{display:"none"}});
  var daysLeft = Math.ceil(closestDiff / (1000 * 60 * 60 * 24));
  if (daysLeft > 30) return el("div", {css:{display:"none"}});

  var isUrgent = daysLeft <= 3;
  var wCol = isUrgent ? "#ef4444" : "#f59e0b";
  var wBg = isUrgent ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)";

  var widget = el("div", {
    css: {
      background: "var(--card)", border: "1.5px solid " + wCol, borderRadius: "16px",
      padding: "16px 20px", marginBottom: "28px", display: "flex",
      alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 8px 24px " + wBg, cursor: "pointer", transition: "transform 0.2s"
    },
    onclick: function() { go("govtupdates"); }
  });
  
  widget.addEventListener("mouseenter", function() { this.style.transform = "translateY(-3px)"; });
  widget.addEventListener("mouseleave", function() { this.style.transform = "translateY(0)"; });

  var left = el("div", {css: {display: "flex", alignItems: "center", gap: "14px", flex:"1", minWidth:"0"}});
  left.appendChild(el("div", {
    css: {fontSize: "2rem", animation: isUrgent ? "pulse-dot 1.2s infinite" : "none", flexShrink:"0"},
    txt: isExam ? "📝" : "⏳"
  }));

  var textWrap = el("div", {css:{minWidth:"0"}});
  var typeText = isExam ? "Upcoming Exam" : "Application Deadline";
  textWrap.appendChild(el("div", {css: {fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".1em", color: wCol, fontWeight: "700", marginBottom: "2px"}}, typeText));
  textWrap.appendChild(el("div", {css: {fontSize: ".95rem", fontWeight: "700", color: "var(--text)", display: "-webkit-box", WebkitLineClamp: "1", WebkitBoxOrient: "vertical", overflow: "hidden", paddingRight:"10px"}}, closestEntry.org + " — " + closestEntry.title));
  left.appendChild(textWrap);
  widget.appendChild(left);

  var right = el("div", {
    css: {background: wCol, color: "#fff", padding: "6px 14px", borderRadius: "10px", fontWeight: "800", fontSize: ".9rem", whiteSpace: "nowrap", flexShrink:"0"}
  }, daysLeft === 0 ? "Today!" : daysLeft + " Days");
  
  widget.appendChild(right);
  return widget;
}

// ─── AI DOUBT SOLVER ─────────────────────────────────────────────
var ADS_LOADING = false;

function makeAIDoubtSolver() {
  var wrapper = el("div", {
    id: "ai-doubt-solver",
    css: {
      marginBottom: "28px", borderRadius: "18px", overflow: "hidden",
      border: "1px solid var(--border2)", background: "var(--card)",
      boxShadow: "var(--shadow-elevated, 0 12px 32px rgba(0,0,0,0.12))",
      transition: "box-shadow 0.3s ease"
    }
  });

  var bar = el("div", {
    id: "ads-bar",
    css: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 18px", cursor: "pointer", background: "var(--card2)",
      transition: "background 0.2s ease", userSelect: "none"
    }
  });

  var barLeft = el("div", {css: {display: "flex", alignItems: "center", gap: "12px"}});

  var icon = el("div", {
    css: {
      width: "40px", height: "40px", flexShrink: "0", background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
      borderRadius: "11px", display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 4px 12px rgba(99,102,241,0.45)", fontFamily: "var(--font-display)", 
      fontSize: "1rem", fontWeight: "800", color: "#fff", letterSpacing: "-0.02em"
    }
  }, "S");

  var barText = el("div");
  barText.appendChild(el("div", {
    css: {fontFamily: "var(--font-display)", fontSize: ".93rem", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.02em"}
  }, "AI Doubt Solver"));
  barText.appendChild(el("div", {
    css: {fontSize: ".73rem", color: "var(--muted)", marginTop: "2px"}
  }, "Tap to collapse..."));

  barLeft.appendChild(icon);
  barLeft.appendChild(barText);

  var arrow = el("div", {
    css: {fontSize: "1.1rem", color: "var(--muted)", transition: "transform 0.3s cubic-bezier(0.2,0.8,0.2,1)", lineHeight: "1", transform: "rotate(180deg)"}
  }, "▾");

  bar.appendChild(barLeft);
  bar.appendChild(arrow);

  var panel = el("div", {
    css: { display: "flex", flexDirection: "column", borderTop: "1px solid var(--border)" }
  });

  var chatArea = el("div", {
    id: "ads-chat-area",
    css: {
      maxHeight: "300px", overflowY: "auto", padding: "16px 16px 8px",
      display: "flex", flexDirection: "column", gap: "20px", scrollBehavior: "smooth"
    }
  });

  var welcome = el("div", {
    id: "ads-welcome",
    css: {textAlign: "center", padding: "20px 16px 12px"}
  });
  welcome.appendChild(el("div", {css: {fontSize: "1.8rem", marginBottom: "8px"}}, "🎓"));
  welcome.appendChild(el("div", {css: {fontWeight: "700", color: "var(--text)", marginBottom: "5px", fontFamily: "var(--font-display)"}}, "Ask me anything!"));
  welcome.appendChild(el("div", {css: {fontSize: ".8rem", color: "var(--muted)", lineHeight: "1.5"}}, "History, Geography, Polity, Economy, Science, GK — I'm here to help."));
  chatArea.appendChild(welcome);

  var messages = el("div", {id: "ads-messages"});
  chatArea.appendChild(messages);
  panel.appendChild(chatArea);

  var inputRow = el("div", {
    css: {
      display: "flex", alignItems: "center", gap: "8px",
      padding: "10px 14px", borderTop: "1px solid var(--border)"
    }
  });

  var input = el("input", {
    id: "ads-input", type: "text", placeholder: "e.g. What is the Preamble of India?",
    css: {
      flex: "1", background: "var(--bg2)", border: "1.5px solid var(--border)", 
      borderRadius: "10px", color: "var(--text)", fontFamily: "var(--font-body)",
      fontSize: ".85rem", padding: "9px 13px", outline: "none"
    }
  });
  input.addEventListener("focus", function() {
    this.style.borderColor = "var(--accent)"; this.style.boxShadow = "0 0 0 3px var(--accent-glow)";
  });
  input.addEventListener("blur", function() {
    this.style.borderColor = "var(--border)"; this.style.boxShadow = "none";
  });
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") sendDoubt(messages, welcome, input, sendBtn);
  });

  var sendBtn = el("button", {
    css: {
      width: "38px", height: "38px", flexShrink: "0", background: "linear-gradient(135deg, #3174F6, #5a9af8)",
      border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", 
      display: "flex", alignItems: "center", justifyContent: "center", 
      transition: "all 0.18s ease", boxShadow: "0 4px 12px rgba(49,116,246,0.35)"
    },
    onclick: function() { sendDoubt(messages, welcome, input, sendBtn); }
  });
  sendBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
  sendBtn.addEventListener("mouseenter", function() { this.style.transform = "translateY(-2px)"; this.style.boxShadow = "0 6px 16px rgba(49,116,246,0.5)"; });
  sendBtn.addEventListener("mouseleave", function() { this.style.transform = "translateY(0)"; this.style.boxShadow = "0 4px 12px rgba(49,116,246,0.35)"; });

  inputRow.appendChild(input);
  inputRow.appendChild(sendBtn);
  panel.appendChild(inputRow);

  panel.appendChild(el("div", {
    css: {textAlign: "center", fontSize: ".62rem", color: "var(--subtle)", padding: "6px 14px 12px", letterSpacing: "0.04em"}
  }, "Powered by Sarvam AI · Made for India 🇮🇳"));

  var isOpen = true; 
  
  bar.addEventListener("click", function() {
    isOpen = !isOpen;
    panel.style.display = isOpen ? "flex" : "none";
    arrow.style.transform = isOpen ? "rotate(180deg)" : "rotate(0deg)";
    barText.children[1].textContent = isOpen ? "Tap to collapse..." : "Tap to ask anything about your studies...";
    wrapper.style.boxShadow = isOpen ? "var(--shadow-elevated, 0 12px 32px rgba(0,0,0,0.12))" : "var(--shadow-card)";
    bar.style.background = isOpen ? "var(--card2)" : "transparent";
    if (isOpen) setTimeout(function() { input.focus(); }, 300);
  });

  bar.addEventListener("mouseenter", function() { if (!isOpen) this.style.background = "var(--card2)"; });
  bar.addEventListener("mouseleave", function() { if (!isOpen) this.style.background = "transparent"; });

  wrapper.appendChild(bar);
  wrapper.appendChild(panel);
  return wrapper;
}

async function sendDoubt(messages, welcome, input, sendBtn) {
  if (ADS_LOADING) return;
  var question = input.value.trim();
  if (!question) return;

  if (welcome) welcome.style.display = "none";

  input.value = "";
  ADS_LOADING = true;
  sendBtn.disabled = true;
  sendBtn.style.opacity = "0.5";

  messages.appendChild(adsCreateBubble("user", question));
  adsScrollChat();

  var typing = adsCreateTyping();
  messages.appendChild(typing);
  adsScrollChat();

  try {
    var res = await fetch("/api/doubt", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ question: question })
    });

    var data = await res.json();
    messages.removeChild(typing);

    if (data.answer) {
      messages.appendChild(adsCreateBubble("ai", data.answer));
    } else if (data.error) {
      messages.appendChild(adsCreateBubble("ai", "⚠️ " + data.error));
    } else {
      messages.appendChild(adsCreateBubble("ai", "⚠️ No response. Please try again."));
    }
  } catch(err) {
    if(messages.contains(typing)) messages.removeChild(typing);
    messages.appendChild(adsCreateBubble("ai", "⚠️ Network error. Check your connection."));
  }

  ADS_LOADING = false;
  sendBtn.disabled = false;
  sendBtn.style.opacity = "1";
  adsScrollChat();
  input.focus();
}

function adsCreateBubble(type, text) {
  var msg = el("div", {css: {display: "flex", gap: "8px", flexDirection: type === "user" ? "row-reverse" : "row", animation: "msg-pop 0.25s ease", marginBottom: "4px"}});

  var avatar = el("div", {
    css: {
      width: "26px", height: "26px", borderRadius: "50%", flexShrink: "0",
      display: "flex", alignItems: "center", justifyContent: "center",
      marginTop: "2px", fontSize: ".8rem",
      background: type === "user" ? "var(--accent)" : "linear-gradient(135deg, #6366F1, #8B5CF6)", 
      color: "#fff", fontWeight: "700", overflow: "hidden"
    }
  });
  
  if (type === "user") {
    var userName = (window.currentUser && window.currentUser.displayName)
      ? window.currentUser.displayName.trim()[0].toUpperCase()
      : "U";
    avatar.textContent = userName;
  } else {
    avatar.textContent = "S";
    avatar.style.fontFamily = "var(--font-display)";
    avatar.style.fontWeight = "800";
    avatar.style.fontSize = ".75rem";
  }

  var bubble = el("div", {
    css: {
      maxWidth: "82%", padding: "10px 14px", fontSize: ".9rem", lineHeight: "1.6",
      color: type === "user" ? "#fff" : "var(--text)", 
      fontWeight: "500", 
      background: type === "user" ? "var(--accent)" : "var(--card)", 
      border: type === "user" ? "none" : "1.5px solid var(--border2)", 
      borderRadius: type === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
      boxShadow: type === "user" ? "0 4px 12px rgba(0,0,0,0.15)" : "0 2px 10px rgba(0,0,0,0.04)"
    }
  });
  
  var formattedText = text
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong style='color: var(--text); font-weight: 800;'>$1</strong>");
    
  bubble.innerHTML = formattedText;

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  return msg;
}

function adsCreateTyping() {
  var msg = el("div", {css: {display: "flex", gap: "8px", alignItems: "flex-end"}});
  var avatar = el("div", {
    css: {
      width: "26px", height: "26px", borderRadius: "50%", flexShrink: "0",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #6366F1, #8B5CF6)", overflow: "hidden"
    }
  });
  avatar.textContent = "S";
  avatar.style.background = "linear-gradient(135deg, #6366F1, #8B5CF6)";
  avatar.style.fontFamily = "var(--font-display)";
  avatar.style.fontWeight = "800";
  avatar.style.fontSize = ".75rem";
  avatar.style.color = "#fff";

  var bubble = el("div", {
    css: {
      padding: "10px 14px", borderRadius: "14px 14px 14px 4px",
      background: "var(--card2)", border: "1px solid var(--border)",
      display: "flex", gap: "4px", alignItems: "center"
    }
  });
  for (var i = 0; i < 3; i++) {
    var dot = el("span", {
      css: {
        width: "6px", height: "6px", borderRadius: "50%", background: "var(--muted)", 
        display: "inline-block", animation: "typing-bounce 1.2s ease-in-out infinite", animationDelay: (i * 0.2) + "s"
      }
    });
    bubble.appendChild(dot);
  }
  msg.appendChild(avatar);
  msg.appendChild(bubble);
  return msg;
}

function adsScrollChat() {
  var area = document.getElementById("ads-chat-area");
  if (area) setTimeout(function() { area.scrollTop = area.scrollHeight; }, 50);
}

// INTERACTIVE EMOJI FEEDBACK WIDGET (PREMIUM SPACING)
function createSmartFeedbackWidget() {
    var widgetWrap = el("div", { 
        css: { 
            background: "var(--card)", border: "1.5px solid var(--border)", 
            borderRadius: "24px", /* Thoda aur smooth curve */
            padding: "32px 28px", /* 🔥 MAIN FIX: Andar ki spacing badha di taaki text/button side se na chipke */
            margin: "24px auto", 
            maxWidth: "680px", 
            width: "calc(100% - 16px)", 
            boxSizing: "border-box",
            textAlign: "center", 
            boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
            transition: "box-shadow 0.3s ease, border-color 0.3s ease"
        } 
    });

    widgetWrap.appendChild(el("h3", { css: { margin: "0 0 6px 0", fontSize: "1.4rem", color: "var(--text)", fontFamily: "var(--font-display)", fontWeight: "800" }, txt: "Rate your experience!" }));
    widgetWrap.appendChild(el("p", { css: { margin: "0 0 20px 0", fontSize: ".9rem", color: "var(--muted)" }, txt: "Your feedback helps us improve StudyLab." }));

    // Dynamic Emoji Display
    var emojiDisplay = el("div", { 
        css: { 
            fontSize: "4rem", /* Emoji thoda bada kiya */
            margin: "10px 0 24px 0", 
            transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            display: "inline-block",    
            transformOrigin: "center",  
            willChange: "transform",    
            lineHeight: "1", 
        },
        txt: "🤔" 
    });
    var emojis = ["🤔", "😞", "😐", "🙂", "😊", "🤩"];
    var ratingText = ["Tap a star", "Needs Work", "It's Okay", "Good", "Great!", "Absolutely Amazing!"];
    var statusText = el("div", { css: { fontSize: ".95rem", fontWeight: "700", color: "var(--accent)", marginBottom: "20px", minHeight: "22px" }, txt: "Tap a star" });

    widgetWrap.appendChild(emojiDisplay);

    // Interactive Stars
    var starContainer = el("div", { css: { display: "flex", justifyContent: "center", gap: "10px", fontSize: "2.8rem", color: "var(--border2)", cursor: "pointer", marginBottom: "24px" } });
    var stars = [];
    var currentRating = 0; 
    var formReveal = el("div", { css: { display: "none", animation: "fade-in 0.4s ease", marginTop: "10px" } });

    for (let i = 1; i <= 5; i++) {
        let star = el("span", { txt: "★", css: { transition: "all 0.2s ease", color: "var(--border)" } });

        star.onclick = function() {
            currentRating = i;

            emojiDisplay.style.willChange = "transform";
            emojiDisplay.style.transform = "scale(1.2) rotate(5deg)";

            setTimeout(() => {
                emojiDisplay.style.transform = "scale(1) rotate(0deg)";
                setTimeout(() => { emojiDisplay.style.willChange = "auto"; }, 300);
            }, 200);

            emojiDisplay.textContent = emojis[i];
            statusText.textContent = ratingText[i];
            statusText.style.color = (i <= 2) ? "#ef4444" : (i <= 4) ? "#f59e0b" : "#10b981";

            stars.forEach((s, index) => {
                if (index < currentRating) {
                    s.style.color = "#f59e0b";
                    s.style.textShadow = "0 0 15px rgba(245, 158, 11, 0.4)";
                    s.style.transform = "scale(1.15)";
                } else {
                    s.style.color = "var(--border)";
                    s.style.textShadow = "none";
                    s.style.transform = "scale(1)";
                }
            });

            formReveal.style.display = "block";
        };
        stars.push(star);
        starContainer.appendChild(star);
    }

    widgetWrap.appendChild(starContainer);
    widgetWrap.appendChild(statusText);

    // Text Area & Submit
    var textArea = el("textarea", { 
        css: { 
            width: "100%", 
            padding: "16px", /* Andar ki padding thodi badhai */
            borderRadius: "14px", 
            border: "1.5px solid var(--border2)", 
            background: "var(--bg)", /* Background thoda contrast kiya */
            color: "var(--text)", 
            minHeight: "100px", 
            marginBottom: "20px", /* Niche ka gap badhaya */
            fontFamily: "var(--font-body)", 
            resize: "none", 
            boxSizing: "border-box", 
            display: "block", 
            fontSize: ".95rem",
            lineHeight: "1.5",
            outline: "none",
            transition: "border-color 0.2s ease"
        } 
    });
    textArea.placeholder = "Tell us what you loved or what we can improve... (Optional)";
    
    // Focus effect for premium feel
    textArea.onfocus = function() { textArea.style.borderColor = "var(--accent)"; };
    textArea.onblur = function() { textArea.style.borderColor = "var(--border2)"; };

    var submitBtn = el("button", { 
        css: { 
            width: "100%", 
            padding: "16px", 
            background: "linear-gradient(135deg, #4F8EF7, #3b82f6)", 
            color: "#fff", 
            border: "none", 
            borderRadius: "14px", 
            fontWeight: "700", 
            fontFamily: "var(--font-body)",
            cursor: "pointer", 
            fontSize: "1.05rem", 
            boxShadow: "0 6px 20px rgba(79,142,247,0.25)", 
            transition: "transform 0.2s, box-shadow 0.2s",
            boxSizing: "border-box", 
            display: "block" 
        }, 
        txt: "Send Feedback 🚀" 
    });

    submitBtn.onmousedown = function() { this.style.transform = "scale(0.97)"; };
    submitBtn.onmouseup = function() { this.style.transform = "scale(1)"; };
    submitBtn.onmouseleave = function() { this.style.transform = "scale(1)"; };

    submitBtn.onclick = function() {
        if (currentRating === 0) return;

        var feedbackText = textArea.value.trim();

        var user = { name: "Guest User", phone: "No Phone" };
        try {
            var savedData = localStorage.getItem('sl_user');
            if (savedData) user = JSON.parse(savedData);
        } catch(e) {}

        if (window.STUDYLAB_FEEDBACK_URL) {
            submitBtn.textContent = "Sending...";
            submitBtn.style.opacity = "0.7";
            fetch(window.STUDYLAB_FEEDBACK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    Date: new Date().toLocaleString("en-IN"),
                    Name: user.name,
                    Phone: user.phone,
                    Rating: currentRating + " stars",
                    Message: feedbackText || "(no message)"
                })
            }).then(function() {
                var firstName = user.name.split(' ')[0] || "there";
                widgetWrap.innerHTML = `
                <div style="padding: 40px 20px; text-align: center; animation: bounce-in 0.5s ease;">
                    <div style="font-size: 3.8rem; margin-bottom: 20px;">💖</div>
                    <div style="font-weight: 800; font-size: 1.5rem; color: var(--text); margin-bottom: 10px; font-family: var(--font-display);">You're awesome, ${firstName}!</div>
                    <div style="font-size: 1rem; color: var(--muted); line-height: 1.6;">Thank you for helping us make StudyLab the best exam partner.</div>
                </div>`;
            }).catch(function() {
                alert("Network error. Please try again.");
                submitBtn.textContent = "Send Feedback 🚀";
                submitBtn.style.opacity = "1";
            });
        }
    };

    formReveal.appendChild(textArea);
    formReveal.appendChild(submitBtn);
    widgetWrap.appendChild(formReveal);

    return widgetWrap;
}
// ── OPEN FEEDBACK IN A POPUP MODAL ──
window.openFeedbackModal = function() {
    var overlay = el("div", {
        css: {
            position: "fixed", inset: "0", background: "rgba(4, 8, 16, 0.85)", 
            backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center", 
            zIndex: "10000", padding: "20px", animation: "fade-in 0.2s ease"
        }
    });

    overlay.addEventListener("click", function(e) {
        if (e.target === overlay) document.body.removeChild(overlay);
    });

    // Aapka widget call kiya
    var widget = createSmartFeedbackWidget();
    widget.style.margin = "0"; 
    widget.style.position = "relative"; 

    // Close button (X)
    var closeBtn = el("button", {
        css: {
            position: "absolute", top: "16px", right: "16px", 
            background: "var(--card2)", border: "none", borderRadius: "50%", 
            width: "32px", height: "32px", fontSize: "1.2rem", 
            color: "var(--muted)", cursor: "pointer", display: "flex", 
            alignItems: "center", justifyContent: "center", transition: "all 0.2s"
        },
        txt: "×",
        onclick: function() { document.body.removeChild(overlay); }
    });
    
    closeBtn.onmouseover = function() { this.style.color = "var(--text)"; this.style.background = "var(--border2)"; };
    closeBtn.onmouseleave = function() { this.style.color = "var(--muted)"; this.style.background = "var(--card2)"; };

    widget.appendChild(closeBtn);
    overlay.appendChild(widget);
    document.body.appendChild(overlay);
};





// ─── MAIN PAGE RENDER ────────────────────────────────────────────
function pgHome(){
  var tot=SUBJ.reduce(function(s,k){return s+(QD[k]||[]).length;},0);
  var w=el("div",{cls:"fd"});
  w.appendChild(makeNav("home"));

  w.appendChild(makeModernHero());
  w.appendChild(makeDeadlineWidget());
  if (typeof makeQuoteCard === 'function') w.appendChild(makeQuoteCard());

  var skillTreeBanner = el("div", {
    css: {
      background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
      borderRadius: "18px", padding: "24px 28px", marginBottom: "32px",
      color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between",
      cursor: "pointer", boxShadow: "0 12px 32px rgba(124,58,237,0.3)",
      transition: "transform 0.25s ease, box-shadow 0.25s ease"
    },
    onclick: function() { go('skilltree'); }
  });
  skillTreeBanner.addEventListener("mouseenter", function() { 
    this.style.transform = "translateY(-4px)"; 
    this.style.boxShadow = "0 16px 40px rgba(124,58,237,0.4)";
  });
  skillTreeBanner.addEventListener("mouseleave", function() { 
    this.style.transform = "translateY(0)"; 
    this.style.boxShadow = "0 12px 32px rgba(124,58,237,0.3)";
  });

  var stbLeft = el("div", {css: {display: "flex", alignItems: "center", gap: "16px"}});
  stbLeft.appendChild(el("div", {css: {fontSize: "2.5rem", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))"}}, "🗺️"));
  
  var stbText = el("div");
  stbText.appendChild(el("div", {css:{fontSize:"1.3rem", fontWeight:"800", fontFamily:"var(--font-display)", marginBottom:"4px", letterSpacing: "-0.02em"}}, "RPG Skill Tree"));
  stbText.appendChild(el("div", {css:{fontSize:".85rem", opacity:"0.85", lineHeight: "1.4"}}, "Master topics sequentially and unlock new levels!"));
  
  stbLeft.appendChild(stbText);
  skillTreeBanner.appendChild(stbLeft);
  skillTreeBanner.appendChild(el("div", {css:{fontSize:"1.5rem", fontWeight:"800", background: "rgba(255,255,255,0.2)", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%"}}, "→"));

  w.appendChild(skillTreeBanner);
  w.appendChild(makeAIDoubtSolver());

  var SD={
    History:{color:"#7c3aed",bg:"#f5f3ff",desc:"Explore ancient civilizations, medieval kingdoms, freedom struggle, and modern India.",topics:["Indus Valley","Mughal Empire","British Raj","Independence Movement","Ancient India"],sym:["⚔️","🏛️","📜","👑","⚛️","🛡️"]},
    Geography:{color:"#059669",bg:"#ecfdf5",desc:"From Himalayas to coastal plains, rivers, climate zones, and world physical features.",topics:["Rivers & Lakes","Climate","Physical Features","World Map","Agriculture"],sym:["🌍","🏔️","🌊","🌿","🌋","🌎"]},
    Polity:{color:"#dc2626",bg:"#fef2f2",desc:"Indian Constitution, Parliament, judiciary, fundamental rights and governance structure.",topics:["Constitution","Parliament","Fundamental Rights","Judiciary","Local Governance"],sym:["⚖️","🏛️","📜","🔐","🇮🇳"]},
    Economy:{color:"#0284c7",bg:"#f0f9ff",desc:"National income, banking, budget, five-year plans, poverty and economic reforms.",topics:["GDP & Growth","Banking","Union Budget","Poverty","Agriculture Economy"],sym:["📊","💰","🏦","📈","💴"]},
    Science:{color:"#0891b2",bg:"#ecfeff",desc:"Physics, chemistry, biology, technology, space, inventions and scientific discoveries.",topics:["Physics","Chemistry","Biology","Space Tech","Inventions"],sym:["🔭","⚛️","🧪","🚀","⚡"]},
    GK:{color:"#d97706",bg:"#fffbeb",desc:"Current affairs, awards, sports, national symbols, important days and miscellaneous facts.",topics:["Current Affairs","Awards","Sports","National Symbols","Important Days"],sym:["🏆","🌟","💡","🇮🇳","📰"]},
    "Current Affairs":{color:"#3b82f6",bg:"#eff6ff",desc:"Stay updated with national, international, economy, sports, and tech news.",topics:["National","International","Economy","Sports","Tech"],sym:["📰","🌐","🏆","🚀","💰","🔥"]},
    "Previous Year Questions":{color:"#8b5cf6",bg:"#f5f3ff",desc:"Practice with actual past exam papers to understand patterns and difficulty levels.",topics:["UPSC","SSC CGL","Railways","Banking","State PCS"],sym:["📜","🕰️","🎯","📝","📚","🔍"]}
  };
  
  var subjSec=el("div",{id:"ss",css:{marginBottom:"48px"}});
  var subjTitle=el("div",{css:{textAlign:"center",marginBottom:"32px"}});
  subjTitle.appendChild(el("div",{css:{fontSize:".6rem",color:"var(--subtle)",textTransform:"uppercase",letterSpacing:".18em",fontWeight:"700",marginBottom:"10px",fontFamily:"var(--font-display)"},txt:"Choose Your Subject"}));
  subjTitle.appendChild(el("div",{css:{fontSize:"1.9rem",fontWeight:"800",letterSpacing:"-.04em",fontFamily:"var(--font-display)"},txt:"What do you want to study today?"}));
  subjSec.appendChild(subjTitle);
  
  if (typeof SUBJ !== 'undefined') {
    SUBJ.forEach(function(s,idx){
      var d=SD[s],cnt=(typeof QD !== 'undefined' && QD[s] ? QD[s].length : 0),isOdd=idx%2===0;
      var row=el("div",{css:{display:"flex",alignItems:"stretch",gap:"0",marginBottom:"20px",borderRadius:"20px",overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,.25)",cursor:"pointer",minHeight:"180px"},onclick:function(){go("sub",s);}});
      row.addEventListener("mouseenter",function(){this.style.transform="translateY(-4px)";this.style.boxShadow="0 16px 48px rgba(0,0,0,.35)";});
      row.addEventListener("mouseleave",function(){this.style.transform="translateY(0)";this.style.boxShadow="0 8px 32px rgba(0,0,0,.25)";});
      row.style.transition="all .25s ease";

      var symPanel=el("div",{css:{width:"clamp(90px,28vw,180px)",flexShrink:"0",background:"var(--card2)",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",order:isOdd?"0":"2",borderRight:isOdd?"1px solid var(--border)":"none",borderLeft:isOdd?"none":"1px solid var(--border)"}});
      var bigEmoji=el("div",{css:{fontSize:"5rem",opacity:".15",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"},txt: typeof ICON !== 'undefined' ? ICON[s] : "📚"});
      symPanel.appendChild(bigEmoji);
      var positions=[[10,10],[60,5],[80,55],[15,70],[50,80],[75,20]];
      (d.sym||[]).slice(0,6).forEach(function(sym,si){
        var pos=positions[si]||[50,50];
        var sp=el("div",{css:{position:"absolute",fontSize:"1.3rem",opacity:".25",left:pos[0]+"%",top:pos[1]+"%"}},sym);
        symPanel.appendChild(sp);
      });
      var cIcon=el("div",{css:{position:"relative",zIndex:"1",fontSize:"3.5rem",filter:"drop-shadow(0 4px 12px rgba(0,0,0,.2))"},txt: typeof ICON !== 'undefined' ? ICON[s] : "📚"});
      symPanel.appendChild(cIcon);

      var content=el("div",{css:{flex:"1",minWidth:"0",background:"var(--card)",padding:"20px clamp(14px,4vw,32px)",display:"flex",flexDirection:"column",justifyContent:"center",order:"1",borderLeft:isOdd?"none":"3px solid "+d.color,borderRight:isOdd?"3px solid "+d.color:"none"}});
      var ctop=el("div",{css:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}});
      ctop.appendChild(el("div",{css:{fontSize:"1.4rem",fontWeight:"800",letterSpacing:"-.04em",fontFamily:"var(--font-display)",color:"var(--text)"},txt:s}));
      ctop.appendChild(el("span",{css:{fontSize:".65rem",fontWeight:"700",padding:"3px 10px",borderRadius:"6px",background:d.color+"20",color:d.color,letterSpacing:".06em",fontFamily:"var(--font-display)"}},cnt+" Q"));
      content.appendChild(ctop);
      content.appendChild(el("div",{css:{fontSize:".92rem",color:"var(--muted)",lineHeight:"1.65",marginBottom:"14px",fontWeight:"300"},txt:d.desc}));
      var chips=el("div",{css:{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"16px"}});
      (d.topics||[]).forEach(function(t){chips.appendChild(el("span",{css:{fontSize:".68rem",fontWeight:"600",padding:"3px 10px",borderRadius:"6px",background:d.color+"18",color:d.color,border:"1px solid "+d.color+"28",fontFamily:"var(--font-display)",letterSpacing:"0.02em"}},t));});
      content.appendChild(chips);
      var cta=el("div",{css:{display:"flex",gap:"8px",alignItems:"center"}});
      cta.appendChild(el("span",{css:{fontSize:".82rem",fontWeight:"700",color:d.color,fontFamily:"var(--font-display)"}},"Start Learning →"));
      content.appendChild(cta);

      if(isOdd){row.appendChild(symPanel);row.appendChild(content);}
      else{row.appendChild(content);row.appendChild(symPanel);}
      subjSec.appendChild(row);
    });
  }
  w.appendChild(subjSec);

  // Add the new Smart Feedback Widget!
  w.appendChild(createSmartFeedbackWidget());

  // Footer
  var ft=el("div",{css:{paddingTop:"16px",borderTop:"1.5px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}});
  var frl=el("div",{css:{display:"flex",alignItems:"center",gap:"8px"}});
  if (typeof makeLogo === 'function') frl.appendChild(makeLogo(22));
  frl.appendChild(el("div",{css:{fontSize:".75rem",color:"var(--subtle)"},txt:"StudyLab — Your Ultimate Competitive Exam Partner"}));
  ft.appendChild(frl);
  
  var footerCredit = el("a",{
    href: "https://aratt.ai/user/@jaglan_aman", 
    target: "_blank",
    css: {fontSize:".75rem", color:"var(--accent)", textDecoration:"none", fontWeight:"600"}
  });
  footerCredit.textContent = "Created by Aman (@jaglan_aman)";
  ft.appendChild(footerCredit);
  
  w.appendChild(ft);
  return w;
}

