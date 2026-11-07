/* The first three scenes of the lecture, built from the sketched line illustrations.
   Each illustration draws itself along its lines (order maps from tools/reveal_map.py), then moves. */
(()=>{
"use strict";
const A=window.STORY_ASSETS,IL=window.ILLUS;
const clamp=x=>Math.min(1,Math.max(0,x)),ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,easeO=t=>1-Math.pow(1-t,3);
const seg=(t,a,b)=>clamp((t-a)/(b-a)),lerp=(a,b,u)=>a+(b-a)*u;
const INK=[28,28,32],TYPE="#3B3B3D";

/* ---------- illustration layers ---------- */
const LAY={};
function loadLayer(key){return new Promise(res=>{const im=new Image();im.onload=()=>{const c=document.createElement("canvas");c.width=im.width;c.height=im.height;
  const g=c.getContext("2d",{willReadFrequently:true});g.drawImage(im,0,0);const d=g.getImageData(0,0,c.width,c.height).data,n=c.width*c.height;
  const order=new Float32Array(n),ink=new Uint8Array(n);for(let i=0;i<n;i++){order[i]=(d[i*4]*256+d[i*4+1])/65535;ink[i]=d[i*4+2];}
  const out=document.createElement("canvas");out.width=c.width;out.height=c.height;const og=out.getContext("2d");
  LAY[key]={w:c.width,h:c.height,order,ink,canvas:out,g:og,img:og.createImageData(c.width,c.height),p:-1};res();};im.src=IL[key];});}
function layerAt(key,p){const L=LAY[key];p=Math.round(clamp(p)*2000)/2000;if(L.p===p)return L.canvas;L.p=p;
  const px=L.img.data,o=L.order,k=L.ink,soft=.012,n=L.w*L.h;
  for(let i=0;i<n;i++){const j=i*4;let a=0;if(k[i]){const v=(p-o[i])/soft+1;a=v<=0?0:v>=1?k[i]:k[i]*v;}px[j]=INK[0];px[j+1]=INK[1];px[j+2]=INK[2];px[j+3]=a;}
  L.g.putImageData(L.img,0,0);return L.canvas;}
/* follow the ink of a horizontal line (e.g. the heartbeat) from x0 to x1, starting near row y0 */
function traceLine(key,x0,x1,y0,win=40){const L=LAY[key],pts=[];let y=Math.round(y0*L.h);
  for(let x=Math.round(x0*L.w);x<=Math.round(x1*L.w);x+=3){let best=-1,bd=1e9;for(let dy=-win;dy<=win;dy++){const yy=y+dy;if(yy<0||yy>=L.h)continue;const v=L.ink[yy*L.w+x];if(v>90&&Math.abs(dy)<bd){bd=Math.abs(dy);best=yy;}}
    if(best>=0)y=best;pts.push([x/L.w,y/L.h]);}return pts;}

/* ---------- shots ---------- */
const word=(t,a,o={})=>({t,a,...o});
const pop=(t,t0,d=.7)=>seg(t,t0,t0+d);
const SH=[
  {scene:"חתונה",sub:"16.6.2001",k:"שקף 3",img:"img01",reveal:[0,3.2],dur:7,
    cam:t=>({s:1.02,x:lerp(-.05,.05,seg(t,0,7)),y:Math.abs(Math.sin(t*3.2))*-.008}),
    words:t=>[word("אני זוכרת שחיכיתי לו המון זמן",pop(t,2.6)),word("הוא איחר לאסוף אותי",pop(t,4),{line:1})]},
  {scene:"חתונה",sub:"16.6.2001",k:"שקף 3",img:"img05",alt:"img08",reveal:[0,3.2],dur:8.5,
    mix:t=>t<3.4?0:.5-.5*Math.cos((t-3.4)*Math.PI/.8),flies:{cx:.48,cy:.3,r:.22},
    cam:t=>({s:lerp(1,1.05,seg(t,0,8.5)),x:0,y:0}),
    words:t=>[word("עמדתי לידו בחופה",pop(t,2.8)),word("וגירשתי את המחשבות שלי כמו שמגרשים זבובים",pop(t,4.2),{line:1})]},
  {scene:"חתונה",sub:"16.6.2001",k:"שקף 3",img:"img07",reveal:[0,3],dur:7.5,
    cam:t=>{const j=t>3.4&&t<3.9?Math.sin((t-3.4)*60)*.012*(1-seg(t,3.4,3.9)):0;return{s:1+.03*Math.exp(-Math.max(0,t-3.4)*6)*(t>3.4?1:0),x:j,y:t>3.3&&t<3.6?.01:0};},
    shards:{t0:3.4,x:.44,y:.86},
    words:t=>[word("בזמן שהוא שובר את הכוס",pop(t,3.6)),word("כל מה שעובר לי בראש: זה לא יחזיק מעמד",pop(t,5),{line:1})]},
  {scene:"חתונה",sub:"מריבות · המתנה · שתייה · מחשבות",k:"שקף 3",img:"img03",reveal:[0,3.6],dur:8,flies:{cx:.42,cy:.12,r:.12},
    cam:t=>({s:lerp(1,1.07,seg(t,0,8)),x:0,y:lerp(0,.02,seg(t,0,8))}),
    words:t=>[word("זאת הייתה חתונה כמו כל החתונות",pop(t,3.4))]},
  {scene:"הריון",sub:"נכנסנו להריון שעה אחרי שיצאנו מהחופה",k:"שקף 4",img:"img06",reveal:[0,3.2],dur:7,
    cam:t=>({s:lerp(1.04,1,seg(t,0,7)),x:0,y:Math.sin(t*1.3)*.004}),
    words:t=>[word("וכמו שזה קרה מהר, הוא יצא מהר. מהר מדי.",pop(t,3.4))]},
  {scene:"חודשיים בפגייה",sub:"קילו 600 · שבוע 31",k:"שקף 4",img:"img10",reveal:[0,3.4],dur:10,pulse:{y:.638},
    cam:t=>({s:1+.012*Math.sin(t*2.4)*seg(t,3.4,4),x:0,y:0}),
    words:t=>[word("היפרדות שלייה. ניתוח קיסרי.",pop(t,3)*(1-seg(t,5.8,6.2))),word("מדי פעם הוא היה מפסיק לנשום",pop(t,6.3)),word("חודשיים בפגייה, הולכים ובאים",pop(t,7.8),{line:1})]},
  {scene:"עצמתי עיניים",sub:"אני רוצה להאמין שדברים יסתדרו...",k:"שקף 6",img:"img09",crop:[0,0,1,.5],altCrop:[0,.5,1,1],reveal:[0,3],dur:8.5,
    mix:t=>{const b=(c,w=.18)=>Math.max(0,1-Math.abs(t-c)/w);return Math.max(b(3.8),b(4.6),seg(t,5.6,6.4));},
    cam:t=>({s:lerp(1,1.04,seg(t,0,8.5)),x:0,y:0}),
    words:t=>[word("כשהראש והלב לא מבינים",pop(t,5.4)),word("אז הגוף מנסה לדבר",pop(t,6.4),{line:1})]},
  {scene:"הגוף שילם את המחיר",sub:"",k:"שקף 6",img:"img14",reveal:[0,3.6],dur:9,
    cam:t=>({s:lerp(1,1.06,seg(t,0,9)),x:lerp(0,-.02,seg(t,0,9)),y:0}),
    words:t=>{const n=(a,b,t0,t1)=>Math.round(lerp(a,b,easeO(seg(t,t0,t1))));return[word(`${n(1,14,3.2,5.4)} הפריות · ${n(1,28,4,6.2)} החזרות`,pop(t,3.2)),word("6 זריקות ביום",pop(t,6.6),{line:1})];}},
  {scene:"והוא שם",sub:"לא עוזב לרגע",k:"שקף 6",img:"img12",reveal:[0,3.6],dur:7.5,
    cam:t=>({s:lerp(1.05,1,seg(t,0,7.5)),x:0,y:0}),
    words:t=>[word("גם אם פספס ימים שלמים בעבודה",pop(t,3.6)),word("גם כשאיימו לפטר אותו",pop(t,4.8),{line:1})]},
  {scene:"והוא שם",sub:"לא עוזב לרגע",k:"שקף 6",img:"img15",reveal:[0,3.2],dur:8.5,
    cam:t=>({s:lerp(1,1.06,seg(t,0,8.5)),x:0,y:0}),
    words:t=>[word("מטפל בי, מקלח אותי, מכין לי אוכל",pop(t,3.4))]},
];
const XF=1.0;let acc=0;SH.forEach(s=>{s.t0=acc;acc+=s.dur;});const TOTAL=acc+.8;

/* ---------- renderer ---------- */
const cv=document.getElementById("film"),g=cv.getContext("2d");
const plate=new Image();plate.src=A.plate;
function layout(){const W=cv.width,H=cv.height,port=H>W,m=Math.min(W,H);
  return port?{W,H,port,m,box:[-W*.2,H*.2,W*1.2,H*.66],wordY:H*.74}:{W,H,port,m,box:[W*.05,H*.2,W*.95,H*.86],wordY:H*.905};}
function bg(L){g.fillStyle="#fff";g.fillRect(0,0,L.W,L.H);if(plate.complete&&plate.naturalWidth){const s=Math.max(L.W/plate.naturalWidth,L.H/plate.naturalHeight),w=plate.naturalWidth*s,h=plate.naturalHeight*s;g.drawImage(plate,0,L.H-h,w,h);}}
function place(L,s,crop){const [cx0,cy0,cx1,cy1]=crop||[0,0,1,1],La=LAY[s.img],sw=(cx1-cx0)*La.w,sh=(cy1-cy0)*La.h,[bx0,by0,bx1,by1]=L.box,bw=bx1-bx0,bh=by1-by0;
  const sc=Math.min(bw/sw,bh/sh);return{sx:cx0*La.w,sy:cy0*La.h,sw,sh,dw:sw*sc,dh:sh*sc,cx:(bx0+bx1)/2,cy:(by0+by1)/2};}
function drawLayer(L,s,key,crop,p,alpha,cam){const pl=place(L,s,crop),c=layerAt(key,p),z=cam.s,w=pl.dw*z,h=pl.dh*z,x=pl.cx-w/2+cam.x*pl.dw,y=pl.cy-h/2+cam.y*pl.dh;
  if(alpha<=0)return pl;g.save();g.globalAlpha=alpha;g.drawImage(c,pl.sx,pl.sy,pl.sw,pl.sh,x,y,w,h);g.restore();return{...pl,x,y,w,h};}
const toScreen=(r,u,v)=>[r.x+u*r.w,r.y+v*r.h];
function flies(L,r,f,t,a){g.save();g.globalAlpha=a;g.strokeStyle="#1C1C20";g.fillStyle="#1C1C20";g.lineWidth=Math.max(1,L.m/900);
  for(let k=0;k<4;k++){const ph=k*1.7,u=f.cx+f.r*Math.cos(t*(1.1+k*.23)+ph)*.9,v=f.cy+f.r*.55*Math.sin(t*(1.6+k*.19)+ph*1.3),[x,y]=toScreen(r,u,v),s=L.m*.007,fl=Math.abs(Math.sin(t*38+k))*.8+.2;
    g.beginPath();g.ellipse(x,y,s*.55,s*.32,0,0,Math.PI*2);g.fill();g.beginPath();g.ellipse(x-s*.35,y-s*.55,s*.45,s*.8*fl,-.5,0,Math.PI*2);g.ellipse(x+s*.35,y-s*.55,s*.45,s*.8*fl,.5,0,Math.PI*2);g.stroke();}g.restore();}
function shards(L,r,sd,t){const v=t-sd.t0;if(v<0||v>2.6)return;g.save();g.strokeStyle="#1C1C20";g.lineWidth=Math.max(1,L.m/800);g.globalAlpha=1-seg(v,1.6,2.6);
  for(let k=0;k<9;k++){const a=-Math.PI*(.1+.8*k/8),d=easeO(clamp(v/.7))*(.06+.05*(k%3)),u=sd.x+Math.cos(a)*d,w=sd.y+Math.sin(a)*d*.7+.06*Math.max(0,v-.4)**2,[x,y]=toScreen(r,u,w),s=L.m*.008,rot=k+v*6;
    g.beginPath();for(let q=0;q<3;q++){const aa=rot+q*2.1;g[q?"lineTo":"moveTo"](x+Math.cos(aa)*s,y+Math.sin(aa)*s*.7);}g.closePath();g.stroke();}
  if(v<.35){g.globalAlpha=(1-v/.35)*.6;const[x,y]=toScreen(r,sd.x,sd.y);g.beginPath();for(let k=0;k<8;k++){const a=k/8*Math.PI*2;g.moveTo(x+Math.cos(a)*L.m*.02,y+Math.sin(a)*L.m*.014);g.lineTo(x+Math.cos(a)*L.m*.045,y+Math.sin(a)*L.m*.03);}g.stroke();}g.restore();}
let PULSE=null;
function pulse(L,r,s,t){if(t<3.6)return;if(!PULSE){const a=traceLine("img10",.0,.33,s.pulse.y),b=traceLine("img10",.7,1,s.pulse.y);PULSE=[a,b];}
  const per=2.2,ph=((t-3.6)%per)/per,stop=t>6.3&&t<7.6;if(stop)return;
  g.save();for(const path of PULSE){const i=Math.floor(ph*(path.length-1)),tail=14;for(let k=Math.max(0,i-tail);k<=i;k++){const[x,y]=toScreen(r,path[k][0],path[k][1]);g.globalAlpha=(1-(i-k)/tail)*.9;g.fillStyle="#2AA7CF";g.beginPath();g.arc(x,y,L.m*.0055*(1-(i-k)/tail*.6),0,Math.PI*2);g.fill();}}g.restore();}
function wrap(text,maxW){if(g.measureText(text).width<=maxW)return[text];const w=text.split(" ");let best=[text],bd=1e9;
  for(let i=1;i<w.length;i++){const a=w.slice(0,i).join(" "),b=w.slice(i).join(" "),d=Math.max(g.measureText(a).width,g.measureText(b).width);if(d<bd){bd=d;best=[a,b];}}return best;}
function caption(L,s,a){if(a<=0)return;const m=L.m;g.save();g.globalAlpha=a;g.fillStyle=TYPE;g.direction="rtl";g.textBaseline="alphabetic";
  const fs=Math.round(m*(L.port?.075:.07));g.font=`800 ${fs}px Assistant, Arial, sans-serif`;const x=L.port?L.W/2:L.W*.95,y0=L.port?L.H*.1:L.H*.115;g.textAlign=L.port?"center":"right";
  g.fillText(s.scene,x,y0);if(s.sub){const ss=Math.round(m*.036);g.font=`600 ${ss}px Assistant, Arial, sans-serif`;g.globalAlpha=a*.85;wrap(s.sub,L.port?L.W*.9:L.W*.6).forEach((ln,j)=>g.fillText(ln,x,y0+fs*.72+j*ss*1.2+ss*.2));}g.restore();}
function words(L,ws,fade){g.save();g.fillStyle=TYPE;g.direction="rtl";g.textAlign="center";g.textBaseline="middle";const fs=Math.round(L.m*(L.port?.044:.042));
  ws.forEach(w=>{const a=(w.a??1)*fade;if(a<=0)return;g.globalAlpha=a;g.font=`${w.line?600:800} ${fs}px Assistant, Arial, sans-serif`;
    wrap(w.t,L.W*.88).forEach((ln,j,arr)=>g.fillText(ln,L.W/2,L.wordY+(w.line||0)*fs*1.35+(j-(arr.length-1)/2)*fs*1.15));});g.restore();}
function shotIndex(t){for(let i=SH.length-1;i>=0;i--)if(t>=SH[i].t0)return i;return 0;}
function drawShot(L,s,lt,fade){
  const cam=s.cam?s.cam(lt):{s:1,x:0,y:0},p=s.reveal?ease(seg(lt,s.reveal[0],s.reveal[1])):1,mix=s.mix?s.mix(lt):0;
  let r=null;
  if(s.alt||s.altCrop){r=drawLayer(L,s,s.img,s.crop,p,fade*(1-mix),cam);drawLayer(L,s,s.alt||s.img,s.altCrop||s.crop,1,fade*mix,cam);}
  else r=drawLayer(L,s,s.img,s.crop,p,fade,cam);
  if(s.flies)flies(L,r,s.flies,lt,fade*seg(lt,s.reveal[1]-.6,s.reveal[1]+.4));
  if(s.shards)shards(L,r,s.shards,lt);
  if(s.pulse)pulse(L,r,s,lt);
  return r;}
function renderAt(t){const L=layout();bg(L);t=Math.min(Math.max(0,t),TOTAL-1e-4);
  const i=shotIndex(t),s=SH[i],lt=t-s.t0,prev=SH[i-1];
  if(prev&&lt<XF){const f=1-seg(lt,0,XF);drawShot(L,prev,prev.dur+lt,f);words(L,prev.words?prev.words(prev.dur):[],f);if(prev.scene!==s.scene||prev.sub!==s.sub)caption(L,prev,f);}
  drawShot(L,s,lt,seg(lt,0,.25));
  const capIn=prev&&prev.scene===s.scene&&prev.sub===s.sub?1:seg(lt,.3,1);caption(L,s,capIn*(1-seg(t,TOTAL-.8,TOTAL)));
  words(L,s.words?s.words(lt):[],1-seg(t,TOTAL-.8,TOTAL));
  return i;}

/* ---------- page controls ---------- */
const RATIOS={"16:9":[1920,1080],"9:16":[1080,1920]};
let t0=null,paused=false,pauseT=0,cur=-1,ready=false;
const board=document.getElementById("board"),fmt=x=>`${Math.floor(x/60)}:${String(Math.floor(x%60)).padStart(2,"0")}`;
SH.forEach((s,i)=>{const b=document.createElement("button");b.type="button";b.className="scene";b.innerHTML='<span class="n"></span><span class="c"></span><span class="k"></span>';
  b.querySelector(".n").textContent=String(i+1).padStart(2,"0");b.querySelector(".c").textContent=s.scene;b.querySelector(".k").textContent=`${s.k} · ${s.img}.png · ${fmt(s.t0)}`;
  b.onclick=()=>seek(s.t0+.01);board.appendChild(b);});
function seek(t){pauseT=t;t0=null;if(paused)draw(t);}
function draw(t){if(!ready)return;const i=renderAt(t);document.getElementById("time").textContent=`${fmt(t)} / ${fmt(TOTAL)}`;if(i!==cur){cur=i;[...board.children].forEach((c,k)=>c.setAttribute("aria-current",String(k===i)));}}
function loop(now){if(!paused){if(t0==null)t0=now-pauseT*1000;let t=(now-t0)/1000;if(t>TOTAL){t0=now;t=0;}pauseT=t;draw(t);}requestAnimationFrame(loop);}
document.getElementById("play").onclick=()=>{paused=false;seek(0);document.getElementById("pause").textContent="השהה";};
document.getElementById("pause").onclick=e=>{paused=!paused;t0=null;e.target.textContent=paused?"המשך":"השהה";};
const rg=document.getElementById("ratio");
for(const[k,lab]of[["16:9","מסך הרצאה 16:9"],["9:16","רילס 9:16"]]){const c=document.createElement("button");c.type="button";c.className="chip";c.textContent=lab;
  c.setAttribute("aria-pressed",String(k==="16:9"));c.onclick=()=>{[cv.width,cv.height]=RATIOS[k];[...rg.children].forEach(x=>x.setAttribute("aria-pressed",String(x===c)));if(paused)draw(pauseT);};rg.appendChild(c);}
const loaded=Promise.all([...Object.keys(IL).map(loadLayer),new Promise(r=>plate.complete?r():(plate.onload=plate.onerror=r))]).then(()=>{ready=true;});
window.Story={renderAt,TOTAL,SCENES:SH.map(s=>({t0:s.t0,in:0,dur:s.dur,out:0})),setRatio:k=>{[cv.width,cv.height]=RATIOS[k];},canvas:cv,ready:()=>loaded};
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>loaded).then(()=>{if(matchMedia("(prefers-reduced-motion: reduce)").matches){paused=true;document.getElementById("pause").textContent="המשך";draw(SH[3].t0+7);}requestAnimationFrame(loop);});
})();
