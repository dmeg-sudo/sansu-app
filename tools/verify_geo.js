// 図形問題の 答えを 図の 座標から 別に 計算して たしかめる
var fs=require('fs');eval(fs.readFileSync(__dirname+'/../kanji.js','utf8')+fs.readFileSync(__dirname+'/../geometry.js','utf8'));
function sub(a,b){return [a[0]-b[0],a[1]-b[1]]}function L(v){return Math.hypot(v[0],v[1])}
function par(a,b,c,d){var u=sub(b,a),v=sub(d,c);return Math.abs(u[0]*v[1]-u[1]*v[0])/L(u)/L(v)<1e-3}
function perp(a,b,c,d){var u=sub(b,a),v=sub(d,c);return Math.abs(u[0]*v[0]+u[1]*v[1])/L(u)/L(v)<1e-3}
function angAt(p,i){var n=p.length,a=sub(p[(i+1)%n],p[i]),b=sub(p[(i+n-1)%n],p[i]);return Math.acos((a[0]*b[0]+a[1]*b[1])/L(a)/L(b))*180/Math.PI}
function cm(a,b){return Math.round(L(sub(b,a))/30*10)/10}
function strip(s){return s.replace(/\{([^|}]+)\|[^}]+\}/g,'$1')}
var NB='アイウエオ',err=[];
function chk(c,msg){if(!c)err.push(msg)}
['g2','g4'].forEach(function(g){GEO[g].forEach(function(q,i){var v=q.verify,tag=g+'#'+(i+1)+' '+v.type;
 // 各 step: 選択肢の 重複なし、check の 結果が 答えと 合う
 q.steps.forEach(function(st){if(st.ch)chk(new Set(st.ch).size===st.ch.length&&st.ch.length>=2,tag+' choices');});
 switch(v.type){
 case 'para':case 'perp':var hits=[];for(var a=0;a<v.lines.length;a++)for(var b=a+1;b<v.lines.length;b++){var A=v.lines[a],B=v.lines[b];if(v.type==='para'?par(A[0],A[1],B[0],B[1]):perp(A[0],A[1],B[0],B[1]))hits.push(NB[a]+' と '+NB[b])}
  chk(hits.length===1&&hits[0]===v.ans,tag+' '+hits);var oks=q.steps[1].items.filter(function(x){return x.ok}).map(function(x){return x.b});chk(oks.length===1&&oks[0]===v.ans,tag+' check '+oks);break;
 case 'corr':chk(v.ans===(v.mode==='same'?v.th:180-v.th),tag);chk(q.steps[1].items[0].ok,tag+' gap');break;
 case 'quad':var p=v.ps,pp=(par(p[0],p[1],p[3],p[2])?1:0)+(par(p[1],p[2],p[0],p[3])?1:0),s=[0,1,2,3].map(function(k){return cm(p[k],p[(k+1)%4])}),eq=s.every(function(x){return Math.abs(x-s[0])<0.05}),ra=[0,1,2,3].every(function(k){return Math.abs(angAt(p,k)-90)<0.5});
  var name=pp===1?'台形':pp===2?(ra?(eq?'正方形':'長方形'):(eq?'ひし形':'平行四辺形')):'?';chk(strip(v.ans)===name,tag+' '+name);break;
 case 'pgside':chk(cm(v.ps[2],v.ps[3])===v.ans&&par(v.ps[0],v.ps[1],v.ps[3],v.ps[2])&&par(v.ps[1],v.ps[2],v.ps[0],v.ps[3]),tag);break;
 case 'pgangC':chk(Math.round(angAt(v.ps,2))===v.ans,tag+' '+angAt(v.ps,2));break;
 case 'pgangB':chk(Math.round(angAt(v.ps,1))===v.ans,tag+' '+angAt(v.ps,1));break;
 case 'rhper':var s4=[0,1,2,3].map(function(k){return cm(v.ps[k],v.ps[(k+1)%4])});chk(s4.every(function(x){return x===s4[0]})&&s4[0]*4===v.ans,tag+' '+s4);break;
 case 'prot':chk(v.ans===v.deg,tag);chk(strip(q.steps[1].ch[0]).indexOf(v.base==='r'?'外':'内')>=0,tag+' scale');break;
 case 'line':chk(v.given+v.ans===180,tag);break;case 'turn':chk(v.given+v.ans===360,tag);break;
 case 'setsq':chk([30,45,60].indexOf(v.a1)>=0&&[30,45,60].indexOf(v.a2)>=0&&v.ans===v.a1+v.a2,tag);break;
 case 'ndiag':chk(v.n*(v.n-3)/2===v.ans,tag);break;
 case 'rectdiag':chk(cm(v.ps[1],v.ps[3])===v.ans&&cm(v.ps[0],v.ps[2])===v.ans,tag);break;
 case 'rhdiag':chk(perp(v.ps[0],v.ps[2],v.ps[1],v.ps[3])&&q.steps[0].items[0].ok,tag);break;
 case 'pgdiag':var O=[(v.ps[0][0]+v.ps[2][0])/2,(v.ps[0][1]+v.ps[2][1])/2],O2=[(v.ps[1][0]+v.ps[3][0])/2,(v.ps[1][1]+v.ps[3][1])/2];chk(L(sub(O,O2))<1e-9&&Math.abs(L(sub(O,v.ps[0]))/30-v.ans)<0.05,tag);break;
 case 'shape2':var nm=(v.curve||v.gap)?'どちらでもない':v.n===3?'三角形':v.n===4?'四角形':'?';chk(strip(v.ans)===nm,tag+' '+nm);break;
 case 'rect2':var n=v.ps.length,rs=v.ps.map(function(_,k){return Math.abs(angAt(v.ps,k)-90)<0.5}),nr=rs.filter(Boolean).length,sd=v.ps.map(function(_,k){return cm(v.ps[k],v.ps[(k+1)%n])});
  var nm2=n===3?(nr===1?'直角三角形':'三角形（直角なし）'):(nr===4?(sd.every(function(x){return x===sd[0]})?'正方形':'長方形'):'どちらでもない');chk(strip(v.ans)===nm2,tag+' '+nm2);
  chk(q.steps[0].items.filter(function(x){return x.ok}).length===nr,tag+' sqcheck');break;
 case 'count':chk(v.ps.length===v.ans,tag);break;
 case 'right':var nr2=v.ps.filter(function(_,k){return Math.abs(angAt(v.ps,k)-90)<0.5}).length;chk(nr2===v.ans&&q.steps[1].items.filter(function(x){return x.ok}).length===nr2,tag+' '+nr2);break;
 case 'faces':chk(v.ans===6,tag);break;case 'boxedges':chk(v.n===4&&v.ans===4,tag);break;
 default:err.push('unknown '+tag)}
 // 最後の答え
 var last=q.steps[q.steps.length-1];if(last.t==='num')chk(Math.abs(last.ans-q.ans)<1e-9||typeof q.ans!=='number',tag+' last');
 // 漢字
 JSON.stringify(q.steps)+q.q;[q.q].concat(q.steps.map(function(s){return s.x+(s.ch||[]).join('')+(s.unit||'')+(s.items||[]).map(function(x){return x.b+x.res}).join('')+JSON.stringify(s.lab||{})})).forEach(function(t){var o=t.replace(/\{[^|}]+\|[^}]+\}/g,'');(o.match(/[\u4e00-\u9fff]/g)||[]).forEach(function(c){if((KANJI_GRADE[c]||7)>1)err.push(tag+' kanji '+c)})});
 if(/[\u4e00-\u9fff]/.test(q.svg.replace(/<[^>]+>/g,'')))err.push(tag+' kanji in svg');
});console.log(g,GEO[g].length,'problems')});
console.log(err.length?err:'ALL OK');process.exit(err.length?1:0);
