function pgDaily() {
  var styleId = "fix-streak-banner-css";
  if (!document.getElementById(styleId)) {
    var styleNode = document.createElement("style");
    styleNode.id = styleId;
    styleNode.innerHTML = `
      .old-streak-box { background: var(--card) !important; border: 1.5px solid var(--border) !important; border-radius: 16px; padding: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
      .old-streak-left { display: flex; flex-direction: column; align-items: center; justify-content: center; border-right: 1.5px solid var(--border); }
      .old-streak-right { padding-left: 12px; display: flex; flex-direction: column; justify-content: center; }
      .old-subject-title { color: var(--text) !important; font-weight: 700; font-size: 1.1rem; }
      .old-subject-lbl { color: var(--muted) !important; font-size: 0.8rem; }
      .old-status-txt { color: #ef4444; font-size: 0.85rem; margin-top: 4px; }
    `;
    document.head.appendChild(styleNode);
  }

  var w = document.createElement("div");
  w.style.maxWidth = "700px";
  w.style.margin = "0 auto";
  w.style.paddingBottom = "40px";

  w.innerHTML = `
    <div style="text-align:center; margin-bottom:24px;">
      <div style="font-size:3rem;">🎯</div>
      <h2 style="color:var(--text); font-weight:800; margin:8px 0 4px 0;">Daily Challenge</h2>
      <p style="color:var(--muted); font-size:0.85rem; margin:0;">One question every day. Come back tomorrow for a new one!</p>
    </div>

    <div class="old-streak-box">
      <div class="old-streak-left">
        <div style="font-size:1.8rem;">🔥</div>
        <div style="font-size:1.8rem; font-weight:800; color:var(--text);">0</div>
        <div style="font-size:0.65rem; color:var(--muted); font-weight:700; letter-spacing:0.05em;">DAY STREAK</div>
      </div>
      <div class="old-streak-right">
        <div class="old-subject-lbl">Today's subject</div>
        <div class="old-subject-title">🔬 Science</div>
        <div class="old-status-txt">❌ Answered - try again tomorrow</div>
      </div>
    </div>

    <div style="background:var(--card); border:1.5px solid var(--border); border-radius:16px; padding:24px;">
      <div style="font-size:0.75rem; color:var(--muted); font-weight:700; letter-spacing:0.05em; text-transform:uppercase; margin-bottom:8px;">Question of the Day</div>
      <h3 style="color:var(--text); font-size:1.2rem; font-weight:700; line-height:1.4; margin:0 0 20px 0;">Rana Pratap Sagar Hydro Electricity Station is situated at</h3>
      
      <div style="padding:14px; border:1.5px solid #ef4444; background:rgba(239,68,68,0.05); border-radius:12px; margin-bottom:12px; color:#ef4444; font-weight:600;">A. Kota</div>
      <div style="padding:14px; border:1.5px solid var(--border); border-radius:12px; margin-bottom:12px; color:var(--text); font-weight:600;">B. Udaipur</div>
      <div style="padding:14px; border:1.5px solid #22c55e; background:rgba(34,197,94,0.05); border-radius:12px; margin-bottom:12px; color:#22c55e; font-weight:600;">C. Rawatbhata</div>
      <div style="padding:14px; border:1.5px solid var(--border); border-radius:12px; margin-bottom:12px; color:var(--text); font-weight:600;">D. Bikaner</div>
    </div>
  `;

  return w;
}
