window.STUDYLAB_FEEDBACK_URL = "https://formspree.io/f/mzdyqbyz";
// ─── DEADLINE COUNTDOWN WIDGET ───────────────────────────────────
function makeDeadlineWidget() {
  var stored = Sv.get("gu_entries") || [];
  var allData = stored.concat(GU_FALLBACK);
  
  var now = new Date();
  now.setHours(0,0,0,0);
  var closestEntry = null;
  var closestDiff = Infinity;
  var isExam = false;

  // Scan all govt updates for the closest future date
  allData.forEach(function(e) {
    var dateStr = e.lastDate || e.examDate;
    if(!dateStr) return;
    
    // Normalize Indian date formats (DD-MM-YYYY to YYYY-MM-DD)
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

  // Hide if no upcoming dates found within 30 days
  if (!closestEntry || closestDiff === Infinity) return el("div", {css:{display:"none"}});
  var daysLeft = Math.ceil(closestDiff / (1000 * 60 * 60 * 24));
  if (daysLeft > 30) return el("div", {css:{display:"none"}});

  // Widget Styling
  var isUrgent = daysLeft <= 3;
  var wCol = isUrgent ? "#ef4444" : "#f59e0b"; // Red if urgent, Orange if approaching
  var wBg = isUrgent ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)";

  var widget = el("div", {
    css: {
      background: "var(--card)",
      border: "1.5px solid " + wCol,
      borderRadius: "16px",
      padding: "16px 20px",
      marginBottom: "28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 8px 24px " + wBg,
      cursor: "pointer",
      transition: "transform 0.2s"
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
// ─────────────────────────────────────────────────────────────────

// ─── AI DOUBT SOLVER ─────────────────────────────────────────────
// API key is safely stored in Vercel Environment Variables.
// Set GEMINI_API_KEY in: Vercel Dashboard → Project → Settings → Environment Variables
// No key needed here — frontend calls /api/doubt securely.
var ADS_LOADING = false;

function makeAIDoubtSolver() {
  var wrapper = el("div", {
    id: "ai-doubt-solver",
    css: {
      marginBottom: "28px",
      borderRadius: "18px",
      overflow: "hidden",
      border: "1px solid var(--border2)",
      background: "var(--card)",
      boxShadow: "var(--shadow-card)",
      transition: "box-shadow 0.3s ease"
    }
  });

  // ── COLLAPSED BAR ──
  var bar = el("div", {
    id: "ads-bar",
    css: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 18px", cursor: "pointer",
      transition: "background 0.2s ease", userSelect: "none"
    }
  });

  var barLeft = el("div", {css: {display: "flex", alignItems: "center", gap: "12px"}});

  var icon = el("div", {
    css: {
      width: "40px", height: "40px", flexShrink: "0",
      background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
      borderRadius: "11px", display: "flex", alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(99,102,241,0.45)",
      fontFamily: "var(--font-display)", fontSize: "1rem",
      fontWeight: "800", color: "#fff", letterSpacing: "-0.02em"
    }
  }, "S");

  var barText = el("div");
  barText.appendChild(el("div", {
    css: {fontFamily: "var(--font-display)", fontSize: ".93rem", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.02em"}
  }, "AI Doubt Solver"));
  barText.appendChild(el("div", {
    css: {fontSize: ".73rem", color: "var(--muted)", marginTop: "2px"}
  }, "Tap to ask anything about your studies..."));

  barLeft.appendChild(icon);
  barLeft.appendChild(barText);

  var arrow = el("div", {
    css: {fontSize: "1.1rem", color: "var(--muted)", transition: "transform 0.3s cubic-bezier(0.2,0.8,0.2,1)", lineHeight: "1"}
  }, "▾");

  bar.appendChild(barLeft);
  bar.appendChild(arrow);

  // ── EXPANDED PANEL ──
  var panel = el("div", {
    css: {
      display: "none", flexDirection: "column",
      borderTop: "1px solid var(--border)"
    }
  });

  // Chat area
  var chatArea = el("div", {
    id: "ads-chat-area",
    css: {
      maxHeight: "300px", overflowY: "auto",
      padding: "16px 16px 8px",
      display: "flex", flexDirection: "column", gap: "20px",
      scrollBehavior: "smooth"
    }
  });

  // Welcome state
  var welcome = el("div", {
    id: "ads-welcome",
    css: {textAlign: "center", padding: "20px 16px 12px"}
  });
  welcome.appendChild(el("div", {css: {fontSize: "1.8rem", marginBottom: "8px"}}, "🎓"));
  welcome.appendChild(el("div", {css: {fontWeight: "700", color: "var(--text)", marginBottom: "5px", fontFamily: "var(--font-display)"}}, "Ask me anything!"));
  welcome.appendChild(el("div", {css: {fontSize: ".8rem", color: "var(--muted)", lineHeight: "1.5"}}, "History, Geography, Polity, Economy, Science, GK — I'm here to help."));
  chatArea.appendChild(welcome);

  // Messages container
  var messages = el("div", {id: "ads-messages"});
  chatArea.appendChild(messages);
  panel.appendChild(chatArea);

  // Input row
  var inputRow = el("div", {
    css: {
      display: "flex", alignItems: "center", gap: "8px",
      padding: "10px 14px", borderTop: "1px solid var(--border)"
    }
  });

  var input = el("input", {
    id: "ads-input", type: "text",
    placeholder: "e.g. What is the Preamble of India?",
    css: {
      flex: "1", background: "var(--bg2)",
      border: "1.5px solid var(--border)", borderRadius: "10px",
      color: "var(--text)", fontFamily: "var(--font-body)",
      fontSize: ".85rem", padding: "9px 13px", outline: "none"
    }
  });
  input.addEventListener("focus", function() {
    this.style.borderColor = "var(--accent)";
    this.style.boxShadow = "0 0 0 3px var(--accent-glow)";
  });
  input.addEventListener("blur", function() {
    this.style.borderColor = "var(--border)";
    this.style.boxShadow = "none";
  });
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") sendDoubt(messages, welcome, input, sendBtn);
  });

  var sendBtn = el("button", {
    css: {
      width: "38px", height: "38px", flexShrink: "0",
      background: "linear-gradient(135deg, #3174F6, #5a9af8)",
      border: "none", borderRadius: "10px", color: "#fff",
      cursor: "pointer", display: "flex", alignItems: "center",
      justifyContent: "center", transition: "all 0.18s ease",
      boxShadow: "0 4px 12px rgba(49,116,246,0.35)"
    },
    onclick: function() { sendDoubt(messages, welcome, input, sendBtn); }
  });
  sendBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
  sendBtn.addEventListener("mouseenter", function() { this.style.transform = "translateY(-2px)"; this.style.boxShadow = "0 6px 16px rgba(49,116,246,0.5)"; });
  sendBtn.addEventListener("mouseleave", function() { this.style.transform = "translateY(0)"; this.style.boxShadow = "0 4px 12px rgba(49,116,246,0.35)"; });

  inputRow.appendChild(input);
  inputRow.appendChild(sendBtn);
  panel.appendChild(inputRow);

  // Footer
  panel.appendChild(el("div", {
    css: {textAlign: "center", fontSize: ".62rem", color: "var(--subtle)", padding: "6px 14px 12px", letterSpacing: "0.04em"}
  }, "Powered by Sarvam AI · Made for India 🇮🇳"));

  // Toggle logic
  var isOpen = false;
  bar.addEventListener("click", function() {
    isOpen = !isOpen;
    panel.style.display = isOpen ? "flex" : "none";
    arrow.style.transform = isOpen ? "rotate(180deg)" : "rotate(0deg)";
    wrapper.style.boxShadow = isOpen
      ? "0 0 0 1px rgba(79,142,247,0.3), 0 20px 60px rgba(0,0,0,0.4)"
      : "var(--shadow-card)";
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

  // Hide welcome on first message
  if (welcome) welcome.style.display = "none";

  input.value = "";
  ADS_LOADING = true;
  sendBtn.disabled = true;
  sendBtn.style.opacity = "0.5";

  // User bubble
  messages.appendChild(adsCreateBubble("user", question));
  adsScrollChat();

  // Typing indicator
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
    messages.removeChild(typing);
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
      background: type === "user" ? "var(--accent)" : "linear-gradient(135deg, #1a1a2e, #16213e)",
      color: "#fff", fontWeight: "700",
      overflow: "hidden"
    }
  });
  if (type === "user") {
    // Show first letter of user's display name
    var userName = (window.currentUser && window.currentUser.displayName)
      ? window.currentUser.displayName.trim()[0].toUpperCase()
      : "U";
    avatar.textContent = userName;
  } else {
    // Sarvam "S" logo
    avatar.textContent = "S";
    avatar.style.background = "linear-gradient(135deg, #6366F1, #8B5CF6)";
    avatar.style.fontFamily = "var(--font-display)";
    avatar.style.fontWeight = "800";
    avatar.style.fontSize = ".75rem";
  }

  var bubble = el("div", {
    css: {
      maxWidth: "82%", padding: "9px 13px", fontSize: ".85rem", lineHeight: "1.6",
      color: type === "user" ? "#fff" : "var(--text)",
      background: type === "user" ? "var(--accent)" : "var(--card2)",
      border: type === "user" ? "none" : "1px solid var(--border)",
      borderRadius: type === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px"
    }
  });
  bubble.innerHTML = text.replace(/\n/g, "<br>");

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
      background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
      overflow: "hidden"
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
        width: "6px", height: "6px", borderRadius: "50%",
        background: "var(--muted)", display: "inline-block",
        animation: "typing-bounce 1.2s ease-in-out infinite",
        animationDelay: (i * 0.2) + "s"
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
// ─────────────────────────────────────────────────────────────────

function pgHome(){
  var tot=SUBJ.reduce(function(s,k){return s+(QD[k]||[]).length;},0);
  var w=el("div",{cls:"fd"});
  w.appendChild(makeNav("home"));

  // Quote of the day
  w.appendChild(makeQuoteCard());

  // NEW: Add the Deadline Widget
  w.appendChild(makeDeadlineWidget());

  // AI Doubt Solver (replaces stats tiles)
  w.appendChild(makeAIDoubtSolver());

  // Subject showcase - alternating layout
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
  SUBJ.forEach(function(s,idx){
    var d=SD[s],cnt=(QD[s]||[]).length,isOdd=idx%2===0;
    var row=el("div",{css:{display:"flex",alignItems:"stretch",gap:"0",marginBottom:"20px",borderRadius:"20px",overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,.25)",cursor:"pointer",minHeight:"180px"},onclick:function(){go("sub",s);}});
    row.addEventListener("mouseenter",function(){this.style.transform="translateY(-4px)";this.style.boxShadow="0 16px 48px rgba(0,0,0,.35)";});
    row.addEventListener("mouseleave",function(){this.style.transform="translateY(0)";this.style.boxShadow="0 8px 32px rgba(0,0,0,.25)";});
    row.style.transition="all .25s ease";

    // Symbol background panel
    var symPanel=el("div",{css:{width:"180px",flexShrink:"0",background:"var(--card2)",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",order:isOdd?"0":"2",borderRight:isOdd?"1px solid var(--border)":"none",borderLeft:isOdd?"none":"1px solid var(--border)"}});
    // Big emoji background
    var bigEmoji=el("div",{css:{fontSize:"5rem",opacity:".15",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"},txt:ICON[s]});
    symPanel.appendChild(bigEmoji);
    // Scattered symbols
    var positions=[[10,10],[60,5],[80,55],[15,70],[50,80],[75,20]];
    (d.sym||[]).slice(0,6).forEach(function(sym,si){
      var pos=positions[si]||[50,50];
      var sp=el("div",{css:{position:"absolute",fontSize:"1.3rem",opacity:".25",left:pos[0]+"%",top:pos[1]+"%"}},sym);
      symPanel.appendChild(sp);
    });
    // Center icon
    var cIcon=el("div",{css:{position:"relative",zIndex:"1",fontSize:"3.5rem",filter:"drop-shadow(0 4px 12px rgba(0,0,0,.2))"},txt:ICON[s]});
    symPanel.appendChild(cIcon);

    // Content panel
    var content=el("div",{css:{flex:"1",background:"var(--card)",padding:"28px 32px",display:"flex",flexDirection:"column",justifyContent:"center",order:"1",borderLeft:isOdd?"none":"3px solid "+d.color,borderRight:isOdd?"3px solid "+d.color:"none"}});
    var ctop=el("div",{css:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}});
    ctop.appendChild(el("div",{css:{fontSize:"1.4rem",fontWeight:"800",letterSpacing:"-.04em",fontFamily:"var(--font-display)",color:"var(--text)"},txt:s}));
    ctop.appendChild(el("span",{css:{fontSize:".65rem",fontWeight:"700",padding:"3px 10px",borderRadius:"6px",background:d.color+"20",color:d.color,letterSpacing:".06em",fontFamily:"var(--font-display)"}},cnt+" Q"));
    content.appendChild(ctop);
    content.appendChild(el("div",{css:{fontSize:".92rem",color:"var(--muted)",lineHeight:"1.65",marginBottom:"14px",fontWeight:"300"},txt:d.desc}));
    // Topic chips
    var chips=el("div",{css:{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"16px"}});
    (d.topics||[]).forEach(function(t){chips.appendChild(el("span",{css:{fontSize:".68rem",fontWeight:"600",padding:"3px 10px",borderRadius:"6px",background:d.color+"18",color:d.color,border:"1px solid "+d.color+"28",fontFamily:"var(--font-display)",letterSpacing:"0.02em"}},t));});
    content.appendChild(chips);
    // CTA
    var cta=el("div",{css:{display:"flex",gap:"8px",alignItems:"center"}});
    cta.appendChild(el("span",{css:{fontSize:".82rem",fontWeight:"700",color:d.color,fontFamily:"var(--font-display)"}},"Start Learning →"));
    content.appendChild(cta);

    if(isOdd){row.appendChild(symPanel);row.appendChild(content);}
    else{row.appendChild(content);row.appendChild(symPanel);}
    subjSec.appendChild(row);
  });
  w.appendChild(subjSec);

  // Feedback Section
  var fb=el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"18px",padding:"32px 36px",marginBottom:"24px",textAlign:"center",boxShadow:"var(--shadow-card)",position:"relative",overflow:"hidden"}});
  var fbLine=el("div",{css:{position:"absolute",top:"0",left:"0",right:"0",height:"2px",background:"linear-gradient(90deg,var(--accent),var(--accent2),transparent)"}});
  fb.appendChild(fbLine);
  fb.appendChild(el("div",{css:{fontSize:"1.8rem",marginBottom:"10px"},txt:"\uD83D\uDCAC"}));
  fb.appendChild(el("div",{css:{fontSize:"1.1rem",fontWeight:"700",marginBottom:"6px",fontFamily:"var(--font-display)",letterSpacing:"-0.02em"},txt:"How are we doing?"}));
  fb.appendChild(el("div",{css:{fontSize:".85rem",color:"var(--muted)",marginBottom:"20px"},txt:"Your feedback helps us improve StudyLab for everyone"}));
  var stars=el("div",{css:{display:"flex",gap:"6px",justifyContent:"center",marginBottom:"18px"}});
  var selRating=Sv.get("fb_rating")||0;
  var selMsg=Sv.get("fb_msg")||"";
  for(var si=1;si<=5;si++){
    (function(i){
      var s=el("span",{cls:"star"+(i<=selRating?" lit":"")},i<=selRating?"\u2605":"\u2606");
      s.addEventListener("click",function(){selRating=i;Sv.set("fb_rating",i);rebuildStars();});
      s.addEventListener("mouseenter",function(){tempHighlight(i);});
      s.addEventListener("mouseleave",function(){rebuildStars();});
      stars.appendChild(s);
    })(si);
  }
  function tempHighlight(n){var ss=stars.querySelectorAll(".star");ss.forEach(function(s,i){s.textContent=i<n?"\u2605":"\u2606";s.classList.toggle("lit",i<n);});}
  function rebuildStars(){var ss=stars.querySelectorAll(".star");ss.forEach(function(s,i){s.textContent=i<selRating?"\u2605":"\u2606";s.classList.toggle("lit",i<selRating);});}
  fb.appendChild(stars);
  if(selRating>0){
    var rLabel=["","Needs Improvement","Could Be Better","It\'s Good!","Really Loving It!","Absolutely Amazing!"][selRating];
    fb.appendChild(el("div",{css:{fontSize:".82rem",color:"var(--accent)",fontWeight:"600",marginBottom:"14px"}},rLabel));
  }
  var fta=el("textarea",{cls:"inp",placeholder:"Tell us what you think or suggest a feature... (optional)",rows:"3",css:{marginBottom:"12px",textAlign:"left"}});
  fta.value=selMsg;
  fta.addEventListener("input",function(e){selMsg=e.target.value;});
  fb.appendChild(fta);
  fb.appendChild(el("button",{cls:"btn btnp",css:{width:"100%",padding:"11px"},onclick:function(){
    if(!selRating){toast("Please select a star rating first","#f87171");return;}
    Sv.set("fb_msg",selMsg);
    Sv.set("fb_done",true);
    Sv.set("fb_rating_stored", selRating);
    Sv.set("fb_timestamp", new Date().toISOString());
    
    toast("Thank you for your feedback! \u2764\uFE0F");
    fb.innerHTML="";
    fb.appendChild(el("div",{css:{fontSize:"2.5rem",marginBottom:"10px"},txt:"\uD83C\uDF89"}));
    fb.appendChild(el("div",{css:{fontSize:"1.1rem",fontWeight:"700",marginBottom:"6px"},txt:"Thank you so much!"}));
    fb.appendChild(el("div",{css:{fontSize:".85rem",color:"var(--muted)"},txt:"Your "+selRating+"\u2605 rating has been recorded locally. It means a lot!"}));
    
    // Formspree Integration
    if(window.STUDYLAB_FEEDBACK_URL) {
      fetch(window.STUDYLAB_FEEDBACK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Date: new Date().toLocaleString("en-IN"),
          Rating: selRating + " stars",
          Message: selMsg || "(no message)"
        })
      }).catch(function(){/* Silently fail - already saved locally */});
    }
  }},"Submit Feedback"));
  w.appendChild(fb);

  // Footer
  var ft=el("div",{css:{paddingTop:"16px",borderTop:"1.5px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}});
  var frl=el("div",{css:{display:"flex",alignItems:"center",gap:"8px"}});
  frl.appendChild(makeLogo(22));
  frl.appendChild(el("div",{css:{fontSize:".75rem",color:"var(--subtle)"},txt:"StudyLab \u00b7 Your AI Study Partner"}));
  ft.appendChild(frl);
  var footerCredit = el("div",{css:{fontSize:".75rem",color:"var(--subtle)"}});
  footerCredit.textContent = "Created by Aman | AI-assisted development";
  ft.appendChild(footerCredit);
  w.appendChild(ft);
  return w;
}