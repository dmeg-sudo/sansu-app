(function(){
var app=document.getElementById('app'),S={g:null,i:0,step:0,sel:[]};
function load(){try{return JSON.parse(localStorage.getItem('mathapp'))||{}}catch(e){return {}}}
function save(d){try{localStorage.setItem('mathapp',JSON.stringify(d))}catch(e){}}
var D=load();
if(!S.g&&D._last)S.g=D._last;
function prog(g){if(!D[g])D[g]={stars:0,done:{}};if(!D[g].manga)D[g].manga={};return D[g]}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
// 漢字レベル: 2年生プロフィール→小2までの漢字（小2の字に ふりがな）, 4年生→小4まで（小3・小4の字に ふりがな）
function lv(){return S.g==='g4'?4:2}
function T(s){
 var G=lv(),R=G===4?3:2;
 return esc(s).replace(/\{([^|}]+)\|([^}]+)\}/g,function(_,w,r){
  var mx=0;for(var i=0;i<w.length;i++){var c=w.charAt(i);if(/[\u4e00-\u9fff]/.test(c)){var k=KANJI_GRADE[c]||7;if(k>mx)mx=k}}
  if(mx>G)return r;
  if(mx>=R)return '<ruby>'+w+'<rt>'+r+'</rt></ruby>';
  return w;});
}
function el(h){app.innerHTML=h}
function btn(t,cls,fn){var b=document.createElement('button');b.className='btn '+(cls||'');b.innerHTML=T(t);b.onclick=fn;return b}
function mstars(p){var n=0;for(var k in p.manga)n+=p.manga[k];return n}
function home(){
 el('<h1>'+T('かんがえる {教室|きょうしつ}')+'</h1><p style="text-align:center">'+T('だれが やるかな？')+'</p><div class="chips" id="who"></div><div id="menu"></div>');
 var w=document.getElementById('who');
 [['g2','2{年生|ねんせい}'],['g4','4{年生|ねんせい}']].forEach(function(x){
  w.appendChild(btn(x[1],S.g===x[0]?'sel':'',function(){S.g=x[0];D._last=x[0];save(D);home()}))});
 var m=document.getElementById('menu');
 if(!S.g){m.innerHTML='<p style="text-align:center">'+T('{上|うえ}の ボタンを おしてね')+'</p>';return}
 var p=prog(S.g);
 m.innerHTML='<h2>'+T('🔢 {算数|さんすう}')+'</h2>';
 m.appendChild(btn('{文章|ぶんしょう}{問題|もんだい}  ⭐'+p.stars,'big',list));
 var h=document.createElement('h2');h.innerHTML=T('📚 まんがで まなぶ')+'  ⭐'+mstars(p);m.appendChild(h);
 MANGA.forEach(function(tp){m.appendChild(btn(tp.icon+' '+tp.title,'big',function(){S.tp=tp;eps()}))});
}
function list(){
 var p=prog(S.g),ps=PROBLEMS[S.g];
 el('<div class="top"><span>⭐ '+p.stars+'</span></div><h1>'+T('{問題|もんだい}を {選|えら}ぼう')+'</h1><div class="chips" id="l"></div>');
 var l=document.getElementById('l');
 ps.forEach(function(q,i){l.appendChild(btn((p.done[i]?'✅ ':'')+'{問題|もんだい} '+(i+1),p.done[i]?'ok':'',function(){S.i=i;S.step=1;S.sel=[];S.miss=0;play()}))});
 app.appendChild(btn('← もどる','',home));
}
var STEPS=['','① {何|なに}を きかれている？','② {使|つか}う {数|かず}は どれ？（{全部|ぜんぶ} {選|えら}んでね）','③ どんな {式|しき}に なる？','④ {答|こた}えを {入|い}れよう'];
function choose(c,m,arr,right,next,onMiss){shuf(arr).forEach(function(t){var b=btn(t,'',function(){
  if(t===right){b.className='btn ok';m.innerHTML=T('そうだね！ よく {読|よ}めたね 👍');next()}
  else{b.className='btn ng';onMiss();m.innerHTML=T('もういちど {問題|もんだい}を ゆっくり {読|よ}んでみよう')}});c.appendChild(b)})}
function play(){
 var q=PROBLEMS[S.g][S.i];
 el('<div class="top"><span>'+T('{問題|もんだい} ')+(S.i+1)+'</span><span>⭐ '+prog(S.g).stars+'</span></div>'+
  '<div class="q">'+T(q.q)+'</div><div class="step">'+T(STEPS[S.step])+'</div><div id="c"></div><div class="msg" id="m"></div>');
 var c=document.getElementById('c'),m=document.getElementById('m');
 function next(){S.step++;S.sel=[];setTimeout(play,700)}
 function miss(){S.miss++}
 if(S.step===1)choose(c,m,q.ask,q.ask[0],next,miss);
 else if(S.step===3)choose(c,m,q.ops,q.ops[0],next,miss);
 else if(S.step===2){
  var decoy=q.nums[0]+(S.g==='g2'?10:100),opts=q.nums.slice();
  if(opts.indexOf(decoy)<0)opts.push(decoy);
  var w=document.createElement('div');w.className='chips';c.appendChild(w);
  shuf(opts).forEach(function(n){var b=btn(String(n),'',function(){
   var k=S.sel.indexOf(n);if(k<0){S.sel.push(n);b.className='btn sel'}else{S.sel.splice(k,1);b.className='btn'}});w.appendChild(b)});
  c.appendChild(btn('これで いい！','big',function(){
   var ok=S.sel.length===q.need.length&&q.need.every(function(n){return S.sel.indexOf(n)>=0});
   if(ok){m.innerHTML=T('ばっちり！ {数|かず}を {見|み}つけられたね');next()}
   else{S.miss++;m.innerHTML=T('{問題|もんだい}の {中|なか}の {数|かず}を もういちど さがしてみよう')}}));
 } else {
  var fb=btn('🖼 {図|ず}を {見|み}る','',function(){fb.outerHTML='<div class="fig">'+T(q.fig)+'</div>'});c.appendChild(fb);
  var d=document.createElement('div');d.style.textAlign='center';
  d.innerHTML='<input id="a" type="text" inputmode="decimal" autocomplete="off"> '+T(q.unit);c.appendChild(d);
  c.appendChild(btn('{答|こた}え{合|あ}わせ','big',function(){
   var v=parseFloat(document.getElementById('a').value.replace(/[０-９．]/g,function(s){return String.fromCharCode(s.charCodeAt(0)-65248)}));
   if(Math.abs(v-q.ans)<1e-9){var p=prog(S.g),st=S.miss===0?3:S.miss<3?2:1;
    if(!p.done[S.i]){p.stars+=st}p.done[S.i]=true;save(D);
    el('<h1 class="done">'+T('{正解|せいかい}！ 🎉')+'</h1><p style="text-align:center;font-size:48px">'+'⭐'.repeat(st)+'</p><p style="text-align:center">'+q.ans+' '+T(q.unit)+'</p><div id="n"></div>');
    var n=document.getElementById('n');
    if(S.i+1<PROBLEMS[S.g].length)n.appendChild(btn('つぎの {問題|もんだい}','big',function(){S.i++;S.step=1;S.miss=0;play()}));
    n.appendChild(btn('{問題|もんだい} いちらん','',list));
   }else{S.miss++;m.innerHTML=T('おしい！ {式|しき}を もういちど {計算|けいさん}してみよう')}}));
 }
 app.appendChild(btn('← いちらんへ','',list));
}
// ---- まんが ----
function eps(){
 var p=prog(S.g);
 el('<h1>'+T(S.tp.icon+' '+S.tp.title)+'</h1><div id="l"></div>');
 var l=document.getElementById('l');
 S.tp.eps.forEach(function(e,i){var st=p.manga[e.id];
  l.appendChild(btn((i+1)+'. '+e.title+(st?'  '+'⭐'.repeat(st):''),'big',function(){S.ep=e;S.pi=0;S.qi=-1;panel()}))});
 app.appendChild(btn('← もどる','',home));
}
function face(k,side){var c=CHARS[k];
 return '<svg class="face" viewBox="0 0 80 80" width="72" height="72"><circle cx="40" cy="40" r="37" fill="#fff" stroke="#333" stroke-width="3"/>'+
  '<text x="40" y="54" font-size="42" text-anchor="middle">'+c[0]+'</text></svg><div class="nm">'+c[1]+'</div>'}
function panel(){
 var e=S.ep,pn=e.panels[S.pi],h='';
 pn.l.forEach(function(x,j){var side=x[0]==='h'?'l':'r';
  h+='<div class="row '+side+'"><div class="who">'+face(x[0])+'</div><div class="bub">'+T(x[1])+'</div></div>'});
 el('<div class="top"><span>'+T(e.title)+'</span><span>'+(S.pi+1)+' / '+e.panels.length+'</span></div>'+
  '<div class="panel" id="pnl" style="background:'+pn.bg+'"><div class="scene">'+pn.s+'</div>'+h+'</div><div class="chips" id="nav"></div>');
 var nav=document.getElementById('nav'),last=S.pi===e.panels.length-1;
 if(S.pi>0)nav.appendChild(btn('← まえ','',function(){S.pi--;panel()}));
 nav.appendChild(btn(last?(S.qi>=0?'クイズに もどる →':'クイズへ →'):'つぎ →','big',fwd));
 app.appendChild(btn('{話|はなし}を えらぶ','',eps));
 var p=document.getElementById('pnl'),x0=null;
 p.onclick=function(){fwd()};
 p.addEventListener('touchstart',function(ev){x0=ev.touches[0].clientX},false);
 p.addEventListener('touchend',function(ev){if(x0===null)return;var dx=ev.changedTouches[0].clientX-x0;x0=null;
  if(dx<-50){ev.preventDefault();fwd()}else if(dx>50&&S.pi>0){ev.preventDefault();S.pi--;panel()}},false);
 function fwd(){if(!last){S.pi++;panel()}else{if(S.qi<0){S.qi=0;S.qs=0;S.qmiss=0;S.qok=0}quiz()}}
}
function quiz(){
 var e=S.ep,q=e.quiz[S.qi];
 el('<div class="top"><span>'+T('クイズ ')+(S.qi+1)+' / '+e.quiz.length+'</span></div>'+
  '<div class="q">'+T(q.q)+'</div><div class="step">'+T(S.qs===0?'① {何|なに}を きかれている？':'② {答|こた}えを {選|えら}ぼう（まんがに {書|か}いて あったよ）')+'</div><div id="c"></div><div class="msg" id="m"></div>');
 var c=document.getElementById('c'),m=document.getElementById('m');
 function next(){
  if(S.qs===0){S.qs=1;setTimeout(quiz,700);return}
  if(S.qmiss===0)S.qok++;
  S.qs=0;S.qmiss=0;S.qi++;
  setTimeout(S.qi<e.quiz.length?quiz:fin,700)}
 var arr=S.qs===0?q.ask:q.ch;
 choose(c,m,arr,arr[0],next,function(){if(S.qs===1)S.qmiss++});
 app.appendChild(btn('📖 まんがを もういちど {読|よ}む','',function(){S.pi=0;panel()}));
}
function fin(){
 var st=Math.max(1,S.qok),p=prog(S.g);
 if(!p.manga[S.ep.id]||p.manga[S.ep.id]<st)p.manga[S.ep.id]=st;save(D);
 el('<h1 class="done">'+T('よく {読|よ}めたね！ 🎉')+'</h1><p style="text-align:center;font-size:48px">'+'⭐'.repeat(st)+'</p><div id="n"></div>');
 S.qi=-1;
 var n=document.getElementById('n');
 n.appendChild(btn('{話|はなし}を えらぶ','big',eps));
 n.appendChild(btn('← はじめに もどる','',home));
}
home();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(function(){});
})();
