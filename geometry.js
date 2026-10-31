// 図形の問題（SVGで描く）。座標は viewBox 400x300、30px = 1cm。
// step の しゅるい: ask/choice=選ぶ（ch[0]が正解）, tap=ぜんぶ タップして たしかめる, check=道具で たしかめる, num=数を 入れる
var GEOM=(function(){
 var U=30;
 function sub(a,b){return [a[0]-b[0],a[1]-b[1]]}
 function len(v){return Math.sqrt(v[0]*v[0]+v[1]*v[1])}
 function dot(a,b){return a[0]*b[0]+a[1]*b[1]}
 function cross(a,b){return a[0]*b[1]-a[1]*b[0]}
 function ang(v,a,b){var p=sub(a,v),q=sub(b,v);return Math.acos(Math.max(-1,Math.min(1,dot(p,q)/len(p)/len(q))))*180/Math.PI}
 function cm(px){return Math.round(px/U*10)/10}
 function r1(x){return Math.round(x*10)/10}
 function lineDist(p,a,b){var d=sub(b,a);return Math.abs(cross(d,sub(p,a)))/len(d)}
 function foot(p,a,b){var d=sub(b,a),t=dot(sub(p,a),d)/dot(d,d);return [a[0]+d[0]*t,a[1]+d[1]*t]}
 function f(n){return Math.round(n*10)/10}
 function ln(a,b,cls,extra){return '<line x1="'+f(a[0])+'" y1="'+f(a[1])+'" x2="'+f(b[0])+'" y2="'+f(b[1])+'" class="'+(cls||'')+'"'+(extra||'')+'/>'}
 function tx(p,s,cls){if(cls==='nm'||cls==='al')p=[Math.max(14,Math.min(386,p[0])),Math.max(16,Math.min(286,p[1]))];return '<text x="'+f(p[0])+'" y="'+f(p[1])+'" class="'+(cls||'lb')+'">'+s+'</text>'}
 // タップできる 線（太い とうめいな 当たり判定つき）
 function tl(id,a,b,cls){return '<g class="tp" data-id="'+id+'">'+ln(a,b,'vis '+(cls||''))+ln(a,b,'hit')+'</g>'}
 function tv(id,p){return '<g class="tp" data-id="'+id+'"><circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="9" class="vis vx"/><circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="30" class="hit"/></g>'}
 function poly(ps,cls,id){var s='';for(var i=0;i<ps.length;i++)s+=f(ps[i][0])+','+f(ps[i][1])+' ';return (id?'<g class="tp" data-id="'+id+'">':'')+'<polygon points="'+s+'" class="'+(cls||'')+'"/>'+(id?'</g>':'')}
 function mid(a,b){return [(a[0]+b[0])/2,(a[1]+b[1])/2]}
 function off(p,c,d){var v=sub(p,c),l=len(v)||1;return [p[0]+v[0]/l*d,p[1]+v[1]/l*d]}
 // 三角定規を 頂点 v に あてる（p の 方向に そわせる）
 function square(v,p,q){var u=sub(p,v),l=len(u);u=[u[0]/l,u[1]/l];var n=[-u[1],u[0]];if(dot(n,sub(q,v))<0)n=[u[1],-u[0]];
  var a=ang(v,p,q),ok=Math.abs(a-90)<0.6;
  return {ok:ok,ov:'<polygon class="sq" points="'+f(v[0])+','+f(v[1])+' '+f(v[0]+u[0]*95)+','+f(v[1]+u[1]*95)+' '+f(v[0]+n[0]*80)+','+f(v[1]+n[1]*80)+'"/>'+
   '<polyline class="sqm" points="'+f(v[0]+u[0]*14)+','+f(v[1]+u[1]*14)+' '+f(v[0]+u[0]*14+n[0]*14)+','+f(v[1]+u[1]*14+n[1]*14)+' '+f(v[0]+n[0]*14)+','+f(v[1]+n[1]*14)+'"/>',
   res:ok?'ぴったり！ {直角|ちょっかく}だ ✓':'すきまが ある… {直角|ちょっかく}では ない ✗'}}
 // 2本の 線の はばを 2か所で はかる
 function gap(a,b,c,d){var p1=[a[0]+(b[0]-a[0])*0.18,a[1]+(b[1]-a[1])*0.18],p2=[a[0]+(b[0]-a[0])*0.82,a[1]+(b[1]-a[1])*0.82],
  f1=foot(p1,c,d),f2=foot(p2,c,d),d1=cm(lineDist(p1,c,d)),d2=cm(lineDist(p2,c,d)),ok=Math.abs(d1-d2)<0.05;
  return {ok:ok,ov:ln(p1,f1,'gp')+ln(p2,f2,'gp')+tx(mid(p1,f1),d1+'cm','gl')+tx(mid(p2,f2),d2+'cm','gl'),
   res:'はば '+d1+'cm と '+d2+'cm → '+(ok?'{同|おな}じ！ {平行|へいこう} ✓':'ちがう… {平行|へいこう}では ない ✗')}}
 function arc(c,r,a1,a2,cls){var p1=[c[0]+r*Math.cos(a1*Math.PI/180),c[1]-r*Math.sin(a1*Math.PI/180)],p2=[c[0]+r*Math.cos(a2*Math.PI/180),c[1]-r*Math.sin(a2*Math.PI/180)];
  return '<path class="'+(cls||'ar')+'" d="M'+f(p1[0])+','+f(p1[1])+' A'+r+','+r+' 0 '+((a2-a1)>180?1:0)+',0 '+f(p2[0])+','+f(p2[1])+'"/>'}
 function dir(c,a,l){return [c[0]+l*Math.cos(a*Math.PI/180),c[1]-l*Math.sin(a*Math.PI/180)]}
 return {U:U,sub:sub,len:len,dot:dot,cross:cross,ang:ang,cm:cm,r1:r1,ln:ln,tx:tx,tl:tl,tv:tv,poly:poly,mid:mid,off:off,square:square,gap:gap,arc:arc,dir:dir,lineDist:lineDist};
})();
var GEO=(function(G){
 var g2=[],g4=[];
 var NAMES='アイウエオ';
 // ---- 4年: 平行 ----
 function parallelP(lines,pairs,ans,kind){
  var s='',i;for(i=0;i<lines.length;i++)s+=G.tl('L'+i,lines[i][0],lines[i][1])+G.tx(G.off(lines[i][0],lines[i][1],18),NAMES.charAt(i),'nm');
  var items=pairs.map(function(pr){var A=lines[pr[0]],B=lines[pr[1]],r=kind==='para'?G.gap(A[0],A[1],B[0],B[1]):(function(){
    var d1=G.sub(A[1],A[0]),d2=G.sub(B[1],B[0]),t=G.cross(G.sub(B[0],A[0]),d2)/G.cross(d1,d2),X=[A[0][0]+d1[0]*t,A[0][1]+d1[1]*t];return G.square(X,A[1],B[1])})();
   return {b:NAMES.charAt(pr[0])+' と '+NAMES.charAt(pr[1]),ov:r.ov,res:r.res,ok:r.ok}});
  var ch=pairs.map(function(pr){return NAMES.charAt(pr[0])+' と '+NAMES.charAt(pr[1])});
  var ai=ch.indexOf(ans);ch.splice(ai,1);ch.unshift(ans);
  var w=kind==='para'?'{平行|へいこう}':'すい{直|ちょく}';
  g4.push({cat:'すい{直|ちょく}と {平行|へいこう}',q:'{下|した}の {図|ず}で、'+w+'な 2本の {直線|ちょくせん}は どれと どれですか。',svg:s,
   steps:[{t:'ask',x:'{何|なに}を きかれている？',ch:[w+'な 2本の {線|せん}','いちばん {長|なが}い {線|せん}','{交|まじ}わる {点|てん}の {数|かず}']},
    {t:'check',x:(kind==='para'?'はばを はかろう：2本の {線|せん}の はばは、どこでも {同|おな}じ？（ぜんぶ ためしてね）':'{三角定規|さんかくじょうぎ}を あてよう：{直角|ちょっかく}に {交|まじ}わっている？（ぜんぶ ためしてね）'),items:items},
    {t:'choice',x:'{答|こた}えを {選|えら}ぼう',ch:ch}],ans:ans,verify:{type:kind,lines:lines,ans:ans}});
 }
 parallelP([[[40,60],[360,100]],[[40,140],[360,180]],[[150,290],[250,15]],[[40,225],[360,255]]],[[0,1],[0,3],[1,3]],'ア と イ','para');
 parallelP([[[70,25],[100,285]],[[310,25],[350,285]],[[190,25],[220,285]],[[25,150],[380,165]]],[[0,1],[0,2],[1,2]],'ア と ウ','para');
 parallelP([[[30,240],[190,30]],[[230,280],[380,110]],[[150,270],[310,60]]],[[0,1],[0,2],[1,2]],'ア と ウ','para');
 parallelP([[[25,150],[375,150]],[[60,285],[290,20]],[[205,20],[205,285]]],[[0,1],[0,2],[1,2]],'ア と ウ','perp');
 parallelP([[[30,240],[300,57]],[[40,90],[380,140]],[[130,30],[296,275]]],[[0,1],[0,2],[1,2]],'ア と ウ','perp');
 // 平行な 線と 角度
 function corr(th,mode){var A=[[25,100],[375,100]],B=[[25,220],[375,220]],Up=[210,100],Lo=[210-120/Math.tan(th*Math.PI/180),220];
  var t1=G.dir(Lo,th+180,60),t2=G.dir(Up,th,60);
  var s=G.tl('L0',A[0],A[1])+G.tl('L1',B[0],B[1])+G.ln(t1,t2,'vis')+G.tx([30,90],'ア','nm')+G.tx([30,210],'イ','nm')+
   G.arc(Up,28,0,th)+G.tx(G.dir(Up,th/2,46),'あ','al')+G.tx([335,40],'あ = '+th+'°','gl');
  var a=mode==='same'?[0,th]:[th,180];s+=G.arc(Lo,28,a[0],a[1],'ar ar2')+G.tx(G.dir(Lo,(a[0]+a[1])/2,48),'い','al');
  var gp=G.gap(A[0],A[1],B[0],B[1]),ans=mode==='same'?th:180-th;
  g4.push({cat:'{平行|へいこう}な {線|せん}と {角度|かくど}',q:'ア と イ の {線|せん}は {平行|へいこう}です。あ の {角度|かくど}は '+th+'° です。い の {角度|かくど}は {何度|なんど}ですか。',svg:s,
   steps:[{t:'ask',x:'{何|なに}を きかれている？',ch:['い の {角度|かくど}','あ の {角度|かくど}','{線|せん}の {長|なが}さ']},
    {t:'check',x:'ほんとうに {平行|へいこう}か はばを はかろう',items:[{b:'ア と イ',ov:gp.ov,res:gp.res,ok:gp.ok}]},
    {t:'choice',x:mode==='same'?'い は あ と どんな {関係|かんけい}？':'い と あ の {関係|かんけい}は？（い の となりに あ と {同|おな}じ {角|かく}が あるよ）',
     ch:mode==='same'?['{平行|へいこう}な {線|せん}に {同|おな}じ むきで {交|まじ}わるので {同|おな}じ {大|おお}きさ','あ の {半分|はんぶん}','あ の 2{倍|ばい}']:['い と あ を たすと 180°','い と あ は {同|おな}じ','い と あ を たすと 90°']},
    {t:'num',x:'い の {角度|かくど}を {入|い}れよう',ans:ans,unit:'°'}],ans:ans,verify:{type:'corr',th:th,mode:mode,ans:ans}});
 }
 corr(65,'same');corr(70,'supp');
 // ---- 4年: 四角形の なかま ----
 var NAMES4=['{台形|だいけい}','{平行四辺形|へいこうしへんけい}','ひし{形|がた}','{長方形|ちょうほうけい}','{正方形|せいほうけい}'];
 function quad(ps,ans){var V='ABCD',s=G.poly(ps,'fillq'),i,lab={};
  for(i=0;i<4;i++){var a=ps[i],b=ps[(i+1)%4];s+=G.tl('s'+i,a,b);lab['s'+i]=[G.mid(a,b),G.cm(G.len(G.sub(b,a)))+'cm'];s+=G.tx(G.off(a,[200,150],18),V.charAt(i),'nm')}
  var p1=G.gap(ps[0],ps[1],ps[3],ps[2]),p2=G.gap(ps[1],ps[2],ps[0],ps[3]);
  var ch=NAMES4.slice(0,4);ch.splice(ch.indexOf(ans),1);ch.unshift(ans);
  g4.push({cat:'{四角形|しかくけい}の なかま',q:'この {四角形|しかくけい}の {名前|なまえ}は {何|なん}ですか。{辺|へん}の {平行|へいこう}と {長|なが}さを たしかめてから {答|こた}えよう。',svg:s,
   steps:[{t:'check',x:'{向|む}かい{合|あ}う {辺|へん}は {平行|へいこう}？ はばを はかろう',items:[{b:'AB と DC',ov:p1.ov,res:p1.res,ok:p1.ok},{b:'BC と AD',ov:p2.ov,res:p2.res,ok:p2.ok}]},
    {t:'tap',x:'4つの {辺|へん}を タップして {長|なが}さを {見|み}よう',ids:['s0','s1','s2','s3'],lab:lab},
    {t:'choice',x:'{名前|なまえ}を {選|えら}ぼう',ch:ch}],ans:ans,verify:{type:'quad',ps:ps,ans:ans}});
 }
 quad([[80,230],[330,230],[260,80],[150,80]],NAMES4[0]);
 quad([[50,230],[260,230],[340,80],[130,80]],NAMES4[1]);
 quad([[70,215],[220,215],[295,85],[145,85]],NAMES4[2]);
 quad([[60,240],[300,240],[300,60],[60,60]],NAMES4[3]);
 function pgBase(){var ps=[[60,230],[240,230],[320,90],[140,90]],s=G.poly(ps,'fillq'),V='ABCD',i;for(i=0;i<4;i++){s+=G.ln(ps[i],ps[(i+1)%4],'vis');s+=G.tx(G.off(ps[i],[190,160],18),V.charAt(i),'nm')}return {ps:ps,s:s}}
 (function(){var b=pgBase(),ab=G.cm(G.len(G.sub(b.ps[1],b.ps[0]))),bc=G.cm(G.len(G.sub(b.ps[2],b.ps[1])));
  var s=b.s+G.tx([140,262],'AB = '+ab+'cm','gl')+G.tx([290,175],'BC = '+bc+'cm','gl');
  g4.push({cat:'{四角形|しかくけい}の なかま',q:'{平行四辺形|へいこうしへんけい} ABCD で、AB は '+ab+'cm、BC は '+bc+'cm です。{辺|へん} CD の {長|なが}さは {何|なん}cmですか。',svg:s,
   steps:[{t:'ask',x:'{何|なに}を きかれている？',ch:['{辺|へん} CD の {長|なが}さ','{辺|へん} AB の {長|なが}さ','まわりの {長|なが}さ']},
    {t:'choice',x:'CD と {向|む}かい{合|あ}う {辺|へん}は どれ？',ch:['AB','BC','AD']},
    {t:'choice',x:'{平行四辺形|へいこうしへんけい}の {向|む}かい{合|あ}う {辺|へん}の {長|なが}さは？',ch:['{同|おな}じ','ちがう','2{倍|ばい}']},
    {t:'num',x:'CD の {長|なが}さ',ans:ab,unit:'cm'}],ans:ab,verify:{type:'pgside',ps:b.ps,ans:ab}});
  var A=Math.round(G.ang(b.ps[0],b.ps[1],b.ps[3]));
  var s2=b.s+G.arc(b.ps[0],26,0,A)+G.tx(G.dir(b.ps[0],A/2,48),A+'°','gl');
  g4.push({cat:'{四角形|しかくけい}の なかま',q:'{平行四辺形|へいこうしへんけい} ABCD で、{角|かく}A は '+A+'° です。{角|かく}C は {何度|なんど}ですか。',svg:s2,
   steps:[{t:'ask',x:'{何|なに}を きかれている？',ch:['{角|かく}C の {大|おお}きさ','{角|かく}A の {大|おお}きさ','{辺|へん}の {長|なが}さ']},
    {t:'choice',x:'{角|かく}C と {向|む}かい{合|あ}う {角|かく}は どれ？',ch:['{角|かく}A','{角|かく}B','{角|かく}D']},
    {t:'choice',x:'{平行四辺形|へいこうしへんけい}の {向|む}かい{合|あ}う {角|かく}の {大|おお}きさは？',ch:['{同|おな}じ','たすと 90°','ちがう']},
    {t:'num',x:'{角|かく}C',ans:A,unit:'°'}],ans:A,verify:{type:'pgangC',ps:b.ps,ans:A}});
  g4.push({cat:'{四角形|しかくけい}の なかま',q:'{平行四辺形|へいこうしへんけい} ABCD で、{角|かく}A は '+A+'° です。{角|かく}B は {何度|なんど}ですか。',svg:s2,
   steps:[{t:'ask',x:'{何|なに}を きかれている？',ch:['{角|かく}B の {大|おお}きさ','{角|かく}A の {大|おお}きさ','{角|かく}C の {大|おお}きさ']},
    {t:'choice',x:'{角|かく}A と {角|かく}B は となり{合|あ}う {角|かく}。たすと {何度|なんど}？',ch:['180°','90°','360°']},
    {t:'num',x:'{角|かく}B',ans:180-A,unit:'°'}],ans:180-A,verify:{type:'pgangB',ps:b.ps,ans:180-A}});
 })();
 (function(){var ps=[[70,215],[220,215],[295,85],[145,85]],s=G.poly(ps,'fillq'),i;for(i=0;i<4;i++)s+=G.ln(ps[i],ps[(i+1)%4],'vis');var a=G.cm(G.len(G.sub(ps[1],ps[0])));s+=G.tx([130,245],a+'cm','gl');
  g4.push({cat:'{四角形|しかくけい}の なかま',q:'1つの {辺|へん}が '+a+'cm の ひし{形|がた}が あります。まわりの {長|なが}さは {何|なん}cmですか。',svg:s,
   steps:[{t:'ask',x:'{何|なに}を きかれている？',ch:['まわりの {長|なが}さ','1つの {辺|へん}の {長|なが}さ','{角|かく}の {大|おお}きさ']},
    {t:'choice',x:'ひし{形|がた}の 4つの {辺|へん}の {長|なが}さは？',ch:['4つとも {同|おな}じ','{向|む}かい{合|あ}う {辺|へん}だけ {同|おな}じ','ぜんぶ ちがう']},
    {t:'num',x:'まわりの {長|なが}さ',ans:a*4,unit:'cm'}],ans:a*4,verify:{type:'rhper',ps:ps,ans:a*4}});
 })();
 // ---- 4年: 角度 ----
 function prot(base,deg){var c=[200,255],R=175,s='<path class="pr" d="M25,255 A175,175 0 0,1 375,255 Z"/>',k;
  for(k=0;k<=180;k+=10){var o=G.dir(c,k,R),i1=G.dir(c,k,R-(k%30?10:18));s+=G.ln(o,i1,'tk');
   if(k%30===0){s+=G.tx(G.dir(c,k,R-30),String(k),'so')+G.tx(G.dir(c,k,R-58),String(180-k),'si')}}
  var a0=base==='r'?0:180,a1=base==='r'?deg:180-deg;
  s+=G.ln(c,G.dir(c,a0,215),'ray')+G.ln(c,G.dir(c,a1,215),'ray')+G.arc(c,40,Math.min(a0,a1),Math.max(a0,a1),'ar ar2')+G.tx(G.dir(c,(a0+a1)/2,62),'あ','al');
  var ans=deg,right=base==='r'?'{外|そと}がわの {目|め}もり':'{内|うち}がわの {目|め}もり',wrong=base==='r'?'{内|うち}がわの {目|め}もり':'{外|そと}がわの {目|め}もり';
  g4.push({cat:'{角度|かくど}',q:'{分度器|ぶんどき}で あ の {角度|かくど}を はかります。{何度|なんど}ですか。',svg:s,
   steps:[{t:'ask',x:'{何|なに}を きかれている？',ch:['あ の {角度|かくど}','{分度器|ぶんどき}の {大|おお}きさ','{線|せん}の {長|なが}さ']},
    {t:'choice',x:'{辺|へん}が 0° に {重|かさ}なっている のは どちらの {目|め}もり？ そちらを {読|よ}むよ',ch:[right,wrong]},
    {t:'num',x:'あ の {角度|かくど}',ans:ans,unit:'°'}],ans:ans,verify:{type:'prot',base:base,deg:deg,ans:ans}});
 }
 prot('r',40);prot('l',130);prot('l',60);
 (function(){var c=[200,200],s=G.ln([20,200],[380,200],'vis')+G.ln(c,G.dir(c,50,170),'vis')+G.arc(c,34,0,50)+G.tx(G.dir(c,25,58),'50°','gl')+G.arc(c,44,50,180,'ar ar2')+G.tx(G.dir(c,115,70),'あ','al');
  g4.push({cat:'{角度|かくど}',q:'{一直線|いっちょくせん}の {上|うえ}に {角|かく}が あります。あ の {角度|かくど}は {何度|なんど}ですか。',svg:s,
   steps:[{t:'ask',x:'{何|なに}を きかれている？',ch:['あ の {角度|かくど}','50° の {角|かく}','{線|せん}の {数|かず}']},
    {t:'choice',x:'{一直線|いっちょくせん}の {角度|かくど}は {何度|なんど}？',ch:['180°','90°','360°']},
    {t:'num',x:'あ（180 − 50）',ans:130,unit:'°'}],ans:130,verify:{type:'line',given:50,ans:130}});
  var s2=G.ln(c,G.dir(c,0,170),'vis')+G.ln(c,G.dir(c,120,170),'vis')+G.arc(c,34,0,120)+G.tx(G.dir(c,60,58),'120°','gl')+G.arc(c,46,120,360,'ar ar2')+G.tx(G.dir(c,240,72),'あ','al');
  g4.push({cat:'{角度|かくど}',q:'あ の {角度|かくど}は {何度|なんど}ですか。（{小|ちい}さい ほうの {角|かく}は 120° です）',svg:s2,
   steps:[{t:'ask',x:'{何|なに}を きかれている？',ch:['{大|おお}きい ほうの {角|かく} あ','120° の {角|かく}','{半回転|はんかいてん}の {角|かく}']},
    {t:'choice',x:'1{回転|かいてん}の {角度|かくど}は {何度|なんど}？',ch:['360°','180°','90°']},
    {t:'num',x:'あ（360 − 120）',ans:240,unit:'°'}],ans:240,verify:{type:'turn',given:120,ans:240}});
 })();
 function setsq(a1,a2){var O=[70,250],s='',lab={},L1=230,L2=180;
  function tri(id,b,al,L){var P=G.dir(O,b,L),Q=G.dir(O,b+al,L/Math.cos(al*Math.PI/180));s+=G.poly([O,P,Q],'ss '+id,id);
   lab[id]=[[G.dir(O,b+al/2,48),al+'°'],[G.off(P,O,-24),'90°'],[G.off(Q,O,-26),(90-al)+'°']];return Q}
  tri('t1',0,a1,L1);tri('t2',a1,a2,L2);
  s+=G.arc(O,30,0,a1+a2,'ar ar2')+G.tx(G.dir(O,(a1+a2)/2,62),'あ','al');
  g4.push({cat:'{角度|かくど}',q:'2まいの {三角定規|さんかくじょうぎ}を {組|く}み{合|あ}わせました。あ の {角度|かくど}は {何度|なんど}ですか。',svg:s,
   steps:[{t:'ask',x:'{何|なに}を きかれている？',ch:['あ の {角度|かくど}','{定規|じょうぎ}の {長|なが}さ','{直角|ちょっかく}の {数|かず}']},
    {t:'tap',x:'{三角定規|さんかくじょうぎ}を 1まいずつ タップして {角度|かくど}を たしかめよう',ids:['t1','t2'],lab:lab},
    {t:'choice',x:'あ は どの {角|かく}と どの {角|かく}を あわせた もの？',ch:[a1+'° と '+a2+'°',(90-a1)+'° と '+a2+'°',a1+'° と 90°'].filter(function(x,i,arr){return arr.indexOf(x)===i})},
    {t:'num',x:'あ の {角度|かくど}',ans:a1+a2,unit:'°'}],ans:a1+a2,verify:{type:'setsq',a1:a1,a2:a2,ans:a1+a2}});
 }
 setsq(45,30);setsq(60,45);
 // ---- 4年: 対角線 ----
 (function(){var ps=[[60,230],[300,250],[330,80],[110,60]],V='ABCD',s=G.poly(ps,'fillq'),i;for(i=0;i<4;i++){s+=G.ln(ps[i],ps[(i+1)%4],'vis');s+=G.tx(G.off(ps[i],[200,160],18),V.charAt(i),'nm')}
  s+=G.tl('d0',ps[0],ps[2],'dg')+G.tl('d1',ps[1],ps[3],'dg');
  g4.push({cat:'{対角線|たいかくせん}',q:'{四角形|しかくけい}の {対角線|たいかくせん}は {何本|なんぼん} ありますか。',svg:s,
   steps:[{t:'ask',x:'{対角線|たいかくせん}って どんな {線|せん}？',ch:['{向|む}かい{合|あ}う {頂点|ちょうてん}を むすぶ {直線|ちょくせん}','となりの {頂点|ちょうてん}を むすぶ {線|せん}','まがった {線|せん}']},
    {t:'tap',x:'{向|む}かい{合|あ}う {頂点|ちょうてん}を むすぶ {点線|てんせん}を ぜんぶ タップ',ids:['d0','d1']},
    {t:'num',x:'{対角線|たいかくせん}の {数|かず}',ans:2,unit:'{本|ほん}'}],ans:2,verify:{type:'ndiag',n:4,ans:2}});
  var R=[[80,240],[320,240],[320,60],[80,60]],s2=G.poly(R,'fillq');for(i=0;i<4;i++){s2+=G.ln(R[i],R[(i+1)%4],'vis');s2+=G.tx(G.off(R[i],[200,150],18),V.charAt(i),'nm')}
  var ac=G.cm(G.len(G.sub(R[2],R[0])));s2+=G.ln(R[0],R[2],'vis')+G.ln(R[1],R[3],'dg')+G.tx([150,135],'AC = '+ac+'cm','gl');
  g4.push({cat:'{対角線|たいかくせん}',q:'{長方形|ちょうほうけい} ABCD の {対角線|たいかくせん} AC は '+ac+'cm です。{対角線|たいかくせん} BD は {何|なん}cmですか。',svg:s2,
   steps:[{t:'ask',x:'{何|なに}を きかれている？',ch:['BD の {長|なが}さ','AC の {長|なが}さ','{辺|へん} AB の {長|なが}さ']},
    {t:'choice',x:'{長方形|ちょうほうけい}の 2本の {対角線|たいかくせん}の {長|なが}さは？',ch:['{同|おな}じ','ちがう','{半分|はんぶん}']},
    {t:'num',x:'BD',ans:ac,unit:'cm'}],ans:ac,verify:{type:'rectdiag',ps:R,ans:ac}});
  var H=[[200,30],[310,150],[200,270],[90,150]],s3=G.poly(H,'fillq');for(i=0;i<4;i++)s3+=G.ln(H[i],H[(i+1)%4],'vis');s3+=G.ln(H[0],H[2],'vis')+G.ln(H[1],H[3],'vis');
  var sq=G.square([200,150],H[1],H[0]);
  g4.push({cat:'{対角線|たいかくせん}',q:'ひし{形|がた}の 2本の {対角線|たいかくせん}は、どのように {交|まじ}わっていますか。',svg:s3,
   steps:[{t:'check',x:'{交|まじ}わった {所|ところ}に {三角定規|さんかくじょうぎ}を あてよう',items:[{b:'{交|まじ}わった {所|ところ}',ov:sq.ov,res:sq.res,ok:sq.ok}]},
    {t:'choice',x:'{答|こた}えを {選|えら}ぼう',ch:['すい{直|ちょく}に {交|まじ}わる','{平行|へいこう}に なる','ななめに {交|まじ}わる']}],ans:'perp',verify:{type:'rhdiag',ps:H,ans:'perp'}});
  var Pg=[[50,230],[230,230],[290,50],[110,50]],s4=G.poly(Pg,'fillq');for(i=0;i<4;i++){s4+=G.ln(Pg[i],Pg[(i+1)%4],'vis');s4+=G.tx(G.off(Pg[i],[170,140],18),V.charAt(i),'nm')}
  var ac4=G.cm(G.len(G.sub(Pg[2],Pg[0])));s4+=G.ln(Pg[0],Pg[2],'vis')+G.ln(Pg[1],Pg[3],'dg')+G.tx([176,152],'O','nm')+G.tx([60,140],'AC = '+ac4+'cm','gl');
  g4.push({cat:'{対角線|たいかくせん}',q:'{平行四辺形|へいこうしへんけい} ABCD の {対角線|たいかくせん} AC は '+ac4+'cm です。{対角線|たいかくせん}が {交|まじ}わる {点|てん}を O と すると、AO は {何|なん}cmですか。',svg:s4,
   steps:[{t:'ask',x:'{何|なに}を きかれている？',ch:['AO の {長|なが}さ','AC の {長|なが}さ','BD の {長|なが}さ']},
    {t:'choice',x:'{平行四辺形|へいこうしへんけい}の {対角線|たいかくせん}は {交|まじ}わった {点|てん}で…',ch:['それぞれ {半分|はんぶん}に {分|わ}かれる','{長|なが}さが {同|おな}じに なる','すい{直|ちょく}に {交|まじ}わる']},
    {t:'num',x:'AO',ans:ac4/2,unit:'cm'}],ans:ac4/2,verify:{type:'pgdiag',ps:Pg,ans:ac4/2}});
 })();
 // ---- 2年 ----
 function shape2(segs,curve,ans,gapAt){var s='',ids=[],lab={},i;
  for(i=0;i<segs.length;i++){s+=G.tl('s'+i,segs[i][0],segs[i][1]);ids.push('s'+i);lab['s'+i]=[G.mid(segs[i][0],segs[i][1]),'まっすぐ']}
  if(curve){s+='<g class="tp" data-id="c0"><path class="vis" d="'+curve+'"/><path class="hit" d="'+curve+'"/></g>';ids.push('c0');lab.c0=[[200,40],'まがった {線|せん}！']}
  if(gapAt)lab[ids[0]]=[gapAt,'すきまが ある！'];
  g2.push({cat:'{三角形|さんかくけい}と {四角形|しかくけい}',q:'この {形|かたち}は {三角形|さんかくけい}ですか、{四角形|しかくけい}ですか。',svg:s,
   steps:[{t:'ask',x:'{何|なに}を きかれている？',ch:['{形|かたち}の {名前|なまえ}','{形|かたち}の {色|いろ}','{形|かたち}の {大|おお}きさ']},
    {t:'tap',x:'{線|せん}を 1本ずつ ぜんぶ タップして、まっすぐか しらべよう',ids:ids,lab:lab,count:1},
    {t:'choice',x:'{答|こた}えを {選|えら}ぼう（3本の {直線|ちょくせん}で かこまれた {形|かたち}が {三角形|さんかくけい}、4本なら {四角形|しかくけい}）',ch:[ans].concat(['{三角形|さんかくけい}','{四角形|しかくけい}','どちらでもない'].filter(function(x){return x!==ans}))}],
   ans:ans,verify:{type:'shape2',n:segs.length,curve:!!curve,gap:!!gapAt,ans:ans}});
 }
 shape2([[[200,40],[340,250]],[[340,250],[60,250]],[[60,250],[200,40]]],null,'{三角形|さんかくけい}');
 shape2([[[80,60],[330,90]],[[330,90],[300,250]],[[300,250],[60,230]],[[60,230],[80,60]]],null,'{四角形|しかくけい}');
 shape2([[[215,45],[340,250]],[[340,250],[60,250]],[[60,250],[185,60]]],null,'どちらでもない',[200,48]);
 shape2([[[60,250],[340,250]],[[340,250],[300,90]],[[100,90],[60,250]]],'M300,90 Q200,10 100,90','どちらでもない');
 function rect2(ps,ans){var s=G.poly(ps,'fillq'),i,items=[],lab={},ids=[],n=ps.length,V='アイウエ';
  for(i=0;i<n;i++){var a=ps[i],b=ps[(i+1)%n];s+=G.tl('s'+i,a,b);ids.push('s'+i);lab['s'+i]=[G.mid(a,b),G.cm(G.len(G.sub(b,a)))+'cm']}
  for(i=0;i<n;i++){var r=G.square(ps[i],ps[(i+1)%n],ps[(i+n-1)%n]);items.push({b:'かど '+V.charAt(i),ov:r.ov+G.tx(G.off(ps[i],[200,150],20),V.charAt(i),'nm'),res:r.res,ok:r.ok});s+=G.tx(G.off(ps[i],[200,150],20),V.charAt(i),'nm')}
  var opts=n===3?['{直角三角形|ちょっかくさんかくけい}','{三角形|さんかくけい}（{直角|ちょっかく}なし）']:['{長方形|ちょうほうけい}','{正方形|せいほうけい}','どちらでもない'];
  opts.splice(opts.indexOf(ans),1);opts.unshift(ans);
  g2.push({cat:'{長方形|ちょうほうけい}・{正方形|せいほうけい}・{直角三角形|ちょっかくさんかくけい}',q:'この {形|かたち}の {名前|なまえ}は {何|なん}ですか。{見|み}た {感|かん}じでは なく、{三角|さんかく}じょうぎで たしかめよう。',svg:s,
   steps:[{t:'check',x:'{三角|さんかく}じょうぎを かどに あてよう（ぜんぶ）',items:items},
    {t:'tap',x:'{辺|へん}を ぜんぶ タップして {長|なが}さを {見|み}よう',ids:ids,lab:lab},
    {t:'choice',x:'{名前|なまえ}を {選|えら}ぼう',ch:opts}],ans:ans,verify:{type:'rect2',ps:ps,ans:ans}});
 }
 rect2([[60,230],[300,230],[300,110],[60,110]],'{長方形|ちょうほうけい}');
 rect2([[140,240],[260,240],[260,120],[140,120]],'{正方形|せいほうけい}');
 rect2([[80,240],[200,240],[80,120]],'{直角三角形|ちょっかくさんかくけい}');
 rect2([[60,230],[300,230],[312,110],[72,110]],'どちらでもない');
 rect2([[70,240],[230,240],[100,110]],'{三角形|さんかくけい}（{直角|ちょっかく}なし）');
 function count2(ps,what,ans){var s=G.poly(ps,'fillq'),i,ids=[];
  for(i=0;i<ps.length;i++){if(what==='v'){s+=G.ln(ps[i],ps[(i+1)%ps.length],'vis')}else{s+=G.tl('s'+i,ps[i],ps[(i+1)%ps.length]);ids.push('s'+i)}}
  if(what==='v')for(i=0;i<ps.length;i++){s+=G.tv('v'+i,ps[i]);ids.push('v'+i)}
  var w=what==='v'?'{頂点|ちょうてん}':'{辺|へん}';
  g2.push({cat:'{辺|へん}と {頂点|ちょうてん}',q:'この {形|かたち}の '+w+'は いくつ ありますか。',svg:s,
   steps:[{t:'ask',x:w+'って どこ？',ch:what==='v'?['かどの {点|てん}','まっすぐな {線|せん}','{形|かたち}の {中|なか}']:['まっすぐな {線|せん}','かどの {点|てん}','{形|かたち}の {中|なか}']},
    {t:'tap',x:w+'を 1つずつ タップして かぞえよう',ids:ids,count:1},
    {t:'num',x:w+'の {数|かず}',ans:ans,unit:'つ'}],ans:ans,verify:{type:'count',ps:ps,what:what,ans:ans}});
 }
 count2([[200,40],[350,250],[50,250]],'v',3);
 count2([[70,70],[330,50],[300,250],[100,230]],'s',4);
 count2([[60,150],[200,40],[340,150],[200,260]],'v',4);
 function right2(ps,ans){var s=G.poly(ps,'fillq'),i,items=[],n=ps.length,V='アイウエ';
  for(i=0;i<n;i++){s+=G.ln(ps[i],ps[(i+1)%n],'vis')+G.tx(G.off(ps[i],[200,150],20),V.charAt(i),'nm');var r=G.square(ps[i],ps[(i+1)%n],ps[(i+n-1)%n]);items.push({b:'かど '+V.charAt(i),ov:r.ov,res:r.res,ok:r.ok})}
  g2.push({cat:'{直角|ちょっかく}を {見|み}つける',q:'この {形|かたち}に {直角|ちょっかく}の かどは いくつ ありますか。',svg:s,
   steps:[{t:'ask',x:'{直角|ちょっかく}って どんな かど？',ch:['{三角|さんかく}じょうぎの {直角|ちょっかく}と ぴったり {重|かさ}なる かど','とがった かど','{大|おお}きく ひらいた かど']},
    {t:'check',x:'{三角|さんかく}じょうぎを ぜんぶの かどに あてよう',items:items},
    {t:'num',x:'{直角|ちょっかく}の {数|かず}',ans:ans,unit:'つ'}],ans:ans,verify:{type:'right',ps:ps,ans:ans}});
 }
 right2([[60,240],[340,240],[340,80],[160,80]],2);
 right2([[100,60],[300,260],[100,260]],1);
 // 箱の 形
 function box(){var w=180,h=105,dx=70,dy=-50,o=[70,260],F=[o,[o[0]+w,o[1]],[o[0]+w,o[1]-h],[o[0],o[1]-h]],B=F.map(function(p){return [p[0]+dx,p[1]+dy]});
  return {F:F,B:B,cm:[G.cm(w),G.cm(h),4]}}
 (function(){var b=box(),F=b.F,B=b.B,s='';
  s+=G.poly(F,'face','f0')+G.poly([F[3],F[2],B[2],B[3]],'face','f1')+G.poly([F[1],B[1],B[2],F[2]],'face','f2');
  s+=G.ln(F[0],B[0],'dg')+G.ln(B[0],B[1],'dg')+G.ln(B[0],B[3],'dg');
  g2.push({cat:'{箱|はこ}の {形|かたち}',q:'この {箱|はこ}の {面|めん}は いくつ ありますか。',svg:s,
   steps:[{t:'ask',x:'{面|めん}って どこ？',ch:['たいらな ところ','かどの {点|てん}','まっすぐな {線|せん}']},
    {t:'tap',x:'{見|み}える {面|めん}を ぜんぶ タップしよう',ids:['f0','f1','f2'],count:1,after:'{見|み}えない うらがわにも {同|おな}じように 3つ {面|めん}が あるよ'},
    {t:'num',x:'{面|めん}の {数|かず}（{見|み}える 3 ＋ {見|み}えない 3）',ans:6,unit:'つ'}],ans:6,verify:{type:'faces',ans:6}});
  var s2='',ids=[],k;
  var edges=[[F[0],F[1],'w'],[F[3],F[2],'w'],[B[3],B[2],'w'],[B[0],B[1],'w'],[F[0],F[3],'h'],[F[1],F[2],'h'],[B[1],B[2],'h'],[B[0],B[3],'h'],[F[0],B[0],'d'],[F[1],B[1],'d'],[F[2],B[2],'d'],[F[3],B[3],'d']];
  for(k=0;k<edges.length;k++){var hid=(edges[k][0]===B[0]||edges[k][1]===B[0]);
   if(edges[k][2]==='w'){s2+=G.tl('e'+k,edges[k][0],edges[k][1],hid?'dg':'');ids.push('e'+k)}else s2+=G.ln(edges[k][0],edges[k][1],hid?'dg':'vis')}
  s2+=G.tx([130,285],b.cm[0]+'cm','gl');
  g2.push({cat:'{箱|はこ}の {形|かたち}',q:'この {箱|はこ}で、{長|なが}さが '+b.cm[0]+'cm の {辺|へん}は {何本|なんぼん} ありますか。（{点線|てんせん}は {見|み}えない {辺|へん}）',svg:s2,
   steps:[{t:'ask',x:'{何|なに}を きかれている？',ch:[b.cm[0]+'cm の {辺|へん}の {数|かず}','{面|めん}の {数|かず}','{頂点|ちょうてん}の {数|かず}']},
    {t:'tap',x:'よこに のびる '+b.cm[0]+'cm の {辺|へん}を {点線|てんせん}も ふくめて ぜんぶ タップ',ids:ids,count:1},
    {t:'num',x:b.cm[0]+'cm の {辺|へん}の {数|かず}',ans:4,unit:'{本|ほん}'}],ans:4,verify:{type:'boxedges',ans:4,n:ids.length}});
 })();
 return {g2:g2,g4:g4};
})(GEOM);
