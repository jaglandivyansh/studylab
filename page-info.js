function pgAbout(){
  var w = el("div",{cls:"fd"});
  w.appendChild(makeNav("about"));
  var wrap = el("div",{css:{maxWidth:"700px",margin:"0 auto", paddingBottom: "40px"}});

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

  // ── FIXED: removed duplicate subjCount line ──
  var tot = (typeof SUBJ !== "undefined" && typeof QD !== "undefined")
    ? SUBJ.reduce(function(s, k) { return s + (QD[k] || []).length; }, 0)
    : 0;
  var subjCount = (typeof SUBJ !== "undefined") ? SUBJ.length : 0;

  var statsRow = el("div",{css:{display:"flex",justifyContent:"center",gap:"8px",flexWrap:"wrap",marginTop:"22px"}});
  [[tot.toLocaleString() + "+", "MCQs"], [subjCount.toString(), "Subjects"], ["100%", "Free"], ["0", "Ads"]].forEach(function(s){
    var chip = el("div",{css:{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:"99px",padding:"6px 16px",display:"flex",flexDirection:"column",alignItems:"center",minWidth:"70px"}});
    chip.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"800",color:"var(--accent)",letterSpacing:"-.02em",fontFamily:"var(--font-display)"}},s[0]));
    chip.appendChild(el("div",{css:{fontSize:".6rem",color:"var(--muted)",fontWeight:"600",textTransform:"uppercase",letterSpacing:".07em"}},s[1]));
    statsRow.appendChild(chip);
  });
  hero.appendChild(statsRow);
  wrap.appendChild(hero);

  // ── Mission & Vision ──
  var mvBox = el("div",{
    css:{
      display:"grid",
      gridTemplateColumns:"1fr 1fr",
      gap:"12px",
      marginBottom:"16px"
    }
  });

  [
    {
      title:"Mission",
      icon:"🎯",
      text:"Make quality government exam preparation accessible, simple and completely free for every aspirant."
    },
    {
      title:"Vision",
      icon:"🚀",
      text:"Build India's most student-friendly learning platform powered by technology and focused learning."
    }
  ].forEach(function(item){
    var card = el("div",{
      css:{
        background:"var(--card)",
        border:"1px solid var(--border)",
        borderRadius:"16px",
        padding:"20px"
      }
    });
    card.appendChild(el("div",{css:{fontSize:"1.5rem",marginBottom:"10px"}},item.icon));
    card.appendChild(el("div",{css:{fontWeight:"800",marginBottom:"8px",fontFamily:"var(--font-display)"}},item.title));
    card.appendChild(el("div",{css:{fontSize:".85rem",color:"var(--muted)",lineHeight:"1.7"}},item.text));
    mvBox.appendChild(card);
  });
  wrap.appendChild(mvBox);

  // ── Creator card ──
  var cbox = el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px",padding:"24px",marginBottom:"16px",position:"relative",overflow:"hidden"}});
  cbox.appendChild(el("div",{css:{position:"absolute",top:"0",left:"0",bottom:"0",width:"3px",background:"linear-gradient(180deg,#4F8EF7,#7EB3FF)",borderRadius:"3px 0 0 3px"}}));
  cbox.appendChild(el("div",{css:{fontSize:".65rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".12em",fontWeight:"700",marginBottom:"16px",fontFamily:"var(--font-display)"},txt:"✦ Founder's Story"}));
  var crow = el("div",{css:{display:"flex",alignItems:"flex-start",gap:"16px"}});
  var avatar = el("div",{css:{width:"52px",height:"52px",borderRadius:"14px",background:"linear-gradient(135deg,#4F8EF7,#7EB3FF)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",fontWeight:"800",color:"#fff",flexShrink:"0",fontFamily:"var(--font-display)"}}, "A");
  crow.appendChild(avatar);
  var cinfo = el("div",{css:{flex:"1"}});
  cinfo.appendChild(el("div",{css:{fontSize:"1.1rem",fontWeight:"800",letterSpacing:"-.02em",marginBottom:"4px",fontFamily:"var(--font-display)"},txt:"Aman"}));
  cinfo.appendChild(el("div",{css:{fontSize:".72rem",color:"var(--accent)",fontWeight:"700",letterSpacing:".08em",textTransform:"uppercase",marginBottom:"10px"},txt:"Govt Exam Aspirant & Developer"}));
  cinfo.appendChild(el("div",{css:{fontSize:".88rem",color:"var(--muted)",lineHeight:"1.75",fontWeight:"300"}},"During my own government exam preparation, I struggled to find a clean and distraction-free platform. Most study apps were filled with ads, paywalls, and unnecessary complexity. StudyLab was created to solve that problem and provide focused learning tools that every aspirant can access freely."));
  crow.appendChild(cinfo);
  cbox.appendChild(crow);
  wrap.appendChild(cbox);

  // ── Features grid ──
  var fbox = el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px",padding:"24px",marginBottom:"16px"}});
  fbox.appendChild(el("div",{css:{fontSize:".65rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".12em",fontWeight:"700",marginBottom:"16px",fontFamily:"var(--font-display)"},txt:"✦ What's Inside"}));
  var fgrid = el("div",{css:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}});
  [
    ["📚", tot.toLocaleString() + "+ MCQs", "Curated and categorized"],
    ["📰","Daily Digest","Live current affairs fetched daily"],
    ["🤖","AI Doubt Solver","Instant answers to your study queries"],
    ["🎯","Quiz Mode","MCQ sessions with instant feedback"],
    ["🔔","Govt Updates","Live vacancies, admit cards via RSS"],
    ["📊","Progress Tracker","Accuracy, streaks & subject breakdown"],
    ["🎯","Daily Challenge","Fresh mixed quiz every day"],
    ["🃏","Flashcards","Tap-to-flip cards for quick revision"],
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

  // ── Impact ──
  var impactBox = el("div",{
    css:{
      background:"var(--card)",
      border:"1px solid var(--border)",
      borderRadius:"16px",
      padding:"24px",
      marginBottom:"16px"
    }
  });
  impactBox.appendChild(el("div",{
    css:{
      fontSize:".65rem",
      color:"var(--muted)",
      textTransform:"uppercase",
      letterSpacing:".12em",
      fontWeight:"700",
      marginBottom:"18px",
      fontFamily:"var(--font-display)"
    }
  },"✦ StudyLab Impact"));
  var impactGrid = el("div",{css:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}});
  [
    [tot.toLocaleString()+"+","Questions"],
    [subjCount.toString(),"Subjects"],
    ["100%","Free"],
    ["0","Ads"]
  ].forEach(function(item){
    var card = el("div",{
      css:{
        background:"var(--bg2)",
        border:"1px solid var(--border)",
        borderRadius:"12px",
        padding:"18px",
        textAlign:"center"
      }
    });
    card.appendChild(el("div",{css:{fontSize:"1.4rem",fontWeight:"800",color:"var(--accent)",fontFamily:"var(--font-display)"}},item[0]));
    card.appendChild(el("div",{css:{fontSize:".75rem",color:"var(--muted)",marginTop:"4px"}},item[1]));
    impactGrid.appendChild(card);
  });
  impactBox.appendChild(impactGrid);
  wrap.appendChild(impactBox);

  // ── FAQ ──
  var faqBox = el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px",padding:"24px",marginBottom:"16px"}});
  faqBox.appendChild(el("div",{css:{fontSize:".65rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".12em",fontWeight:"700",marginBottom:"16px",fontFamily:"var(--font-display)"},txt:"✦ FAQ"}));
  var faqs = [
    ["Is StudyLab free?", "Yes, completely free. No subscription, no hidden charges, no ads — ever."],
    ["Do I need an account?", "No account needed to study. Sign in with Google only if you want to sync your progress."],
    ["Which exams is this useful for?", "Primarily for UPSC, SSC, RRB, State PCS and other competitive govt exams."],
    ["Can I use it offline?", "Once loaded, most features work without internet. Gov Updates & Daily Digest require a connection."]
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

  // ── Roadmap ──
  var roadmap = el("div",{
    css:{
      background:"var(--card)",
      border:"1px solid var(--border)",
      borderRadius:"16px",
      padding:"24px",
      marginBottom:"16px"
    }
  });
  roadmap.appendChild(el("div",{
    css:{
      fontSize:".65rem",
      color:"var(--muted)",
      textTransform:"uppercase",
      letterSpacing:".12em",
      fontWeight:"700",
      marginBottom:"18px",
      fontFamily:"var(--font-display)"
    }
  },"✦ Roadmap"));
  [
    "✅ AI Doubt Solver",
    "✅ Current Affairs",
    "✅ Flashcards",
    "🚀 PYQ Analysis",
    "🚀 Smart Study Planner",
    "🚀 Revision Scheduler",
    "🚀 Mobile App"
  ].forEach(function(t){
    roadmap.appendChild(el("div",{css:{padding:"10px 0",borderBottom:"1px solid var(--border)",fontSize:".88rem"}},t));
  });
  wrap.appendChild(roadmap);

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

