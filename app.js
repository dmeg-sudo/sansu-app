(function(){
var app=document.getElementById('app'),S={g:null,i:0,step:0,sel:[]};
function load(){try{return JSON.parse(localStorage.getItem('mathapp'))||{}}catch(e){return {}}}
function save(d){try{localStorage.setItem('mathapp',JSON.stringify(d))}catch(e){}}
var D=load();
function prog(g){if(!D[g])D[g]={stars:0,done:{}};return D[g]}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function el(h){app.innerHTML=h}
function btn(t,cls,fn){var b=document.createElement('button');b.className='btn '+(cls||'');b.textContent=t;b.onclick=fn;return b}
function home(){
 el('<h1>かんがえる算数</h1><p style="text-align:center">だれが やるかな？</p><div id="b"></div>');
 var b=document.getElementById('b');
 [['g2','2年生'],['g4','4年生']].forEach(function(x){var p=prog(x[0]);
  b.appendChild(btn(x[1]+'  ⭐'+p.stars,'big',function(){S.g=x[0];list()}))});
}
function list(){
 var p=prog(S.g),ps=PROBLEMS[S.g];
 el('<div class="top"><span>⭐ '+p.stars+'</span></div><h1>もんだいを えらぼう</h1><div class="chips" id="l"></div>');
 var l=document.getElementById('l');
 ps.forEach(function(q,i){l.appendChild(btn((p.done[i]?'✅ ':'')+'もんだい '+(i+1),p.done[i]?'ok':'',function(){S.i=i;S.step=1;S.sel=[];S.miss=0;play()}))});
 app.appendChild(btn('← もどる','',home));
}
var STEPS=['','① なにを きかれている？','② つかう 数は どれ？（ぜんぶ えらんでね）','③ どんな しき に なる？','④ 答えを 入れよう'];
function play(){
 var q=PROBLEMS[S.g][S.i];
 el('<div class="top"><span>もんだい '+(S.i+1)+'</span><span>⭐ '+prog(S.g).stars+'</span></div>'+
  '<div class="q">'+q.q+'</div><div class="step">'+STEPS[S.step]+'</div><div id="c"></div><div class="msg" id="m"></div>');
 var c=document.getElementById('c'),m=document.getElementById('m');
 function next(){S.step++;S.sel=[];setTimeout(play,700)}
 function choose(arr,right){shuf(arr).forEach(function(t){var b=btn(t,'',function(){
   if(t===right){b.className='btn ok';m.textContent='そうだね！ よく よめたね 👍';next()}
   else{b.className='btn ng';S.miss++;m.textContent='もういちど もんだいを ゆっくり よんでみよう'}});c.appendChild(b)})}
 if(S.step===1)choose(q.ask,q.ask[0]);
 else if(S.step===3)choose(q.ops,q.ops[0]);
 else if(S.step===2){
  var decoy=q.nums[0]+(S.g==='g2'?10:100),opts=q.nums.slice();
  if(opts.indexOf(decoy)<0)opts.push(decoy);
  var w=document.createElement('div');w.className='chips';c.appendChild(w);
  shuf(opts).forEach(function(n){var b=btn(String(n),'',function(){
   var k=S.sel.indexOf(n);if(k<0){S.sel.push(n);b.className='btn sel'}else{S.sel.splice(k,1);b.className='btn'}});w.appendChild(b)});
  c.appendChild(btn('これで いい！','big',function(){
   var ok=S.sel.length===q.need.length&&q.need.every(function(n){return S.sel.indexOf(n)>=0});
   if(ok){m.textContent='ばっちり！ 数を 見つけられたね';next()}
   else{S.miss++;m.textContent='もんだいの 中の 数を もういちど さがしてみよう'}}));
 } else {
  var fb=btn('🖼 ずを 見る','',function(){fb.outerHTML='<div class="fig">'+q.fig+'</div>'});c.appendChild(fb);
  var d=document.createElement('div');d.style.textAlign='center';
  d.innerHTML='<input id="a" type="text" inputmode="decimal" autocomplete="off"> '+q.unit;c.appendChild(d);
  c.appendChild(btn('こたえあわせ','big',function(){
   var v=parseFloat(document.getElementById('a').value.replace(/[０-９．]/g,function(s){return String.fromCharCode(s.charCodeAt(0)-65248)}));
   if(Math.abs(v-q.ans)<1e-9){var p=prog(S.g),st=S.miss===0?3:S.miss<3?2:1;
    if(!p.done[S.i]){p.stars+=st}p.done[S.i]=true;save(D);
    el('<h1 class="done">せいかい！ 🎉</h1><p style="text-align:center;font-size:48px">'+'⭐'.repeat(st)+'</p><p style="text-align:center">'+q.ans+' '+q.unit+'</p><div id="n"></div>');
    var n=document.getElementById('n');
    if(S.i+1<PROBLEMS[S.g].length)n.appendChild(btn('つぎの もんだい','big',function(){S.i++;S.step=1;S.miss=0;play()}));
    n.appendChild(btn('もんだい いちらん','',list));
   }else{S.miss++;m.textContent='おしい！ しき を もういちど けいさんしてみよう'}}));
 }
 app.appendChild(btn('← いちらんへ','',list));
}
home();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(function(){});
})();
