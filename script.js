/* ===== EDIT ME ===== */
var CONFIG = {
  desmondLink: "", // e.g. "https://wa.me/234XXXXXXXXXX" or your Snapchat link. Leave empty to just copy a message.
  playlists: [
    { name: "Playlist one", note: "For the deep, quiet moments", emoji: "🌙", url: "https://open.spotify.com/playlist/2TxzRBvVM8m2s0pbHL0wb0" },
    { name: "Playlist two", note: "For when you need to feel it out", emoji: "🥀", url: "https://open.spotify.com/playlist/3l1jB1vw855Kcj6oEaek4N" }
  ],
  // Optional: add specific Spotify song links per mood. If empty, a playlist is suggested instead.
  songs: { sad: [], tired: [], anxious: [], angry: [], numb: [], happy: [] }
};

var MOODS = {
  sad:{e:"🌧️",l:"Sad",subs:["Lonely","Hurt","Disappointed","Heartbroken","Grieving"],msg:"It’s okay to feel heavy. You don’t have to fix it right now."},
  tired:{e:"🌫️",l:"Tired",subs:["Drained","Burnt out","Sleepy","Overwhelmed"],msg:"Rest counts as doing something. Be gentle with yourself today."},
  anxious:{e:"🍃",l:"Anxious",subs:["Worried","Overthinking","Nervous","Restless"],msg:"Slow breath in, slow breath out. Your thoughts are loud, not true."},
  angry:{e:"🔥",l:"Angry",subs:["Frustrated","Irritated","Resentful","Jealous"],msg:"Anger is often hurt wearing armor. You’re allowed to feel it."},
  numb:{e:"🫧",l:"Numb",subs:["Empty","Disconnected","Blank","Detached"],msg:"Feeling nothing is still a feeling. Soft and slow is enough today."},
  happy:{e:"🌷",l:"Good",subs:["Calm","Hopeful","Grateful","Content"],msg:"I’m glad you’re feeling some light today. Hold onto it."}
};
var WHY = [
  {e:"💭",l:"I was thinking about someone"},
  {e:"📚",l:"School stress"},
  {e:"👥",l:"The people around me at school"},
  {e:"🏠",l:"Things at home"},
  {e:"🌀",l:"I just feel this way, no reason"},
  {e:"✍️",l:"Something else"}
];
var HELP = [
  {k:"talk",e:"💬",l:"Talk to Desmond"},
  {k:"lists",e:"🎧",l:"Browse the playlists"},
  {k:"suggest",e:"✨",l:"Suggest something for my mood"},
  {k:"quiet",e:"🕯️",l:"I just needed to let it out"}
];

var S = {step:0, core:null, sub:null, why:[], help:null};
var app = document.getElementById("app");

function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
function bar(){ var h='<div class="steps">'; for(var i=1;i<=4;i++) h+='<i class="'+(i<=S.step?'d':'')+'"></i>'; return h+'</div>'; }
function back(){ return S.step>0 ? '<button class="ghost" id="back">← Back</button>' : ''; }
function summary(){ return "Hi Desmond, I checked in. I’m feeling "+S.sub.toLowerCase()+" ("+MOODS[S.core].l.toLowerCase()+")"+(S.why.length?" because of: "+S.why.join(", ").toLowerCase():"")+"."; }

function render(){
  var h="";
  if(S.step===0){
    h='<h1>Hi Grace 🤍</h1><p>This is a quiet little space just for you. No wrong answers, no rush. Want to check in with yourself?</p><button class="primary" id="go">Let’s begin</button>';
  } else if(S.step===1){
    h=bar()+'<h1>How are you feeling right now?</h1><p>Pick the one that’s closest.</p><div class="grid">'+Object.keys(MOODS).map(function(k){return '<button class="opt" data-core="'+k+'"><span class="e">'+MOODS[k].e+'</span>'+MOODS[k].l+'</button>';}).join("")+'</div>'+back();
  } else if(S.step===2){
    h=bar()+'<h1>A little more specific?</h1><p>Which of these fits best?</p><div class="grid">'+MOODS[S.core].subs.map(function(s){return '<button class="opt" data-sub="'+s+'">'+s+'</button>';}).join("")+'</div>'+back();
  } else if(S.step===3){
    h=bar()+'<h1>Why do you think you feel '+S.sub.toLowerCase()+'?</h1><p>Choose as many as feel true.</p><div class="grid one">'+WHY.map(function(w){return '<button class="opt'+(S.why.indexOf(w.l)>-1?' on':'')+'" data-why="'+w.l+'">'+w.e+' '+w.l+'</button>';}).join("")+'</div><button class="primary" id="next">Continue</button>'+back();
  } else if(S.step===4){
    h=bar()+'<h1>What would help right now?</h1><p>Whatever feels right is the right answer.</p><div class="grid one">'+HELP.map(function(x){return '<button class="opt" data-help="'+x.k+'">'+x.e+' '+x.l+'</button>';}).join("")+'</div>'+back();
  } else {
    h=result();
  }
  app.innerHTML=h; bind();
}

function plLink(p){ return '<a class="pl" target="_blank" rel="noopener" href="'+p.url+'"><span class="e">'+p.emoji+'</span><span><b>'+p.name+'</b><small>'+p.note+' · opens in Spotify</small></span></a>'; }

function result(){
  var m=MOODS[S.core], h='<h1>'+(S.help==="quiet"?"Thank you for sharing":"Here you go")+' 🤍</h1><div class="note">'+m.msg+'</div>';
  if(S.help==="lists"){
    h+=CONFIG.playlists.map(plLink).join("");
  } else if(S.help==="suggest"){
    var songs=CONFIG.songs[S.core]||[];
    if(songs.length){ var s=pick(songs); h+='<p>A song picked for how you feel:</p><a class="pl" target="_blank" rel="noopener" href="'+s.url+'"><span class="e">🎵</span><span><b>'+s.title+'</b><small>opens in Spotify</small></span></a>'; }
    else { h+='<p>Try this one, it suits a '+S.sub.toLowerCase()+' kind of day:</p>'+plLink(pick(CONFIG.playlists))+'<button class="ghost" id="again">Suggest another</button>'; }
  } else if(S.help==="talk"){
    h+='<p>Desmond would like to hear from you. Here’s a message ready to send:</p><div class="note" id="msg">'+summary()+'</div>';
    h+=CONFIG.desmondLink?'<a class="primary" target="_blank" rel="noopener" href="'+CONFIG.desmondLink+'">Open chat with Desmond</a><button class="ghost" id="copy">Copy message</button>':'<button class="primary" id="copy">Copy message to send</button>';
  } else {
    h+='<p>You don’t have to do anything else. I’m glad you took a moment for yourself.</p>';
  }
  h+='<button class="primary" id="restart" style="background:var(--rose)">Check in again</button>';
  h+='<p class="foot">If things ever feel too heavy, please reach out to someone you trust, a family member, a friend, or a counsellor.</p>';
  return h;
}

function bind(){
  function on(sel,fn){ var els=app.querySelectorAll(sel); for(var i=0;i<els.length;i++) els[i].addEventListener("click",fn); }
  on("#go",function(){S.step=1;render();});
  on("#back",function(){S.step--;render();});
  on("[data-core]",function(){S.core=this.dataset.core;S.step=2;render();});
  on("[data-sub]",function(){S.sub=this.dataset.sub;S.step=3;render();});
  on("[data-why]",function(){var v=this.dataset.why,i=S.why.indexOf(v);if(i>-1)S.why.splice(i,1);else S.why.push(v);this.classList.toggle("on");});
  on("#next",function(){S.step=4;render();});
  on("[data-help]",function(){S.help=this.dataset.help;S.step=5;render();});
  on("#again",render);
  on("#restart",function(){S={step:1,core:null,sub:null,why:[],help:null};render();});
  on("#copy",function(){var t=summary(),b=this;function ok(){b.textContent="Copied 🤍";}
    if(navigator.clipboard){navigator.clipboard.writeText(t).then(ok,ok);}else{ok();}});
}
render();
