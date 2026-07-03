function pgAbout(){
  var w = el("div",{cls:"fd"});
  w.appendChild(makeNav("about"));
  var wrap = el("div",{css:{maxWidth:"680px",margin:"0 auto", paddingBottom: "40px"}});

  var tot = (typeof SUBJ !== "undefined" && typeof QD !== "undefined")
    ? SUBJ.reduce(function(s, k) { return s + (QD[k] || []).length; }, 0)
    : 0;
  var subjCount = (typeof SUBJ !== "undefined") ? SUBJ.length : 0;

  // ── Hero — wordmark + honest one-liner ──
  var hero = el("div",{css:{padding:"36px 4px 8px"}});
  var heroTitle = el("div",{css:{fontSize:"2rem",fontWeight:"800",letterSpacing:"-.03em",fontFamily:"var(--font-display)",marginBottom:"14px"}});
  heroTitle.innerHTML = 'Study<span style="color:var(--accent)">Lab</span>';
  hero.appendChild(heroTitle);
  hero.appendChild(el("div",{css:{fontSize:"1.02rem",color:"var(--muted)",lineHeight:"1.65",maxWidth:"440px",fontWeight:"300"}},"Built by one aspirant, for every aspirant. No ads. No paywalls. Nothing to unlock."));
  wrap.appendChild(hero);

  // ── Cost comparison strip ──
  var cmp = el("div",{css:{display:"grid",gridTemplateColumns:"1fr 1fr",border:"1px solid var(--border)",borderRadius:"12px",overflow:"hidden",marginTop:"22px",marginBottom:"10px"}});
  var cmpLeft = el("div",{css:{padding:"18px 20px",borderRight:"1px solid var(--border)"}});
  cmpLeft.appendChild(el("div",{css:{fontSize:".68rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",fontWeight:"600",marginBottom:"12px"}},"Typical exam apps"));
  var cmpLeftList = el("div",{css:{fontSize:".85rem",color:"var(--muted)",lineHeight:"2.1"}});
  ["Ads between questions","Mock tests behind paywall","Recurring subscription"].forEach(function(t){ cmpLeftList.appendChild(el("div",{},t)); });
  cmpLeft.appendChild(cmpLeftList);
  cmp.appendChild(cmpLeft);
  var cmpRight = el("div",{css:{padding:"18px 20px"}});
  cmpRight.appendChild(el("div",{css:{fontSize:".68rem",color:"var(--accent)",textTransform:"uppercase",letterSpacing:".08em",fontWeight:"600",marginBottom:"12px"}},"StudyLab"));
  var cmpRightList = el("div",{css:{fontSize:".85rem",color:"var(--text)",lineHeight:"2.1"}});
  ["Zero ads, ever","Everything unlocked","Free, always"].forEach(function(t){ cmpRightList.appendChild(el("div",{},t)); });
  cmpRight.appendChild(cmpRightList);
  cmp.appendChild(cmpRight);
  wrap.appendChild(cmp);
  wrap.appendChild(el("div",{css:{fontSize:".78rem",color:"var(--muted)",fontWeight:"300",lineHeight:"1.6",padding:"0 4px",marginBottom:"26px"}},"Built to stay free — for as long as StudyLab exists."));

  // ── Founder note ──
  var founder = el("div",{css:{padding:"20px 4px",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",marginBottom:"24px"}});
  founder.appendChild(el("div",{css:{fontSize:".68rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",fontWeight:"600",marginBottom:"12px"}},"From the founder"));
  founder.appendChild(el("div",{css:{fontSize:".88rem",color:"var(--muted)",lineHeight:"1.8",fontWeight:"300",marginBottom:"10px"}},"During my own government exam preparation, I struggled to find a clean and distraction-free platform. Most study apps were filled with ads, paywalls, and unnecessary complexity. StudyLab was created to solve that problem and provide focused learning tools that every aspirant can access freely."));
  founder.appendChild(el("div",{css:{fontSize:".82rem",color:"var(--text)",fontWeight:"600"}},"— Aman, govt exam aspirant and developer"));
  wrap.appendChild(founder);

  // ── Mission & Vision ──
  var mvBox = el("div",{css:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"24px"}});
  [
    {title:"Mission", text:"Make quality government exam preparation accessible, simple and completely free for every aspirant."},
    {title:"Vision", text:"Build India's most student-friendly learning platform powered by technology and focused learning."}
  ].forEach(function(item){
    var card = el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px",padding:"18px"}});
    card.appendChild(el("div",{css:{fontWeight:"700",marginBottom:"7px",fontFamily:"var(--font-display)",fontSize:".92rem"}},item.title));
    card.appendChild(el("div",{css:{fontSize:".82rem",color:"var(--muted)",lineHeight:"1.65"}},item.text));
    mvBox.appendChild(card);
  });
  wrap.appendChild(mvBox);

  // ── What's inside ──
  var fbox = el("div",{css:{marginBottom:"24px"}});
  fbox.appendChild(el("div",{css:{fontSize:".68rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",fontWeight:"600",marginBottom:"14px"}},"What's inside"));
  var flist = el("div",{css:{border:"1px solid var(--border)",borderRadius:"12px",overflow:"hidden"}});
  [
    [tot.toLocaleString() + "+ MCQs", "Curated and categorized"],
    ["Daily digest", "Live current affairs fetched daily"],
    ["AI doubt solver", "Instant answers to your study queries"],
    ["Quiz mode", "MCQ sessions with instant feedback"],
    ["Govt updates", "Live vacancies, admit cards via RSS"],
    ["Progress tracker", "Accuracy, streaks and subject breakdown"],
    ["Daily challenge", "Fresh mixed quiz every day"],
    ["Flashcards", "Tap-to-flip cards for quick revision"]

  ].forEach(function(f, i, arr){
    var row = el("div",{css:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 16px",borderBottom: i<arr.length-1 ? "1px solid var(--border)" : "none"}});
    row.appendChild(el("div",{css:{fontSize:".86rem",fontWeight:"600"}},f[0]));
    row.appendChild(el("div",{css:{fontSize:".78rem",color:"var(--muted)",textAlign:"right"}},f[1]));
    flist.appendChild(row);
  });
  fbox.appendChild(flist);
  wrap.appendChild(fbox);

  // ── At a glance ──
  // NOTE: "Questions" reflects the true count computed from SUBJ/QD at
  // render time — no simulated ticking, no fabricated movement. If/when
  // your hourly content job exposes a real timestamp (e.g. a
  // "lastContentUpdate" value saved alongside QD), pass it in here to
  // replace the static caption below with a genuine one.
  var impactBox = el("div",{css:{marginBottom:"24px"}});
  impactBox.appendChild(el("div",{css:{fontSize:".68rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",fontWeight:"600",marginBottom:"14px"}},"At a glance"));
  var impactGrid = el("div",{css:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px"}});
  [[tot.toLocaleString(),"Questions"],[subjCount.toString(),"Subjects"],["100%","Free"],["0","Ads"]].forEach(function(item){
    var card = el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"10px",padding:"14px 8px",textAlign:"center"}});
    card.appendChild(el("div",{css:{fontSize:"1.2rem",fontWeight:"800",color:"var(--accent)",fontFamily:"var(--font-display)"}},item[0]));
    card.appendChild(el("div",{css:{fontSize:".68rem",color:"var(--muted)",marginTop:"3px"}},item[1]));
    impactGrid.appendChild(card);
  });
  impactBox.appendChild(impactGrid);
  impactBox.appendChild(el("div",{css:{fontSize:".7rem",color:"var(--muted)",marginTop:"10px"}},"New questions are added on an hourly schedule."));
  wrap.appendChild(impactBox);

  // ── Privacy note — builds trust for a professional page ──
  var privacy = el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px",padding:"16px 18px",marginBottom:"24px"}});
  privacy.appendChild(el("div",{css:{fontSize:".68rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",fontWeight:"600",marginBottom:"10px"}},"Your data"));
  privacy.appendChild(el("div",{css:{fontSize:".82rem",color:"var(--muted)",lineHeight:"1.7",fontWeight:"300"}},"Your progress, streaks, and bookmarks are stored on your device. StudyLab does not sell or share your data with third parties."));
  wrap.appendChild(privacy);

  // ── FAQ ──
  var faqBox = el("div",{css:{marginBottom:"24px"}});
  faqBox.appendChild(el("div",{css:{fontSize:".68rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",fontWeight:"600",marginBottom:"14px"}},"FAQ"));
  var faqWrap = el("div",{css:{border:"1px solid var(--border)",borderRadius:"12px",padding:"6px 18px"}});
  var faqs = [
    ["Is StudyLab free?", "Yes, completely free. No subscription, no hidden charges, no ads — ever."],
    ["Which exams is this useful for?", "Primarily for UPSC, SSC, RRB, State PCS and other competitive govt exams."],
    ["Can I use it offline?", "Once loaded, most features work without internet. Govt updates and daily digest require a connection."],
    ["How often is new content added?", "Questions are added on an hourly automated schedule, so the bank keeps growing while you study."]
  ];
  var faqOpen = {};
  faqs.forEach(function(faq, i){
    var item = el("div",{css:{borderBottom: i < faqs.length-1 ? "1px solid var(--border)" : "none", padding:"14px 0"}});
    var qrow = el("div",{css:{display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",gap:"12px"},onclick:function(){
      faqOpen[i] = !faqOpen[i];
      ans.style.display = faqOpen[i] ? "block" : "none";
      arrow.textContent = faqOpen[i] ? "\u25B2" : "\u25BC";
    }});
    qrow.appendChild(el("div",{css:{fontSize:".88rem",fontWeight:"600",lineHeight:"1.5",flex:"1"}},faq[0]));
    var arrow = el("span",{css:{fontSize:".62rem",color:"var(--muted)",flexShrink:"0"}},"\u25BC");
    qrow.appendChild(arrow);
    item.appendChild(qrow);
    var ans = el("div",{css:{fontSize:".82rem",color:"var(--muted)",lineHeight:"1.7",marginTop:"9px",display:"none",fontWeight:"300"}},faq[1]);
    item.appendChild(ans);
    faqWrap.appendChild(item);
  });
  faqBox.appendChild(faqWrap);
  wrap.appendChild(faqBox);

  // ── Roadmap ──
  var roadmap = el("div",{css:{marginBottom:"24px"}});
  roadmap.appendChild(el("div",{css:{fontSize:".68rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",fontWeight:"600",marginBottom:"14px"}},"Roadmap"));
  var rmWrap = el("div",{css:{border:"1px solid var(--border)",borderRadius:"12px",overflow:"hidden"}});
  [
    ["AI doubt solver", true],
    ["Current affairs", true],
    ["Flashcards", true],
    ["Mobile app (installable PWA)", true],
    ["PYQ analysis", false],
    ["Smart study planner", false],
    ["Revision scheduler", false],
    ["Mock test mode", false]
  ].forEach(function(t, i, arr){
    var row = el("div",{css:{display:"flex",alignItems:"center",gap:"10px",padding:"12px 16px",borderBottom: i<arr.length-1 ? "1px solid var(--border)" : "none"}});
    var dot = el("span",{css:{width:"7px",height:"7px",borderRadius:"50%",flexShrink:"0",background: t[1] ? "var(--accent)" : "var(--border2)"}});
    row.appendChild(dot);
    row.appendChild(el("div",{css:{fontSize:".85rem",color: t[1] ? "var(--text)" : "var(--muted)"}},t[0]));
    if(!t[1]) row.appendChild(el("div",{css:{fontSize:".68rem",color:"var(--muted)",marginLeft:"auto"}},"planned"));
    rmWrap.appendChild(row);
  });
  roadmap.appendChild(rmWrap);
  wrap.appendChild(roadmap);

  // ── Contact ──
  var contactBox = el("div",{css:{marginBottom:"12px"}});
  contactBox.appendChild(el("div",{css:{fontSize:".68rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",fontWeight:"600",marginBottom:"14px"}},"Get in touch"));
  contactBox.appendChild(el("div",{css:{fontSize:".86rem",color:"var(--muted)",marginBottom:"14px",lineHeight:"1.65",fontWeight:"300"}},"Have a suggestion, found a bug, or just want to say hi? Feel free to reach out. Every bit of feedback helps make StudyLab better for everyone."));
  var contactLinks = el("div",{css:{display:"flex",gap:"10px",flexWrap:"wrap"}});
  [
    {icon:"<img src='https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg' style='width:18px;height:18px;display:block;'>", label:"Telegram", href:"https://t.me/studylab_app"},
    {icon:"<img src='https://www.google.com/s2/favicons?domain=arattai.in&sz=128' style='width:18px;height:18px;display:block;border-radius:4px;'>", label:"Arattai", href:"https://aratt.ai/user/@jaglan_aman"}
  ].forEach(function(c){
    var btn = el("a",{href:c.href,target:"_blank",rel:"noopener",css:{display:"inline-flex",alignItems:"center",gap:"7px",padding:"9px 16px",borderRadius:"9px",background:"var(--card)",border:"1px solid var(--border)",color:"var(--text)",fontSize:".82rem",fontWeight:"600",textDecoration:"none"}});
    var iconSpan = el("span",{css:{display:"flex", alignItems:"center"}});
    iconSpan.innerHTML = c.icon;
    btn.appendChild(iconSpan);
    btn.appendChild(el("span",{},c.label));
    contactLinks.appendChild(btn);
  });
  contactBox.appendChild(contactLinks);
  wrap.appendChild(contactBox);

  // ── Footer note ──
  var fnote = el("div",{css:{textAlign:"center",padding:"20px 16px 32px",color:"var(--subtle)",fontSize:".76rem",lineHeight:"1.7"}});
  fnote.appendChild(el("div",{css:{marginBottom:"4px"}},"Made with care by Aman — a fellow aspirant, for all aspirants."));
  fnote.appendChild(el("div",{},"StudyLab is free forever. Good luck with your preparation."));
  wrap.appendChild(fnote);

  w.appendChild(wrap);
  return w;
}