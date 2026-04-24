function pgStats(){
  var w=el("div",{cls:"fd"});
  w.appendChild(makeNav("stats"));
  var wrap=el("div",{css:{maxWidth:"820px",margin:"0 auto"}});
  w.appendChild(wrap);

  // Collect all stats
  var totalAttempted=0,totalCorrect=0,totalSessions=0;
  var subjectStats=[];
  SUBJ.forEach(function(s){
    var sv=Sv.get("qz_"+s)||{best:null,att:0,h:[]};
    var hist=sv.h||[];
    var sessions=hist.length;
    var avgAcc=sessions?Math.round(hist.reduce(function(sum,h){return sum+h.pct;},0)/sessions):0;
    var best=sv.best||0;
    var total=(QD[s]||[]).length;
    var totalQ=hist.reduce(function(sum,h){return sum+h.total;},0);
    var totalC=hist.reduce(function(sum,h){return sum+h.correct;},0);
    totalAttempted+=totalQ;totalCorrect+=totalC;totalSessions+=sessions;
    subjectStats.push({s:s,sessions:sessions,avg:avgAcc,best:best,total:total,totalQ:totalQ,totalC:totalC});
  });
  var overallAcc=totalAttempted?Math.round((totalCorrect/totalAttempted)*100):0;
  var streak=Sv.get("streak")||{count:0};
  var dailyDone=Sv.get("daily_"+Math.floor(Date.now()/86400000));

  // Header
  var hd=el("div",{css:{textAlign:"center",marginBottom:"28px"}});
  hd.appendChild(el("div",{css:{fontSize:"2rem",marginBottom:"6px"},txt:"\uD83D\uDCCA"}));
  hd.appendChild(el("div",{css:{fontSize:"1.4rem",fontWeight:"800",letterSpacing:"-.02em",marginBottom:"4px"},txt:"Progress Dashboard"}));
  hd.appendChild(el("div",{css:{fontSize:".85rem",color:"var(--muted)"},txt:"Track your performance across all subjects"}));
  wrap.appendChild(hd);

  // Top stats row
  var topStats=el("div",{css:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"24px"}});
  [["\uD83D\uDCDD",totalAttempted,"Questions\nAttempted","var(--accent)"],["\uD83C\uDFAF",overallAcc+"%","Overall\nAccuracy","#4ade80"],["\uD83D\uDCDA",totalSessions,"Quiz\nSessions","#818cf8"],["\uD83D\uDD25",streak.count,"Day\nStreak","#f59e0b"]].forEach(function(r){
    var card=el("div",{css:{background:"var(--card)",border:"1.5px solid var(--border)",borderRadius:"14px",padding:"18px 14px",textAlign:"center"}});
    card.appendChild(el("div",{css:{fontSize:"1.4rem",marginBottom:"6px"},txt:r[0]}));
    card.appendChild(el("div",{css:{fontSize:"1.5rem",fontWeight:"800",color:r[3],letterSpacing:"-.02em"},txt:String(r[1])}));
    card.appendChild(el("div",{css:{fontSize:".68rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",fontWeight:"600",whiteSpace:"pre-line",lineHeight:"1.4"},txt:r[2]}));
    topStats.appendChild(card);
  });
  wrap.appendChild(topStats);

  // Subject breakdown
  wrap.appendChild(el("div",{css:{fontSize:".72rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",fontWeight:"600",marginBottom:"14px"},txt:"Subject Breakdown"}));
  var grid=el("div",{css:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"24px"}});
  subjectStats.forEach(function(st){
    var ac=AC[st.s];
    var card=el("div",{css:{background:"var(--card)",border:"1.5px solid var(--border)",borderRadius:"14px",padding:"20px"}});
    // Top row
    var top=el("div",{css:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}});
    top.appendChild(el("div",{css:{display:"flex",alignItems:"center",gap:"8px"}},[el("span",{css:{fontSize:"1.3rem"}},ICON[st.s]),el("span",{css:{fontWeight:"700",fontSize:"1rem"}},st.s)]));
    top.appendChild(el("span",{css:{fontSize:".75rem",fontWeight:"700",padding:"3px 10px",borderRadius:"99px",background:ac+"18",color:ac}},st.best?st.best+"%":"—"));
    card.appendChild(top);
    // Accuracy bar
    var barWrap=el("div",{css:{marginBottom:"10px"}});
    barWrap.appendChild(el("div",{css:{display:"flex",justifyContent:"space-between",fontSize:".72rem",color:"var(--muted)",marginBottom:"5px"}},[el("span",{},"Accuracy"),el("span",{},st.avg+"%")]));
    var bar=el("div",{css:{height:"6px",background:"var(--border)",borderRadius:"99px",overflow:"hidden"}});
    var fill=el("div",{css:{height:"100%",width:st.avg+"%",background:ac,borderRadius:"99px",transition:"width .6s ease"}});
    bar.appendChild(fill);barWrap.appendChild(bar);card.appendChild(barWrap);
    // Stats row
    var srow=el("div",{css:{display:"flex",gap:"12px"}});
    [[st.sessions,"Sessions"],[st.totalQ,"Questions"],[st.totalC,"Correct"]].forEach(function(r){
      var s=el("div",{css:{flex:"1",textAlign:"center",background:"var(--bg2)",borderRadius:"8px",padding:"6px 4px"}});
      s.appendChild(el("div",{css:{fontSize:".9rem",fontWeight:"700"},txt:String(r[0])}));
      s.appendChild(el("div",{css:{fontSize:".62rem",color:"var(--muted)"},txt:r[1]}));
      srow.appendChild(s);
    });
    card.appendChild(srow);

    // Weak indicator
    if(st.sessions>0&&st.avg<50){
      var weak=el("div",{css:{marginTop:"10px",padding:"6px 10px",background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",borderRadius:"8px",fontSize:".72rem",color:"#f87171",fontWeight:"600"}},"\u26A0\uFE0F Needs more practice");
      card.appendChild(weak);
    } else if(st.sessions>0&&st.avg>=80){
      var strong=el("div",{css:{marginTop:"10px",padding:"6px 10px",background:"rgba(74,222,128,.08)",border:"1px solid rgba(74,222,128,.2)",borderRadius:"8px",fontSize:".72rem",color:"#4ade80",fontWeight:"600"}},"\u2B50 Strong subject!");
      card.appendChild(strong);
    }
    grid.appendChild(card);
  });
  wrap.appendChild(grid);

  // Recent sessions
  var recentAll=[];
  SUBJ.forEach(function(s){var h=(Sv.get("qz_"+s)||{h:[]}).h||[];h.forEach(function(e){recentAll.push({s:s,date:e.date,pct:e.pct,correct:e.correct,total:e.total});});});
  recentAll.sort(function(a,b){return b.date>a.date?1:-1;});
  if(recentAll.length){
    wrap.appendChild(el("div",{css:{fontSize:".72rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",fontWeight:"600",marginBottom:"14px"},txt:"Recent Sessions"}));
    var rbox=el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"14px",overflow:"hidden",marginBottom:"24px"}});
    recentAll.slice(0,8).forEach(function(e,i){
      var row=el("div",{css:{display:"flex",alignItems:"center",gap:"12px",padding:"12px 16px",borderBottom:i<Math.min(recentAll.length,8)-1?"1px solid var(--border)":"none"}});
      row.appendChild(el("span",{css:{fontSize:"1.1rem",width:"28px",textAlign:"center"}},ICON[e.s]));
      var ri=el("div",{css:{flex:"1"}});ri.appendChild(el("div",{css:{fontSize:".85rem",fontWeight:"600"},txt:e.s}));ri.appendChild(el("div",{css:{fontSize:".72rem",color:"var(--muted)"},txt:e.date+" · "+e.correct+"/"+e.total+" correct"}));row.appendChild(ri);
      var pctBadge=el("span",{css:{fontSize:".82rem",fontWeight:"700",padding:"4px 12px",borderRadius:"99px",background:e.pct>=60?"rgba(74,222,128,.12)":"rgba(248,113,113,.1)",color:e.pct>=60?"#4ade80":"#f87171"}},e.pct+"%");
      row.appendChild(pctBadge);
      rbox.appendChild(row);
    });
    wrap.appendChild(rbox);
  }

  // Share and Export buttons
  var actionWrap=el("div",{css:{display:"flex",gap:"10px",justifyContent:"center",marginBottom:"32px",flexWrap:"wrap"}});
  actionWrap.appendChild(el("button",{cls:"btn btnp",css:{padding:"12px 24px",fontSize:".9rem"},onclick:function(){
    var text="\uD83D\uDCCA My StudyLab Progress\n\n\uD83D\uDCDD "+totalAttempted+" questions attempted\n\uD83C\uDFAF "+overallAcc+"% overall accuracy\n\uD83D\uDD25 "+streak.count+" day streak\n\uD83D\uDCDA "+totalSessions+" quiz sessions\n\n🌐 https://studylab-inky.vercel.app";
    if(navigator.share){navigator.share({title:"My StudyLab Progress",text:text});}
    else{navigator.clipboard.writeText(text).then(function(){toast("Stats copied! Share it \uD83D\uDE80");});}
  }},"\uD83D\uDCF1 Share Progress"));
  
  actionWrap.appendChild(el("button",{cls:"btn btng",css:{padding:"12px 24px",fontSize:".9rem"},onclick:function(){
    // Export all data as JSON
    var exportData = {
      exportDate: new Date().toISOString(),
      stats: {
        totalAttempted: totalAttempted,
        totalCorrect: totalCorrect,
        overallAccuracy: overallAcc,
        totalSessions: totalSessions,
        streak: streak.count
      },
      subjects: {},
      recentSessions: recentAll
    };
    SUBJ.forEach(function(s){
      var sv = Sv.get("qz_"+s) || {best:null,att:0,h:[]};
      exportData.subjects[s] = sv;
    });
    var blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'studylab_progress_' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    toast("Progress exported! \uD83D\uDCBE");
  }},"\uD83D\uDCBE Export Data"));
  wrap.appendChild(actionWrap);

  if(totalSessions===0){
    var empty=el("div",{css:{textAlign:"center",padding:"40px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px",marginBottom:"24px"}});
    empty.appendChild(el("div",{css:{fontSize:"2.5rem",marginBottom:"12px"},txt:"\uD83D\uDCDA"}));
    empty.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"600",marginBottom:"8px"},txt:"No quiz sessions yet!"}));
    empty.appendChild(el("div",{css:{fontSize:".85rem",color:"var(--muted)",marginBottom:"20px"},txt:"Complete your first quiz to see your progress here"}));
    empty.appendChild(el("button",{cls:"btn btnp",onclick:function(){go("home");}},"\uD83C\uDFAF Start a Quiz"));
    wrap.appendChild(empty);
  }

  return w;
}