var SUBJ = ["History", "Geography", "Polity", "Economy", "Science", "GK", "Current Affairs", "Previous Year Questions"];
var ICON = {"History": "","Geography": "","Polity": "44","Economy": " ","Science": "","GK":"","Current Affairs":"","Previous Year Questions": ""};
var AC={History:"#d97706", Geography:"#059669", Polity: "#7c3aed", Economy:"#db2777", Science:"#0891b2", GK:"#65a30d","Current Affairs":"#3b82f6", "Previous Year Questions": "#93c5fd"};
var Sv={
    get:function(k){try{return JSON.parse(localStorage.getItem(k)||"null");}catch(e){return null;}},
    set:function(k,v){
        try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}
        // Sync to Firestore if logged in
        if(window.currentUser&&window.db){
            var uid=window.currentUser.uid;
            try{
                window.db.collection("users").doc(uid).set(
                    Object.fromEntries([[k, JSON.stringify(v)]]),
                    {merge:true}
                )
            }catch(ex){}
        }
    },
    syncFromCloud:function(uid){
        if(!window.db)return;
        window.db.collection("users").doc(uid).get().then(function(doc){
            if(doc.exists){
                var d=doc.data();
                Object.keys(d).forEach(function(k){
                    try{localStorage.setItem(k,d[k]);}catch(e){}
                });
                render();
                toast("Progress synced from cloud!");
            }
        }).catch(function(){});
    }
};

// - USER SYSTEM
window.currentUser = Sv.get("guest_user") || null;
window.signOut = function() {
    showSignOutModal();
};

function shuf(a){var b=a.slice(); for(var i=b.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=b[i];b[i]=b[j];b[j]=t;}return b;}

var tt;
function toast(m,c){clearTimeout(tt);var d=document.createElement("div"); d.className="toast";d.style.background=c||"#c96442";d.textContent=m;var tc=document.getElementById("tc");tc.innerHTML="";tc.appendChild(d);tt=setTimeout(function(){tc.innerHTML="";},2000);}

function el(t,p,ch){
    var e=document.createElement(t);
    if(p){for(var k in p){if(k=="cls")e.className=p[k];else if(k=="css"){for(var s in p[k])e.style[s]=p[k][s]; }else if(k=="txt")e.textContent=p[k];else if(k=="htm")e.innerHTML=p[k];else if(k.slice(0,2)=="on")e.addEventListener(k.slice(2),p[k]); else e.setAttribute(k,p[k]);}}
    if(ch){var a=Array.isArray(ch)?ch: [ch]; for(var i=0;i<a.length;i++){var c=a[i]; if(c==null||c===false)continue; if(typeof c=="string")e.appendChild(document.createTextNode(c)); else e.appendChild(c);}}
    return e;
}

var pg="home",sub=null;
window.currentPage = "home"; // expose for swipe navigation

// --- NEW: CHALLENGE URL PARSER ---
window.challengeData = null;
(function(){
    var s = window.location.search.substring(1);
    if(s) {
        var p={};
        s.split('&').forEach(function(kv){ var a=kv.split('='); p[a[0]]=decodeURIComponent(a[1]||''); });
        if(p.c === '1' && p.s && p.q) {
            window.challengeData = {
                s: p.s,
                q: p.q.split('-').map(Number),
                sc: parseInt(p.sc)||0,
                n: p.n || 'A friend'
            };
            pg = "qz"; sub = p.s; // Boot directly into the challenged quiz
            // Clean URL so it doesn't trigger again on page refresh
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
})();

function closeMobileDrawer(){
    var drawer = document.getElementById("nb-mobile-drawer");
    var hamburgerBtn = document.getElementById('nb-hamburger');
    if(drawer) {
        drawer.classList.remove('open');
    }
    if(hamburgerBtn) {
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
}

function go(p,s, skipHistory){
    // Clear RPG mode memory if navigating anywhere EXCEPT the quiz page
    if (p!=="qz") window.activeSkillNode = null;
    pg=p; if(s!== undefined)sub =s;
    
    // THE BUG FIX: Tell the swipe script which page we are actually on!
    window.currentPage =p;
    closeMobileDrawer();
    
    // IMPORTANT NEW LINE: Tell the phone's back button where we are!
    // We only push history if this was a normal click, NOT if the user actually pressed the back button
    if (!skipHistory) {
        history.pushState({ page: p, sub: s }, "");
    }
    
    // 1. Instantly update the navigation buttons to show the active state
    var allNavBtns = document.querySelectorAll('#bottom-navbar button, #top-navbar .nb-links button, #nb-mobile-drawer button');
    allNavBtns.forEach(function(b){
        b.classList.toggle('active', b.getAttribute('data-page') === p);
    });
    
    // Render immediately requestAnimation Frame lets GPU finish current frame first
    requestAnimationFrame(function() {
        if (document.startViewTransition) {
            document.startViewTransition(function() { render(); window.scrollTo(0,0); });
        } else {
            render(); window.scrollTo(0,0);
        }
    });
}

function render(){
    var app=document.getElementById("app"); 
    app.innerHTML="";
    // Show hero banner and current affairs ONLY on home page
    if(pg=="home") {document.body.classList.remove("hide-top-sections"); }else{document.body.classList.add("hide-top-sections");}
    
    if(pg=="home")app.appendChild(pgHome()); 
    else if(pg=="sub")app.appendChild(pgSub()); 
    else if(pg=="fcmenu") app.appendChild(pgFCMenu()); 
    else if(pg=="fc")app.appendChild(pgFC()); 
    else if(pg=="swipefc") app.appendChild(pgSwipeFC()); 
    else if(pg=="qz")app.appendChild(pgQZ()); 
    else if(pg=="stats") app.appendChild(pgStats());
    else if(pg=="daily")app.appendChild(pgDaily()); 
    else if(pg=="digest")app.appendChild(pgDigest()); 
    else if(pg=="about") app.appendChild(pgAbout()); 
    else if(pg=="govtupdates") app.appendChild(pgGovtUpdates());
    else if(pg=="howtouse") app.appendChild(pgHowToUse());
}

var QUOTES=[
    {q:"The secret of getting ahead is getting started.",a:"Mark Twain"},
    {q:"An investment in knowledge pays the best interest.",a:"Benjamin Franklin"},
    {q:"Education is the most powerful weapon which you can use to change the world.",a:"Nelson Mandela"},
    {q:"Live as if you were to die tomorrow. Learn as if you were to live forever.",a:"Mahatma Gandhi"},
    {q:"The beautiful thing about learning is that nobody can take it away from you.",a:"B.B. King"},
    {q:"Success is not final, failure is not fatal: it is the courage to continue that counts.",a:"Winston Churchill"},
    {q:"The more that you read, the more things you will know.",a:"Dr. Seuss"},
    {q:"Genius is one percent inspiration and ninety-nine percent perspiration.",a:"Thomas Edison"},
    {q:"It does not matter how slowly you go as long as you do not stop.",a:"Confucius"},
    {q:"You don't have to be great to start, but you have to start to be great.",a:"Zig Ziglar"},
    {q:"The expert in anything was once a beginner.",a:"Helen Hayes"},
    {q:"Develop a passion for learning. If you do, you will never cease to grow.",a:"Anthony J. D'Angelo"},
    {q:"The mind is not a vessel to be filled but a fire to be kindled.",a: "Plutarch"},
    {q:"Knowledge is power.",a:"Francis Bacon"},
    {q:"One child, one teacher, one book, one pen can change the world.", a:"Malala Yousafzai"},
    {q:"Do not wait to strike till the iron is hot; but make it hot by striking.",a:"William Butler Yeats"},
    {q:"The only way to do great work is to love what you do.",a:"Steve Jobs"},
    {q:"In the middle of every difficulty lies opportunity.", a:"Albert Einstein"},
    {q:"Strive for progress, not perfection.",a: "Unknown"},
    {q:"Success is the sum of small efforts repeated day in and day out.", a:"Robert Collier"},
    {q:"Hard work beats talent when talent doesn't work hard.", a:"Tim Notke"},
    {q:"The future belongs to those who believe in the beauty of their dreams.",a:"Eleanor Roosevelt"},
    {q:"Believe you can and you're halfway there.", a:"Theodore Roosevelt"},
    {q:"Your time is limited, so don't waste it living someone else's life.",a:"Steve Jobs"},
    {q:"The difference between ordinary and extraordinary is that little extra.",a:"Jimmy Johnson"},
    {q:"Push yourself, because no one else is going to do it for you.", a:"Unknown"},
    {q:"Great things never come from comfort zones.", a:"Unknown"},
    {q:"Dream it. Wish it. Do it.",a:"Unknown"},
    {q:"Stay focused and never give up.",a: "Unknown"},
    {q:"Work hard in silence, let success make the noise.", a:"Frank Ocean"},
    {q:"Don't stop when you're tired. Stop when you're done.",a:"Unknown"},
    {q:"Wake up with determination. Go to bed with satisfaction.",a:"Unknown"},
    {q:"Little things make big days.",a:"Unknown"},
    {q:"It's going to be hard, but hard is not impossible.", a:"Unknown"},
    {q:"Don't wait for opportunity. Create it.",a:"Unknown"},
    {q:"First, have a definite, clear practical ideal; a goal, an objective.",a:"Aristotle"},
    {q:"The only limit to our realization of tomorrow is our doubts of today.",a:"Franklin D. Roosevelt"},
    {q:"You are never too old to set another goal or to dream a new dream.",a:"C.S. Lewis"},
    {q:"What you get by achieving your goals is not as important as what you become.",a:"Henry David Thoreau"},
    {q:"It always seems impossible until it's done.", a:"Nelson Mandela"},
    {q:"Talent is cheaper than table salt. What separates the talented individual from the successful one is hard work.", a:"Stephen King"},
    {q:"With the new day comes new strength and new thoughts.",a:"Eleanor Roosevelt"},
    {q:"Opportunities don't happen, you create them.",a:"Chris Grosser"},
    {q:"Try not to become a person of success, but rather try to become a person of value.",a:"Albert Einstein"},
    {q:"The man who has confidence in himself gains the confidence of others.",a: "Hasidic Proverb"},
    {q:"Start where you are. Use what you have. Do what you can.", a:"Arthur Ashe"},
    {q:"I find that the harder I work, the more luck I seem to have.",a: "Thomas Jefferson"},
    {q:"Success usually comes to those who are too busy to be looking for it.",a:"Henry David Thoreau"},
    {q:"Never give up on a dream just because of the time it will take to accomplish it.",a:"Earl Nightingale"},
    {q:"You miss 100% of the shots you don't take.",a:"Wayne Gretzky"},
    {q:"Motivation is what gets you started. Habit is what keeps you going.",a:"Jim Ryun"},
    {q:"I attribute my success to this: I never gave or took any excuse.",a:"Florence Nightingale"},
    {q:"The way to get started is to quit talking and begin doing.", a:"Walt Disney"},
    {q:"Well begun is half done.",a:"Aristotle"},
    {q:"A winner is a dreamer who never gives up.",a:"Nelson Mandela"},
    {q:"Excellence is not a destination; it is a continuous journey that never ends.",a:"Brian Tracy"},
    {q:"Education is not preparation for life; education is life itself.",a:"John Dewey"},
    {q:"The more I read, the more I acquire, the more certain I am that I know nothing.",a:"Voltaire"},
    {q:"Real knowledge is to know the extent of one's ignorance.",a:"Confucius"},
    {q:"The greatest glory in living lies not in never falling, but in rising every time we fall.",a:"Nelson Mandela"},
    {q:"Wisdom is not a product of schooling but of the lifelong attempt to acquire it.",a:"Albert Einstein"},
    {q:"Learning is a treasure that will follow its owner everywhere.",a:"Chinese Proverb"},
    {q:"The roots of education are bitter, but the fruit is sweet.",a:"Aristotle"},
    {q:"Nothing in life is to be feared, it is only to be understood.",a:"Marie Curie"},
    {q:"Life is what happens when you're busy making other plans.",a:"John Lennon"},
    {q:"Spread love everywhere you go. Let no one ever come to you without leaving happier.",a:"Mother Teresa"}
];

function getDailyQuote(){
    var day=Math.floor(Date.now()/86400000);
    return QUOTES [day% QUOTES.length];
}

function makeQuoteCard(){
    var q=getDailyQuote();
    var card=el("div", {css: {background:"var(--card)", border:"1px solid var(--border)", borderRadius:"16px", padding:"28px 30px", marginBottom:"28px", position:"relative", overflow:"hidden", boxShadow:"var(--shadow-card)"}});
    // Top accent line
    var topLine=el("div", {css: {position:"absolute", top:"0",left:"0",right:"0",height:"2px", background:"linear-gradient(90deg, var(-accent), var(--accent2))"}});
    card.appendChild(topLine);
    // Decorative quote mark
    var deco=el("div", {css: {position:"absolute", top:"16px", right:"20px", fontSize:"5rem", lineHeight:"1", color:"var(--border2)", fontFamily:"Georgia, serif", pointerEvents:"none", userSelect:"none"}},"\u201C");
    card.appendChild(deco);
    var label=el("div", {css: {fontSize:".6rem", textTransform:"uppercase", letterSpacing:".16em",color:"var(--accent)", fontWeight:"700", marginBottom:"14px", fontFamily:"var(--font-display)"}},"\u2728 Quote of the Day");
    card.appendChild(label);
    var quote=el("div", {css: {fontSize:"1.05rem", lineHeight:"1.7",color:"var(--text)", fontStyle:"italic", marginBottom:"14px", fontWeight:"300", fontFamily:"var(--font-body)"}},"\u201C"+q.q+"\u201D");
    card.appendChild(quote);
    var author=el("div", {css: {fontSize:".78rem",color:"var(--muted)", fontWeight:"500", fontFamily:"var(--font-display)"}},"\u2014\u2009"+q.a);
    card.appendChild(author);
    return card;
}

function makeLogo(sz){
    sz=sz||40;
    var img = document.createElement("img");
    img.src = "logo.png";
    img.alt = "StudyLab Logo"; // <--- ADD THIS LINE
    img.style.width = sz + "px";
    img.style.height = sz + "px";
    img.style.borderRadius = "10px";
    img.style.objectFit = "cover";
    return img;
}

function showLoginModal(){
    var overlay=el("div", {cls:"login-modal", onclick:function(e){if(e.target===overlay)document.body.removeChild(overlay);}});
    var card=el("div", {cls:"login-card"});
    var Ic=el("div", {css:{display:"flex",justifyContent:"center", marginBottom:"14px"}});lc.appendChild(makeLogo(56)); card.appendChild(lc);
    card.appendChild(el("div", {css: {fontSize:"1.4rem", fontWeight:"800", marginBottom:"6px"},txt:"Welcome to StudyLab"}));
    card.appendChild(el("div", {css: {fontSize:".85rem",color:"var(--muted)", marginBottom:"24px", lineHeight:"1.6"},txt:"Sign in to save your progress across devices and track your improvement"}));
    var benefits=el("div", {css: {background:"var(--bg2)",borderRadius:"12px", padding:"16px", marginBottom:"24px", textAlign:"left"}});
    ["\u2601\uFE0F Progress saved to cloud","\uD83D\uDCF1 Access from any device", "\uD83D\uDCCA Personal analytics","\uD83D\uDD25 Streak tracking"].forEach(function(b) { benefits.appendChild(el("div", {css:{padding:"6px 0", fontSize:".82rem",color:"var(--muted)"}},b));});
    card.appendChild(benefits);
    
    var gBtn=document.createElement("button");
    gBtn.style.cssText="width:100%; padding: 13px;border-radius: 12px; border:none; background:var(--accent); color:#fff;font-family: Poppins, inherit; font-size: 95rem;font-weight:600;cursor:pointer;display:flex;align-items:center; justify-content:center;gap: 10px; box-shadow:0 2px 8px rgba(0,0,0,.15); transition:all .2s;";
    gBtn.innerHTML=' Continue as Guest';
    gBtn.addEventListener("click", function(){
        document.body.removeChild(overlay);
        showNameInputModal();
    });
    
    card.appendChild(gBtn);
    card.appendChild(el("div", {css:{fontSize:".72rem",color:"var(--subtle)", marginTop:"14px"}},"\uD83D\uDD12 Secure login via Google. We never share your data."));
    overlay.appendChild(card);document.body.appendChild(overlay);
}

// Beautiful Name & Phone Input Modal
function showNameInputModal() {
    var overlay = el("div", {
        css: {
            position: "fixed", inset: "0", background: "rgba(4,8,16,0.85)",
            backdropFilter: "blur(12px)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: "10000", animation: "fade-in 0.3s ease"
        }
    });
    var card = el("div", {
        css: {
            background: "var(--card)", border: "1.5px solid var(--border2)",
            borderRadius: "24px", padding: "40px 36px", maxWidth: "460px",
            width: "90%", boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            animation: "slide-up 0.4s cubic-bezier(0.2,0.8,0.2,1)", position: "relative"
        }
    });
    
    // Header with icon
    var header = el("div", { css: { textAlign: "center", marginBottom: "32px" } });
    var icon = el("div", {
        css: {
            width: "80px", height: "80px", margin: "0 auto 20px",
            background: "linear-gradient(135deg, #4F8EF7, #7EB3FF)", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.5rem", boxShadow: "0 8px 24px rgba(79,142,247,0.3)",
            animation: "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        }
    }, "");
    
    header.appendChild(icon);
    header.appendChild(el("h2", {
        css: { fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px"}
    }, "Welcome to StudyLab!"));
    header.appendChild(el("p", {
        css: { fontSize: ".9rem", color: "var(--muted)", lineHeight: "1.5" }
    }, "Let's personalize your learning experience"));
    card.appendChild(header);
    
    // --- 1. NAME INPUT
    var nameWrapper = el("div", { css: { position: "relative", marginBottom: "20px" } });
    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "";
    nameInput.style.cssText = "width: 100%; padding: 16px 18px; border-radius: 14px; border: 2px solid var(--border2); background: var(--bg2); color: var(--text); font-family: var(--font-body); font-size: 95rem; outline: none; transition: all 0.3s ease; box-sizing: border-box;";
    
    var nameLabel = el("label", {
        css: {
            position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)",
            color: "var(--muted)", fontSize: ".9rem", pointerEvents: "none",
            transition: "all 0.3s ease", background: "var(--bg2)", padding: "0 6px"
        }
    }, "Your Name");
    
    nameInput.addEventListener("focus", function() {
        this.style.borderColor = "var(--accent)"; this.style.boxShadow = "0 0 0 3px var(--accent-glow)";
        nameLabel.style.top = "0"; nameLabel.style.fontSize = ".75rem"; nameLabel.style.color = "var(--accent)"; nameLabel.style.fontWeight = "600";
    });
    nameInput.addEventListener("blur", function() {
        this.style.borderColor = "var(--border2)"; this.style.boxShadow = "none";
        if (!this.value) { nameLabel.style.top = "50%"; nameLabel.style.fontSize = ".9rem"; nameLabel.style.color = "var(--muted)"; nameLabel.style.fontWeight = "400"; }
    });
    nameInput.addEventListener("input", function() {
        if (this.value) { nameLabel.style.top = "0"; nameLabel.style.fontSize = ".75rem"; nameLabel.style.color = "var(--accent)"; nameLabel.style.fontWeight = "600"; }
    });
    nameWrapper.appendChild(nameInput);
    nameWrapper.appendChild(nameLabel);
    card.appendChild(nameWrapper);
    
    // --- 2. PHONE INPUT
    var phoneWrapper = el("div", { css: { position: "relative", marginBottom: "28px" } });
    var phoneInput = document.createElement("input");
    phoneInput.type = "tel"; // Shows number keyboard on mobile
    phoneInput.placeholder = "";
    phoneInput.style.cssText = "width: 100%; padding: 16px 18px; border-radius: 14px; border: 2px solid var(--border2); background: var(--bg2); color: var(--text); font-family: var(--font-body); font-size: 95rem; outline: none; transition: all 0.3s ease; box-sizing: border-box;";
    
    var phoneLabel = el("label", {
        css: {
            position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)",
            color: "var(--muted)", fontSize: ".9rem", pointerEvents: "none",
            transition: "all 0.3s ease", background: "var(--bg2)", padding: "0 6px"
        }
    }, "Phone Number");
    
    phoneInput.addEventListener("focus", function() {
        this.style.borderColor = "var(--accent)"; this.style.boxShadow = "0 0 0 3px var(--accent-glow)";
        phoneLabel.style.top = "0"; phoneLabel.style.fontSize = ".75rem"; phoneLabel.style.color = "var(--accent)"; phoneLabel.style.fontWeight = "600";
    });
    phoneInput.addEventListener("blur", function() {
        this.style.borderColor = "var(--border2)"; this.style.boxShadow = "none";
        if (!this.value) { phoneLabel.style.top = "50%"; phoneLabel.style.fontSize = ".9rem"; phoneLabel.style.color = "var(--muted)"; phoneLabel.style.fontWeight = "400"; }
    });
    phoneInput.addEventListener("input", function() {
        if (this.value) { phoneLabel.style.top = "0"; phoneLabel.style.fontSize = ".75rem"; phoneLabel.style.color = "var(--accent)"; phoneLabel.style.fontWeight = "600"; }
    });
    
    phoneWrapper.appendChild(phoneInput);
    phoneWrapper.appendChild(phoneLabel);
    card.appendChild(phoneWrapper);
    
    // Helper text
    card.appendChild(el("p", {
        css: { fontSize: ".78rem", color: "var(--subtle)", marginBottom: "24px", textAlign: "center" }
    }, "We'll use this to personalize your experience"));
    
    // Buttons
    var btnContainer = el("div", { css: { display: "flex", gap: "12px" } });
    var skipBtn = el("button", {
        css: {
            flex: "1", padding: "14px", borderRadius: "12px", border: "1.5px solid var(--border2)",
            background: "transparent", color: "var(--muted)", fontFamily: "var(--font-body)",
            fontSize: ".88rem", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease"
        },
        onclick: function() {
            finishGuestLogin("Guest User", "");
            document.body.removeChild(overlay);
        }
    }, "Skip");
    
    skipBtn.addEventListener("mouseenter", function() { this.style.borderColor = "var(--accent)"; this.style.color = "var(--text)"; });
    skipBtn.addEventListener("mouseleave", function() { this.style.borderColor = "var(--border2)"; this.style.color = "var(--muted)"; });
    
    var continueBtn = el("button", {
        css: {
            flex: "2", padding: "14px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #4F8EF7, #7EB3FF)", color: "#fff",
            fontFamily: "var(--font-body)", fontSize: ".92rem", fontWeight: "700",
            cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 4px 14px rgba(79,142,247,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
        },
        onclick: function() {
            var name = nameInput.value.trim() || "Guest User";
            var phone = phoneInput.value.trim() || "";
            // Basic validation if they try to click continue without typing
            if(nameInput.value.trim() === "" || phoneInput.value.trim() === "") {
                alert("Please enter both Name and Phone number to continue.");
                return;
            }
            finishGuestLogin(name, phone);
            document.body.removeChild(overlay);
        }
    }, "Continue");
    
    continueBtn.addEventListener("mouseenter", function() { this.style.transform = "translateY(-2px)"; this.style.boxShadow = "0 6px 20px rgba(79,142,247,0.45)"; });
    continueBtn.addEventListener("mouseleave", function() { this.style.transform = "translateY(0)"; this.style.boxShadow = "0 4px 14px rgba(79,142,247,0.35)"; });
    
    btnContainer.appendChild(skipBtn);
    btnContainer.appendChild(continueBtn);
    card.appendChild(btnContainer);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    setTimeout(function() { nameInput.focus(); }, 400);
}

// Updated Login Finisher to handle Phone Number
function finishGuestLogin(name, phone) {
    window.currentUser = {
        displayName: name,
        phoneNumber: phone,
        email: "guest@studylab.local",
        photoURL: null,
        isGuest: true
    };
    Sv.set("guest_user", window.currentUser);
    localStorage.setItem('sl_user', JSON.stringify({ name: name, phone: phone }));
    toast("Welcome, " + name + "!", "#4ade80");
    try {
        if (window.OneSignalDeferred) {
            window.OneSignalDeferred.push(async function (OneSignal) {
                var permission = await OneSignal.Notifications.permission;
                if (!permission) await OneSignal.Notifications.requestPermission();
                await OneSignal.User.addTag("name", name);
                await OneSignal.User.addTag("type", "guest");
            });
        }
    } catch(e) {}
    
    // Trigger the install prompt now that they are logged in!
    if (typeof triggerSmartInstallPrompt === "function") {
        setTimeout(triggerSmartInstallPrompt, 1000);
    }
    render();
}

// Beautiful Sign Out Confirmation Modal
function showSignOutModal() {
    var userName = window.currentUser? window.currentUser.displayName: "User";
    var overlay = el("div", {
        css: {
            position: "fixed",
            inset: "0",
            background: "rgba(4,8,16,0.85)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "10000",
            animation: "fade-in 0.3s ease"
        }
    });
    
    // Close on overlay click
    overlay.addEventListener("click", function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
    
    var card = el("div", {
        css: {
            background: "var(--card)",
            border: "1.5px solid var(--border2)",
            borderRadius: "24px",
            padding: "40px 36px",
            maxWidth: "440px",
            width: "90%",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            animation: "slide-up 0.4s cubic-bezier(0.2,0.8,0.2,1)",
            position: "relative"
        }
    });
    
    // Prevent card click from closing modal
    card.addEventListener("click", function(e) {
        e.stopPropagation();
    });
    
    // Header with icon
    var header = el("div", {
        css: {
            textAlign: "center",
            marginBottom: "28px"
        }
    });
    var icon = el("div", {
        css: {
            width: "80px",
            height: "80px",
            margin: "0 auto 20px",
            background: "linear-gradient(135deg, #f59e0b, #ef4444)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            boxShadow: "0 8px 24px rgba(239,68,68,0.3)",
            animation: "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        }
    }, "");
    
    header.appendChild(icon);
    header.appendChild(el("h2", {
        css: {
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "var(--text)",
            marginBottom: "8px"
        }
    }, "Sign Out?"));
    
    header.appendChild(el("p", {
        css: {
            fontSize: ".9rem",
            color: "var(--muted)",
            lineHeight: "1.5"
        }
    }, "See you soon, " + userName + "!"));
    card.appendChild(header);
    
    // Info box
    var infoBox = el("div", {
        css: {
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "18px",
            marginBottom: "28px"
        }
    });
    
    var infoItems = [
        "Your progress will be saved",
        "Bookmarks remain intact",
        "Sign back in anytime"
    ];
    
    infoItems.forEach(function(item) {
        infoBox.appendChild(el("div", {
            css: {
                padding: "6px 0",
                fontSize: ".82rem",
                color: "var(--muted)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
            }
        }, item));
    });
    card.appendChild(infoBox);
    
    // Buttons
    var btnContainer = el("div", {
        css: {
            display: "flex",
            gap: "12px",
            flexDirection: "column"
        }
    });
    
    var signOutBtn = el("button", {
        css: {
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "#fff",
            fontFamily: "var(--font-body)",
            fontSize: ".92rem",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
        },
        onclick: function() {
            // Perform sign out
            Sv.set("guest_user", null);
            window.currentUser = null;
            document.body.removeChild(overlay);
            toast(" Signed out successfully", "#f59e0b");
            render();
        }
    }, "Yes, Sign Out");
    
    signOutBtn.addEventListener("mouseenter", function() {
        this.style.transform = "translateY(-2px)";
        this.style.boxShadow = "0 6px 20px rgba(239,68,68,0.45)";
    });
    signOutBtn.addEventListener("mouseleave", function() {
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "0 4px 14px rgba(239,68,68,0.35)";
    });
    
    var cancelBtn = el("button", {
        css: {
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1.5px solid var(--border2)",
            background: "transparent",
            color: "var(--text)",
            fontFamily: "var(--font-body)",
            fontSize: ".88rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease"
        },
        onclick: function() {
            document.body.removeChild(overlay);
        }
    }, "Cancel");
    
    cancelBtn.addEventListener("mouseenter", function() {
        this.style.borderColor = "var(--accent)";
        this.style.background = "var(--bg2)";
    });
    cancelBtn.addEventListener("mouseleave", function() {
        this.style.borderColor = "var(--border2)";
        this.style.background = "transparent";
    });
    
    btnContainer.appendChild(signOutBtn);
    btnContainer.appendChild(cancelBtn);
    card.appendChild(btnContainer);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    
    // ESC key to close
    var escHandler = function(e) {
        if (e.key === "Escape") {
            document.body.removeChild(overlay);
            document.removeEventListener("keydown", escHandler);
        }
    };
    document.addEventListener("keydown", escHandler);
}

function makeNav(active){
    // Update fixed top navbar active state
    var btns = document.querySelectorAll('#nb-links button');
    btns.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-page') === active); });
    
    // Update mobile drawer active state
    var mbtns = document.querySelectorAll('#nb-mobile-drawer button');
    mbtns.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-page') === active); });
    
    // Update bottom navbar active state
    var bbtns = document.querySelectorAll('#bottom-navbar button');
    bbtns.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-page') === active); });
    
    // Update user area in top navbar
    var ua = document.getElementById('nb-user-area');
    if(ua){
        ua.innerHTML = "";
        var user = window.currentUser;
        if(user){
            var pill = el("div", {cls:"nb-user-pill", onclick:function(){window.signOut();}});
            if(user.photoURL){var img=document.createElement("img");img.src=user.photoURL;img.className="user-avatar";img.alt="avatar"; pill.appendChild(img);}
            else{var av=el("div", {css: {width:"30px",height:"30px", borderRadius: "50%", background:"var(--accent)", display:"flex", alignItems:"center",justifyContent:"center", fontWeight:"700", fontSize:".8rem",color:"#fff"}},user.displayName?user.displayName[0]:"U"); pill.appendChild(av);}
            pill.appendChild(el("div", {css:{fontSize:".78rem", fontWeight:"600"}, txt:user.displayName?user.displayName.split(" ")[0]:"User"}));
            ua.appendChild(pill);
        } else {
            var lb=el("button", {cls:"btn btnp", css: {padding:"6px 16px", fontSize:".78rem"}, onclick:function(){showLoginModal();}});
            lb.innerHTML=" Sign In"; ua.appendChild(lb);
        }
    }
    // Return empty div (layout placeholder, nav is now fixed at top)
    return el("div", {css: {display:"none"}});
}

// DEADLINE COUNTDOWN WIDGET
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
        var cleanDateStr = dateStr.replace(/(\d{2})[\\-\.](\d{2})[\\-\.](\d{4})/, '$3-$2-$1');
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
    if (!closestEntry || closestDiff === Infinity) return el("div", {css: {display:"none"}});
    var daysLeft = Math.ceil(closestDiff /(1000*60*60*24));
    if (daysLeft > 30) return el("div", {css: {display:"none"}});
    
    // Widget Styling
    var isUrgent = daysLeft <= 3;
    var wCol = isUrgent? "#ef4444": "#f59e0b"; // Red if urgent, Orange if approaching
    var wBg = isUrgent? "rgba(239,68,68,0.1)": "rgba(245,158,11,0.1)";
    var widget = el("div", {
        cls: "glass-modal", // <-- Add this line right here
        css: {
            background: "var(--card)",
            border: "1.5px solid" + wCol,
            borderRadius: "16px",
            padding: "16px 20px",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 8px 24px" + wBg,
            cursor: "pointer",
            transition: "transform 0.2s"
        },
        onclick: function() { go("govtupdates"); }
    });
    
    widget.addEventListener("mouseenter", function() { this.style.transform = "translateY(-3px)"; });
    widget.addEventListener("mouseleave", function() { this.style.transform = "translateY(0)"; });
    
    var left = el("div", {css: {display: "flex", alignItems: "center", gap: "14px", flex:"1", minWidth:"0"}});
    left.appendChild(el("div", {
        css: {fontSize: "2rem", animation: isUrgent? "pulse-dot 1.2s infinite": "none", flexShrink:"0"},
        txt: isExam?"":""
    }));
    
    var textWrap = el("div", {css:{minWidth:"0"}});
    var typeText = isExam? "Upcoming Exam": "Application Deadline";
    textWrap.appendChild(el("div", {css: {fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".1em", color: wCol, fontWeight: "700", marginBottom: "2px"}}, typeText));
    textWrap.appendChild(el("div", {css: {fontSize: ".95rem", fontWeight: "700", color: "var(--text)", display: "-webkit-box", WebkitLineClamp: "1", WebkitBoxOrient: "vertical", overflow: "hidden", paddingRight:"10px"}}, closestEntry.org + "-" + closestEntry.title));
    
    left.appendChild(textWrap);
    widget.appendChild(left);
    var right = el("div", {
        css: {background: wCol, color: "#fff", padding: "6px 14px", borderRadius: "10px", fontWeight: "800", fontSize: ".9rem", whiteSpace: "nowrap", flexShrink:"0"}
    }, daysLeft === 0 ? "Today!": daysLeft + " Days");
    
    widget.appendChild(right);
    return widget;
}

// --- UPDATED RENDER FUNCTION ---
function render(){
    var app=document.getElementById("app");
    app.innerHTML="";
    if(pg=="home"){document.body.classList.remove("hide-top-sections"); }else{document.body.classList.add("hide-top-sections");}
    
    // Show current-affairs-container only on digest page
    var cac = document.getElementById("current-affairs-container");
    if(cac) cac.style.display = (pg=="digest") ? "block": "none";
    
    if(pg=="home")app.appendChild(pgHome());
    else if(pg=="sub")app.appendChild(pgSub());
    else if(pg=="fcmenu") app.appendChild(pgFCMenu());
    else if(pg=="fc") app.appendChild(pgFC());
    else if(pg=="swipefc")app.appendChild(pgSwipeFC());
    else if(pg=="qz")app.appendChild(pgQZ());
    else if(pg=="bm") app.appendChild(pgBookmarks());
    else if(pg=="stats") app.appendChild(pgStats());
    else if(pg=="daily")app.appendChild(pgDaily());
    else if(pg=="digest") app.appendChild(pgDigest());
    else if(pg=="about") app.appendChild(pgAbout());
    else if(pg=="govtupdates") app.appendChild(pgGovtUpdates());
    else if(pg=="howtouse")app.appendChild(pgHowToUse());
    else if(pg=="shorts") app.appendChild(pgShorts());
    else if(pg=="skilltree") app.appendChild(pgSkillTree());
}

// PWA INSTALLATION & SERVICE WORKER
let deferredPrompt;
let installButton;
// Register Service Worker (only if on same origin)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Check if we're on the same origin (not viewing through a CDN)
        var currentOrigin = window.location.origin;
        var isLocalOrHTTPS = window.location.protocol === 'https:' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';
        if (isLocalOrHTTPS && !currentOrigin.includes('claudusercontent')) {
            // Try to register external service worker
            navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log(' ServiceWorker registered:', registration.scope);
            })
            .catch(function(err) {
                console.log('! External SW failed, trying inline...', err.message);
                registerInlineSW();
            });
        } else {
            console.log(' ServiceWorker skipped - not on proper domain. Deploy to a web host to enable offline features.');
        }
    });
}

// Inline service worker as fallback
function registerInlineSW() {
    try {
        var swCode = `
        const CACHE_NAME = 'studylab-v2';
        self.addEventListener('install', e=> {
            e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(['/'])));
        });
        self.skipWaiting();
        self.addEventListener('activate', e => {
            e.waitUntil(self.clients.claim());
        });
        self.addEventListener('fetch', e=>{
            e.respondWith(
                caches.match(e.request).then(r => r|| fetch(e.request))
            );
        });
        `;
        var blob = new Blob ([swCode], { type: 'application/javascript' });
        var swUrl = URL.createObjectURL(blob);
        navigator.serviceWorker.register(swUrl)
        .then(function(reg) {
            console.log(' Inline ServiceWorker registered');
        })
        .catch(function(err) {
            console.log(' ServiceWorker not available:', err.message);
        });
    } catch(e) {
        console.log(' Inline SW creation failed:', e.message);
    }
}

// Listen for beforeinstallprompt event (Works on Desktop & Mobile)
window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e; // Just save it quietly, do NOT show it automatically yet
});

// Create a helper function to call later
function triggerSmartInstallPrompt() {
    if (deferredPrompt && !sessionStorage.getItem('installPromptShown')) {
        setTimeout(function() {
            showInstallModal();
            sessionStorage.setItem('installPromptShown', 'true');
        }, 1500); // Small delay after the tour finishes so it feels natural
    }
}

function showInstallButton() {
    // Check if button already exists
    if (installButton) return;
    
    // Detect device type
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Create install button
    installButton = el("button", {
        cls: "btn btnp",
        css: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            fontSize: isMobile? ".75rem": ".82rem",
            padding: isMobile? "6px 12px": "8px 16px",
            background: "linear-gradient(135deg, #4F8EF7, #7EB3FF)",
            border: "none",
            boxShadow: "0 4px 12px rgba(79,142,247,0.3)",
            animation: "pulse-glow 2s ease-in-out infinite",
            whiteSpace: "nowrap",
            minWidth: "fit-content"
        },
        onclick: function(e) {
            e.preventDefault();
            e.stopPropagation();
            showInstallModal();
        }
    }, isMobile?" Install": "Install App");
    
    // Add to navbar user area
    var userArea = document.getElementById('nb-user-area');
    if (userArea) {
        userArea.insertBefore(installButton, userArea.firstChild);
    }
    
    // Add pulse animation
    var style = document.createElement('style');
    style.textContent = `
    @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 4px 12px rgba(79,142,247,0.3); }
        50% { box-shadow: 0 4px 20px rgba(79,142,247,0.5), 0 0 30px rgba(79,142,247,0.2); }
    }
    @media (max-width: 768px) {
        #nb-user-area {
            gap: 6px !important;
        }
    }
    `;
    document.head.appendChild(style);
}

// Beautiful Install Modal (Mobile-Optimized)
function showInstallModal() {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isAndroid = /Android/i.test(navigator.userAgent);
    
    var overlay = el("div", {
        css: {
            position: "relative",
            inset: "0",
            background: "rgba(4,8,16,0.9)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: isMobile? "flex-end": "center",
            justifyContent: "center",
            zIndex: "100",
            animation: "fade-in 0.3s ease",
            padding: isMobile? "0": "20px"
        }
    });
    
    // Close on overlay click
    overlay.addEventListener("click", function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
    
    var card = el("div", {
        css: {
            background: "var(--card)",
            border: "1.5px solid var(--border2)",
            borderRadius: isMobile? "24px 24px 0 0": "24px",
            padding: isMobile? "32px 24px 40px": "40px 36px",
            maxWidth: "460px",
            width: isMobile? "100%": "90%",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.6)",
            animation: isMobile? "slide-up-mobile 0.4s cubic-bezier(0.2,0.8,0.2,1)": "slide-up 0.4s cubic-bezier(0.2,0.8,0.2,1)",
            position: "relative",
            maxHeight: isMobile? "90vh": "auto",
            overflowY: "auto"
        }
    });
    
    // Prevent card click from closing modal
    card.addEventListener("click", function(e) {
        e.stopPropagation();
    });
    
    // Mobile swipe down to close
    if (isMobile) {
        var startY = 0;
        var currentY = 0;
        card.addEventListener("touchstart", function(e) {
            startY = e.touches[0].clientY;
        });
        card.addEventListener("touchmove", function(e) {
            currentY = e.touches[0].clientY;
            var diff = currentY - startY;
            if (diff > 0 && card.scrollTop === 0) {
                e.preventDefault();
                card.style.transform = "translateY(" + diff + "px)";
            }
        });
        card.addEventListener("touchend", function(e) {
            var diff = currentY - startY;
            if (diff > 100) {
                document.body.removeChild(overlay);
            } else {
                card.style.transform = "translateY(0)";
            }
        });
    }
    
    // Drag indicator for mobile
    if (isMobile) {
        var dragIndicator = el("div", {
            css: {
                width: "40px",
                height: "4px",
                background: "var(--border2)",
                borderRadius: "2px",
                margin: "0 auto 24px",
                opacity: "0.5"
            }
        });
        card.appendChild(dragIndicator);
    }
    
    // Header with icon
    var header = el("div", {
        css: {
            textAlign: "center",
            marginBottom: "28px"
        }
    });
    
    var iconSize = isMobile? "70px": "80px";
    var icon = el("div", {
        css: {
            width: iconSize,
            height: iconSize,
            margin: "0 auto 20px",
            background: "linear-gradient(135deg, #4F8EF7, #7EB3FF)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile? "2rem": "2.5rem",
            boxShadow: "0 8px 24px rgba(79,142,247,0.3)",
            animation: "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
        }
    }, "");
    
    header.appendChild(icon);
    header.appendChild(el("h2", {
        css: {
            fontFamily: "var(--font-display)",
            fontSize: isMobile? "1.4rem": "1.6rem",
            fontWeight: "700",
            color: "var(--text)",
            marginBottom: "8px"
        }
    }, "Install StudyLab"));
    
    header.appendChild(el("p", {
        css: {
            fontSize: isMobile? ".85rem": ".9rem",
            color: "var(--muted)",
            lineHeight: "1.5"
        }
    }, "Get the best learning experience"));
    card.appendChild(header);
    
    // Benefits list
    var benefits = el("div", {
        css: {
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: isMobile? "16px": "18px",
            marginBottom: "24px"
        }
    });
    
    var benefitsList = [
        "Instant access from home screen",
        "Works offline after install",
        "Faster loading times",
        "Get study reminders",
        "No storage concerns"
    ];
    
    benefitsList.forEach(function(item) {
        benefits.appendChild(el("div", {
            css: {
                padding: "6px 0",
                fontSize: isMobile? ".78rem": ".82rem",
                color: "var(--muted)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
            }
        }, item));
    });
    card.appendChild(benefits);
    
    // Platform-specific instructions
    if (isIOS) {
        var iosInstructions = el("div", {
            css: {
                background: "linear-gradient(135deg, rgba(79,142,247,0.1), rgba(126,179,255,0.1))",
                border: "1.5px solid var(--accent)",
                borderRadius: "14px",
                padding: isMobile? "16px": "18px",
                marginBottom: "24px"
            }
        });
        
        iosInstructions.appendChild(el("div", {
            css: {
                fontSize: isMobile? ".82rem": ".88rem",
                fontWeight: "700",
                color: "var(--accent)",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
            }
        }," iOS Installation Steps:"));
        
        var steps = [
            "1. Tap the Share button",
            "2. Scroll and tap 'Add to Home Screen'",
            "3. Tap 'Add' to confirm",
            "4. Open StudyLab from your home screen!"
        ];
        
        steps.forEach(function(step) {
            iosInstructions.appendChild(el("div", {
                css: {
                    padding: "4px 0",
                    fontSize: isMobile? ".78rem" : ".82rem",
                    color: "var(--text)"
                }
            }, step));
        });
        card.appendChild(iosInstructions);
    }
    
    // Buttons
    var btnContainer = el("div", {
        css: {
            display: "flex",
            gap: "12px",
            flexDirection: isMobile? "column-reverse": "row"
        }
    });
    
    var cancelBtn = el("button", {
        css: {
            flex: "1",
            padding: isMobile? "16px": "14px",
            borderRadius: "12px",
            border: "1.5px solid var(--border2)",
            background: "transparent",
            color: "var(--text)",
            fontFamily: "var(--font-body)",
            fontSize: isMobile? ".9rem": ".88rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
            WebkitTapHighlightColor: "transparent"
        },
        onclick: function() {
            document.body.removeChild(overlay);
        }
    }, "Maybe Later");
    
    cancelBtn.addEventListener("mouseenter", function() {
        this.style.borderColor = "var(--accent)";
        this.style.background = "var(--bg2)";
    });
    cancelBtn.addEventListener("mouseleave", function() {
        this.style.borderColor = "var(--border2)";
        this.style.background = "transparent";
    });
    
    // Install button (only for Android/Chrome)
    if (!isIOS && deferredPrompt) {
        var installBtn = el("button", {
            css: {
                flex: "2",
                padding: isMobile? "16px": "14px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #4F8EF7, #7EB3FF)",
                color: "#fff",
                fontFamily: "var(--font-body)",
                fontSize: isMobile? ".95rem": ".92rem",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 14px rgba(79,142,247,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                WebkitTapHighlightColor: "transparent"
            },
            onclick: function() {
                installAppNow();
                document.body.removeChild(overlay);
            }
        }, "Install Now");
        
        installBtn.addEventListener("touchstart", function() {
            this.style.transform = "scale(0.98)";
        });
        installBtn.addEventListener("touchend", function() {
            this.style.transform = "scale(1)";
        });
        btnContainer.appendChild(installBtn);
    }
    
    btnContainer.appendChild(cancelBtn);
    card.appendChild(btnContainer);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    
    // ESC key to close (desktop)
    if (!isMobile) {
        var escHandler = function(e) {
            if (e.key === "Escape") {
                document.body.removeChild(overlay);
                document.removeEventListener("keydown", escHandler);
            }
        };
        document.addEventListener("keydown", escHandler);
    }
    
    // Add mobile-specific animation
    var style = document.createElement('style');
    style.textContent = `
    @keyframes slide-up-mobile {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
    }`;
    document.head.appendChild(style);
    
    // --- AUTO-CLOSE AFTER 3 SECONDS ---
    setTimeout(function() {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
    }, 4000);
}

async function installAppNow() {
    if (!deferredPrompt) {
        toast("Installation not available", "#f59e0b");
        return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        toast(" App installed successfully!", "#4ade80");
        console.log('User accepted the install prompt');
    } else {
        toast("Installation cancelled", "#8896B3");
        console.log('User dismissed the install prompt');
    }
    
    // Clear the deferred Prompt
    deferredPrompt = null;
    
    // Hide install button
    if (installButton) {
        installButton.style.display = 'none';
    }
}

async function installApp() {
    showInstallModal();
}

// Detect if app is installed
window.addEventListener('appinstalled', function() {
    console.log(' StudyLab has been installed');
    toast(" StudyLab installed! Open from your home screen", "#4ade80");
    // Hide install button
    if (installButton) {
        installButton.style.display = 'none';
    }
    // Clear the deferred Prompt
    deferredPrompt = null;
});

// Check if running as installed PWA
if (window.matchMedia ('(display-mode: standalone)').matches ||
window.navigator.standalone === true) {
    console.log(' Running as installed PWA');
    // Hide install button if running as PWA
    if (installButton) {
        installButton.style.display = 'none';
    }
}

// Add install prompt for iOS Safari (doesn't support beforeinstallprompt)
if (isIOS() && !isInStandaloneMode()) {
    // Show iOS install button after 2 seconds
    setTimeout(function() {
        showInstallButton();
    }, 2000);
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isInStandaloneMode() {
    return ('standalone' in window.navigator) && (window.navigator.standalone);
}

function showIOSInstallPrompt() {
    // Lightweight banner for iOS
    var iosPrompt = el("div", {
        css: {
            position: "fixed",
            bottom: "80px",
            left: "16px",
            right: "16px",
            background: "var(--card)",
            border: "2px solid var(--accent)",
            borderRadius: "16px",
            padding: "16px 18px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            zIndex: "9999",
            animation: "slide-up 0.4s ease",
            display: "flex",
            alignItems: "center",
            gap: "12px"
        }
    });
    
    var iconDiv = el("div", {
        css: {
            width: "42px",
            height: "42px",
            background: "var(--accent)", // Uses your theme's accent color
            color: "#fff",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: "0",
            boxShadow: "0 2px 5px rgba(0,0,0,0.15)"
        }
    });
    
    // Clean download SVG icon
    iconDiv.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';
    
    var content = el("div", {
        css: {
            flex: "1",
            minWidth: "0"
        }
    });
    
    content.innerHTML = '<div style="font-size:.88rem;font-weight:700;color:var(--text); margin-bottom:4px;">Install StudyLab</div><div style="font-size:.75rem;color:var(--muted); line-height:1.4;">Tap to see installation steps</div>';
    
    var closeBtn = el("button", {
        css: {
            background: "none",
            border: "none",
            color: "var(--muted)",
            fontSize: "1.3rem",
            cursor: "pointer",
            padding: "4px",
            lineHeight: "1",
            flexShrink: "0",
            WebkitTapHighlightColor: "transparent"
        },
        onclick: function() {
            iosPrompt.remove();
        }
    }, "X");
    
    iosPrompt.appendChild(iconDiv);
    iosPrompt.appendChild(content);
    iosPrompt.appendChild(closeBtn);
    
    // Click to show full modal
    iosPrompt.addEventListener("click", function(e) {
        if (e.target !== closeBtn) {
            showInstallModal();
            iosPrompt.remove();
        }
    });
    document.body.appendChild(iosPrompt);
    
    // Auto-hide after 12 seconds
    setTimeout(function() {
        if (iosPrompt.parentElement) {
            iosPrompt.style.animation = "slide-down 0.4s ease";
            setTimeout(function() { iosPrompt.remove(); }, 400);
        }
    }, 12000);
}

// HARDWARE BACK BUTTON & EXIT CONFIRMATION ROUTING

// 1. Initialize the app history on load
window.addEventListener('load', function() {
    if (typeof checkSignIn === "function") {
        checkSignIn(function() {
            history.replaceState({ page: 'exit_trap' }, "");
            history.pushState({ page: 'home', sub: null }, "");
            // Start the app
            render();
            // Trigger login or install prompt directly
            setTimeout(function() {
                initAppFlow();
            }, 800); // Wait just under a second so the home page finishes loading visually
        });
    }
});

// 2. Listen for the mobile hardware Back Button
window.addEventListener('popstate', function(e) {
    // If the user clicked the Exit button, ignore this event and let the app close natively
    if (window.allowNativeExit) return;
    if (e.state && e.state.page === 'exit_trap') {
        // User pressed back on the Home page! They are trying to leave.
        showExitConfirmationModal();
        // Immediately put the home page back in the history so the app doesn't close
        history.pushState({ page: 'home', sub: null }, "");
    } else if (e.state && e.state.page) {
        // User pressed back from inside the app (e.g. returning to Home from a Quiz)
        // We pass 'true' at the end so it doesn't create duplicate history
        go(e.state.page, e.state.sub, true);
    }
});

// 3. The Custom Exit UI
function showExitConfirmationModal() {
    var overlay = el("div", {
        css: {
            position: "fixed", inset: "0", background: "rgba(4,8,16,0.85)",
            backdropFilter: "blur(12px)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: "10000", animation: "fade-in 0.2s ease"
        }
    });
    var card = el("div", {
        css: {
            background: "var(--card)", border: "1.5px solid var(--border2)",
            borderRadius: "24px", padding: "32px 28px", maxWidth: "340px", width: "85%",
            textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            animation: "slide-up 0.3s cubic-bezier(0.2,0.8,0.2,1)"
        }
    });
    
    var icon = el("div", {
        css: { fontSize: "3.2rem", marginBottom: "16px", textShadow: "0 8px 16px rgba(0,0,0,0.3)" }
    }, "");
    var title = el("h3", {
        css: { fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--text)", marginBottom: "8px"}
    }, "Exit StudyLab?");
    var subtext = el("p", {
        css: { fontSize: "0.9rem", color: "var(--muted)", marginBottom: "24px"}
    }, "Are you sure you want to close the application?");
    
    var btnRow = el("div", { css: { display: "flex", gap: "10px" } });
    var stayBtn = el("button", {
        css: {
            flex: "1", padding: "13px", borderRadius: "12px", border: "1.5px solid var(--border2)",
            background: "var(--bg2)", color: "var(--text)", fontWeight: "600", cursor: "pointer",
            fontFamily: "var(--font-body)"
        },
        onclick: function() { document.body.removeChild(overlay); }
    }, "Stay");
    
    var exitBtn = el("button", {
        css: {
            flex: "1", padding: "13px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff",
            fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
            fontFamily: "var(--font-body)"
        },
        onclick: function() {
            window.allowNativeExit = true;
            // 1. Remove the modal
            document.body.removeChild(overlay);
            // 2. Show a "Closing..." visual so user knows something happened
            var bye = document.createElement('div');
            bye.style.cssText = 'position:fixed;inset:0; background:var(--bg);z-index:999999;display:flex; flex-direction:column; alignItems:center; justify-content:center;';
            bye.innerHTML = '<div style="font-size:3rem; margin-bottom: 16px;"></div><div style="font-family:var(--font-display); font-size:1.2rem;font-weight:700;color:var(--text);">Good bye!</div><div style="font-size:.85rem;color:var(--muted); margin-top:8px;">See you next time</div>';
            document.body.appendChild(bye);
            // 3. Try native close (works in TWA/Android PWA)
            try { window.close(); } catch(e) {}
            // 4. For browser fallback: use replaceState to kill our trap, then go back
            setTimeout(function() {
                // Replace current state with a real "exit" marker
                history.replaceState({ page: 'exit_trap' }, "");
                // Now go back - browser exits if nothing behind
                history.back();
                // If still alive after 800ms, show a friendly message
                setTimeout(function() {
                    bye.innerHTML = '<div style="font-size:2.5rem; margin-bottom: 16px;"></div><div style="font-family:var(--font-display); font-size:1.1rem;font-weight:700;color:var(--text);text-align:center;padding:0 24px;">Close this tab manually<br>to exit StudyLab</div><button onclick="window.location.reload()" style="margin-top:20px;padding:10px 24px;border-radius: 10px;border:1.5px solid var(--border2);background:var(--bg2);color:var(--text); font-size:.9rem;font-weight:600;cursor: pointer;">Go Back Instead</button>';
                }, 800);
            }, 100);
        }
    }, "Yes, Exit");
    
    btnRow.appendChild(stayBtn);
    btnRow.appendChild(exitBtn);
    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(subtext);
    card.appendChild(btnRow);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
}

// NEW INITIALIZATION ENGINE (REPLACES TOUR)
function initAppFlow() {
    var storedUser = localStorage.getItem('sl_user');
    var guestUser = Sv.get("guest_user");
    if (!storedUser && !guestUser) {
        showNameInputModal();
    } else {
        if (typeof triggerSmartInstallPrompt === "function") {
            triggerSmartInstallPrompt();
        }
    }
}

// 1. Initialize the app history on load
window.addEventListener('load', function() {
    history.replaceState({ page: 'exit_trap' }, "");
    history.pushState({ page: 'home', sub: null }, "");
    // Render the app immediately so they see the beautiful home screen!
    render();
});

// Start the professional funnel after a tiny 1-second delay
setTimeout(function() {
    initAppFlow();
}, 1000);