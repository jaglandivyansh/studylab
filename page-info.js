function pgAbout(){
  var w = el("div",{cls:"fd"});
  w.appendChild(makeNav("about"));
  var wrap = el("div",{css:{maxWidth:"700px",margin:"0 auto"}});

  // ── Hero card ──
  var hero = el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"20px",padding:"36px 28px",marginBottom:"18px",textAlign:"center",position:"relative",overflow:"hidden"}});
  var heroLine = el("div",{css:{position:"absolute",top:"0",left:"0",right:"0",height:"3px",background:"linear-gradient(90deg,var(--accent),var(--accent2),transparent)"}});
  hero.appendChild(heroLine);
  var heroBg = el("div",{css:{position:"absolute",top:"-60px",left:"50%",width:"400px",height:"300px",background:"radial-gradient(ellipse at center,rgba(79,142,247,0.1) 0%,transparent 70%)",transform:"translateX(-50%)",pointerEvents:"none"}});
  hero.appendChild(heroBg);
  var lc = el("div",{css:{display:"flex",justifyContent:"center",marginBottom:"16px",position:"relative"}});
  lc.appendChild(makeLogo(68));
  hero.appendChild(lc);
  hero.appendChild(el("div",{css:{fontSize:"2rem",fontWeight:"800",letterSpacing:"-.04em",fontFamily:"var(--font-display)",marginBottom:"6px",position:"relative"},txt:"StudyLab"}));
  hero.appendChild(el("div",{css:{fontSize:".72rem",color:"var(--accent)",fontWeight:"700",letterSpacing:".14em",textTransform:"uppercase",fontFamily:"var(--font-display)",marginBottom:"16px"},txt:"Your Study Partner"}));
  hero.appendChild(el("div",{css:{fontSize:".92rem",color:"var(--muted)",lineHeight:"1.75",maxWidth:"460px",margin:"0 auto",fontWeight:"300"},txt:"A free, offline-ready General Studies prep app built with one goal — make serious exam preparation simple, structured, and accessible for every aspirant."}));
  
  var tot = SUBJ.reduce(function(s, k) { return s + (QD[k] || []).length; }, 0); 
  var subjCount = SUBJ.length; 

  var statsRow = el("div",{css:{display:"flex",justifyContent:"center",gap:"8px",flexWrap:"wrap",marginTop:"22px"}});
  [[tot.toLocaleString() + "+", "MCQs"], [subjCount.toString(), "Subjects"], ["100%", "Free"], ["0", "Ads"]].forEach(function(s){
    var chip = el("div",{css:{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:"99px",padding:"6px 16px",display:"flex",flexDirection:"column",alignItems:"center",minWidth:"70px"}});
    chip.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"800",color:"var(--accent)",letterSpacing:"-.02em",fontFamily:"var(--font-display)"}},s[0]));
    chip.appendChild(el("div",{css:{fontSize:".6rem",color:"var(--muted)",fontWeight:"600",textTransform:"uppercase",letterSpacing:".07em"}},s[1]));
    statsRow.appendChild(chip);
  });
  hero.appendChild(statsRow);
  wrap.appendChild(hero);

  // ── Creator card ──
  var cbox = el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px",padding:"24px",marginBottom:"16px",position:"relative",overflow:"hidden"}});
  cbox.appendChild(el("div",{css:{position:"absolute",top:"0",left:"0",bottom:"0",width:"3px",background:"linear-gradient(180deg,#4F8EF7,#7EB3FF)",borderRadius:"3px 0 0 3px"}}));
  cbox.appendChild(el("div",{css:{fontSize:".65rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".12em",fontWeight:"700",marginBottom:"16px",fontFamily:"var(--font-display)"},txt:"✦ Creator"}));
  var crow = el("div",{css:{display:"flex",alignItems:"flex-start",gap:"16px"}});
  var avatar = el("div",{css:{width:"52px",height:"52px",borderRadius:"14px",background:"linear-gradient(135deg,#4F8EF7,#7EB3FF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",fontWeight:"800",color:"#fff",flexShrink:"0",fontFamily:"var(--font-display)"}}, "A");
  crow.appendChild(avatar);
  var cinfo = el("div",{css:{flex:"1"}});
  cinfo.appendChild(el("div",{css:{fontSize:"1.1rem",fontWeight:"800",letterSpacing:"-.02em",marginBottom:"4px",fontFamily:"var(--font-display)"},txt:"Aman"}));
  cinfo.appendChild(el("div",{css:{fontSize:".72rem",color:"var(--accent)",fontWeight:"700",letterSpacing:".08em",textTransform:"uppercase",marginBottom:"10px"},txt:"Govt Exam Aspirant & Developer"}));
  cinfo.appendChild(el("div",{css:{fontSize:".88rem",color:"var(--muted)",lineHeight:"1.75",fontWeight:"300"}},"I'm a student preparing for government exams. I built StudyLab for myself because I couldn't find a clean, distraction-free tool that actually fit my study flow. No ads, no paywalls, just focused prep."));
  crow.appendChild(cinfo);
  cbox.appendChild(crow);
  wrap.appendChild(cbox);

  // ── Features grid ──
  var fbox = el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px",padding:"24px",marginBottom:"16px"}});
  fbox.appendChild(el("div",{css:{fontSize:".65rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".12em",fontWeight:"700",marginBottom:"16px",fontFamily:"var(--font-display)"},txt:"✦ What's Inside"}));
  var fgrid = el("div",{css:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}});
  [
    ["📚", tot.toLocaleString() + "+ MCQs", "Curated and categorized"],
    ["🃏","Flashcards","Tap-to-flip cards for quick revision"],
    ["🎯","Quiz Mode","MCQ sessions with instant feedback"],
    ["🔔","Govt Updates","Live vacancies, admit cards via RSS"],
    ["📊","Progress Tracker","Accuracy, streaks & subject breakdown"],
    ["🎯","Daily Challenge","Fresh mixed quiz every day"],
    ["☁️","Cloud Sync","Save progress everywhere"],
    ["🌙","Dark & Light","Easy on the eyes, day or night"]
  ].forEach(function(f){
    var fc = el("div",{css:{background:"var(--bg2)",borderRadius:"12px",padding:"14px 16px",border:"1px solid var(--border)",transition:"border-color .2s"}});
    fc.appendChild(el("div",{css:{fontSize:"1.3rem",marginBottom:"7px"}},f[0]));
    fc.appendChild(el("div",{css:{fontSize:".88rem",fontWeight:"700",marginBottom:"3px"}},f[1]));
    fc.appendChild(el("div",{css:{fontSize:".75rem",color:"var(--muted)",lineHeight:"1.5"}},f[2]));
    fgrid.appendChild(fc);
  });
  fbox.appendChild(fgrid);
  wrap.appendChild(fbox);

  // ── FAQ ──
  var faqBox = el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px",padding:"24px",marginBottom:"16px"}});
  faqBox.appendChild(el("div",{css:{fontSize:".65rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".12em",fontWeight:"700",marginBottom:"16px",fontFamily:"var(--font-display)"},txt:"✦ FAQ"}));
  var faqs = [
    ["Is StudyLab free?", "Yes, completely free. No subscription, no hidden charges, no ads — ever."],
    ["Do I need an account?", "No account needed to study. Sign in with Google only if you want to sync your progress."],
    ["Which exams is this useful for?", "Primarily for UPSC, SSC, RRB, State PCS and other competitive govt exams."],
    ["Can I use it offline?", "Once loaded, most features work without internet. Gov Updates requires a connection."]
  ];
  var faqOpen = {};
  faqs.forEach(function(faq, i){
    var item = el("div",{css:{borderBottom: i < faqs.length-1 ? "1px solid var(--border)" : "none", paddingBottom: i < faqs.length-1 ? "12px" : "0", marginBottom: i < faqs.length-1 ? "12px" : "0"}});
    var qrow = el("div",{css:{display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",gap:"12px"},onclick:function(){
      faqOpen[i] = !faqOpen[i];
      ans.style.display = faqOpen[i] ? "block" : "none";
      arrow.textContent = faqOpen[i] ? "▲" : "▼";
    }});
    qrow.appendChild(el("div",{css:{fontSize:".9rem",fontWeight:"600",lineHeight:"1.5",flex:"1"}},faq[0]));
    var arrow = el("span",{css:{fontSize:".65rem",color:"var(--muted)",flexShrink:"0"}},"▼");
    qrow.appendChild(arrow);
    item.appendChild(qrow);
    var ans = el("div",{css:{fontSize:".85rem",color:"var(--muted)",lineHeight:"1.7",marginTop:"8px",display:"none",fontWeight:"300"}},faq[1]);
    item.appendChild(ans);
    faqBox.appendChild(item);
  });
  wrap.appendChild(faqBox);

  // ── Contact ──
  var contactBox = el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px",padding:"24px",marginBottom:"18px"}});
  contactBox.appendChild(el("div",{css:{fontSize:".65rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".12em",fontWeight:"700",marginBottom:"16px",fontFamily:"var(--font-display)"},txt:"✦ Get in Touch"}));
  contactBox.appendChild(el("div",{css:{fontSize:".88rem",color:"var(--muted)",marginBottom:"16px",lineHeight:"1.65",fontWeight:"300"}},"Have a suggestion, found a bug, or just want to say hi? Feel free to reach out. Every bit of feedback helps make StudyLab better for everyone."));
  var contactLinks = el("div",{css:{display:"flex",gap:"10px",flexWrap:"wrap"}});
  [
    {icon:"<img src='https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg' style='width:20px;height:20px;display:block;'>", label:"Telegram", href:"https://t.me/studylab_app", color:"#229ED9"},
    {icon:"<img src='https://www.google.com/s2/favicons?domain=arattai.in&sz=128' style='width:20px;height:20px;display:block;border-radius:4px;'>", label:"Arattai", href:"https://aratt.ai/user/@jaglan_aman", color:"#3b82f6"}
  ].forEach(function(c){
    var btn = el("a",{href:c.href,target:"_blank",rel:"noopener",css:{display:"inline-flex",alignItems:"center",gap:"7px",padding:"9px 18px",borderRadius:"10px",background:"var(--bg2)",border:"1px solid var(--border2)",color:"var(--text)",fontSize:".85rem",fontWeight:"600",textDecoration:"none",transition:"border-color .18s,transform .18s"}});
    var iconSpan = el("span",{css:{display:"flex", alignItems:"center"}});
    iconSpan.innerHTML = c.icon;
    btn.appendChild(iconSpan);
    btn.appendChild(el("span",{},c.label));
    contactLinks.appendChild(btn);
  });
  contactBox.appendChild(contactLinks);
  wrap.appendChild(contactBox);

  // ── Footer note ──
  var fnote = el("div",{css:{textAlign:"center",padding:"20px 16px 32px",color:"var(--subtle)",fontSize:".78rem",lineHeight:"1.7"}});
  fnote.appendChild(el("div",{css:{marginBottom:"4px"}},"Made with ❤️ by Aman — a fellow aspirant, for all aspirants."));
  fnote.appendChild(el("div",{},"StudyLab is free forever. Good luck with your preparation! 🎯"));
  wrap.appendChild(fnote);

  w.appendChild(wrap);
  return w;
}

function pgHowToUse(){
  var w = el("div",{cls:"fd"});
  w.appendChild(makeNav("howtouse"));
  var wrap = el("div",{css:{maxWidth:"760px",margin:"0 auto"}});

  // Page header
  var hd = el("div",{css:{textAlign:"center",marginBottom:"36px",padding:"32px 24px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"18px",position:"relative",overflow:"hidden"}});
  var topLine = el("div",{css:{position:"absolute",top:"0",left:"0",right:"0",height:"3px",background:"linear-gradient(90deg,var(--accent),var(--accent2),transparent)"}});
  hd.appendChild(topLine);
  hd.appendChild(el("div",{css:{fontSize:"2.6rem",marginBottom:"10px"},txt:"📖"}));
  hd.appendChild(el("div",{css:{fontSize:"1.6rem",fontWeight:"800",letterSpacing:"-.03em",fontFamily:"var(--font-display)",marginBottom:"8px"},txt:"How to Use StudyLab"}));
  hd.appendChild(el("div",{css:{fontSize:".92rem",color:"var(--muted)",lineHeight:"1.7",maxWidth:"500px",margin:"0 auto"},txt:"Everything you need to know to get the most out of your study sessions."}));
  wrap.appendChild(hd);

  var steps = [
    {
      num:"01", icon:"🏠", title:"Start from Home",
      color:"#4F8EF7",
      desc:"The Home page shows all 6 subjects — History, Geography, Polity, Economy, Science, and GK. Each subject card shows the number of available questions. Tap any card to begin.",
      tips:["Scroll down to see all subject cards","Each card shows question count and topic emoji","You can study multiple subjects in one session"]
    },
    {
      num:"02", icon:"🃏", title:"Use Flashcards to Learn",
      color:"#8b5cf6",
      desc:"Inside each subject, choose Flashcards mode. A question appears on the front — tap the card to flip it and reveal the answer. Great for quick revision and memory building.",
      tips:["Tap anywhere on the card to flip it","Use ← → arrow buttons to move between cards","Cards are shuffled every session for better retention"]
    },
    {
      num:"03", icon:"🎯", title:"Take a Quiz to Test Yourself",
      color:"#4ade80",
      desc:"Choose Quiz mode to answer MCQ questions. Select an option — green means correct, red means wrong. Your score and accuracy are saved automatically after every session.",
      tips:["Choose how many questions per quiz (10, 20, or 30)","Your answers are tracked to show weak areas","Review wrong answers at the end of each quiz"]
    },
    // --- NEW: AI TUTOR STEP ---
    {
      num:"04", icon:"💡", title:"Ask the AI Tutor",
      color:"#b87333",
      desc:"Stuck on a difficult question? Click the 💡 icon during any quiz to get an instant, logical explanation from our Sarvam AI Tutor.",
      tips:["Available on all quiz questions","AI reads the question and options to give specific context","100% free to use"]
    },
    {
      num:"05", icon:"📊", title:"Track Your Progress",
      color:"#f59e0b",
      desc:"Visit the Progress tab (📊) in the navbar to see your performance dashboard. It shows overall accuracy, total questions attempted, quiz sessions, day streak, and subject-wise breakdown.",
      tips:["Subjects where accuracy < 50% are flagged as weak","Subjects with ≥ 80% accuracy are marked as strong","Your streak resets if you skip a day — stay consistent!"]
    },
    {
      num:"06", icon:"🎯", title:"Use the Daily Challenge",
      color:"#f87171",
      desc:"The Daily tab gives you a fresh mixed-subject quiz every day to keep your preparation on track. It's a great way to maintain your streak and cover all topics consistently.",
      tips:["Daily quiz resets every midnight","Mix of all 6 subjects in one session","Complete it to keep your streak alive 🔥"]
    },
    {
      num:"07", icon:"🔔", title:"Check Government Updates",
      color:"#34d399",
      desc:"The Gov Updates tab fetches live RSS feeds from UPSC, SSC, RRB, and other boards to show latest vacancies, admit cards, exam dates, and results — all in one place.",
      tips:["Use the filter tabs: All, Vacancy, Admit Card, Exam Date, Result","Search by keyword to find specific updates","You can also add your own entries manually"]
    },
    {
      num:"08", icon:"☁️", title:"Sign In to Sync Progress",
      color:"#a78bfa",
      desc:"Click the Sign In button in the top-right corner and log in with Google. Your quiz history, streaks, and scores are saved to the cloud so you never lose progress — even if you switch devices.",
      tips:["One-click Google Sign In — no password needed","Progress syncs automatically across all your devices","You can sign out anytime from the top-right corner"]
    },
    {
      num:"09", icon:"🌙", title:"Switch Between Dark & Light Mode",
      color:"#60a5fa",
      desc:"Use the 🌙 / ☀️ toggle button in the navbar to switch between dark and light themes. StudyLab remembers your preference automatically.",
      tips:["Dark mode is easier on the eyes at night","Light mode works better in bright environments","Your theme preference is saved locally"]
    }
  ];

  steps.forEach(function(step){
    var card = el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px",padding:"24px 28px",marginBottom:"16px",position:"relative",overflow:"hidden"}});
    card.appendChild(el("div",{css:{position:"absolute",top:"0",left:"0",bottom:"0",width:"3px",background:step.color,borderRadius:"3px 0 0 3px"}}));
    var topRow = el("div",{css:{display:"flex",alignItems:"flex-start",gap:"16px",marginBottom:"12px"}});
    var numBadge = el("div",{css:{minWidth:"40px",height:"40px",borderRadius:"10px",background:step.color+"22",border:"1.5px solid "+step.color+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".68rem",fontWeight:"800",color:step.color}},step.num);
    topRow.appendChild(numBadge);
    var titleBlock = el("div",{css:{flex:"1"}});
    titleBlock.appendChild(el("div",{css:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"}},[
      el("span",{css:{fontSize:"1.2rem"}},step.icon),
      el("span",{css:{fontSize:"1rem",fontWeight:"700"}},step.title)
    ]));
    titleBlock.appendChild(el("div",{css:{fontSize:".88rem",color:"var(--muted)",lineHeight:"1.65",fontWeight:"300"}},step.desc));
    topRow.appendChild(titleBlock);
    card.appendChild(topRow);
    wrap.appendChild(card);
  });
  
  // --- NEW AI HIGHLIGHT CARD ---
  var aiHighlight = el("div", {
    css: {
      background: "linear-gradient(145deg, rgba(184, 115, 51, 0.1), rgba(184, 115, 51, 0.03))",
      border: "1px solid #b87333",
      borderRadius: "16px",
      padding: "24px 28px",
      marginBottom: "24px",
      textAlign: "center"
    }
  });
  aiHighlight.appendChild(el("div", {css: {fontSize: "1.8rem", marginBottom: "8px"}, txt: "💡"}));
  aiHighlight.appendChild(el("div", {css: {fontSize: "1.1rem", fontWeight: "800", color: "#b87333", marginBottom: "8px"}, txt: "Powered by Sarvam AI"}));
  aiHighlight.appendChild(el("div", {css: {fontSize: ".92rem", color: "var(--muted)", lineHeight: "1.6"}, txt: "StudyLab now features a built-in AI Tutor. It analyzes the specific question you are solving and provides a clear breakdown of why an answer is correct, making your preparation smarter and faster."}));
  wrap.appendChild(aiHighlight);
  
  // Quick Tips footer card

  var footer = el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px",padding:"24px 28px",marginBottom:"24px",textAlign:"center"}});
  footer.appendChild(el("div",{css:{fontSize:"1.4rem",marginBottom:"8px"},txt:"🚀"}));
  footer.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"700",marginBottom:"8px"},txt:"Ready to start?"}));
  footer.appendChild(el("button",{cls:"btn btnp",css:{padding:"11px 28px",fontSize:".9rem",marginTop:"12px"},onclick:function(){go("home");}}, "🏠 Go to Home →"));
  wrap.appendChild(footer);

  w.appendChild(wrap);
  return w;
}