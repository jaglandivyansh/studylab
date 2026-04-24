function pgDaily(){
  var w=el("div",{cls:"fd"});
  w.appendChild(makeNav("daily"));
  var wrap=el("div",{css:{maxWidth:"680px",margin:"0 auto"}});
  w.appendChild(wrap);

  // Pick today's question deterministically
  var allQ=[];
  SUBJ.forEach(function(s){(QD[s]||[]).forEach(function(q){allQ.push({q:q.q,o:q.o,a:q.a,subj:s});});});
  var dayIdx=Math.floor(Date.now()/86400000);
  var todayQ=allQ[dayIdx%allQ.length];
  var todayKey="daily_"+dayIdx;
  var done=Sv.get(todayKey);
  var streak=Sv.get("streak")||{count:0,last:0};
  var todayDay=Math.floor(Date.now()/86400000);
  var yday=todayDay-1;
  if(streak.last===yday){/* continue */}else if(streak.last!==todayDay){streak.count=0;}

  var chosen=null,correct=false;

  function build(){
    wrap.innerHTML="";

    // Header
    var hd=el("div",{css:{textAlign:"center",marginBottom:"28px"}});
    hd.appendChild(el("div",{css:{fontSize:"2.5rem",marginBottom:"8px"},txt:"\uD83C\uDFAF"}));
    hd.appendChild(el("div",{css:{fontSize:"1.4rem",fontWeight:"800",letterSpacing:"-.02em",marginBottom:"4px"},txt:"Daily Challenge"}));
    hd.appendChild(el("div",{css:{fontSize:".85rem",color:"var(--muted)"},txt:"One question every day. Come back tomorrow for a new one!"}));
    wrap.appendChild(hd);

    // Streak card
    var sc=el("div",{css:{background:"linear-gradient(135deg,#1a1520,#201828)",border:"1px solid rgba(232,112,58,.25)",borderRadius:"16px",padding:"20px 24px",marginBottom:"24px",display:"flex",alignItems:"center",gap:"20px"}});
    var sf=el("div",{css:{textAlign:"center"}});
    sf.appendChild(el("div",{css:{fontSize:"2.2rem",lineHeight:"1"},txt:"\uD83D\uDD25"}));
    sf.appendChild(el("div",{css:{fontSize:"1.8rem",fontWeight:"800",color:"var(--accent)"},txt:streak.count}));
    sf.appendChild(el("div",{css:{fontSize:".7rem",color:"var(--muted)",fontWeight:"600",textTransform:"uppercase",letterSpacing:".08em"},txt:"Day Streak"}));
    sc.appendChild(sf);
    var sdiv=el("div",{css:{width:"1px",height:"60px",background:"var(--border)"}});
    sc.appendChild(sdiv);
    var si=el("div",{css:{flex:"1"}});
    si.appendChild(el("div",{css:{fontSize:".82rem",color:"var(--muted)",marginBottom:"4px"},txt:"Today's subject"}));
    si.appendChild(el("div",{css:{fontSize:"1.1rem",fontWeight:"700"},txt:ICON[todayQ.subj]+" "+todayQ.subj}));
    si.appendChild(el("div",{css:{fontSize:".78rem",color:done&&done.correct?"#4ade80":"var(--subtle)",marginTop:"6px"},txt:done?(done.correct?"\u2705 Answered correctly!":"\u274C Answered - try again tomorrow"):"Not answered yet today"}));
    sc.appendChild(si);
    wrap.appendChild(sc);

    // Question card
    var qcard=el("div",{css:{background:"var(--card)",border:"1.5px solid var(--border)",borderRadius:"16px",padding:"28px",marginBottom:"20px"}});
    qcard.appendChild(el("div",{css:{fontSize:".72rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",fontWeight:"600",marginBottom:"14px"},txt:"Question of the Day"}));
    qcard.appendChild(el("div",{css:{fontSize:"1.1rem",fontWeight:"600",lineHeight:"1.65",marginBottom:"24px"},txt:todayQ.q}));

    var L=["A","B","C","D"];
    todayQ.o.forEach(function(opt,i){
      var isDone=done||chosen!==null;
      var cls="qo";
      if(isDone||chosen!==null){
        if(i===todayQ.a)cls+=" ok";
        else if(i===(done?done.chosen:chosen))cls+=" no";
      }
      var ob=el("button",{cls:cls,onclick:function(){
        if(done||chosen!==null)return;
        chosen=i;correct=(i===todayQ.a);
        // Update streak
        if(correct){
          if(streak.last===yday)streak.count++;
          else if(streak.last!==todayDay)streak.count=1;
          streak.last=todayDay;
          Sv.set("streak",streak);
          if(correct) throwConfetti(); // Celebrate maintaining the streak!
        }
        Sv.set(todayKey,{chosen:i,correct:correct});
        done={chosen:i,correct:correct};
        build();
      }});
      ob.appendChild(el("span",{css:{fontSize:".75rem",fontWeight:"700",color:"var(--subtle)",minWidth:"22px"}},L[i]+"."));
      ob.appendChild(el("span",{},opt));
      if(isDone)ob.disabled=true;
      qcard.appendChild(ob);
    });

    if(done){
      var res=el("div",{css:{marginTop:"16px",padding:"16px",borderRadius:"10px",background:done.correct?"rgba(74,222,128,.08)":"rgba(248,113,113,.08)",border:"1px solid "+(done.correct?"#4ade80":"#f87171"),textAlign:"center"}});
      res.appendChild(el("div",{css:{fontSize:"1.5rem",marginBottom:"6px"},txt:done.correct?"\uD83C\uDF89":"\uD83D\uDCAA"}));
      res.appendChild(el("div",{css:{fontWeight:"700",color:done.correct?"#4ade80":"#f87171",marginBottom:"4px"},txt:done.correct?"Correct! Great job!":"Not quite, but keep going!"}));
      if(done.correct&&streak.count>1)res.appendChild(el("div",{css:{fontSize:".82rem",color:"var(--accent)"},txt:"\uD83D\uDD25 "+streak.count+" day streak! Keep it up!"}));
      qcard.appendChild(res);

      // Share score button
      var shareBtn=el("button",{cls:"btn btnp",css:{width:"100%",marginTop:"14px"},onclick:function(){shareScore(todayQ.subj,done.correct,streak.count);}},"\uD83D\uDCF1 Share My Result");
      qcard.appendChild(shareBtn);
    }
    wrap.appendChild(qcard);

    // Past 7 days
    var hist=el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px",padding:"20px"}});
    hist.appendChild(el("div",{css:{fontSize:".72rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",fontWeight:"600",marginBottom:"14px"},txt:"Last 7 Days"}));
    var days=el("div",{css:{display:"flex",gap:"8px",justifyContent:"center"}});
    for(var di=6;di>=0;di--){
      var dk="daily_"+(todayDay-di);
      var dd=Sv.get(dk);
      var dayBox=el("div",{css:{width:"36px",height:"36px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",background:dd?(dd.correct?"rgba(74,222,128,.15)":"rgba(248,113,113,.1)"):"var(--card2)",border:"1px solid "+(dd?(dd.correct?"#4ade80":"#f87171"):"var(--border)")}},dd?(dd.correct?"\u2705":"\u274C"):"\u25CB");
      days.appendChild(dayBox);
    }
    hist.appendChild(days);
    wrap.appendChild(hist);
  }
  build();return w;
}

// ─── SHARE SCORE ────────────────────────────────────────────────
function shareScore(subj,correct,streak){
  var text="\uD83D\uDCDA StudyLab Daily Challenge\n"+(correct?"\u2705 Answered correctly!":"\u274C Missed today's question")+"\n\uD83D\uDD25 Current streak: "+streak+" days\n\uD83C\uDF93 Subject: "+subj+"\n\n🌐 https://studylab-inky.vercel.app";
  if(navigator.share){navigator.share({title:"StudyLab Daily Challenge",text:text});}
  else{navigator.clipboard.writeText(text).then(function(){toast("Result copied! Share it \uD83D\uDE80");});}
}