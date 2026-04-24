// ── SARVAM AI TUTOR MODAL ──

function openSarvamAIModal(questionText, optionsArr, correctIndex, subject) {
  var overlay = el("div", {
    css: {
      position: "fixed", inset: "0", background: "rgba(8, 12, 18, 0.9)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: "10000"
    }
  });

  var card = el("div", {
    cls: "glass-modal", // <-- Applies the frosted glass
    css: {
      border: "1px solid rgba(184, 115, 51, 0.3)", 
      borderRadius: "18px",
      padding: "26px", 
      maxWidth: "500px", 
      width: "90%", 
      boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)"
    }
  });
  
  var header = el("div", {css:{display:"flex", justifyContent:"space-between", marginBottom:"16px"}});
  header.appendChild(el("h3", {css:{margin:0, color:"#EEF2FF", fontFamily:"var(--font-display)"}, txt: "💡 AI Tutor Analysis"}));
  var closeBtn = el("button", {css:{background:"none", border:"none", color:"var(--subtle)", cursor:"pointer", fontSize:"1.2rem"}, txt:"✕", onclick: () => document.body.removeChild(overlay)});
  header.appendChild(closeBtn);
  card.appendChild(header);

  var contentArea = el("div", {css:{fontSize:"0.95rem", color:"var(--muted)", lineHeight:"1.6", maxHeight:"60vh", overflowY:"auto"}});
  contentArea.innerHTML = "<div style='text-align:center; padding: 20px;'>Analyzing problem...</div>";
  card.appendChild(contentArea);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  var correctAns = optionsArr ? optionsArr[correctIndex] : "Not provided";
  var prompt = `You are a technical tutor. The student is reviewing a ${subject} question. 
Question: ${questionText}
Options: ${optionsArr ? optionsArr.join(", ") : ""}
Correct Answer: ${correctAns}

Briefly explain the underlying logic of why this is the correct answer. Keep it analytical, straightforward, and under 50 words in English.`;

  // Notice we are now calling our own local API route
  fetch("api/tutor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "sarvam-30b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 150
    })
  })
  .then(res => res.json())
  .then(data => {
    // Check if Sarvam returned a successful choice
    if (data.choices && data.choices[0] && data.choices[0].message) {
      contentArea.style.color = "#EEF2FF";
      contentArea.innerText = data.choices[0].message.content;
    } 
    // Handle error messages returned from the backend
    else if (data.error) {
      contentArea.innerText = "Error: " + data.error;
    } 
    else {
      contentArea.innerText = "The AI is thinking... please try again in a second.";
    }
  })
  .catch(err => {
    contentArea.innerText = "Connection lost. Please check your internet.";
  });
}
// ───────────────────────────

// ========================================
// LIVE DAILY CURRENT AFFAIRS — RSS SYSTEM
// ========================================

const CA_TABS = [
  { id: 'national',  label: '🇮🇳 National',  color: '#4F8EF7' },
  { id: 'govt',      label: '🏛 Govt / PIB',  color: '#8b5cf6' },
  { id: 'economy',   label: '📈 Economy',     color: '#f59e0b' },
  { id: 'science',   label: '🔬 Science',     color: '#4ade80' },
  { id: 'world',     label: '🌐 World',       color: '#f87171' }
];

// ── GLOBAL ERROR HANDLER ──
window.addEventListener('error', function(e) {
  console.error('StudyLab Error:', e.error);
  // Don't show errors to users for better UX
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled Promise:', e.reason);
  e.preventDefault();
});

// rss2json base — free, no key, works from browser
const R2J = 'https://api.rss2json.com/v1/api.json?rss_url=';

const CA_FEEDS = {
  national: [
    { url: R2J + encodeURIComponent('https://feeds.feedburner.com/ndtvnews-india-news'),          name: 'NDTV India' },
    { url: R2J + encodeURIComponent('https://timesofindia.indiatimes.com/rssfeeds/2083611.cms'),  name: 'Times of India' },
    { url: R2J + encodeURIComponent('https://www.thehindu.com/news/national/feeder/default.rss'), name: 'The Hindu' }
  ],
  govt: [
    { url: R2J + encodeURIComponent('https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3'),   name: 'PIB India' },
    { url: R2J + encodeURIComponent('https://www.thehindu.com/news/national/feeder/default.rss'), name: 'The Hindu' },
    { url: R2J + encodeURIComponent('https://feeds.feedburner.com/ndtvnews-india-news'),          name: 'NDTV India' }
  ],
  economy: [
    { url: R2J + encodeURIComponent('https://economictimes.indiatimes.com/rssfeedsdefault.cms'),  name: 'Economic Times' },
    { url: R2J + encodeURIComponent('https://www.livemint.com/rss/economy'),                      name: 'Mint Economy' },
    { url: R2J + encodeURIComponent('https://www.business-standard.com/rss/economy-policy-102.rss'), name: 'Business Standard' }
  ],
  science: [
    { url: R2J + encodeURIComponent('https://www.thehindu.com/sci-tech/feeder/default.rss'),      name: 'The Hindu Sci-Tech' },
    { url: R2J + encodeURIComponent('https://feeds.feedburner.com/ndtvnews-science'),             name: 'NDTV Science' },
    { url: R2J + encodeURIComponent('https://timesofindia.indiatimes.com/rssfeeds/2886704.cms'),  name: 'TOI Science' }
  ],
  world: [
    { url: R2J + encodeURIComponent('https://feeds.feedburner.com/ndtvnews-world-news'),          name: 'NDTV World' },
    { url: R2J + encodeURIComponent('https://timesofindia.indiatimes.com/rssfeeds/296589292.cms'),name: 'TOI World' },
    { url: R2J + encodeURIComponent('https://www.thehindu.com/news/international/feeder/default.rss'), name: 'The Hindu World' }
  ]
};

const CA_FALLBACK = {
  national: [
    { title: "India's GDP growth forecast revised upward by IMF for FY2025", source: "Economic Times", url: "https://economictimes.indiatimes.com", pubDate: "" },
    { title: "Union Cabinet approves major infrastructure projects under PM Gati Shakti", source: "PIB India", url: "https://pib.gov.in", pubDate: "" },
    { title: "Supreme Court delivers landmark verdict on electoral bonds scheme", source: "The Hindu", url: "https://www.thehindu.com", pubDate: "" },
    { title: "New education policy implementation reviewed at national level meet", source: "Hindustan Times", url: "https://www.hindustantimes.com", pubDate: "" }
  ],
  govt: [
    { title: "Cabinet approves PM Vishwakarma scheme for traditional artisans", source: "PIB India", url: "https://pib.gov.in", pubDate: "" },
    { title: "Government launches Digital India initiative phase-3", source: "PIB India", url: "https://pib.gov.in", pubDate: "" },
    { title: "New railway line inaugurated connecting remote districts", source: "PIB India", url: "https://pib.gov.in", pubDate: "" }
  ],
  economy: [
    { title: "RBI holds repo rate steady; focuses on inflation management", source: "Mint", url: "https://www.livemint.com", pubDate: "" },
    { title: "India ranks among top 10 in Global Innovation Index 2024", source: "India Today", url: "https://www.indiatoday.in", pubDate: "" },
    { title: "India signs bilateral trade agreements with multiple nations at G20", source: "Business Standard", url: "https://www.business-standard.com", pubDate: "" }
  ],
  science: [
    { title: "ISRO successfully tests next-generation rocket engine for Gaganyaan", source: "The Hindu", url: "https://www.thehindu.com", pubDate: "" },
    { title: "India's first quantum computing mission gets Cabinet approval", source: "NDTV Science", url: "https://www.ndtv.com", pubDate: "" },
    { title: "DRDO develops new high-altitude surveillance drone", source: "Times of India", url: "https://timesofindia.com", pubDate: "" }
  ],
  world: [
    { title: "India-US strategic partnership strengthened at bilateral summit", source: "NDTV World", url: "https://www.ndtv.com", pubDate: "" },
    { title: "UN General Assembly adopts India-sponsored resolution on yoga", source: "The Hindu", url: "https://www.thehindu.com", pubDate: "" },
    { title: "SCO summit: India pushes for stronger connectivity in Central Asia", source: "Times of India", url: "https://timesofindia.com", pubDate: "" }
  ]
};

var caActiveTab = 'national';
var caCache = {};  // cache fetched articles per tab

async function fetchRSSFeed(feedObj) {
  const res = await Promise.race([
    fetch(feedObj.url),
    new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout')), 6000))
  ]);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (data.status !== 'ok' || !data.items || !data.items.length) throw new Error('Empty feed');
  return data.items.map(item => ({
    title: (item.title || '').split(' - ')[0].split(' | ')[0].trim(),
    source: feedObj.name,
    url: item.link || item.url || '#',
    pubDate: item.pubDate || ''
  })).filter(a => a.title.length > 10);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    var d = new Date(dateStr);
    if (isNaN(d)) return '';
    var now = new Date();
    var diff = Math.floor((now - d) / 60000); // minutes
    if (diff < 60) return diff + 'm ago';
    if (diff < 1440) return Math.floor(diff/60) + 'h ago';
    return d.toLocaleDateString('en-IN', { day:'numeric', month:'short' });
  } catch(e) { return ''; }
}

function renderCurrentAffairs(articles, isLive, tabId) {
  const container = document.getElementById('current-affairs-container');
  if (!container) return;
  const tab = CA_TABS.find(t => t.id === tabId) || CA_TABS[0];

  // Build tab bar HTML
  let tabsHTML = CA_TABS.map(t => `
    <button class="ca-tab${t.id === tabId ? ' ca-tab-active' : ''}"
      style="${t.id === tabId ? '--ca-color:'+t.color : ''}"
      onclick="switchCATab('${t.id}')">
      ${t.label}
    </button>`).join('');

  // Build cards HTML
  let cardsHTML = articles.slice(0, 10).map((a, i) => `
    <div class="news-card ca-card" style="animation-delay:${i*40}ms">
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <div class="news-source" style="color:${tab.color}">${a.source}</div>
          ${a.pubDate ? `<div style="font-size:.65rem;color:var(--subtle)">${formatDate(a.pubDate)}</div>` : ''}
        </div>
        <div class="news-title">${a.title}</div>
      </div>
      <a href="${a.url}" target="_blank" rel="noopener" class="news-btn" style="color:${tab.color}">Read Full Story ↗</a>
    </div>`).join('');

  container.innerHTML = `
    <div class="news-header" style="margin-bottom:14px">
      <h2>Daily <span>Current Affairs</span></h2>
      <div class="news-live-badge">${isLive ? '<span class="ca-live-dot"></span>LIVE' : '📰 OFFLINE'}</div>
    </div>
    <div class="ca-tabs-wrap">${tabsHTML}</div>
    <div class="news-scroller ca-scroller">${cardsHTML || '<div class="ca-empty">No articles found. Try another tab.</div>'}</div>
  `;
  // Trigger animation for the newly injected news cards
  setTimeout(function(){ triggerReveal(container); }, 10);
}

async function switchCATab(tabId) {
  caActiveTab = tabId;
  // Update tab active state immediately (fast UI)
  document.querySelectorAll('.ca-tab').forEach(b => {
    const isActive = b.getAttribute('onclick').includes("'"+tabId+"'");
    b.classList.toggle('ca-tab-active', isActive);
    const tab = CA_TABS.find(t => t.id === tabId);
    if (isActive && tab) b.style.setProperty('--ca-color', tab.color);
    else b.style.removeProperty('--ca-color');
  });
  // Use cache if available
  if (caCache[tabId]) {
    renderCurrentAffairs(caCache[tabId].articles, caCache[tabId].isLive, tabId);
    return;
  }
  // Show loading skeleton
  const scroller = document.querySelector('.ca-scroller');
  if (scroller) scroller.innerHTML = '<div class="ca-loading"><div class="ca-spinner"></div>Loading '+tabId+' news...</div>';
  await loadCATab(tabId);
}

async function loadCATab(tabId) {
  const feeds = CA_FEEDS[tabId] || [];
  for (const feed of feeds) {
    try {
      const articles = await fetchRSSFeed(feed);
      if (articles.length) {
        caCache[tabId] = { articles, isLive: true };
        if (caActiveTab === tabId) renderCurrentAffairs(articles, true, tabId);
        return;
      }
    } catch(e) { continue; }
  }
  // All feeds failed — use fallback
  const fallback = CA_FALLBACK[tabId] || [];
  caCache[tabId] = { articles: fallback, isLive: false };
  if (caActiveTab === tabId) renderCurrentAffairs(fallback, false, tabId);
}

async function loadCurrentAffairs() {
  const container = document.getElementById('current-affairs-container');
  if (!container) return;
  container.innerHTML = `
    <div class="news-header">
      <h2>Daily <span>Current Affairs</span></h2>
      <div class="news-live-badge"><span class="ca-live-dot"></span>Loading...</div>
    </div>
    <div style="padding:40px;text-align:center;color:var(--muted);font-size:.85rem">
      <div class="ca-spinner" style="margin:0 auto 12px"></div>Fetching live news...
    </div>`;
  caCache = {};
  await loadCATab(caActiveTab);
  // Pre-fetch remaining tabs in background (no await)
  CA_TABS.filter(t => t.id !== caActiveTab).forEach(t => loadCATab(t.id));
}
// ═══════════════════════════════════════════
//   GOVT UPDATES PAGE — RSS SYSTEM
// ═══════════════════════════════════════════

var GU_TYPES = {
  vacancy:   { label:"New Vacancy",   icon:"📋", color:"#4F8EF7" },
  admitcard: { label:"Admit Card",    icon:"🪪", color:"#8b5cf6" },
  examdate:  { label:"Exam Schedule", icon:"📅", color:"#f59e0b" },
  result:    { label:"Result",        icon:"🏆", color:"#4ade80" }
};

// ── RSS feeds via multiple proxy services (tries each until one works)
var GU_RAW_FEEDS = [
  { raw: 'https://www.freejobalert.com/feed/',                                                        name:'FreeJobAlert' },
  { raw: 'https://quicksarkari.com/feed/',                                                            name:'Sarkari Naukri' },
  { raw: 'https://www.rojgarresult.com/feed/',                                                        name:'Rojgar Result' },
  { raw: 'https://www.freshersworld.com/feeds/jobsalert.xml',                                         name:'FreshersWorld' },
  { raw: 'https://employmentnews.gov.in/NewMain/EmploymentNewsRss.aspx',                              name:'Employment News' },
  { raw: 'https://haryanajobs.in/feed/',                                                              name:'Haryana Jobs' }
];

// Build feed URLs with multiple proxy strategies
function guBuildFeedUrls(raw, name) {
  var enc = encodeURIComponent(raw);
  return [
    // Strategy 1: rss2json (primary)
    { url: 'https://api.rss2json.com/v1/api.json?rss_url=' + enc, type: 'r2j', name: name },
    // Strategy 2: allorigins CORS proxy → parse XML ourselves
    { url: 'https://api.allorigins.win/get?url=' + enc, type: 'allorigins', name: name },
    // Strategy 3: corsproxy.io
    { url: 'https://corsproxy.io/?' + enc, type: 'xml', name: name },
    // Strategy 4: cors-anywhere (fallback)
    { url: 'https://thingproxy.freeboard.io/fetch/' + raw, type: 'xml', name: name }
  ];
}

var GU_RSS_FEEDS = GU_RAW_FEEDS.map(function(f){ return guBuildFeedUrls(f.raw, f.name)[0]; });

// Keyword-based auto type classifier
function guClassify(title) {
  var t = (title||'').toLowerCase();
  if (/admit card|hall ticket|call letter/.test(t))           return 'admitcard';
  if (/result|merit list|final list|selected|cut.?off/.test(t)) return 'result';
  if (/exam date|schedule|timetable|postponed|date sheet/.test(t)) return 'examdate';
  return 'vacancy';
}

// Extract org name from title heuristically
function guExtractOrg(title) {
  var orgs = ['UPSC','SSC','RRB','IBPS','NTA','DRDO','SBI','RBI','NABARD','TNPSC',
    'UPPSC','MPSC','BPSC','RPSC','HPSC','UKPSC','JPSC','OPSC','KPSC','GPSC',
    'Army','Navy','Air Force','Police','Railway','High Court','Supreme Court',
    'ISRO','HAL','BHEL','ONGC','NTPC','NHM','AIIMS','ESIC','LIC','GIC'];
  for (var i=0; i<orgs.length; i++) {
    if ((title||'').toUpperCase().indexOf(orgs[i]) !== -1) return orgs[i];
  }
  return '';
}
// Extract 'Last Date' from RSS titles using Regex
function guExtractLastDate(text) {
  var match = (text||'').match(/(?:last date|apply till|deadline|closing date)[\s\:-]*(\d{1,2}[\/\-\s](?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|[a-z]+)[\/\-\s]?\d{2,4}|\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i);
  if(match && match[1]) return match[1].trim();
  return null;
}

// Fallback data shown when all RSS feeds fail
var GU_FALLBACK = [
  { id:'f1', type:'vacancy',   title:'UPSC Civil Services 2025 – Notification Released (1078 Posts)', org:'UPSC', date:'2025-02-15', lastDate:'2025-03-10', link:'https://upsc.gov.in', tags:['UPSC','IAS'] },
  { id:'f2', type:'examdate',  title:'SSC CGL Tier-I 2025 Exam Dates Announced (Apr 14–27)', org:'SSC', date:'2025-02-20', examDate:'Apr 14–27, 2025', link:'https://ssc.nic.in', tags:['SSC','CGL'] },
  { id:'f3', type:'admitcard', title:'Railway RRB NTPC Admit Card 2025 Released', org:'RRB', date:'2025-02-22', link:'https://indianrailways.gov.in', tags:['RRB','NTPC'] },
  { id:'f4', type:'result',    title:'IBPS PO Mains 2024 Result Declared', org:'IBPS', date:'2025-02-18', link:'https://ibps.in', tags:['IBPS','PO'] },
  { id:'f5', type:'vacancy',   title:'DRDO Scientist B Recruitment 2025 (635 Posts)', org:'DRDO', date:'2025-02-10', lastDate:'2025-03-25', link:'https://drdo.gov.in', tags:['DRDO','Scientist'] },
  { id:'f6', type:'examdate',  title:'NEET UG 2025 Exam Date – May 4', org:'NTA', date:'2025-02-25', examDate:'May 4, 2025', link:'https://nta.ac.in', tags:['NTA','NEET'] },
  { id:'f7', type:'admitcard', title:'UPPSC PCS Prelims 2025 Admit Card Available', org:'UPPSC', date:'2025-02-28', link:'https://uppsc.up.nic.in', tags:['UPPSC','PCS'] },
  { id:'f8', type:'result',    title:'SBI PO Mains 2024-25 Final Result Out', org:'SBI', date:'2025-03-01', link:'https://sbi.co.in', tags:['SBI','PO'] },
  { id:'f9', type:'vacancy',   title:'NABARD Grade A & B Recruitment 2025 (102 Posts)', org:'NABARD', date:'2025-03-02', lastDate:'2025-04-01', link:'https://nabard.org', tags:['NABARD'] },
  { id:'f10',type:'vacancy',   title:'High Court Allahabad – Law Clerk (150 Posts)', org:'High Court', date:'2025-02-26', lastDate:'2025-03-28', link:'https://allahabadhighcourt.in', tags:['Judiciary'] }
];

// Parse raw XML string into GU entries
function guParseXml(xmlStr, feedName) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(xmlStr, 'text/xml');
  var items = Array.from(doc.querySelectorAll('item'));
  if (!items.length) throw new Error('No items in XML');
  return items.slice(0, 50).map(function(item, idx) {
    var title = (item.querySelector('title')||{}).textContent || '';
    title = title.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim();
    var link  = (item.querySelector('link')||{}).textContent || (item.querySelector('guid')||{}).textContent || '#';
    var pub   = (item.querySelector('pubDate')||{}).textContent || '';
    var dateStr = pub ? new Date(pub).toISOString().slice(0,10) : new Date().toISOString().slice(0,10);
    if (isNaN(new Date(dateStr))) dateStr = new Date().toISOString().slice(0,10);
    return {
      id: feedName+'_'+idx+'_'+Date.now(),
      type: guClassify(title),
      title: title,
      org: guExtractOrg(title) || feedName,
      date: dateStr,
      lastDate: guExtractLastDate(title), examDate: null,
      link: link.trim() || '#',
      tags: [guExtractOrg(title)].filter(Boolean),
      _rss: true
    };
  }).filter(function(e){ return e.title && e.title.length > 8; });
}

// Fetch one feed with all proxy strategies tried in order
async function guFetchFeed(primaryFeed) {
  var raw = GU_RAW_FEEDS.find(function(f){ return f.name === primaryFeed.name; });
  if (!raw) raw = { raw: '', name: primaryFeed.name };
  var strategies = guBuildFeedUrls(raw.raw, raw.name);

  for (var s = 0; s < strategies.length; s++) {
    var strategy = strategies[s];
    try {
      var res = await Promise.race([
        fetch(strategy.url, { cache: 'no-store' }),
        new Promise(function(_,rej){ setTimeout(function(){ rej(new Error('Timeout')); }, 8000); })
      ]);
      if (!res.ok) continue;

      if (strategy.type === 'r2j') {
        var data = await res.json();
        if (data.status === 'ok' && data.items && data.items.length) {
          return data.items.slice(0,50).map(function(item, idx) {
            var title = (item.title||'').replace(/<[^>]+>/g,'').trim();
            return {
              id: strategy.name+'_'+idx+'_'+Date.now(),
              type: guClassify(title),
              title: title,
              org: guExtractOrg(title) || strategy.name,
              date: item.pubDate ? item.pubDate.slice(0,10) : new Date().toISOString().slice(0,10),
              lastDate: guExtractLastDate(title), examDate: null,
              link: item.link || item.url || '#',
              tags: [guExtractOrg(title)].filter(Boolean),
              _rss: true
            };
          }).filter(function(e){ return e.title.length > 8; });
        }
      } else if (strategy.type === 'allorigins') {
        var json = await res.json();
        if (json && json.contents) {
          return guParseXml(json.contents, strategy.name);
        }
      } else {
        // raw XML via corsproxy / thingproxy
        var xmlText = await res.text();
        return guParseXml(xmlText, strategy.name);
      }
    } catch(e) { continue; }
  }
  throw new Error('All strategies failed for ' + primaryFeed.name);
}

// AI-powered data generation when all RSS fails
async function guFetchAI() {
  try {
    var today = new Date().toISOString().slice(0,10);
    var res = await Promise.race([
      fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{
            role: 'user',
            content: 'Generate 15 realistic Indian government job notifications for today (' + today + '). Return ONLY a JSON array, no markdown, no extra text. Each object must have exactly these fields: id (string), type (one of: vacancy/admitcard/examdate/result), title (string), org (string like UPSC/SSC/RRB/IBPS/NTA/DRDO/SBI/RBI/AIIMS/ISRO), date (YYYY-MM-DD near today), lastDate (YYYY-MM-DD or null), examDate (string or null), link (official URL), tags (array of strings). Mix all 4 types. Make titles realistic and specific with post counts.'
          }]
        })
      }),
      new Promise(function(_,rej){ setTimeout(function(){ rej(new Error('AI Timeout')); }, 15000); })
    ]);
    if (!res.ok) throw new Error('AI API error');
    var aiData = await res.json();
    var text = (aiData.content||[]).map(function(c){ return c.text||''; }).join('');
    // Strip any markdown fences if present
    text = text.replace(/```json|```/g,'').trim();
    var entries = JSON.parse(text);
    if (!Array.isArray(entries) || !entries.length) throw new Error('Bad AI response');
    return entries.map(function(e, i){
      return {
        id: 'ai_'+i+'_'+Date.now(),
        type: ['vacancy','admitcard','examdate','result'].includes(e.type) ? e.type : 'vacancy',
        title: e.title || 'Government Notification',
        org: e.org || 'GOI',
        date: e.date || today,
        lastDate: e.lastDate || null,
        examDate: e.examDate || null,
        link: e.link || '#',
        tags: Array.isArray(e.tags) ? e.tags : [],
        _ai: true
      };
    });
  } catch(e) {
    return null;
  }
}

// Cache for RSS results
var guRssCache = null;
var guLastFetch = 0;

function pgGovtUpdates(){
  var w = el("div",{cls:"fd"});
  w.appendChild(makeNav("govtupdates"));
  var wrap = el("div",{css:{maxWidth:"780px",margin:"0 auto"}});

  // Header
  var hd = el("div",{css:{textAlign:"center",marginBottom:"24px"}});
  hd.appendChild(el("div",{css:{fontSize:"2rem",marginBottom:"6px"},txt:"🔔"}));
  hd.appendChild(el("div",{css:{fontSize:"1.4rem",fontWeight:"800",letterSpacing:"-.02em",marginBottom:"4px"},txt:"Government Job Updates"}));
  hd.appendChild(el("div",{css:{fontSize:".85rem",color:"var(--muted)"},txt:"Vacancies · Admit Cards · Exam Dates · Results — live from RSS"}));
  wrap.appendChild(hd);

  // Status bar (live indicator + refresh button)
  var statusBar = el("div",{css:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px",padding:"11px 18px",marginBottom:"18px"}});
  var statusLeft = el("div",{css:{display:"flex",alignItems:"center",gap:"8px"}});
  var liveDot = el("div",{cls:"gu-live-dot"});
  var statusTxt = el("div",{css:{fontSize:".78rem",color:"var(--muted)"},txt:"Loading live updates..."});
  statusLeft.appendChild(liveDot);
  statusLeft.appendChild(statusTxt);
  statusBar.appendChild(statusLeft);
  var refreshBtn = el("button",{cls:"gu-fetch-btn",onclick:function(){
    guRssCache = null; guLastFetch = 0;
    go("govtupdates");
    toast("🔄 Refreshing...");
  }},"🔄 Refresh");
  statusBar.appendChild(refreshBtn);
  wrap.appendChild(statusBar);

  // Search
  var searchBox = el("input",{cls:"gu-search",placeholder:"🔍  Search vacancies, exams, boards..."});

  // Tabs + list container
  var activeTab = {v:"all"};
  var listWrap = el("div",{});
  var allEntries = [];

  // Stats bar (updated after fetch)
  var statsBar = el("div",{cls:"gu-stats-bar",css:{marginBottom:"18px"}});
  wrap.appendChild(statsBar);

  function updateStats() {
    var counts = {vacancy:0,admitcard:0,examdate:0,result:0};
    allEntries.forEach(function(e){ if(counts[e.type]!==undefined) counts[e.type]++; });
    statsBar.innerHTML = '';
    [["vacancy","📋"],["admitcard","🪪"],["examdate","📅"],["result","🏆"]].forEach(function(r){
      var t = GU_TYPES[r[0]];
      var sc = el("div",{cls:"gu-stat"});
      sc.appendChild(el("div",{css:{fontSize:"1.1rem"}},r[1]));
      sc.appendChild(el("div",{cls:"gu-stat-num",css:{color:t.color}},String(counts[r[0]])));
      sc.appendChild(el("div",{cls:"gu-stat-lbl"},t.label));
      statsBar.appendChild(sc);
    });
  }

  function renderList(){
    var q = searchBox.value.toLowerCase().trim();
    var filtered = allEntries.filter(function(e){
      var typeMatch = activeTab.v === "all" || e.type === activeTab.v;
      var textMatch = !q ||
        (e.title||'').toLowerCase().indexOf(q) !== -1 ||
        (e.org||'').toLowerCase().indexOf(q) !== -1 ||
        (e.tags||[]).join(' ').toLowerCase().indexOf(q) !== -1;
      return typeMatch && textMatch;
    });
    listWrap.innerHTML = '';
    if(!filtered.length){
      var emp = el("div",{cls:"gu-empty"});
      emp.appendChild(el("div",{css:{fontSize:"2.5rem",marginBottom:"10px"}},activeTab.v!=='all'?(GU_TYPES[activeTab.v]||{icon:'📭'}).icon:'📭'));
      emp.appendChild(el("div",{css:{fontWeight:"600",marginBottom:"6px"}},q?'No results for "'+q+'"':'Nothing here yet'));
      emp.appendChild(el("div",{css:{fontSize:".82rem",color:"var(--muted)"}},'Try another tab or refresh'));
      listWrap.appendChild(emp);
      return;
    }
    filtered.forEach(function(entry, idx){
      var t = GU_TYPES[entry.type] || GU_TYPES.vacancy;
      var card = el("div",{cls:"gu-card"});
      card.style.setProperty("--gu-color", t.color);
      card.style.animationDelay = (idx*30)+"ms";
      // Badge
      var badge = el("span",{cls:"gu-badge"},t.icon+" "+t.label);
      badge.style.background = t.color+"20";
      badge.style.color = t.color;
      card.appendChild(badge);
      // Title
      card.appendChild(el("div",{cls:"gu-title"},entry.title));
      // Meta
      var meta = el("div",{cls:"gu-meta"});
      if(entry.org)      meta.appendChild(el("span",{},"🏛 "+entry.org));
      if(entry.date)     meta.appendChild(el("span",{},"📅 "+entry.date));
      if(entry.lastDate) {
  var closingSoon = false;
  var daysLeft = null;
  
  // Attempt to parse standard Indian date formats (DD/MM/YYYY or DD-MM-YYYY)
  var cleanDateStr = entry.lastDate.replace(/(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})/, '$3-$2-$1');
  var parsedDate = new Date(cleanDateStr);
  
  if(!isNaN(parsedDate)) {
    var diffMs = parsedDate - new Date();
    daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if(daysLeft >= 0 && daysLeft <= 5) closingSoon = true;
  }
  
  if(closingSoon) {
    meta.appendChild(el("span",{css:{color:"#ef4444", fontWeight:"700", background:"rgba(239,68,68,0.15)", padding:"2px 8px", borderRadius:"6px"}},"🚨 Closing Soon: " + entry.lastDate + (daysLeft === 0 ? " (Today!)" : " (" + daysLeft + " days left)")));
  } else {
    meta.appendChild(el("span",{css:{color:"#f87171"}},"⏰ Last Date: "+entry.lastDate));
  }
}
      if(entry.examDate) meta.appendChild(el("span",{css:{color:"#f59e0b"}},"📝 Exam: "+entry.examDate));
      card.appendChild(meta);
      // Tags
      if(entry.tags && entry.tags.length){
        var tagWrap = el("div",{css:{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"10px"}});
        entry.tags.filter(Boolean).forEach(function(tag){
          tagWrap.appendChild(el("span",{css:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"99px",padding:"2px 9px",fontSize:".68rem",color:"var(--muted)",fontWeight:"600"}},tag));
        });
        card.appendChild(tagWrap);
      }
      // Footer
      var foot = el("div",{css:{display:"flex",alignItems:"center",justifyContent:"space-between"}});
      foot.appendChild(entry.link ? el("a",{cls:"gu-link",href:entry.link,target:"_blank",rel:"noopener",css:{color:t.color}},"View / Apply ↗") : el("span",{}));
      // Source badge
      if(entry._ai){
        foot.appendChild(el("span",{css:{fontSize:".65rem",color:"#8b5cf6",fontWeight:"600",background:"rgba(139,92,246,0.12)",padding:"2px 8px",borderRadius:"6px"}},"🤖 AI"));
      }
      // Remove button for manually added entries
      if(entry._user){
        (function(eid){
          foot.appendChild(el("button",{cls:"btng",css:{fontSize:".72rem",padding:"4px 10px"},onclick:function(){
            var s = Sv.get("gu_entries")||[];
            Sv.set("gu_entries", s.filter(function(x){ return x.id!==eid; }));
            go("govtupdates");
            toast("Entry removed");
          }},"✕ Remove"));
        })(entry.id);
      }
      card.appendChild(foot);
      listWrap.appendChild(card);
    });
    // Trigger animation for the newly injected live data
    setTimeout(function(){ triggerReveal(listWrap); }, 10);
  }

  // Tabs
  var tabs = el("div",{cls:"gu-tabs"});
  [["all","🔔 All"],["vacancy","📋 Vacancy"],["admitcard","🪪 Admit Card"],["examdate","📅 Exam Date"],["result","🏆 Result"]].forEach(function(td){
    var tb = el("button",{cls:"gu-tab"+(activeTab.v===td[0]?" gu-active":""),onclick:function(){
      activeTab.v = td[0];
      tabs.querySelectorAll(".gu-tab").forEach(function(b){ b.classList.remove("gu-active"); });
      tb.classList.add("gu-active");
      renderList();
    }},td[1]);
    tabs.appendChild(tb);
  });

  searchBox.addEventListener("input", renderList);

  wrap.appendChild(searchBox);
  wrap.appendChild(tabs);

  // Loading skeleton
  // ── SKELETON LOADER ──
  var skeleton = el("div",{css:{display:"flex",flexDirection:"column",gap:"14px",paddingTop:"10px"}});
  skeleton.innerHTML = Array(4).fill(
    '<div class="gu-card skeleton-box" style="height:120px;border-color:transparent;box-shadow:none;">' +
      '<div class="skeleton-box" style="height:22px;width:30%;border-radius:6px;margin-bottom:14px;background:var(--bg)!important"></div>' +
      '<div class="skeleton-box" style="height:16px;width:85%;border-radius:4px;margin-bottom:10px;background:var(--bg)!important"></div>' +
      '<div class="skeleton-box" style="height:16px;width:60%;border-radius:4px;background:var(--bg)!important"></div>' +
    '</div>'
  ).join('');
  wrap.appendChild(skeleton);
  wrap.appendChild(listWrap);

  // ── Fetch Live Government Updates ──
  (async function(){
    // Use cache if less than 10 minutes old
    if(guRssCache && (Date.now()-guLastFetch) < 600000){
      allEntries = guRssCache;
      skeleton.style.display = 'none';
      updateStats();
      renderList();
      statusTxt.textContent = '✅ Cached — '+allEntries.length+' updates loaded';
      return;
    }

    skeleton.innerHTML = '<div class="ca-spinner" style="margin:0 auto 12px"></div>Fetching live govt updates...';

    // Merge with manually added entries from localStorage
    var stored = Sv.get("gu_entries") || [];

    // Try RSS feeds with timeout
    var fetchPromises = GU_RSS_FEEDS.map(function(feed){
      return Promise.race([
        guFetchFeed(feed),
        new Promise(function(_, reject) { 
          setTimeout(function(){ reject(new Error('timeout')); }, 5000); 
        })
      ]).catch(function(){ return []; });
    });

    var results = await Promise.allSettled(fetchPromises);
    var fetchedEntries = [];
    results.forEach(function(r){
      if(r.status === 'fulfilled' && Array.isArray(r.value)){
        fetchedEntries = fetchedEntries.concat(r.value);
      }
    });

    if(fetchedEntries.length >= 3){
      // RSS succeeded — deduplicate + sort
      var seen = {};
      fetchedEntries = fetchedEntries.filter(function(e){
        var key = (e.title||'').slice(0,40).toLowerCase();
        if(seen[key]) return false;
        seen[key] = true;
        return true;
      });
      fetchedEntries.sort(function(a,b){ return (b.date||'') > (a.date||'') ? 1 : -1; });
      allEntries = stored.concat(fetchedEntries);
      guRssCache = allEntries;
      guLastFetch = Date.now();
      statusTxt.textContent = '● Live — '+fetchedEntries.length+' updates from RSS';
      liveDot.style.background = '#4ade80';
    } else {
      // RSS failed — use fallback
      allEntries = stored.concat(GU_FALLBACK);
      guRssCache = allEntries;
      guLastFetch = Date.now();
      statusTxt.textContent = '📋 Offline Mode — '+GU_FALLBACK.length+' curated updates';
      liveDot.style.background = '#f59e0b';
    }

    skeleton.style.display = 'none';
    updateStats();
    renderList();
  })();

  w.appendChild(wrap);
  return w;
}
// --- NEW BOOKMARK HELPERS ---
function getBookmarks(subj) { return Sv.get("bm_"+subj) || []; }
function isBookmarked(subj, qText) { return getBookmarks(subj).some(function(b){ return b.q === qText; }); }
function toggleBookmark(subj, qObj) {
  var bms = getBookmarks(subj);
  var idx = bms.findIndex(function(b){ return b.q === qObj.q; });
  var isBm = false;
  if (idx >= 0) { bms.splice(idx, 1); toast("Bookmark removed"); }
  else { bms.push(qObj); toast("Saved to Bookmarks! ⭐"); isBm = true; }
  Sv.set("bm_"+subj, bms);
  return isBm;
}