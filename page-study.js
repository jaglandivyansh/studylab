function pgSub(){
  var s=sub,ac=AC[s],qs=QD[s]||[];
  var bms=getBookmarks(s); // Get saved bookmarks count
  var w=el("div",{cls:"fd",css:{maxWidth:"700px",margin:"0 auto"}});
  var nr=el("div",{css:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"32px",paddingBottom:"16px",borderBottom:"1.5px solid var(--border)"}});
  nr.appendChild(el("button",{cls:"btn btng",css:{padding:"6px 12px"},onclick:function(){go("home");}},"\u2190 Back"));
  var nb=el("div",{css:{display:"flex",alignItems:"center",gap:"8px"}});
  nb.appendChild(makeLogo(24));nb.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"600"},txt:"StudyLab"}));
  nr.appendChild(nb);w.appendChild(nr);
  
  var c1=el("div",{cls:"mc",onclick:function(){go("fc");}});
  c1.addEventListener("mouseenter",function(){this.style.borderColor=ac;this.style.background="var(--card2)";});
  c1.addEventListener("mouseleave",function(){this.style.borderColor="var(--border)";this.style.background="var(--card)";});
  c1.appendChild(el("div",{css:{fontSize:"2.2rem",marginBottom:"10px"},txt:"\uD83C\uDCCF"}));
  c1.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"600",marginBottom:"4px"},txt:"Flashcards"}));
  c1.appendChild(el("div",{css:{fontSize:".78rem",color:"var(--subtle)"},txt:"Learn with flip cards"}));
  
  var c2=el("div",{cls:"mc",onclick:function(){go("qz");}});
  c2.addEventListener("mouseenter",function(){this.style.borderColor=ac;this.style.background="var(--card2)";});
  c2.addEventListener("mouseleave",function(){this.style.borderColor="var(--border)";this.style.background="var(--card)";});
  c2.appendChild(el("div",{css:{fontSize:"2.2rem",marginBottom:"10px"},txt:"\uD83E\uDDE0"}));
  c2.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"600",marginBottom:"4px"},txt:"Quiz"}));
  c2.appendChild(el("div",{css:{fontSize:".78rem",color:"var(--subtle)"},txt:"Test your knowledge"}));
  
  // NEW: Bookmarks Card
  var c3=el("div",{cls:"mc",onclick:function(){go("bm");}});
  c3.addEventListener("mouseenter",function(){this.style.borderColor="#f59e0b";this.style.background="var(--card2)";});
  c3.addEventListener("mouseleave",function(){this.style.borderColor="var(--border)";this.style.background="var(--card)";});
  c3.appendChild(el("div",{css:{fontSize:"2.2rem",marginBottom:"10px"},txt:"⭐"}));
  c3.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"600",marginBottom:"4px"},txt:"Bookmarks"}));
  c3.appendChild(el("div",{css:{fontSize:".78rem",color:"var(--subtle)"},txt:bms.length+" saved questions"}));

  var ctr=el("div",{css:{textAlign:"center",padding:"12px 0 32px"}});
  ctr.appendChild(el("div",{css:{fontSize:"3.5rem",marginBottom:"12px"},txt:ICON[s]}));
  ctr.appendChild(el("div",{css:{fontSize:"1.5rem",fontWeight:"700",marginBottom:"6px"},txt:s}));
  ctr.appendChild(el("div",{css:{fontSize:".9rem",color:"var(--muted)",marginBottom:"36px"},txt:qs.length+" questions ready"}));
  var mrow=el("div",{css:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(190px, 1fr))",gap:"16px",justifyContent:"center"}});
  mrow.appendChild(c1);mrow.appendChild(c2);mrow.appendChild(c3);
  ctr.appendChild(mrow);w.appendChild(ctr);
  return w;
}

function pgFC(){
  var s=sub,ac=AC[s],allQ=QD[s]||[];
  var pool=shuf(allQ),idx=0,fl=false,srch="",tab="browse";
  var sv=Sv.get("fc_"+s)||{c:[],k:{}};var custom=sv.c,known=sv.k;
  function persist(){Sv.set("fc_"+s,{c:custom,k:known});}
  var w=el("div",{css:{maxWidth:"700px",margin:"0 auto"}});
  
  var sessionTime = 0;
  var timerInt = setInterval(function(){
    if(pg !== "fc") { clearInterval(timerInt); return; } 
    sessionTime++;
    var te = document.getElementById("fc-timer");
    if(te) {
      var m = Math.floor(sessionTime/60);
      var sec = sessionTime%60;
      te.textContent = "⏱️ " + m + ":" + (sec<10?"0":"")+sec;
    }
  }, 1000);

  function getF(){var sc=srch.trim().toLowerCase();return sc?pool.map(function(q){return{id:q.q.slice(0,35),q:q.q,a:q.o[q.a],orig:q};}).filter(function(c){return c.q.toLowerCase().indexOf(sc)>=0||c.a.toLowerCase().indexOf(sc)>=0;}):pool.map(function(q){return{id:q.q.slice(0,35),q:q.q,a:q.o[q.a],orig:q};});}
  
  function build(){
    w.innerHTML="";
    var fc=getF(),si=fc.length?idx%fc.length:0,card=fc[si]||null,isK=card&&known[card.id];
    var isBm=card?isBookmarked(s,card.q):false; 
    var kc=Object.keys(known).filter(function(k){return known[k];}).length;
    
    var hdr=el("div",{css:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px",paddingBottom:"16px",borderBottom:"1.5px solid var(--border)"}});
    hdr.appendChild(el("button",{cls:"btn btng",css:{padding:"6px 12px"},onclick:function(){go("sub");}},"\u2190 Back"));
    var hInfo = el("div",{css:{flex:"1"}});
    hInfo.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"600"},txt:ICON[s]+" "+s+" \u00b7 Flashcards"}));
    var hSub = el("div",{css:{fontSize:".75rem",color:"var(--subtle)",marginTop:"1px",display:"flex",alignItems:"center",gap:"10px"}});
    hSub.appendChild(el("span",{},(pool.length+custom.length)+" cards \u00b7 "+kc+" known"));
    hSub.appendChild(el("span",{id:"fc-timer",css:{color:"var(--accent)",fontWeight:"600",background:"var(--bg2)",padding:"2px 8px",borderRadius:"6px"}},"⏱️ "+Math.floor(sessionTime/60)+":"+(sessionTime%60<10?"0":"")+(sessionTime%60)));
    hInfo.appendChild(hSub);
    hdr.appendChild(hInfo);
    hdr.appendChild(el("span",{css:{fontSize:".75rem",color:ac,background:ac+"22",padding:"4px 10px",borderRadius:"6px",fontWeight:"500"},txt:fc.length+" cards"}));
    w.appendChild(hdr);
    
    var tb=el("div",{css:{display:"flex",gap:"4px",background:"var(--bg2)",padding:"4px",borderRadius:"8px",marginBottom:"18px",width:"fit-content"}});
    ["browse","add"].forEach(function(t){tb.appendChild(el("button",{css:{padding:"6px 14px",borderRadius:"6px",fontSize:".8rem",fontWeight:"500",cursor:"pointer",fontFamily:"inherit",background:tab===t?"var(--card)":"transparent",color:tab===t?"var(--text)":"var(--subtle)",border:tab===t?"1px solid #3a3a3a":"none"},onclick:function(){tab=t;build();}},t==="browse"?"Browse":"+ Add Card"));});
    w.appendChild(tb);
    
    if(tab==="browse"){
      var sr=el("div",{css:{display:"flex",gap:"8px",alignItems:"center",marginBottom:"16px"}});
      var inp=el("input",{cls:"inp",placeholder:"Search "+s+"...",value:srch,type:"text",css:{flex:"1"}});
      inp.addEventListener("input",function(e){srch=e.target.value;idx=0;fl=false;build();});
      sr.appendChild(inp);sr.appendChild(el("span",{css:{fontSize:".8rem",color:"var(--subtle)",whiteSpace:"nowrap"},txt:(si+1)+"/"+fc.length}));w.appendChild(sr);
      
      var cw = el("div", {
          cls: "cw",
          onclick: function() {
              fl = !fl;
              ci.className = "ci" + (fl ? " fl" : "");
              var std = document.getElementById('srs-standard-btns');
              var rat = document.getElementById('srs-rating-btns');
              if(std && rat) {
                  std.style.display = fl ? 'none' : 'flex';
                  rat.style.display = fl ? 'flex' : 'none';
              }
          }
      });
      var ci = el("div", { cls: "ci" + (fl ? " fl" : "") });
      
      var cf = el("div", { cls: "cf" });
      cf.appendChild(el("div", { css: { fontSize: "1.05rem", lineHeight: "1.65", maxHeight: "170px", overflow: "hidden" }, txt: card ? card.q : "No cards" }));
      cf.appendChild(el("div", { css: { fontSize: ".75rem", color: "var(--subtle)", marginTop: "16px" }, txt: "Click to reveal answer" }));
      ci.appendChild(cf);
      
      var cbk = el("div", { cls: "cf cb", css: { borderColor: ac + "55" } });
      cbk.appendChild(el("div", { css: { fontSize: "1.15rem", fontWeight: "600", color: ac }, txt: card ? card.a : "" }));
      if (isK) cbk.appendChild(el("div", { css: { marginTop: "14px", fontSize: ".72rem", color: "#4ade80", background: "rgba(74,222,128,.15)", padding: "4px 10px", borderRadius: "6px" }, txt: "✓ Next review pending" }));
      ci.appendChild(cbk);
      
      cw.appendChild(ci);
      w.appendChild(cw);

      var nr = el("div", {css: {width: "100%", marginTop: "12px"}});

      var stdBtns = el("div", {id: "srs-standard-btns", css: {display: fl ? "none" : "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap"}});
      stdBtns.appendChild(el("button", {cls: "btn", onclick: function(){ idx = (idx - 1 + Math.max(1, fc.length)) % Math.max(1, fc.length); fl = false; build(); }}, "← Prev"));
      stdBtns.appendChild(el("button", {cls: "btn", css: {color: isBm ? "#f59e0b" : "", borderColor: isBm ? "#f59e0b" : ""}, onclick: function(){ if(!card) return; toggleBookmark(s, card.orig); build(); }}, isBm ? "⭐ Saved" : "☆ Save"));
      stdBtns.appendChild(el("button", {cls: "btn btnp", onclick: function(){ idx = (idx + 1) % Math.max(1, fc.length); fl = false; build(); }}, "Next →"));
      
      var ratingBtns = el("div", {id: "srs-rating-btns", css: {display: fl ? "flex" : "none", flexDirection: "column", gap: "8px", width: "100%"}});
      ratingBtns.appendChild(el("div", {css: {textAlign: "center", fontSize: ".75rem", color: "var(--muted)", marginBottom: "4px"}}, "How hard was this to remember?"));
      var rRow = el("div", {css: {display: "flex", gap: "10px", width: "100%"}});
      
      var rateCard = function(days, msg) {
        if(!card) return; known[card.id] = Date.now() + (days * 86400000); persist(); toast(msg);
        idx = (idx + 1) % Math.max(1, fc.length); fl = false; build();
      };
      
      rRow.appendChild(el("button", {cls: "btn btn-srs-hard", css: {flex: "1"}, onclick: function(){ rateCard(1, "Review tomorrow"); }}, "Hard (1d)"));
      rRow.appendChild(el("button", {cls: "btn btn-srs-good", css: {flex: "1"}, onclick: function(){ rateCard(3, "Review in 3 days"); }}, "Good (3d)"));
      rRow.appendChild(el("button", {cls: "btn btn-srs-easy", css: {flex: "1"}, onclick: function(){ rateCard(7, "Review in 7 days"); }}, "Easy (7d)"));
      
      ratingBtns.appendChild(rRow);
      nr.appendChild(stdBtns);
      nr.appendChild(ratingBtns);
      
      w.appendChild(nr);
      var pb=el("div",{cls:"pb",css:{marginTop:"16px"}});pb.appendChild(el("div",{cls:"pf",css:{width:(fc.length?((si+1)/fc.length)*100:0)+"%",background:ac}}));w.appendChild(pb);
    } else {
      var aw=el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px",padding:"20px"}});
      aw.appendChild(el("div",{css:{fontSize:".85rem",fontWeight:"500",marginBottom:"16px"},txt:"Create a custom flashcard"}));
      var ag=el("div",{css:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}});
      var qta=el("textarea",{cls:"inp",placeholder:"Write your question...",rows:"4",css:{resize:"vertical"}});
      var ata=el("textarea",{cls:"inp",placeholder:"Correct answer...",rows:"4",css:{resize:"vertical"}});
      ag.appendChild(el("div",{},[el("div",{css:{fontSize:".75rem",color:"var(--subtle)",marginBottom:"6px"},txt:"Question"}),qta]));
      ag.appendChild(el("div",{},[el("div",{css:{fontSize:".75rem",color:"var(--subtle)",marginBottom:"6px"},txt:"Answer"}),ata]));
      aw.appendChild(ag);
      aw.appendChild(el("button",{cls:"btn btnp",css:{width:"100%"},onclick:function(){if(!qta.value.trim()||!ata.value.trim()){toast("Fill both fields","#f87171");return;}custom.push({q:qta.value.trim(),a:ata.value.trim()});persist();toast("Card added!");qta.value="";ata.value="";build();}},"Add Flashcard"));
      if(custom.length)aw.appendChild(el("div",{css:{marginTop:"10px",fontSize:".75rem",color:"var(--subtle)"},txt:custom.length+" custom card"+(custom.length>1?"s":"")+" saved"}));
      w.appendChild(aw);
      if(custom.length){var cl=el("div",{css:{marginTop:"16px"}});custom.forEach(function(c){cl.appendChild(el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px 14px",marginBottom:"6px"}},[el("div",{css:{fontSize:".85rem",fontWeight:"500",marginBottom:"4px"},txt:c.q}),el("div",{css:{fontSize:".8rem",color:ac},txt:c.a})]));});w.appendChild(cl);}
    }
  }
  build();return w;
}

function pgQZ(){
  var s=sub,ac=AC[s],allQ=QD[s]||[];
  var qst="home",pool=[],qi=0,sc=0,sk=0,ch=null,isSk=false,cnt=25,wrong=[],sRev=false,sHist=false;
  var sv=Sv.get("qz_"+s)||{best:null,att:0,h:[]};var best=sv.best,att=sv.att,hist=sv.h||[];
  function persist(){Sv.set("qz_"+s,{best:best,att:att,h:hist});}
  var L=["A","B","C","D"];
  var w=el("div",{css:{maxWidth:"700px",margin:"0 auto"}});
  var lock=false; 

  // Timer State
  var isTimed = false;
  var timeTaken = 0;
  var timeLimit = 0;
  var timerInt = null;

  // Challenge State
  var isChallenge = window.challengeData && window.challengeData.s === s;
  var chal = window.challengeData;

  function fmt(sec){ var m=Math.floor(sec/60), secR=sec%60; return m+":"+(secR<10?"0":"")+secR; }

  function finishQuiz() {
    if(timerInt) clearInterval(timerInt);
    var pct=pool.length?Math.round((sc/pool.length)*100):0;
    hist=[{date:new Date().toLocaleDateString("en-IN"),pct:pct,correct:sc,skipped:sk,total:pool.length}].concat(hist).slice(0,15);
    if(best===null||pct>best){best=pct;if(pct>0)toast("\uD83C\uDFC6 New best: "+pct+"%!");}
    if(pct === 100) throwConfetti(); // Boom! Perfect score!
    persist(); qst="result"; build();
  }

  function adv(){
    qi++;
    if(qi>=pool.length) finishQuiz();
    else { ch=null; isSk=false; build(); }
  }
  
  function build(){
    w.innerHTML="";
    var hdr=el("div",{css:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px",paddingBottom:"16px",borderBottom:"1.5px solid var(--border)"}});
    hdr.appendChild(el("button",{cls:"btn btng",css:{padding:"6px 12px"},onclick:function(){
      if(window.qzTimeout) clearTimeout(window.qzTimeout); // Stop quiz from advancing if we exit
      if(isChallenge) { window.challengeData = null; } 
      go("sub");
    }},"\u2190 Back"));
    hdr.appendChild(el("div",{css:{flex:"1"}},[
      el("div",{css:{fontSize:"1rem",fontWeight:"600"},txt:ICON[s]+" "+s+(isChallenge?" \u00b7 Challenge":" \u00b7 Quiz")}),
      el("div",{css:{fontSize:".75rem",color:"var(--subtle)",marginTop:"1px"},txt:isChallenge?"Target: "+chal.sc+" points":allQ.length+" questions available"})
    ]));
    if(qst==="playing")hdr.appendChild(el("span",{css:{fontSize:".8rem",color:"var(--subtle)"},txt:sc+" correct \u00b7 "+sk+" skipped"}));
    w.appendChild(hdr);
    
    if(qst==="home"){
      var hw=el("div",{cls:"fd"});
      
      if(isChallenge) {
         // --- CHALLENGE HOME SCREEN ---
         var cbox=el("div",{css:{background:"linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.08))",border:"1px solid #f59e0b",borderRadius:"16px",padding:"36px 24px",textAlign:"center",marginBottom:"24px",boxShadow:"0 8px 24px rgba(245,158,11,0.15)"}});
         cbox.appendChild(el("div",{css:{fontSize:"3.5rem",marginBottom:"12px"},txt:"⚔️"}));
         cbox.appendChild(el("div",{css:{fontSize:"1.6rem",fontWeight:"800",marginBottom:"8px",color:"var(--text)"},txt:chal.n + " challenged you!"}));
         cbox.appendChild(el("div",{css:{fontSize:".95rem",color:"var(--muted)",marginBottom:"28px",lineHeight:"1.6"},txt:"They scored "+chal.sc+" out of "+chal.q.length+" in this exact quiz. Do you have what it takes to beat them?"}));
         
         cbox.appendChild(el("button",{cls:"btn btnp",css:{width:"100%",padding:"14px",fontSize:"1.05rem",borderRadius:"10px",background:"linear-gradient(135deg, #f59e0b, #ef4444)",border:"none",boxShadow:"0 4px 14px rgba(245,158,11,0.3)"},onclick:function(){
            pool = chal.q.map(function(i){ return allQ[i]; }).filter(Boolean);
            qi=0;sc=0;sk=0;ch=null;isSk=false;wrong=[];sRev=false;att++;
            qst="playing"; lock=true; 
            
            if(timerInt) clearInterval(timerInt);
            timeTaken = 0; isTimed = false; 
            timerInt = setInterval(function(){
                if(pg !== "qz") { clearInterval(timerInt); return; }
                timeTaken++;
                var te = document.getElementById("qz-timer");
                if(te) te.textContent = "⏱️ " + fmt(timeTaken);
            }, 1000);
            
            build(); setTimeout(function(){ lock=false; }, 300);
         }},"Accept Challenge 🚀"));
         hw.appendChild(cbox);

      } else {
         // --- NORMAL HOME SCREEN ---
         var hi=el("div",{css:{display:"flex",alignItems:"center",gap:"16px",marginBottom:"28px"}});
         hi.appendChild(el("span",{css:{fontSize:"2.5rem"},txt:ICON[s]}));
         hi.appendChild(el("div",{},[el("div",{css:{fontSize:"1.25rem",fontWeight:"600",marginBottom:"2px"},txt:s+" Quiz"}),el("div",{css:{fontSize:".85rem",color:"var(--muted)"},txt:allQ.length+" questions, shuffled each time"})]));
         hw.appendChild(hi);
         var sg=el("div",{css:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"24px"}});
         [["Questions",allQ.length],["Sessions",att],["Best",best!==null?best+"%":"\u2014"]].forEach(function(r){sg.appendChild(el("div",{cls:"stb"},[el("div",{css:{fontSize:"1.35rem",fontWeight:"600",marginBottom:"4px"},txt:String(r[1])}),el("div",{css:{fontSize:".72rem",color:"var(--subtle)",textTransform:"uppercase"},txt:r[0]})]));});
         hw.appendChild(sg);
         
         var cg=el("div",{css:{marginBottom:"20px"}});cg.appendChild(el("div",{css:{fontSize:".8rem",color:"var(--subtle)",marginBottom:"10px"},txt:"Questions per session"}));
         var cr=el("div",{css:{display:"flex",gap:"6px",flexWrap:"wrap"}});
         [10,25,50,100].filter(function(n){return n<=allQ.length+5;}).forEach(function(n){cr.appendChild(el("button",{css:{padding:"7px 18px",borderRadius:"6px",border:"1px solid "+(cnt===n?ac:"var(--border)"),background:cnt===n?ac+"22":"var(--card)",color:cnt===n?ac:"var(--muted)",fontWeight:"500",fontSize:".85rem",cursor:"pointer",fontFamily:"inherit"},onclick:function(){cnt=n;build();}},String(n)));});
         cg.appendChild(cr);hw.appendChild(cg);
         
         var tmrG=el("div",{css:{marginBottom:"24px"}});
         tmrG.appendChild(el("div",{css:{fontSize:".8rem",color:"var(--subtle)",marginBottom:"10px"},txt:"Quiz Mode"}));
         var tmrR=el("div",{css:{display:"flex",gap:"6px",flexWrap:"wrap"}});
         var tOpts = [{lbl:"Untimed", val:false}, {lbl:"⏱️ Exam Mode (1 min/Q)", val:true}];
         tOpts.forEach(function(o){
           tmrR.appendChild(el("button",{css:{padding:"7px 18px",borderRadius:"6px",border:"1px solid "+(isTimed===o.val?ac:"var(--border)"),background:isTimed===o.val?ac+"22":"var(--card)",color:isTimed===o.val?ac:"var(--muted)",fontWeight:"500",fontSize:".85rem",cursor:"pointer"},onclick:function(){isTimed=o.val;build();}},o.lbl));
         });
         tmrG.appendChild(tmrR); hw.appendChild(tmrG);
         
         hw.appendChild(el("button",{cls:"btn btnp",css:{width:"100%",padding:"12px",fontSize:"1rem",borderRadius:"10px",marginBottom:"20px"},onclick:function(){
           pool=shuf(allQ).slice(0,Math.min(cnt,allQ.length));qi=0;sc=0;sk=0;ch=null;isSk=false;wrong=[];sRev=false;att++;
           persist();qst="playing"; lock=true; 
           
           if(timerInt) clearInterval(timerInt);
           timeTaken = 0;
           timeLimit = isTimed ? cnt * 60 : 0; 
           timerInt = setInterval(function(){
               if(pg !== "qz") { clearInterval(timerInt); return; }
               timeTaken++;
               var te = document.getElementById("qz-timer");
               if(te) {
                   if(isTimed) {
                       var rem = timeLimit - timeTaken;
                       te.textContent = "⏱️ " + fmt(rem);
                       if(rem <= 60) { te.style.color = "#f87171"; te.style.background = "rgba(248,113,113,0.1)"; }
                       if(rem <= 0) { clearInterval(timerInt); toast("⏰ Time's up!"); finishQuiz(); }
                   } else { te.textContent = "⏱️ " + fmt(timeTaken); }
               }
           }, 1000);
           
           build(); setTimeout(function(){ lock=false; }, 300);
         }},"Start Quiz"));
         
         if(hist.length){
           hw.appendChild(el("button",{cls:"btn",css:{width:"100%",justifyContent:"space-between",padding:"10px 14px"},onclick:function(){sHist=!sHist;build();}},[el("span",{},"Session History"),el("span",{},sHist?"\u25b2":"\u25bc")]));
           if(sHist){var hl=el("div",{css:{marginTop:"8px"}});hist.forEach(function(e){hl.appendChild(el("div",{cls:"hrow"},[el("span",{css:{color:"var(--subtle)"},txt:e.date}),el("span",{},e.correct+"/"+e.total+(e.skipped?" \u00b7 "+e.skipped+" skipped":"")),el("span",{css:{fontWeight:"600",color:e.pct>=60?"#4ade80":"#f87171"}},e.pct+"%")]));});hw.appendChild(hl);}
         }
      }
      w.appendChild(hw);
    } else if(qst==="playing"&&pool[qi]){
      var q=pool[qi],pw=el("div",{cls:"fd"});
      var pb=el("div",{cls:"pb"});pb.appendChild(el("div",{cls:"pf",css:{width:(qi/pool.length*100)+"%",background:isChallenge?"#f59e0b":ac}}));pw.appendChild(pb);
      var qbox=el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px",padding:"20px 22px",marginBottom:"16px"}});
      
      var qtop=el("div",{css:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}});
      var qtopL = el("div",{css:{display:"flex",alignItems:"center",gap:"10px"}});
      qtopL.appendChild(el("span",{css:{fontSize:".75rem",color:"var(--subtle)",textTransform:"uppercase",fontWeight:"500"},txt:"Q "+(qi+1)+" of "+pool.length}));
      var timerStr = isTimed ? fmt(timeLimit - timeTaken) : fmt(timeTaken);
      var isLowTime = isTimed && (timeLimit - timeTaken <= 60);
      qtopL.appendChild(el("span",{id:"qz-timer",css:{fontSize:".75rem",fontWeight:"700",color:isLowTime?"#f87171":"var(--accent)",background:isLowTime?"rgba(248,113,113,0.1)":"var(--bg2)",padding:"2px 8px",borderRadius:"6px"}},"⏱️ "+timerStr));
      qtop.appendChild(qtopL);
      
      var rside=el("div",{css:{display:"flex",alignItems:"center",gap:"10px"}});
      if(isSk)rside.appendChild(el("span",{css:{fontSize:".72rem",color:"var(--subtle)",background:"var(--bg2)",padding:"2px 8px",borderRadius:"4px"},txt:"Skipped"}));
      var isBm=isBookmarked(s, q.q);
      var bmBtn=el("button",{css:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1.2rem",transition:"transform 0.2s"},txt:isBm?"⭐":"☆"});
      bmBtn.onclick=function(e){ e.preventDefault(); isBm=toggleBookmark(s, q); this.textContent=isBm?"⭐":"☆"; this.style.transform="scale(1.2)"; var btn=this; setTimeout(function(){btn.style.transform="scale(1)";}, 200); };
      var rside=el("div",{css:{display:"flex",alignItems:"center",gap:"10px"}});
      if(isSk)rside.appendChild(el("span",{css:{fontSize:".72rem",color:"var(--subtle)",background:"var(--bg2)",padding:"2px 8px",borderRadius:"4px"},txt:"Skipped"}));
      var isBm = isBookmarked(s, q.q);
      var bmBtn = el("button", {cls: "icon-action-btn" + (isBm ? " bm-active" : ""), txt: isBm ? "⭐" : "☆"});
      bmBtn.onclick = function(e){ 
        e.preventDefault(); 
        isBm = toggleBookmark(s, q); 
        this.textContent = isBm ? "⭐" : "☆"; 
        this.className = "icon-action-btn" + (isBm ? " bm-active" : "");
        this.style.transform = "scale(1.1)"; 
        var btn = this; setTimeout(function(){ btn.style.transform = ""; }, 200); 
      };
      
      // --- ADDED AI BUTTON ---
      var aiBtn = el("button", {cls: "icon-action-btn", txt: "💡"});
      aiBtn.onclick = function(e){ e.preventDefault(); openSarvamAIModal(q.q, q.o, q.a, s); };
      rside.appendChild(aiBtn);
      // -----------------------

      rside.appendChild(bmBtn);
      qtop.appendChild(rside);

      qbox.appendChild(qtop);qbox.appendChild(el("div",{css:{fontSize:"1.05rem",lineHeight:"1.65"},txt:q.q}));pw.appendChild(qbox);
      var ol=el("div",{css:{marginBottom:"12px"}});
      q.o.forEach(function(opt,i){
        var cls="qo";if(ch!==null){if(i===q.a)cls+=" ok";else if(i===ch)cls+=" no";}
        var ob=el("button",{cls:cls,onclick:function(e){
          e.preventDefault(); if(ch!==null || isSk || lock) return;
          
          // FIX: Force browser to drop the 'sticky hover' state
          this.blur();
          if (document.activeElement) document.activeElement.blur();
          
          lock = true; ch=i;
          if(i===q.a)sc++;else wrong.push({q:q.q,correct:q.o[q.a],chosen:opt,orig:q});
          build();
          
          // Save timeout globally so it can be safely cancelled
          window.qzTimeout = setTimeout(function(){ 
            adv(); 
            setTimeout(function(){ lock=false; }, 300); 
          }, 1100);
        }});
        ob.appendChild(el("span",{css:{fontSize:".75rem",fontWeight:"600",color:"var(--subtle)",minWidth:"20px"},txt:L[i]+"."}));
        ob.appendChild(el("span",{},opt));
        if(ch!==null||isSk)ob.disabled=true;ol.appendChild(ob);
      });
      pw.appendChild(ol);
      
      if(ch===null&&!isSk)pw.appendChild(el("button",{cls:"btn btng",css:{width:"100%",fontSize:".85rem"},onclick:function(e){ 
        e.preventDefault(); if(lock) return; 
        
        // FIX: Drop focus state for the skip button too
        this.blur();
        if (document.activeElement) document.activeElement.blur();
        
        lock=true; isSk=true; sk++; build(); 
        
        window.qzTimeout = setTimeout(function(){ 
          adv(); 
          setTimeout(function(){ lock=false; }, 300); 
        }, 500); 
      }},"\u23e9 Skip"));
      w.appendChild(pw);
    } else if(qst==="result"){
      var pct=pool.length?Math.round((sc/pool.length)*100):0;
      var rw=el("div",{cls:"fd"});
      var rbox=el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px",padding:"32px 28px",marginBottom:"16px",textAlign:"center"}});
      
      if(isChallenge) {
         var won = sc > chal.sc;
         var tie = sc === chal.sc;
         var rcol = won ? "#4ade80" : (tie ? "#f59e0b" : "#f87171");
         rbox.appendChild(el("div",{css:{fontSize:"4rem",fontWeight:"700",color:rcol,lineHeight:"1",marginBottom:"8px"},txt:sc+" / "+pool.length}));
         rbox.appendChild(el("div",{css:{fontSize:"1.2rem",fontWeight:"700",marginBottom:"4px"},txt:won?"You beat "+chal.n+"! 🎉":(tie?"It's a tie! 🤝":chal.n+" wins! 💀")}));
         rbox.appendChild(el("div",{css:{fontSize:".9rem",color:"var(--muted)",marginBottom:"20px"},txt:"Your Score: "+sc+" | Their Score: "+chal.sc}));
         window.challengeData = null; // Clear so the next quiz is normal!
      } else {
         var rlbl=pct===100?"Perfect!":pct>=80?"Excellent!":pct>=60?"Good job!":pct>=40?"Keep practicing!":"Don't give up!";
         var rcol=pct>=60?"#4ade80":pct>=40?ac:"#f87171";
         rbox.appendChild(el("div",{css:{fontSize:"4rem",fontWeight:"700",color:rcol,lineHeight:"1",marginBottom:"8px"},txt:pct+"%"}));
         rbox.appendChild(el("div",{css:{fontSize:"1.1rem",fontWeight:"600",marginBottom:"4px"},txt:rlbl}));
         rbox.appendChild(el("div",{css:{fontSize:".85rem",color:"var(--muted)",marginBottom:"20px"},txt:sc+" correct \u00b7 "+(pool.length-sc-sk)+" wrong \u00b7 "+sk+" skipped \u00b7 ⏱️ "+fmt(timeTaken)}));
         var bar=el("div",{css:{display:"flex",gap:"2px",height:"6px",borderRadius:"99px",overflow:"hidden",marginBottom:"24px"}});
         bar.appendChild(el("div",{css:{flex:String(sc),background:"#4ade80",borderRadius:"99px"}}));
         bar.appendChild(el("div",{css:{flex:String(Math.max(0,pool.length-sc-sk)),background:"#f87171",borderRadius:"99px"}}));
         bar.appendChild(el("div",{css:{flex:String(sk),background:"var(--border2)",borderRadius:"99px"}}));
         rbox.appendChild(bar);
      }

      var rbts=el("div",{css:{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap"}});
      
      if(!isChallenge) {
          var chalBtn = el("button",{cls:"btn btnp",css:{background:"linear-gradient(135deg, #f59e0b, #ef4444)", border:"none", boxShadow:"0 4px 14px rgba(245,158,11,0.3)", width:"100%", marginBottom:"8px"},onclick:function(){
             var qIndices = pool.map(function(q){ return allQ.indexOf(q); }).join('-');
             var uName = window.currentUser && window.currentUser.displayName ? window.currentUser.displayName : "A friend";
             var baseUrl = window.location.origin + window.location.pathname;
             var link = baseUrl + "?c=1&s=" + encodeURIComponent(s) + "&sc=" + sc + "&n=" + encodeURIComponent(uName) + "&q=" + qIndices;
             
             if(navigator.share) {
               navigator.share({title:"Beat my score!", text:"I scored " + sc + "/" + pool.length + " in " + s + " on StudyLab. Can you beat me?", url: link}).catch(function(){});
             } else if (navigator.clipboard && window.isSecureContext !== false) {
               navigator.clipboard.writeText(link).then(function(){ 
                   toast("Challenge link copied! Send it to your friends. ⚔️", "#f59e0b"); 
               }).catch(function(){ prompt("Copy this link to challenge your friend:", link); });
             } else {
               prompt("Copy this link to challenge your friend:", link);
             }
          }},"⚔️ Challenge a Friend to beat "+sc+"!"); // ✅ Fixed!
          
          rbox.appendChild(chalBtn);
      }

      rbts.appendChild(el("button",{cls:"btn btnp",css:{flex:"1",justifyContent:"center"},onclick:function(){
        // Fix for the challenge "New Quiz" bug
        if(isChallenge) { window.challengeData = null; go("qz"); return; }
        
        pool=shuf(allQ).slice(0,Math.min(cnt,allQ.length));qi=0;sc=0;sk=0;ch=null;isSk=false;wrong=[];sRev=false;att++; persist();qst="playing"; lock=true; 
        if(timerInt) clearInterval(timerInt);
        timeTaken = 0; timeLimit = isTimed ? cnt * 60 : 0; 
        timerInt = setInterval(function(){
            if(pg !== "qz") { clearInterval(timerInt); return; }
            timeTaken++; var te = document.getElementById("qz-timer");
            if(te) {
                if(isTimed) {
                    var rem = timeLimit - timeTaken; te.textContent = "⏱️ " + fmt(rem);
                    if(rem <= 60) { te.style.color = "#f87171"; te.style.background = "rgba(248,113,113,0.1)"; }
                    if(rem <= 0) { clearInterval(timerInt); toast("⏰ Time's up!"); finishQuiz(); }
                } else { te.textContent = "⏱️ " + fmt(timeTaken); }
            }
        }, 1000);
        build(); setTimeout(function(){ lock=false; }, 300);
      }},"New Quiz"));
      rbts.appendChild(el("button",{cls:"btn",css:{flex:"1",justifyContent:"center"},onclick:function(){qst="home";build();}},"\u2190 Home"));
      rbox.appendChild(rbts);rw.appendChild(rbox);
      
      if(wrong.length){
        rw.appendChild(el("button",{cls:"btn",css:{width:"100%",justifyContent:"space-between",marginBottom:"8px"},onclick:function(){sRev=!sRev;build();}},[el("span",{},"Review "+wrong.length+" wrong answers"),el("span",{},sRev?"\u25b2":"\u25bc")]));
        if(sRev){wrong.forEach(function(ww){
          var isBmR=isBookmarked(s, ww.q);
          var revW=el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"8px",padding:"14px",marginBottom:"8px",position:"relative"}});
          var rmBtnR=el("button",{css:{position:"absolute",top:"12px",right:"12px",background:"transparent",border:"none",cursor:"pointer",fontSize:"1.1rem"},txt:isBmR?"⭐":"☆"});
          rmBtnR.onclick=function(){ isBmR=toggleBookmark(s, ww.orig); this.textContent=isBmR?"⭐":"☆"; }; 
          revW.appendChild(rmBtnR);
          revW.appendChild(el("div",{css:{fontSize:".875rem",lineHeight:"1.55",marginBottom:"10px",paddingRight:"24px"},txt:ww.q}));
          revW.appendChild(el("div",{css:{fontSize:".8rem",color:"#4ade80",marginBottom:"4px"},txt:"\u2713 "+ww.correct}));
          revW.appendChild(el("div",{css:{fontSize:".8rem",color:"#f87171"},txt:"\u2717 "+ww.chosen}));
          rw.appendChild(revW);
        });}
      }
      w.appendChild(rw);
    }
  }
  build();return w;
}

// --- NEW BOOKMARKS PAGE ---
function pgBookmarks(){
  var s=sub, ac=AC[s];
  var w=el("div",{cls:"fd",css:{maxWidth:"700px",margin:"0 auto"}});
  
  function build(){
    w.innerHTML="";
    var bms=getBookmarks(s);
    
    var hdr=el("div",{css:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px",paddingBottom:"16px",borderBottom:"1.5px solid var(--border)"}});
    hdr.appendChild(el("button",{cls:"btn btng",css:{padding:"6px 12px"},onclick:function(){go("sub");}},"\u2190 Back"));
    hdr.appendChild(el("div",{css:{flex:"1"}},[
      el("div",{css:{fontSize:"1rem",fontWeight:"600"},txt:ICON[s]+" "+s+" \u00b7 Bookmarks"}),
      el("div",{css:{fontSize:".75rem",color:"var(--subtle)",marginTop:"1px"},txt:bms.length+" saved questions"})
    ]));
    w.appendChild(hdr);

    if(!bms.length){
      var emp=el("div",{css:{textAlign:"center",padding:"50px 20px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px"}});
      emp.appendChild(el("div",{css:{fontSize:"3rem",marginBottom:"12px"},txt:"⭐"}));
      emp.appendChild(el("div",{css:{fontSize:"1.1rem",fontWeight:"600",marginBottom:"8px"},txt:"No bookmarks yet"}));
      emp.appendChild(el("div",{css:{fontSize:".85rem",color:"var(--muted)",marginBottom:"20px"},txt:"Tap the ⭐ icon during a quiz or flashcard session to save tricky questions here for quick revision."}));
      emp.appendChild(el("button",{cls:"btn btnp",onclick:function(){go("qz");}},"Start a Quiz"));
      w.appendChild(emp);
      return;
    }

    var lw=el("div",{cls:"fd"});
    bms.forEach(function(q){
      var card=el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px",padding:"22px",marginBottom:"14px",position:"relative",boxShadow:"var(--shadow-card)"}});
      
      // Remove Bookmark Button
      var rmBtn=el("button",{css:{position:"absolute",top:"18px",right:"18px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",cursor:"pointer",fontSize:"1.1rem",padding:"4px 8px",transition:"all 0.2s"},txt:"⭐"});
      rmBtn.onmouseover = function() { this.textContent = "🗑️"; this.style.borderColor = "#f87171"; };
      rmBtn.onmouseout = function() { this.textContent = "⭐"; this.style.borderColor = "var(--border)"; };
      rmBtn.onclick=function(){ toggleBookmark(s, q); build(); };
      card.appendChild(rmBtn);
      
      // Question Text
      card.appendChild(el("div",{css:{fontSize:"1.05rem",fontWeight:"500",lineHeight:"1.6",paddingRight:"40px",marginBottom:"18px"},txt:q.q}));
      
      // Correct Answer Box
      var ansBox=el("div",{css:{background:"rgba(74,222,128,.08)",border:"1px solid rgba(74,222,128,.3)",borderRadius:"10px",padding:"14px 18px",color:"#4ade80"}});
      ansBox.appendChild(el("div",{css:{fontSize:".7rem",textTransform:"uppercase",fontWeight:"700",letterSpacing:".08em",marginBottom:"6px",color:"#34d399"},txt:"Correct Answer"}));
      ansBox.appendChild(el("div",{css:{fontWeight:"600",fontSize:".95rem"},txt:q.o[q.a] || q.a})); // Fallback just in case saved from custom FC
      card.appendChild(ansBox);
      
      lw.appendChild(card);
    });
    w.appendChild(lw);
  }
  
  build();
  return w;
}