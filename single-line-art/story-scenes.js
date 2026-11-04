/* The story film: scenes for every slide of the lecture, the renderer and the page controls. */
(()=>{
"use strict";
const A=window.STORY_ASSETS,F=window.FIGURES,I=F.I;
/* ---------- math ---------- */
const clamp=x=>Math.min(1,Math.max(0,x)),ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,easeO=t=>1-Math.pow(1-t,3);
const seg=(t,a,b)=>clamp((t-a)/(b-a)),lerp=(a,b,u)=>a+(b-a)*u;
const N=4200;
function resample(pts,n){const cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+(pts[i][2]?1e-6:Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1])));
  const L=cum[cum.length-1]||1,o=[];let j=0;for(let i=0;i<n;i++){const t=L*i/(n-1);while(j<cum.length-2&&cum[j+1]<t)j++;const s=cum[j+1]-cum[j]||1,u=(t-cum[j])/s;
  o.push([pts[j][0]+(pts[j+1][0]-pts[j][0])*u,pts[j][1]+(pts[j+1][1]-pts[j][1])*u,(u>0&&pts[j+1][2])?1:0]);}return o;}
function blend(a,b,e,n=N){const A_=a.length===n?a:resample(a,n),B_=b.length===n?b:resample(b,n);return A_.map((p,k)=>[lerp(p[0],B_[k][0],e),lerp(p[1],B_[k][1],e),e<.5?p[2]:B_[k][2]]);}
function samplePath(d,n){const svg=document.createElementNS("http://www.w3.org/2000/svg","svg"),p=document.createElementNS("http://www.w3.org/2000/svg","path");
  p.setAttribute("d",d);svg.appendChild(p);svg.style.cssText="position:absolute;width:0;height:0;visibility:hidden";document.body.appendChild(svg);
  const L=p.getTotalLength(),o=[];for(let i=0;i<=n;i++){const q=p.getPointAtLength(L*i/n);o.push([q.x/1000,q.y/1000,0]);}svg.remove();return o;}
function fig(pts,{maxW=2.4,groundAt,scale=1}={}){let a=1e9,b=1e9,c=-1e9,e=-1e9;for(const[x,y]of pts){a=Math.min(a,x);b=Math.min(b,y);c=Math.max(c,x);e=Math.max(e,y);}
  if(groundAt!=null)e=groundAt;const s=scale*Math.min(1/(e-b||1),maxW/(c-a||1)),cx=(a+c)/2;let o=pts.map(([x,y,f])=>[(x-cx)*s,1-(e-y)*s,f||0]);
  if(o[0][1]<.999)o=[[o[0][0],1,0],...o];const l=o[o.length-1];if(l[1]<.999)o.push([l[0],1,0]);return o;}
const unpack=f=>{const o=[];for(let i=0;i<f.length;i+=3)o.push([f[i]/1e4,f[i+1]/1e4,f[i+2]]);return o;};
const join=(...parts)=>{const o=[];for(const p of parts){if(!p||!p.length)continue;if(o.length){const l=o[o.length-1];o.push([l[0],1,0],[p[0][0],1,0]);}o.push(...p);}return o;};
const P=F.T,rect=(...a)=>F.out(F.rect(...a));
const woman=(o={})=>F.person({dress:.74,hair:"long",...o}),man=(o={})=>F.person({dress:null,hair:"short",broad:1.15,...o});
const walkW=(u,x0,x1,s=1,o={})=>F.walkAcross(u,x0,x1,{hair:"long",dress:.74,...o},s),walkM=(u,x0,x1,s=1,o={})=>F.walkAcross(u,x0,x1,{hair:"short",dress:null,broad:1.12,...o},s);
const flat=()=>[[-.2,1,0],[.2,1,0]];

/* ---------- deck illustrations and drawn faces ---------- */
const illusFit=(raw,scale,tear)=>{const pts=unpack(raw);let a=1e9,b=1e9,c=-1e9;for(const[x,y]of pts){a=Math.min(a,x);b=Math.min(b,y);c=Math.max(c,x);}
  const s=scale/(1-b);return{pts:fig(pts,{groundAt:1,scale}),tear:[(tear[0]-(a+c)/2)*s,1-(1-tear[1])*s]};};
const CPL=illusFit(A.couple,1.1,[.875,.42]),SIT=illusFit(A.sitting,1.15,[.28,.64]);
const COUPLE=CPL.pts,SITTING=SIT.pts;
const FACE_CLOSED="M 230 950 C 220 820 190 680 205 540 C 225 360 320 200 490 175 C 660 155 790 270 795 440 C 800 600 720 740 590 785 C 540 802 470 800 430 775 C 360 730 320 640 318 540 C 320 490 340 465 365 458 C 390 495 430 495 455 460 C 480 470 495 500 500 540 C 505 575 480 595 492 610 C 505 625 535 622 550 606 C 565 570 555 500 545 462 C 570 497 615 497 640 458 C 650 520 620 620 572 668 C 545 650 520 648 500 660 C 480 648 455 650 428 668 C 460 705 540 705 572 668 C 620 700 700 760 760 950";
const FACE_OPEN="M 230 950 C 220 820 190 680 205 540 C 225 360 320 200 490 175 C 660 155 790 270 795 440 C 800 600 720 740 590 785 C 540 802 470 800 430 775 C 360 730 320 640 318 540 C 320 490 340 465 362 458 C 385 428 432 428 455 458 C 432 484 385 484 362 458 C 380 470 395 470 401 460 A 10 10 0 1 1 421 460 A 10 10 0 1 1 401 460 C 430 472 450 470 458 462 C 482 472 495 500 500 540 C 505 575 480 595 492 610 C 505 625 535 622 550 606 C 565 570 555 500 547 460 C 570 428 617 428 640 458 C 617 484 570 484 547 460 C 565 472 580 470 586 460 A 10 10 0 1 1 606 460 A 10 10 0 1 1 586 460 C 615 472 632 468 640 458 C 650 520 620 620 572 668 C 545 650 520 648 500 660 C 480 648 455 650 428 668 C 460 705 540 705 572 668 C 620 700 700 760 760 950";
let FACES=null;const faces=()=>FACES||(FACES={closed:fig(samplePath(FACE_CLOSED,900)),open:fig(samplePath(FACE_OPEN,1000))});
function pulse(x0,x1,shift,flatFrom=1e9,flatTo=-1e9){const o=[];for(let x=x0;x<=x1;x+=.004){const ph=((x+shift)%1+1)%1,d=ph-.5;let y=1;
  if(Math.abs(d)<.12&&!(x+shift>flatFrom&&x+shift<flatTo)){const u=d/.12;y-=.7*Math.exp(-(((u+.15)*6)**2))-.25*Math.exp(-(((u-.25)*7)**2));}o.push([x,y,0]);}return o;}
function fall(){const p=[];for(let x=-1.4;x<=-.35;x+=.004)p.push([x,1,0]);
  for(let i=1;i<=200;i++){const u=i/200;p.push([-.35+u*.12,1+Math.pow(u,1.6)*.55,0]);}
  for(let i=1;i<=100;i++){const u=i/100;p.push([-.23+u*.1,1.55+Math.sin(u*Math.PI*4)*.02,0]);}
  for(let i=1;i<=300;i++){const u=i/300;p.push([-.13+u*1.3,1.55-(1-Math.cos(u*Math.PI/2))*.55,0]);}return p;}
function wallBricks(rows,w=1.1,h=.11,x0=0){const o=[];for(let r=0;r<rows;r++){const y=1-(r+1)*h,n=Math.max(3,Math.round(w/.27)),bw=w/n,off=r%2?bw/2:0;
  for(let i=0;i<=n;i++){const xa=x0+Math.max(0,i*bw-off),xb=x0+Math.min(w,(i+1)*bw-off);if(xb-xa<.02)continue;o.push({r,pts:rect(xa,y,xb-xa,h)});}}return o;}

/* ---------- overlay helpers ---------- */
const INK="#1C1C1E",TYPE="#3B3B3D",WATER="#2AA7CF",RASP="#B0174F",FLAME="#E8A93B";
const ic=(name,x,y,s,p=1,a=1,extra={})=>({pts:typeof name==="string"?I[name]():name,x,y,s,p,a,...extra});
const word=(t,x,y,a,o={})=>({t,x,y,a,...o});
const pop=(t,t0,d=.7)=>seg(t,t0,t0+d);
function tearFx(t,t0,at,n,out){for(let k=0;k<n;k++){const tt=t-t0-k*1.1;if(tt<0)continue;const fallT=.9;
    if(tt<fallT){const u=tt/fallT;out.push(ic(I.drop(1),at[0]+u*.02,lerp(at[1]+.04,.97,u*u),.045,1,clamp(tt*6)));}
    else{const v=(tt-fallT)/1.6;for(let r=0;r<3;r++){const w=clamp(v*1.4-r*.22);if(w>0&&w<1)out.push(ic(F.arc(0,0,.25*w,.04*w,0,Math.PI*2,40),at[0]+.02,1,1,1,1-w));}}}}
function ripple(t,t0,x,R,out,color){const v=(t-t0)/2.4;for(let r=0;r<3;r++){const w=clamp(v*1.3-r*.2);if(w>0&&w<1)out.push(ic(F.arc(0,0,R*w,R*w*.16,0,Math.PI*2,60),x,1,1,1,1-w,{color}));}}
function sunAt(x,y,r,grow){const o=[ic(F.arc(0,0,r,r,Math.PI,Math.PI*2,50),x,y,1)];for(let k=0;k<13;k++){const a=Math.PI+(k+.5)/13*Math.PI;
  o.push(ic(F.line([(r+.06)*Math.cos(a),(r+.06)*Math.sin(a)],[(r+.06+.18*grow)*Math.cos(a),(r+.06+.18*grow)*Math.sin(a)]),x,y,1,1,grow));}return o;}
const RW=L=>Math.min(L.xr,2.1);

/* ---------- scenes: one or more per slide ---------- */
const SC=[];const S=o=>SC.push(o);
S({k:"שקף 2",cap:"אנחנו לא יכולים להיות חלק מהסרט",sub:"ולצפות בו מהצד באותו הזמן",dur:9,intro:"start",
  line:(t,L)=>walkW(easeO(seg(t,.5,6.5)),L.xr+.4,.05,1),
  over:(t)=>[ic("frame",.05,.48,1.15,pop(t,0,1.6))],
  words:(t)=>[word("התובנות באות רק בדיעבד",0,-.12,pop(t,6.5),{size:1.15})]});
S({k:"שקף 2",cap:"והחיים שלנו היו כמו סרט",sub:"נפגשנו בסיני. הייתי בת 18",dur:9,
  line:(t,L)=>{const u=easeO(seg(t,0,5.5));return join(walkW(u,-L.xr-.3,-.17,1),walkM(u,L.xr+.3,.17,1.05));},
  over:(t)=>[ic(I.heart(1.3),0,-.17,1,pop(t,5.5,1.2))],
  words:(t,L)=>{const R=RW(L);return[word("קסם",-R*.62,.3,pop(t,6.3)),word("מתיקות",0,-.18,pop(t,6.9)),word("נדיבות אין סופית",R*.62,.3,pop(t,7.5))];}});
S({k:"שקף 3",cap:"חתונה",sub:"16.6.2001",dur:13,
  line:(t,L)=>join(P(woman({dress:1,hair:"bun",veil:true}),1,-.3),walkM(easeO(seg(t,1.2,5)),L.xr+.4,.25,1.07)),
  over:(t)=>{const o=[ic("chuppah",0,.45,1.25,pop(t,0,1.4)),ic("hourglass",-.8,.35,.4,pop(t,.8))];
    if(t>5.4)o.push(ic("bottle",.68,.62,.5,pop(t,5.4)));
    if(t>7.6){o.push(ic("wineGlass",.05,.88,.3,pop(t,7.6,.4),1-seg(t,9,9.3)));if(t>9)for(let k=0;k<4;k++){const v=seg(t,9,10);o.push(ic("shard",.05+(k-1.5)*.12*v,.9-.1*Math.sin(v*Math.PI)-.02*k,.25,1,1-seg(t,11,12)));}}
    if(t>10)o.push(ic("bubble",-.75,-.05,.9,pop(t,10)));return o;},
  words:(t)=>[word("המתנה",-.8,.12,pop(t,1)),word("מריבות",0,-.3,pop(t,2.5)),word("שתייה",.68,.36,pop(t,5.6)),word("מחשבות",-.75,-.34,pop(t,10)),word("זה לא יחזיק מעמד",-.75,-.06,pop(t,10.6),{size:.62})]});
S({k:"שקף 4",cap:"חודשיים בפגייה",sub:"קילו 600, שבוע 31",dur:11,
  line:(t,L)=>{const sh=t*.35;return[...pulse(-L.xr-.2,-.62,sh,1.2+.35*4,1.2+.35*6.5),...P(F.baby(),.75,0),...pulse(.62,L.xr+.2,sh)];},
  over:(t)=>[ic("incubator",0,.72,.8,pop(t,0,1.2))],
  words:(t,L)=>{const R=RW(L);return[word("היפרדות שלייה",-R*.62,.1,pop(t,1.5)),word("ניתוח קיסרי",R*.62,.1,pop(t,3)),word("מדי פעם הוא מפסיק לנשום",0,-.22,pop(t,5.2),{size:.8})];}});
S({k:"שקף 5",cap:"עד שהזמן עשה את שלו",sub:"והוא סוף סוף קצת גדל",dur:9,
  line:(t,L)=>{const u=seg(t,0,8.5);return join(walkW(u,-L.xr-.3,L.xr*.45,1),walkM(u,-L.xr+.12,L.xr*.45+.42,lerp(.3,.62,u)));}});
S({k:"שקף 6",cap:"עצמתי עיניים",sub:"אני רוצה להאמין שדברים יסתדרו...",dur:6,
  line:()=>faces().closed,
  words:(t)=>[word("כשהראש והלב לא מבינים, אז הגוף מנסה לדבר",0,-.15,pop(t,2.2),{size:.8})]});
S({k:"שקף 6",cap:"הגוף שילם את המחיר",sub:"והוא שם. לא עוזב לרגע.",dur:12,
  line:()=>join(P(F.inBed(),1,-.25),P(F.flipX(F.seated()).reverse(),1,.72)),
  over:(t)=>{const o=[];for(let k=0;k<6;k++)if(t>7+k*.45)o.push(ic("syringe",-.85+k*.3,.08,.42,pop(t,7+k*.45,.4)));return o;},
  words:(t,L)=>{const R=RW(L),n=(a,b,t0,t1)=>Math.round(lerp(a,b,easeO(seg(t,t0,t1))));
    return[word("ניתוח",-R*.75,.3,pop(t,.6)),word("הריון מחוץ לרחם",-R*.25,.3,pop(t,1.4)),word(`${n(1,14,2.2,4.5)} הפריות`,R*.25,.3,pop(t,2.2)),word(`${n(1,28,3.4,6)} החזרות`,R*.75,.3,pop(t,3.4)),word("6 זריקות ביום",-.1,-.14,pop(t,7))];}});
S({k:"שקף 7",cap:"19.1.2009",sub:"כל הסבל היה שווה. שחר ליום חדש נולד!",dur:9,
  line:()=>P(woman({arms:["hold","hold"],item:F.arc(0,.33,.06,.035,0,Math.PI*2,20).map(([x,y])=>[x,y,0])}),1.05,-.35),
  over:(t)=>{const r=easeO(seg(t,.5,6));return sunAt(.6,1-.3*r,.3,r);}});
S({k:"שקף 8",cap:"טיפול זוגי",sub:"נתתי לזה כיסוי, כדי לא להתמודד",dur:11,intro:"draw",drawDur:6.5,illus:true,
  line:(t)=>{const d=.22*ease(seg(t,4.5,8));return COUPLE.map(([x,y,f])=>[x<0?x-d:x+d,y,f]);},
  over:(t)=>{const o=[];tearFx(t,.2,[CPL.tear[0]+.22*ease(seg(t,4.5,8)),CPL.tear[1]],3,o);return o;},
  words:(t)=>[word("7 שנים",0,-.2,pop(t,5.5),{size:1.2,w:800}),word("מנסים לגשר. מנסים שיצליח.",0,.0,pop(t,7.5),{size:.75})]});
S({k:"שקף 9",cap:"אלימות סמויה",sub:"",dur:19,
  line:(t,L)=>P(woman({arms:["face","face"]}),lerp(1,.72,seg(t,2,17)),-L.xr*.8),
  over:(t,L)=>{const R=RW(L),c=[-R*.35,R*.25,R*.82],o=[];
    o.push(ic("card",c[0],.42,.55,pop(t,1.2)));
    o.push(ic("insult",c[1],.1,.5,pop(t,4)),ic("silence",c[1],.44,.55,pop(t,5.4)),ic("eye",c[1],.76,.5,pop(t,6.8)));
    o.push(ic("curse",c[2],.1,.5,pop(t,9)),ic("bolt",c[2],.45,.4,pop(t,10.4)));
    if(t>11.8){const v=easeO(seg(t,11.8,13));o.push(ic("plate",lerp(c[2]+.3,-R*.55,v),lerp(.6,.85,v)-.25*Math.sin(v*Math.PI),.5,1,1-seg(t,13,13.2),{rot:v*4}));
      if(t>13)for(let k=0;k<5;k++){const w=easeO(seg(t,13,14));o.push(ic("shard",-R*.55+(k-2)*.13*w,.88-.12*Math.sin(w*Math.PI)*(k%2+1),.3,1,1-seg(t,17,18),{rot:k+w*3}));}}
    return o;},
  words:(t,L)=>{const R=RW(L),c=[-R*.35,R*.25,R*.82];return[
    word("כלכלית",c[0],-.2,pop(t,.6),{size:1.15,w:800}),word("כרטיס אשראי",c[0],.68,pop(t,1.6)),
    word("רגשית",c[1],-.2,pop(t,3.4),{size:1.15,w:800}),word("עלבונות",c[1],.31,pop(t,4.3),{size:.8}),word("שתיקות",c[1],.64,pop(t,5.7),{size:.8}),word("מבטים",c[1],.93,pop(t,7.1),{size:.8}),
    word("מילולית",c[2],-.2,pop(t,8.4),{size:1.15,w:800}),word("קללות",c[2],.31,pop(t,9.3),{size:.8}),word("התפרצויות זעם",c[2],.64,pop(t,10.7),{size:.8}),word("וזריקת חפצים",-R*.55,.62,pop(t,13.2),{size:.8})];}});
S({k:"שקף 9",cap:"מטבח שכור",sub:"מיץ פטל שנשפך, ומספיק מבט",dur:10,
  line:(t,L)=>join(P(woman({arms:["face","down"]}),.8,-L.xr*.62),[[-.1,1,0],[-.1,.55,0],[1.1,.55,0],[1.1,1,0]]),
  over:(t)=>{const tip=ease(seg(t,1.5,2.6)),o=[ic("glass",.45,.42,.4,pop(t,.3),1,{rot:tip*1.4})];
    if(t>2.4)o.push(ic("spill",.62,.5,.6,pop(t,2.4,1.2),1,{color:RASP}));
    for(let k=0;k<4;k++){const dt=t-3.2-k*.5;if(dt>0&&dt<1.2)o.push(ic(I.drop(1),1.05,lerp(.6,.97,(dt/1.2)**2),.04,1,1,{color:RASP}));}
    if(t>5)o.push(ic("eye",.35,-.05,.9,pop(t,5,1.2)));return o;}});
S({k:"שקף 10",cap:"ניקיון · כביסה · סדר",sub:"גבר אידיאלי. ניקה כל יום שישי, מי לא הייתה רוצה?",dur:14,
  line:(t,L)=>P(woman(),.85,-L.xr*.82),
  over:(t,L)=>{const R=RW(L),o=[ic(F.line([-R*.55,.95],[-R*.55,.05],[R*.95,.05],[R*.95,.95]),0,0,1,pop(t,.3,1.5))];
    ["#D7263D","#F46036","#F2B134","#2E9E5B","#1B9CC4","#5B4B8A"].forEach((c,k)=>{if(t>2+k*.6)o.push(ic("shirt",-R*.4+k*(R*1.25/5),.22,1.25,pop(t,2+k*.6,.5),1,{color:c}));});
    o.push(ic("mop",-R*.25,.62,.7,pop(t,7)),ic("bucket",-R*.08,.84,.5,pop(t,7.4)),ic("table",R*.6,.7,.75,pop(t,10)));return o;},
  words:(t,L)=>{const R=RW(L);return[word("כביסה לפי צבעים",R*.25,.48,pop(t,5)),word("ניקיון",-R*.15,.42,pop(t,7.8)),word("סדר: שולחן עגול",R*.6,.36,pop(t,10.5))];}});
S({k:"שקף 11",cap:"נסיעה לחו״ל",sub:"ניעור המיטה",dur:8,
  line:(t,L)=>P(woman(),1,-L.xr*.5),
  over:(t)=>{const o=[];for(let k=0;k<8;k++)if(t>.6+k*.5)o.push(ic(rect(-.25,-.03,.5,.06),.6+(k%2)*.03,.94-k*.07-(1-easeO(pop(t,.6+k*.5,.5)))*.6,1,1,pop(t,.6+k*.5,.3)));return o;}});
S({k:"שקף 12",cap:"האסימון נופל לי",sub:"1.9.2010",dur:12,
  line:(t,L)=>join(P(woman(),1,-.45),walkM(easeO(seg(t,3.5,7)),L.xr+.3,.35,.58)),
  over:(t)=>{const v=seg(t,.4,2.2),y=v<.75?lerp(-.6,.92,(v/.75)**2):.92-Math.sin((v-.75)/.25*Math.PI)*.12;
    return[ic("token",-.05,y,.45,1,1-seg(t,10.5,11.5),{rot:v*6}),ic("bubble",.62,0,1.15,pop(t,7.4))];},
  words:(t)=>[word("״אמא, את צריכה להתגרש מאבא״",.62,-.02,pop(t,7.8),{size:.72}),word("הבן שלי, בן 8",.35,.28,pop(t,7),{size:.65})]});
S({k:"שקף 13",cap:"פחדים ועכבות",sub:"כל הפחדים צמחו כמו חומה",dur:15,
  line:(t,L)=>P(woman(),.75,-L.xr*.82),
  over:(t,L)=>{const R=RW(L),b=wallBricks(6,R*1.35,.13,-R*.45);return b.filter(q=>t>.5+q.r*2.2).map(q=>ic(q.pts,0,0,1,pop(t,.5+q.r*2.2,.5)));},
  words:(t,L)=>{const R=RW(L),x=-R*.45+R*1.35/2;return["פחד כלכלי","״גרושה״: מה יגידו עליי","להיות לבד","איך הילדים יתמודדו","שהמשפחה לא תקבל אותי","פחד ממנו"].map((s,i)=>word(s,x,1-(i+.5)*.13,pop(t,1+i*2.2),{size:.6,w:800}));}});
S({k:"שקף 14",cap:"הבנתי שאני רוצה לעצמי יותר מזה",sub:"שאני יכולה שיהיו חיים טובים יותר",dur:9,
  line:(t,L)=>walkW(easeO(seg(t,1,7.5)),-L.xr*.82,.12,.75),
  over:(t,L)=>{const R=RW(L),o=wallBricks(6,R*1.35,.13,-R*.45).map(q=>ic(q.pts,0,0,1,1,1-.65*seg(t,3,5)));
    const d=ease(seg(t,1,3));o.push(ic(rect(.03,.25,.28*d+.001,.75),0,0,1,1));
    for(let k=0;k<7;k++){const a=-Math.PI/2+(k-3)*.28;o.push(ic(F.line([.17+.2*Math.cos(a),.6+.25*Math.sin(a)],[.17+.36*Math.cos(a),.6+.45*Math.sin(a)]),0,0,1,pop(t,3.4+k*.12),1-seg(t,8,9)));}return o;}});
S({k:"שקף 15",cap:"פַּחַד",sub:"עשרה חודשים באותו בית, בלי לדבר",dur:13,
  line:()=>join(P(woman(),.55,-.17),P(man(),.58,.17)),
  over:(t,L)=>{const R=RW(L);return[ic("houseSplit",0,.55,1.05,pop(t,0,1.4)),ic("calendar",R*.75,.2,.6,pop(t,7))];},
  words:(t,L)=>{const R=RW(L),m=Math.round(lerp(1,10,easeO(seg(t,7.5,11))));return[word("עזרה מחבר",-R*.78,.05,pop(t,1.2),{size:.75}),word("גישור",-R*.78,.3,pop(t,2.4),{size:.75}),word("פסיכיאטרית",-R*.78,.55,pop(t,3.6),{size:.75}),
    word("חיים תחת קורת גג אחת",-R*.78,.8,pop(t,4.8),{size:.75}),word(String(m),R*.75,.25,pop(t,7.5),{size:1.3,w:800}),word("חודשים",R*.75,.62,pop(t,7.5),{size:.75})];}});
S({k:"שקף 16",cap:"יצאתי לחופשי",sub:"30.8.2011 · זהו. הוא חתם.",dur:11,
  line:(t,L)=>{const u=easeO(seg(t,.6,4.5));if(t<4.8)return walkW(u,-L.xr*.75,.15,1);return blend(walkW(1,-L.xr*.75,.15,1),P(woman({arms:["up","up"],dress:.8}),1.05,.15),ease(seg(t,4.8,6.2)));},
  over:(t,L)=>{const o=[ic("house",-L.xr*.75,.55,1.1,1,1-seg(t,3,5))];for(let k=0;k<3;k++){const v=seg(t,6+k*.4,10.5);if(v>0){const fl=Math.sin(t*9+k)*.4;
    o.push(ic(F.line([-.08,0],[-.04,-.03*(1+fl)],[0,0],[.04,-.03*(1+fl)],[.08,0]),.15+(k-1)*.35+v*(k-1)*.6,-.1-v*.5-k*.08,1.4,1,1-seg(t,10,10.8)));}}return o;}});
S({k:"שקף 17",cap:"רק חשבתי",sub:"דווקא הגירושים כבלו אותי אליו יותר ויותר",dur:15,
  line:(t,L)=>{const pull=Math.sin(Math.min(t,9)*2.2)*.05*seg(t,1,2);return F.walkAcross(.5+pull,-L.xr*.78-.25,-L.xr*.78+.25,{hair:"long",dress:.74},.9);},
  over:(t,L)=>{const R=RW(L),o=[],x0=-L.xr*.78;for(let k=0;k<9;k++)o.push(ic(F.arc(0,0,.06,k%2?.022:.035,0,Math.PI*2,20),x0+.1+k*.1,.97,1,pop(t,.4+k*.08,.3)));
    ["bandage","boiler","waves","tire","siren","cross"].forEach((n,i)=>o.push(ic(n,-R*.1+(i%3)*R*.45,i<3?.1:.6,.42,pop(t,2.5+i*1.6))));return o;},
  words:(t,L)=>{const R=RW(L);return["יד שבורה","דוד שהתפוצץ","הצפות מים","פנצ׳רים","משטרה","צו הרחקה"].map((s,i)=>word(s,-R*.1+(i%3)*R*.45,(i<3?.1:.6)+.27,pop(t,2.9+i*1.6),{size:.7}));}});
S({k:"שקף 18",cap:"8.12.2012",sub:"ערב נר ראשון של חנוכה",dur:11,
  line:(t,L)=>P(woman({arms:["down","face"]}),1,-L.xr*.55),
  over:(t,L)=>{const R=RW(L),o=[ic("phone",-R*.05,.45,.8,pop(t,.3)),ic("menorah",R*.62,.58,.85,pop(t,6))];
    if(t>7.2)for(const fx of[R*.62-.28*.85,R*.62]){const fl=Math.sin(t*12+fx)*.012;o.push(ic(I.drop(1),fx,.42+fl,.04,pop(t,7.2),1,{rot:Math.PI,color:FLAME}));}return o;},
  words:(t,L)=>{const R=RW(L),n=Math.round(lerp(0,20,easeO(seg(t,1,4))));return[word(`${n} הודעות`,-R*.05,.2,pop(t,1),{size:.8}),word(`${n} שיחות שלא נענו`,-R*.05,.75,pop(t,2),{size:.8})];}});
S({k:"שקף 19",cap:"ורק רציתי להחזיר אלי את הילד שלי הביתה",sub:"",dur:11,
  line:()=>flat(),
  over:(t)=>{const o=[ic("candle",0,.8,.6,pop(t,.2,1))],sm=[];for(let i=0;i<=60;i++){const v=i/60;sm.push([Math.sin(v*7+t*1.6)*.05*v,-v*.6,0]);}
    o.push(ic(sm,0,.66,1,pop(t,1.4,2),.8),ic(I.drop(1),0,.7,.035,pop(t,1),1,{rot:Math.PI,color:FLAME}));return o;},
  words:(t,L)=>{const R=RW(L);return[word("המולת אנשים",-R*.7,.25,pop(t,2.5),{size:.75}),word("משטרה",-R*.45,.6,pop(t,3.4),{size:.75}),word("עובדים סוציאליים",R*.5,.25,pop(t,4.3),{size:.75}),word("שכנים",R*.7,.6,pop(t,5.2),{size:.75})];}});
S({k:"שקף 20",cap:"התחתית",sub:"",dur:11,
  line:()=>fall(),
  words:(t)=>["אבל","הקלה","כאב","רחמים","כעס","האשמה?"].map((s,i)=>{const t0=1+i*1.2,v=easeO(seg(t,t0,t0+1.8));return word(s,lerp(-.6,.9,i/5),lerp(-.3,.9+.1*(i%2),v),pop(t,t0,.4)*(1-.35*v),{size:.9});})});
S({k:"שקף 21",cap:"בחירה",sub:"חיים או מוות",dur:13,intro:"draw",drawDur:6,illus:true,
  line:(t)=>t<6.5?SITTING:blend(SITTING,P(woman(),1.05,0),ease(seg(t,6.5,8.5))),
  over:(t)=>{const o=[];tearFx(t,.2,SIT.tear,1,o);return o;},
  words:(t,L)=>{const R=RW(L);return[word("בחרתי בחיים",0,-.2,pop(t,8.6),{size:1.3,w:800}),word("למען הילדים ולמען עצמי",0,0,pop(t,9.2),{size:.8}),word("תהליך שיקום: טיפול, קבוצה",R*.62,.5,pop(t,10.2),{size:.75})];}});
S({k:"שקף 22",cap:"התמודדויות יומיומיות",sub:"",dur:15,
  line:(t,L)=>P(woman(),.95,-L.xr*.75),
  over:(t,L)=>{const R=RW(L),o=[],v=seg(t,.8,1.8);o.push(ic("tray",-R*.2,lerp(.35,.95,v*v),.6,1,1-seg(t,4.5,5),{rot:v*.5}));
    o.push(ic("bubble",-R*.45,-.05,.8,pop(t,2.2)),ic("moon",R*.3,.05,.6,pop(t,5.5)),ic("star",R*.5,-.1,.25,pop(t,5.9)),ic("star",R*.15,-.2,.2,pop(t,6.2)));
    o.push(ic("car",lerp(L.xr+.6,-L.xr-.6,easeO(seg(t,8.5,14))),.85,.5,1));return o;},
  words:(t,L)=>{const R=RW(L);return[word("תבנית העוף שנפלה",-R*.2,.7,pop(t,1.6),{size:.75}),word("״איך אבא מת?״",-R*.45,-.05,pop(t,2.6),{size:.75}),word("השינה בלילה",R*.3,.32,pop(t,6),{size:.75}),word("הנסיעות לבאר שבע",lerp(L.xr+.6,-L.xr-.6,easeO(seg(t,8.5,14))),.6,pop(t,9),{size:.75})];}});
S({k:"שקף 23",cap:"הדברים שנותנים לי",sub:"כוח להמשיך",dur:7,
  line:(t,L)=>walkW(seg(t,0,7),-L.xr-.3,L.xr*.3,1)});
S({k:"שקף 24",cap:"הילדים שלי",sub:"",dur:15,
  line:(t,L)=>{const u=seg(t,0,8);return join(walkM(u,-L.xr-.65,-.5,.72),walkW(u,-L.xr-.25,-.1,1),walkM(u,-L.xr+.12,.26,.55));},
  over:(t,L)=>{const h=seg(t,8,14),hx=lerp(-L.xr-.7,L.xr+.7,h),hy=-.15+Math.sin(h*6)*.03;
    return[ic("helicopter",hx,hy,.7,1),ic(F.line([-.4,-.2],[.4,-.2]),hx,hy,.7*(.4+.6*Math.abs(Math.sin(t*20))),1),ic("guitar",.62,.6,.55,pop(t,10)),ic("star",-.5,-.05,.3,pop(t,9)),ic("star",.26,.2,.25,pop(t,11))];},
  words:(t)=>[word("אפק: טכנאי מסוקים בחיל האוויר",0,-.42,pop(t,8.6),{size:.75}),word("תעודות הצטיינות",-.5,-.26,pop(t,9.3),{size:.7}),word("שחר: לומד גיטרה",.75,.26,pop(t,10.4),{size:.7})]});
S({k:"שקף 25",cap:"האהבה שלי",sub:"",dur:10,
  line:(t,L)=>{const u=easeO(seg(t,0,4.5)),w=easeO(seg(t,6,10));return join(walkW(u,-L.xr-.3,-.15,1),walkM(u,L.xr+.3,.17,1.05)).map(([x,y,f])=>[x+w*L.xr*.5,y,f]);},
  over:(t)=>[ic(I.heart(1.2),0,.08,1,pop(t,4.6,1),1-seg(t,6,6.6))]});
S({k:"שקף 26",cap:"חברות טובות",sub:"אחיות לנפש",dur:12,
  line:(t,L)=>{const u=seg(t,0,6);return join(walkW(u,-L.xr-.6,-.25,1),walkW(u,-L.xr-.25,.1,.98));},
  over:(t,L)=>{const R=RW(L),u=seg(t,0,6);return[ic("suitcase",lerp(-L.xr-.6,-.25,u)+.16,.88,.5,1),ic("beachChair",R*.55,.8,.55,pop(t,6.5)),ic("beachChair",R*.85,.8,.55,pop(t,6.9))];},
  words:(t)=>[word("נסיעה אחת לשבועיים עם חברה טובה",0,-.3,pop(t,7.4),{size:.8}),word("יכולה לעשות עבודה של שנה אצל פסיכולוג",0,-.12,pop(t,8.4),{size:.8})]});
S({k:"שקף 27",cap:"לישון עם האויב, מכירים?",sub:"החופש לבחור",dur:12,
  line:(t,L)=>P(woman(),.95,-L.xr*.72),
  over:(t,L)=>{const R=RW(L),o=[ic("cupboard",R*.05,.52,.9,pop(t,.8))];[[-.3,-.22],[-.1,-.24],[.2,-.22],[-.25,.06],[.05,.06],[.3,.06],[-.05,.36],[.25,.36]].forEach((p,k)=>{if(t>2+k*.45){const v=easeO(pop(t,2+k*.45,.5));o.push(ic("can",R*.05+p[0]*.9,.52+p[1]*.9-(1-v)*.3,.7,1,v));}});
    o.push(ic("chair",R*.75,.72,.6,pop(t,7)),ic("clothes",R*.78,.48,.6,pop(t,7.8)));return o;},
  words:(t,L)=>{const R=RW(L);return[word("לסדר את הארון איך שבא לי",R*.05,-.1,pop(t,3),{size:.75}),word("להשאיר בגדים על הכיסא",R*.75,.24,pop(t,8.2),{size:.7})];}});
S({k:"שקף 28",cap:"לראות את עצמי",sub:"",dur:14,
  line:(t)=>blend(P(F.yogaTree(),1,-.2),P(woman({arms:["mic","down"]}),1,-.2),ease(seg(t,6,7.5))),
  over:(t)=>[ic("mic",-.36,.55,.95,pop(t,7.5))],
  words:(t,L)=>{const R=RW(L);return["סדנאות לגילוי האני החדש","אימון אישי ועסקי","לימודי NLP","יוגה וספורט","להעז! לעמוד מול קהל ולהרצות"].map((s,i)=>word(s,R*.6,-.1+i*.22,pop(t,i<4?1+i*1.3:8),{size:i===4?.85:.75,w:i===4?800:600}));}});
S({k:"שקף 29",cap:"שליטה",sub:"",dur:12,
  line:(t,L)=>t<6.5?walkW(easeO(seg(t,0,4)),-L.xr-.3,-.25,1):walkW(easeO(seg(t,6.5,11.5)),-.25,L.xr*.65,1),
  over:()=>[ic("sign",.15,.5,1.1,1)],
  words:(t)=>[word("לקחת שליטה על החיים שלי דרך הבחירות שאני עושה",0,-.32,pop(t,2),{size:.75}),word("תמיד יהיו דברים שמונחתים עלינו, מלמעלה או מלמטה",0,-.14,pop(t,4.5),{size:.68}),word("אבל אנחנו יכולים לבחור",.45,.05,pop(t,6.2),{size:.95,w:800})]});
S({k:"שקף 30",cap:"אני שואפת לחיים הכי טובים",sub:"לעצמי ולמשפחתי",dur:15,
  line:(t,L)=>walkW(seg(t,4.5,12),-L.xr*.72,L.xr*.72,.85),
  over:(t,L)=>[ic("house",-L.xr*.72,.62,.75,pop(t,.3)),ic("saleSign",-L.xr*.72+.5,.75,.5,pop(t,1.8)),ic("house",L.xr*.72,.62,.75,pop(t,10.5))],
  words:(t,L)=>[word("נמכר",-L.xr*.72+.5,.62,pop(t,2),{size:.55,w:800}),word("החלטתי להיות בקשר עם גיסתי וחמותי לשעבר",0,-.34,pop(t,3),{size:.68}),word("הלכתי אחר ליבי ויצאתי לעצמאות",0,-.16,pop(t,6),{size:.68}),word("מכרתי את הבית המשותף וקניתי בית חדש",0,.02,pop(t,9),{size:.68})]});
S({k:"שקף 31",cap:"סגירת מעגל",sub:"אחרי 10 שנים",dur:9,
  line:()=>P(woman(),.8,0),
  over:(t,L)=>[ic("circle",0,.6,1.15,ease(seg(t,.6,4))),ic("letter",Math.min(L.xr*.55,1.3),.5,.8,pop(t,4.5,1.2))]});
const INS=[["החיים הפכפכים","wave"],["כל מה שלא הורג אותך, עושה אותך חזק יותר","mountain"],["להסתכל לפחד בעיניים ולעבור בתוכו","eye"],["להעז","star"],["לבחור: לא להתקרבן, לא להתמסכן","sign"],
  ["להקשיב לגוף. לעצור ולנשום","breath"],["לא לשפוט, אחרים ולא את עצמך","scale"],["הזמן מרפא כל דבר. תן זמן לזמן","hourglass"],["אף אחד לא ממונה על אושרך מלבדך","star"],["לחבק יותר, לאהוב יותר, להגיד יותר","heart"]];
const INSD=INS.length*2.8+1.5;
S({k:"שקפים 32–33",cap:"תובנות לחיים",sub:"(שאספתי בדרך)",dur:INSD,
  line:(t,L)=>walkW(seg(t,0,INSD),-L.xr-.3,L.xr+.3,1),
  over:(t)=>INS.map(([s,n],i)=>{const t0=.8+i*2.8,a=pop(t,t0,.6)*(1-seg(t,t0+2.4,t0+2.8));return a>0?ic(n==="heart"?I.heart(1):n,0,-.12,.45,pop(t,t0,.8),a):null;}).filter(Boolean),
  words:(t)=>INS.map(([s],i)=>{const t0=.8+i*2.8;return word(s,0,.22,pop(t,t0,.6)*(1-seg(t,t0+2.4,t0+2.8)),{size:1});})});
S({k:"שקף 34",cap:"לפעמים צריך להזכיר לעצמנו מי אנחנו",sub:"",dur:6,line:()=>faces().open});
S({k:"שקף 35",cap:"אור גדול",sub:"אמיר דדון",dur:9,
  line:()=>P(woman({arms:["wide","wide"],dress:.78}),1.05,-.4),
  over:(t)=>{const r=easeO(seg(t,.3,6));return sunAt(.62,1-.4*r,.34,r);}});
S({k:"סיום",cap:"",sub:"",dur:7.5,end:true,line:()=>flat(),
  over:(t)=>{const o=[];if(t>.2&&t<1.2){const v=t-.2;o.push(ic(I.drop(1),0,lerp(-.4,.96,v*v),.07,1,clamp(v*5)));}if(t>=1.2)ripple(t,1.2,0,.9,o,WATER);return o;}});

/* ---------- timeline ---------- */
const MORPH=1.5,RETRACT=1.1;let acc=0;
SC.forEach(s=>{s.intro=s.intro||"morph";s.t0=acc;s.introLen=s.intro==="start"?2.2:s.intro==="draw"?RETRACT+s.drawDur:MORPH;acc+=s.introLen+s.dur;});
const TOTAL=acc;

/* ---------- renderer ---------- */
const cv=document.getElementById("film"),g=cv.getContext("2d");
const plate=new Image();plate.src=A.plate;const logo=new Image();logo.src=A.logo;
function layout(){const W=cv.width,H=cv.height,port=H>W;const FH=port?W*.5:H*.42,hy=port?H*.64:H*.74;return{W,H,port,FH,hy,cx:W/2,xr:(W/2)/FH,m:Math.min(W,H)};}
const X=(L,x)=>L.cx+x*L.FH,Y=(L,y)=>L.hy-(1-y)*L.FH;
function bg(L){g.fillStyle="#fff";g.fillRect(0,0,L.W,L.H);
  if(plate.complete&&plate.naturalWidth){const s=Math.max(L.W/plate.naturalWidth,L.H/plate.naturalHeight),w=plate.naturalWidth*s,h=plate.naturalHeight*s;g.drawImage(plate,0,L.H-h,w,h);}}
const lw=(L,k=1)=>Math.max(1.5,L.FH/1080*5)*k;
function strokeMain(L,pts,upto=pts.length-1){g.strokeStyle=INK;g.lineWidth=lw(L);g.lineCap="round";g.lineJoin="round";g.beginPath();
  const f=pts[0];g.moveTo(0,L.hy);g.lineTo(X(L,f[0]),L.hy);g.lineTo(X(L,f[0]),Y(L,f[1]));
  for(let k=1;k<=upto;k++){const q=pts[k];if(q[2])g.moveTo(X(L,q[0]),Y(L,q[1]));else g.lineTo(X(L,q[0]),Y(L,q[1]));}
  if(upto>=pts.length-1){const l=pts[pts.length-1];g.lineTo(X(L,l[0]),L.hy);g.lineTo(L.W,L.hy);}g.stroke();
  return[X(L,pts[upto][0]),Y(L,pts[upto][1])];}
function drawOver(L,o,fade=1){if(!o||!o.pts||!o.pts.length)return;const a=(o.a??1)*fade;if(a<=0||o.p<=0)return;const pts=o.pts,n=Math.max(2,Math.floor(pts.length*clamp(o.p))),c=Math.cos(o.rot||0),sn=Math.sin(o.rot||0);
  g.save();g.globalAlpha=a;g.strokeStyle=o.color||INK;g.lineWidth=lw(L,.85);g.lineCap="round";g.lineJoin="round";g.beginPath();
  for(let k=0;k<Math.min(n,pts.length);k++){const[px,py,f]=pts[k],x=o.x+(px*c-py*sn)*o.s,y=o.y+(px*sn+py*c)*o.s;if(k===0||f)g.moveTo(X(L,x),Y(L,y));else g.lineTo(X(L,x),Y(L,y));}g.stroke();g.restore();}
function drawWord(L,w,fade=1){const a=(w.a??1)*fade;if(a<=0)return;g.save();g.globalAlpha=a;g.fillStyle=TYPE;g.direction="rtl";g.textAlign="center";g.textBaseline="middle";
  const fs=Math.round(L.m*.043*(w.size||1)*(L.port?1.05:1));g.font=`${w.w||600} ${fs}px Assistant, Arial, sans-serif`;
  const lines=wrap(w.t,L.W*.9);lines.forEach((ln,j)=>{const tw=g.measureText(ln).width;const x=Math.min(L.W-tw/2-L.W*.02,Math.max(tw/2+L.W*.02,X(L,w.x)));g.fillText(ln,x,Y(L,w.y)+(j-(lines.length-1)/2)*fs*1.15);});g.restore();}
function wrap(text,maxW){if(g.measureText(text).width<=maxW)return[text];const w=text.split(" ");let best=[text],bd=1e9;
  for(let i=1;i<w.length;i++){const a=w.slice(0,i).join(" "),b=w.slice(i).join(" "),d=Math.max(g.measureText(a).width,g.measureText(b).width);if(d<bd){bd=d;best=[a,b];}}return best;}
function caption(L,s,a){if(a<=0||!s.cap)return;const m=L.m;g.save();g.globalAlpha=a;g.fillStyle=TYPE;g.direction="rtl";g.textBaseline="alphabetic";
  const fs=Math.round(m*(L.port?.075:.078)*(s.cap.length>22?.8:1));g.font=`800 ${fs}px Assistant, Arial, sans-serif`;
  const maxW=L.port?L.W*.9:L.W*.62,lines=wrap(s.cap,maxW),x=L.port?L.W/2:L.W*.95,y0=L.port?L.H*.1:L.H*.13;g.textAlign=L.port?"center":"right";
  lines.forEach((ln,j)=>g.fillText(ln,x,y0+j*fs*1.08));
  if(s.sub){const ss=Math.round(m*.04);g.font=`600 ${ss}px Assistant, Arial, sans-serif`;g.globalAlpha=a*.85;wrap(s.sub,maxW).forEach((ln,j)=>g.fillText(ln,x,y0+(lines.length-1)*fs*1.08+fs*.75+j*ss*1.2+ss*.2));}
  g.restore();}
const cache={};
function ends(L,i){const k=L.W+"x"+L.H;cache[k]=cache[k]||{};const c=cache[k];if(!c[i]){const s=SC[i];c[i]={a:resample(s.line(0,L),N),z:resample(s.line(s.dur,L),N)};}return c[i];}
const flatten=(pts,u)=>pts.map(p=>[p[0],p[1]+(1-p[1])*u,p[2]]);
function sceneAt(t){for(let i=SC.length-1;i>=0;i--)if(t>=SC[i].t0)return i;return 0;}
function renderAt(t){
  const L=layout();bg(L);t=Math.min(Math.max(0,t),TOTAL-1e-4);
  const i=sceneAt(t),s=SC[i],local=t-s.t0,act=local-s.introLen;
  if(act<0){
    const prev=i>0?SC[i-1]:null;
    if(s.intro==="start"){const gu=ease(clamp(local/s.introLen));g.strokeStyle=INK;g.lineWidth=lw(L);g.lineCap="round";g.beginPath();g.moveTo(L.W,L.hy);g.lineTo(L.W*(1-gu),L.hy);g.stroke();}
    else if(s.intro==="draw"){const z=ends(L,i-1).z;
      if(local<RETRACT)strokeMain(L,flatten(z,ease(local/RETRACT)));
      else{const a=ends(L,i).a,u=ease(clamp((local-RETRACT)/s.drawDur)),k=Math.max(1,Math.floor(u*(N-1)));const p=strokeMain(L,a,k);if(u<1){g.fillStyle=INK;g.beginPath();g.arc(p[0],p[1],lw(L,1.5),0,Math.PI*2);g.fill();}}}
    else strokeMain(L,blend(ends(L,i-1).z,ends(L,i).a,ease(clamp(local/s.introLen))));
    if(prev&&s.intro!=="start"){const f=1-clamp(local/.8);if(f>0){(prev.over?prev.over(prev.dur,L):[]).forEach(o=>drawOver(L,o,f));(prev.words?prev.words(prev.dur,L):[]).forEach(w=>drawWord(L,w,f));caption(L,prev,f);}}
    return i;}
  strokeMain(L,resample(s.line(act,L),N));
  (s.over?s.over(act,L):[]).forEach(o=>drawOver(L,o));
  (s.words?s.words(act,L):[]).forEach(w=>drawWord(L,w));
  if(!s.end)caption(L,s,clamp(act/.7));
  else{const la=clamp((act-3)/1.2);if(la>0&&logo.complete){const w_=L.port?L.W*.6:L.FH*1.05,h_=w_*logo.naturalHeight/logo.naturalWidth;
    g.save();g.globalAlpha=la;g.globalCompositeOperation="multiply";g.drawImage(logo,L.cx-w_/2,L.hy-h_-L.FH*.08,w_,h_);g.restore();}}
  return i;}

/* ---------- page controls ---------- */
const RATIOS={"16:9":[1920,1080],"9:16":[1080,1920]};
let t0=null,paused=false,pauseT=0,cur=-1;
const board=document.getElementById("board"),fmt=x=>`${Math.floor(x/60)}:${String(Math.floor(x%60)).padStart(2,"0")}`;
SC.forEach((s,i)=>{const b=document.createElement("button");b.type="button";b.className="scene";
  b.innerHTML='<span class="n"></span><span class="c"></span><span class="s"></span><span class="k"></span>';
  b.querySelector(".n").textContent=String(i+1).padStart(2,"0");b.querySelector(".c").textContent=s.cap||"אדוות החיים";
  b.querySelector(".s").textContent=s.sub||(s.end?"דמעה נופלת על הקו והופכת לאדוות":" ");b.querySelector(".k").textContent=`${s.k}${s.illus?" · איור מהמצגת":""} · ${fmt(s.t0)}`;
  b.onclick=()=>seek(s.t0+s.introLen+.01);board.appendChild(b);});
function seek(t){pauseT=t;t0=null;if(paused)draw(t);}
function draw(t){const i=renderAt(t);document.getElementById("time").textContent=`${fmt(t)} / ${fmt(TOTAL)}`;
  if(i!==cur){cur=i;[...board.children].forEach((c,k)=>c.setAttribute("aria-current",String(k===i)));}}
function loop(now){if(!paused){if(t0==null)t0=now-pauseT*1000;let t=(now-t0)/1000;if(t>TOTAL){t0=now;t=0;}pauseT=t;draw(t);}requestAnimationFrame(loop);}
document.getElementById("play").onclick=()=>{paused=false;seek(0);document.getElementById("pause").textContent="השהה";};
document.getElementById("pause").onclick=e=>{paused=!paused;t0=null;e.target.textContent=paused?"המשך":"השהה";};
const rg=document.getElementById("ratio");
for(const[k,lab]of[["16:9","מסך הרצאה 16:9"],["9:16","רילס 9:16"]]){const c=document.createElement("button");c.type="button";c.className="chip";c.textContent=lab;
  c.setAttribute("aria-pressed",String(k==="16:9"));c.onclick=()=>{[cv.width,cv.height]=RATIOS[k];[...rg.children].forEach(x=>x.setAttribute("aria-pressed",String(x===c)));if(paused)draw(pauseT);};rg.appendChild(c);}
window.Story={renderAt,TOTAL,SCENES:SC.map(s=>({t0:s.t0,in:s.introLen,dur:s.dur,out:0})),setRatio:k=>{[cv.width,cv.height]=RATIOS[k];},canvas:cv,
  ready:()=>Promise.all([plate,logo].map(im=>im.complete?1:new Promise(r=>{im.onload=im.onerror=r;})))};
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>window.Story.ready()).then(()=>{if(reduced){paused=true;document.getElementById("pause").textContent="המשך";draw(SC[9].t0+SC[9].introLen+15);}requestAnimationFrame(loop);});
})();
