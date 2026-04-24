function pgHome(){
  var tot=SUBJ.reduce(function(s,k){return s+(QD[k]||[]).length;},0);
  var w=el("div",{cls:"fd"});
  w.appendChild(makeNav("home"));

  // Quote of the day
  w.appendChild(makeQuoteCard());

  // NEW: Add the Deadline Widget
  w.appendChild(makeDeadlineWidget());

  // Stats
  var st=el("div",{css:{display:"flex",gap:"10px",marginBottom:"28px",flexWrap:"wrap"}});

  [[tot.toLocaleString(),"Questions","📝"],[SUBJ.length,"Subjects","📚"],["Daily","Quotes","✨"],["Auto","Saved","💾"]].forEach(function(r){
    var sc=el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"14px",padding:"16px 18px",flex:"1 1 110px",position:"relative",overflow:"hidden"}});
    sc.appendChild(el("div",{css:{fontSize:"1.2rem",marginBottom:"4px"},txt:r[2]}));
    sc.appendChild(el("div",{css:{fontSize:"1.05rem",fontWeight:"700",fontFamily:"var(--font-display)",letterSpacing:"-0.02em"},txt:r[0]}));
    sc.appendChild(el("div",{css:{fontSize:".7rem",color:"var(--subtle)",marginTop:"2px",textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"var(--font-display)"},txt:r[1]}));
    st.appendChild(sc);
  });
  w.appendChild(st);

  // Subject showcase - alternating layout
  var SD={
    History:{color:"#7c3aed",bg:"#f5f3ff",desc:"Explore ancient civilizations, medieval kingdoms, freedom struggle, and modern India.",topics:["Indus Valley","Mughal Empire","British Raj","Independence Movement","Ancient India"],sym:["\u2694\uFE0F","\uD83C\uDFDB\uFE0F","\uD83D\uDCDC","\uD83D\uDC51","\u269B\uFE0F","\uD83D\uDEE1\uFE0F"]},
    Geography:{color:"#059669",bg:"#ecfdf5",desc:"From Himalayas to coastal plains, rivers, climate zones, and world physical features.",topics:["Rivers & Lakes","Climate","Physical Features","World Map","Agriculture"],sym:["\uD83C\uDF0D","\uD83C\uDFD4\uFE0F","\uD83C\uDF0A","\uD83C\uDF3F","\uD83C\uDF0B","\uD83C\uDF0E"]},
    Polity:{color:"#dc2626",bg:"#fef2f2",desc:"Indian Constitution, Parliament, judiciary, fundamental rights and governance structure.",topics:["Constitution","Parliament","Fundamental Rights","Judiciary","Local Governance"],sym:["\u2696\uFE0F","\uD83C\uDFDB\uFE0F","\uD83D\uDCDC","\uD83D\uDD0F","\uD83C\uDDEE\uD83C\uDDF3"]},
    Economy:{color:"#0284c7",bg:"#f0f9ff",desc:"National income, banking, budget, five-year plans, poverty and economic reforms.",topics:["GDP & Growth","Banking","Union Budget","Poverty","Agriculture Economy"],sym:["\uD83D\uDCCA","\uD83D\uDCB0","\uD83C\uDFE6","\uD83D\uDCC8","\uD83D\uDCB9"]},
    Science:{color:"#0891b2",bg:"#ecfeff",desc:"Physics, chemistry, biology, technology, space, inventions and scientific discoveries.",topics:["Physics","Chemistry","Biology","Space Tech","Inventions"],sym:["\uD83D\uDD2C","\u269B\uFE0F","\uD83E\uDDEC","\uD83D\uDE80","\u26A1"]},
    GK:{color:"#d97706",bg:"#fffbeb",desc:"Current affairs, awards, sports, national symbols, important days and miscellaneous facts.",topics:["Current Affairs","Awards","Sports","National Symbols","Important Days"],sym:["\uD83C\uDFC6","\uD83C\uDF1F","\uD83D\uDCA1","\uD83C\uDDEE\uD83C\uDDF3","\uD83D\uDCF0"]},
  "Current Affairs":{color:"#3b82f6",bg:"#eff6ff",desc:"Stay updated with national, international, economy, sports, and tech news.",topics:["National","International","Economy","Sports","Tech"],sym:["📰","🌐","🏆","🚀","💰","🔥"]}
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
    
    // Optional: Send to backend if FEEDBACK_URL is configured (set in deployment environment)
    if(window.STUDYLAB_FEEDBACK_URL) {
      fetch(window.STUDYLAB_FEEDBACK_URL, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({data:{Date:new Date().toLocaleString("en-IN"),Rating:selRating+" stars",Message:selMsg||"(no message)"}})
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