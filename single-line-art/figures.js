/* One-line figures and icons for the story film.
   Figure units: ground at y = 1, a standing adult is 1 tall, x = 0 is the figure's own centre.
   Key points are smoothed with Chaikin cuts; a third value of 1 keeps a point sharp. */
(function(){
"use strict";
function chaikin(pts,iter=3){let p=pts.map(q=>[q[0],q[1],q[2]||0]);
  for(let k=0;k<iter;k++){const o=[];for(let i=0;i<p.length-1;i++){const a=p[i],b=p[i+1];
      if(i===0||a[2])o.push(a);else o.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25,0]);
      if(!b[2]&&i<p.length-2)o.push([a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75,0]);}
    o.push(p[p.length-1]);p=o;}
  return p;}
const mirror=pts=>pts.map(([x,y,f])=>[-x,y,f]).reverse();
const flipX=pts=>pts.map(([x,y,f])=>[-x,y,f]);
const arc=(cx,cy,rx,ry,a0,a1,n=24)=>{const o=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;o.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a),0]);}return o;};
const T=(pts,s=1,ox=0,oy=0)=>pts.map(([x,y,f])=>[x*s+ox,1-(1-y)*s+oy,f||0]);
const M=(pts,s=1,ox=0,oy=0,rot=0)=>{const c=Math.cos(rot),n=Math.sin(rot);return pts.map(([x,y,f])=>[(x*c-y*n)*s+ox,(x*n+y*c)*s+oy,f||0]);};
function bez(p0,p1,p2,p3,n=40){const o=[];for(let i=0;i<=n;i++){const t=i/n,u=1-t;o.push([u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1],0]);}return o;}
const line=(...p)=>p.map(q=>[q[0],q[1],q[2]||0]);
const rect=(x,y,w,h)=>line([x,y,1],[x+w,y,1],[x+w,y+h,1],[x,y+h,1],[x,y,1]);
const groundToEnds=pts=>{const a=pts[0],b=pts[pts.length-1];return [[a[0],1,0],...pts,[b[0],1,0]];};

/* ---------- standing person, front or back view ---------- */
function arm(pose){switch(pose){
  case "up":   return [[-.085,.25],[-.15,.12],[-.22,-.02],[-.245,-.07,1],[-.255,-.05],[-.2,.03],[-.14,.14],[-.115,.2]];
  case "out":  return [[-.09,.26],[-.15,.38],[-.2,.48],[-.215,.52,1],[-.23,.5],[-.2,.42],[-.15,.32],[-.12,.21]];
  case "wide": return [[-.09,.26],[-.18,.25],[-.28,.2],[-.32,.18,1],[-.315,.16],[-.27,.17],[-.18,.205],[-.12,.2]];
  case "hold": return [[-.09,.27],[-.12,.36],[-.07,.38],[-.03,.36,1],[-.03,.33],[-.09,.34],[-.135,.32],[-.12,.21]];
  case "join": return [[-.085,.25],[-.11,.12],[-.06,-.02],[-.012,-.12,1],[-.03,-.12],[-.08,-.01],[-.125,.12],[-.115,.2]];
  case "face": return [[-.09,.27],[-.13,.3],[-.07,.2],[-.035,.12,1],[-.05,.11],[-.1,.2],[-.14,.28],[-.12,.21]];
  case "mic":  return [[-.09,.27],[-.13,.33],[-.08,.24],[-.05,.16,1],[-.065,.15],[-.1,.22],[-.145,.3],[-.12,.21]];
  default:     return [[-.088,.26],[-.11,.38],[-.118,.52],[-.122,.58,1],[-.135,.56],[-.135,.4],[-.128,.26],[-.115,.2]];}}
function person({dress=.74,hair="long",arms=["down","down"],broad=1,veil=false,item=null,legLift=0}={}){
  const S=broad,L=[];
  if(dress){const hem=Math.min(dress,.97);
    if(hem<.95)L.push([-.075,1,1],[-.05,.95],[-.055,.83],[-.052,hem,1]);else L.push([-.075,1,1]);
    L.push([-.17*S,hem,1],[-.13*S,.6],[-.1*S,.5],[-.07*S,.41],[-.08*S,.33]);
  }else L.push([-.08,1,1],[-.075,.95],[-.08,.75],[-.095*S,.52],[-.085*S,.43],[-.09*S,.33]);
  L.push(...arm(arms[0]).map(([x,y,f])=>[x*S,y,f]));
  L.push([-.075*S,.18]);if(hair!=="long")L.push([-.03,.165]);
  const head=[];
  if(hair==="long")head.push([-.068,.27,1],[-.082,.17],[-.072,.07],[-.04,.015],[0,0],[.04,.015],[.072,.07],[.082,.17],[.068,.27,1]);
  else if(hair==="bun")head.push([-.03,.165],[-.06,.11],[-.055,.05],[-.025,.025],...arc(0,-.005,.03,.028,Math.PI*.75,Math.PI*2.25,14),[.025,.025],[.055,.05],[.06,.11],[.03,.165]);
  else head.push([-.03,.165],[-.058,.12],[-.06,.06],[-.035,.015],[0,0],[.035,.015],[.06,.06],[.058,.12],[.03,.165]);
  if(veil)head.splice(1,0,[-.07,.35],[-.13,.7],[-.2,.995],[-.27,1,1],[-.22,.8],[-.14,.4],[-.06,.1]);
  const Rh=[];
  if(dress){const hem=Math.min(dress,.97);Rh.push([.08*S,.33],[.07*S,.41],[.1*S,.5],[.13*S,.6],[.17*S,hem,1]);
    if(hem<.95)Rh.push([.052,hem,1],[.055,.83],[.05,.95-legLift],[.075,1-legLift,1],[.02,1-legLift,1],[.018,hem+.02],[-.018,hem+.02],[-.02,1,1]);else Rh.push([.075,1,1]);}
  else Rh.push([.09*S,.33],[.085*S,.43],[.095*S,.52],[.08,.75],[.075,.95],[.08,1,1],[.015,1,1],[.012,.6],[0,.55],[-.012,.6],[-.015,1,1]);
  const R=[...(hair!=="long"?[[.03,.165]]:[]),[.075*S,.18],...mirror(arm(arms[1]).map(([x,y,f])=>[x*S,y,f])),...Rh];
  let pts=[...L,...head,...R];
  if(item){let best=0,bd=1e9;pts.forEach((p,i)=>{if(i<L.length&&p[2]&&p[1]<.6&&Math.abs(p[0])<bd){bd=Math.abs(p[0]);best=i;}});pts=[...pts.slice(0,best+1),...item,pts[best],...pts.slice(best+1)];}
  return out(chaikin(pts));
}
const potPlant=[[-.03,.36],[-.035,.3,1],[.035,.3,1],[.03,.36,1],[0,.36],[0,.3],[-.005,.24],[-.05,.2],[-.06,.17,1],[-.02,.2],[0,.25],[.005,.2],[.05,.15,1],[.035,.21],[0,.26],[0,.36]];

/* ---------- walking person, side view facing right ---------- */
function walker({phase=0,hair="long",dress=.74,broad=1,armSwing=.45,stride=.34,item=null,lean=0}={}){
  const s=Math.sin(phase),hip=[0,.5],LEG=.47;
  const leg=(th,w0,w1)=>{const d=[Math.sin(th),Math.cos(th)],n=[Math.cos(th),-Math.sin(th)],an=[hip[0]+d[0]*LEG,hip[1]+d[1]*LEG];return {d,n,an,w0,w1,th};};
  const A=leg(stride*s,.03,.014),B=leg(-stride*s,.03,.014);
  const front=A.an[0]>=B.an[0]?A:B,rear=front===A?B:A;
  const edge=(lg,t,side)=>{const w=lg.w0+(lg.w1-lg.w0)*t;return [hip[0]+lg.d[0]*LEG*t+lg.n[0]*w*side,hip[1]+lg.d[1]*LEG*t+lg.n[1]*w*side];};
  const tTop=lg=>dress?Math.max(0,(dress-hip[1])/(LEG*lg.d[1])):0;
  const foot=lg=>{const a=lg.an,lift=lg===rear?Math.max(0,-Math.cos(phase))*0:0;return {heel:[a[0]-.018,a[1]+.012-lift,1],toe:[a[0]+.065,a[1]+.016-lift,1]};};
  const fr=foot(rear),ff=foot(front),p=[];
  // rear leg, rear edge up
  p.push(fr.heel);for(let t=1;t>=tTop(rear);t-=.25)p.push([...edge(rear,t,-1),0]);
  if(dress){p.push([...edge(rear,tTop(rear),-1),1],[-.13*broad,dress,1],[-.075*broad,.6],[-.04*broad,.43],[-.05*broad,.33]);}
  else p.push([-.06*broad,.52],[-.055*broad,.44],[-.06*broad,.33]);
  // back, hair, head
  if(hair==="long")p.push([-.06,.31,1],[-.085,.2],[-.082,.1]);else p.push([-.05*broad,.22],[-.03,.19],[-.06,.15],[-.072,.08]);
  p.push([-.05,.02],[0,-.002],[.05,.02],[.075,.06],[.08,.085],[.1,.112,1],[.082,.122],[.086,.132],[.078,.14],[.074,.155],[.04,.168],[.03,.19]);
  // front arm, out and back from the shoulder
  const al=-armSwing*s,ad=[Math.sin(al),Math.cos(al)],an=[Math.cos(al),-Math.sin(al)],sh=[.005,.215],AL=.3;
  p.push([sh[0]+an[0]*.02,sh[1]+an[1]*.02]);
  for(let t=.25;t<=1;t+=.25)p.push([sh[0]+ad[0]*AL*t+an[0]*.018,sh[1]+ad[1]*AL*t+an[1]*.018,t===1?1:0]);
  const hand=[sh[0]+ad[0]*AL,sh[1]+ad[1]*AL];
  if(item)p.push(...item.map(([x,y,f])=>[x+hand[0],y+hand[1],f]),[hand[0],hand[1],1]);
  for(let t=1;t>=.3;t-=.25)p.push([sh[0]+ad[0]*AL*t-an[0]*.016,sh[1]+ad[1]*AL*t-an[1]*.016,t===1?1:0]);
  // front of torso down
  if(dress)p.push([.055,.27],[.05,.33],[.03,.42],[.075*broad,.6],[.13*broad,dress,1],[...edge(front,tTop(front),1),1]);
  else p.push([.06*broad,.28],[.055*broad,.4],[.05*broad,.5]);
  for(let t=tTop(front)+.2;t<=1;t+=.25)p.push([...edge(front,Math.min(1,t),1),0]);
  p.push(ff.toe,ff.heel);
  for(let t=1;t>=tTop(front);t-=.25)p.push([...edge(front,t,-1),0]);
  if(dress)p.push([...edge(front,tTop(front),-1),1],[...edge(rear,tTop(rear),1),1]);else p.push([0,.56]);
  for(let t=tTop(rear)+.2;t<=1;t+=.25)p.push([...edge(rear,Math.min(1,t),1),0]);
  p.push(fr.toe);
  let pts=chaikin(p,2);
  const maxY=Math.max(...pts.map(q=>q[1]));pts=pts.map(([x,y,f])=>[x+lean*(1-y),y+1-maxY,f]);
  return out(groundToEnds(pts));
}
/* a figure walking from x0 to x1 over time u in [0,1]; returns figure points placed in scene units */
function walkAcross(u,x0,x1,opts={},scale=1){const x=x0+(x1-x0)*u,dir=x1>=x0?1:-1,stepLen=.3*scale;
  const ph=Math.abs(x-x0)/stepLen*Math.PI;let f=walker({...opts,phase:ph});if(dir<0)f=flipX(f).reverse();return T(f,scale,x);}

/* ---------- other bodies ---------- */
function profile({hair="long",scale=1}={}){
  const p=[[-.36,1,1],[-.3,.88],[-.2,.79],[-.12,.74],[-.1,.64],[-.16,.55],[-.2,.42],[-.18,.27],[-.09,.17],[.02,.14],[.12,.18],[.18,.26],[.2,.33],[.205,.37,1],[.215,.41],[.26,.48,1],[.225,.505,1],[.225,.53],[.245,.55,1],[.222,.565],[.24,.59,1],[.215,.61],[.2,.65],[.16,.67],[.1,.67],[.09,.76],[.14,.88],[.2,1,1]];
  if(hair==="long")p.splice(2,4,[-.22,.82],[-.27,.78,1],[-.28,.62],[-.23,.48]);
  return out(chaikin(p)).map(([x,y,f])=>[x*scale,1-(1-y)*scale,f]);}
function baby(){const head=[],cx=.2,cy=.62,r=.16;for(let i=0;i<=40;i++){const a=Math.PI*.95+i/40*Math.PI*1.75;head.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}
  const p=[[-.62,1,1],[-.62,.62],[-.5,.38],[-.25,.26],[.1,.24],[.38,.3],[.52,.48],[.55,.72],[.55,1,1],[.52,1,1],
    [.42,1],[.36,.93],[.27,.86],[.2,.8],[.12,.82],[.08,.88],[.13,.92],[.18,.95],[.12,.98],[0,.98],[-.1,.93],[-.2,.95],[-.3,.99],[-.38,.98],[-.4,.9],[-.32,.8],[-.2,.74],[.05,.66],
    ...head,[.06,.72],[-.05,.78],[-.25,.83],[-.38,.92],[-.42,1,1]];
  return out(chaikin(p)).map(([x,y,f])=>[x*.8,1-(1-y)*.75,f]);}
/* woman lying in bed under a blanket, head on the pillow (left) */
function inBed(){const p=[[-.55,1,1],[-.55,.62,1],[-.55,.74,1],[-.5,.74],[-.42,.7],[-.38,.62],[-.33,.6],[-.3,.66],[-.22,.66],[-.1,.62],[.15,.6],[.35,.62],[.45,.66],[.5,.74,1],[.55,.74,1],[.55,.66,1],[.55,1,1],[.55,.78,1],[-.55,.78,1],[-.55,1,1]];
  return out(chaikin(p,2));}
/* person sitting on a chair, side view facing right */
function seated({hair="short"}={}){const p=[[-.16,1,1],[-.16,.62,1],[-.16,.66],[-.13,.6],[-.07,.6],[-.06,.42],[-.08,.3],[-.06,.22],...(hair==="long"?[[-.07,.3,1],[-.09,.2]]:[[-.04,.19],[-.07,.15]]),[-.075,.08],[-.05,.02],[0,0],[.05,.02],[.075,.06],[.095,.105,1],[.078,.12],[.07,.15],[.04,.165],[.03,.19],[.05,.25],[.12,.38],[.16,.45,1],[.14,.46],[.06,.36],[.05,.5],[.06,.6],[.2,.6],[.22,.98],[.27,1,1],[.19,1,1],[.17,.66],[.12,.66],[.1,.66],[-.12,.66],[-.12,1,1]];
  return out(chaikin(p,2));}
/* yoga tree pose: standing on one leg, hands together above the head */
function yogaTree(){return person({dress:.72,hair:"bun",arms:["join","join"],legLift:.22});}

/* ---------- icons (centred on 0,0; about 1 unit tall) ---------- */
/* icons: S(...) joins separate strokes with pen-up moves (flag 2) */
const F={bez};
const S=(...parts)=>parts.flatMap((p,i)=>p.map((q,j)=>[q[0],q[1],j===0&&i>0?2:(q[2]===2?2:(q[2]||0))]));
const I={
  card:()=>S(rect(-.3,-.18,.6,.36),line([-.3,-.08],[.3,-.08]),rect(-.22,.02,.12,.08)),
  bubble:()=>{const o=arc(0,0,.34,.24,Math.PI*.62,Math.PI*2.5,40);o.push([-.25,.32,1],[-.2,.18,1]);return o;},
  insult:()=>S(I.bubble(),line([-.18,.03,1],[-.09,-.08,1],[0,.05,1],[.09,-.08,1],[.18,.03,1])),
  curse:()=>S(I.bubble(),line([-.2,.06,1],[-.15,-.08,1],[-.1,.06,1],[-.05,-.08,1],[0,.06,1],[.05,-.08,1],[.1,.06,1],[.15,-.08,1],[.2,.06,1])),
  silence:()=>{const o=[S(arc(0,0,.3,.12,Math.PI,Math.PI*3,40))];for(let x=-.2;x<=.21;x+=.08)o.push(line([x,-.05],[x,.05]));return S(...o);},
  eye:()=>S(chaikin(line([-.38,0,1],[-.15,-.2],[.15,-.2],[.38,0,1],[.15,.2],[-.15,.2],[-.38,0,1]),3),arc(0,0,.12,.12,0,Math.PI*2,30)),
  bolt:()=>line([.06,-.42,1],[-.14,.04,1],[.03,.04,1],[-.08,.42,1],[.16,-.08,1],[0,-.08,1],[.12,-.42,1],[.06,-.42,1]),
  plate:()=>S(arc(0,0,.3,.1,0,Math.PI*2,40),arc(0,0,.18,.055,0,Math.PI*2,30)),
  shard:()=>line([-.15,-.05,1],[.05,-.1,1],[.12,.02,1],[-.06,.08,1],[-.15,-.05,1]),
  glass:()=>line([-.1,-.3,1],[-.08,.25,1],[.08,.25,1],[.1,-.3,1]),
  spill:()=>S(line([-.32,.26,1],[-.05,-.1,1],[.05,-.04,1],[-.18,.3,1]),chaikin(line([-.12,.3,1],[.1,.27],[.3,.3],[.4,.27,1]),2)),
  chuppah:()=>S(line([-.55,.55,1],[-.55,-.35,1]),F.bez([-.6,-.35],[-.3,-.2],[.3,-.2],[.6,-.35],30),line([.55,-.35,1],[.55,.55,1])),
  bottle:()=>line([-.07,.3,1],[-.07,-.05,1],[-.03,-.14,1],[-.025,-.3,1],[.025,-.3,1],[.03,-.14,1],[.07,-.05,1],[.07,.3,1],[-.07,.3,1]),
  wineGlass:()=>S(arc(0,-.12,.12,.17,Math.PI*.5,Math.PI*2.5,30),line([0,.05],[0,.3,1],[-.1,.3,1],[.1,.3,1])),
  incubator:()=>S(arc(0,.15,.62,.55,Math.PI,Math.PI*2,40),line([.62,.15,1],[.62,.4,1],[-.62,.4,1],[-.62,.15,1])),
  syringe:()=>S(rect(-.3,-.05,.45,.1),line([.15,0],[.32,0]),line([-.3,0],[-.42,0]),line([-.42,-.07],[-.42,.07])),
  shirt:()=>line([-.08,-.12,1],[-.18,-.06,1],[-.14,.02,1],[-.1,-.01,1],[-.1,.16,1],[.1,.16,1],[.1,-.01,1],[.14,.02,1],[.18,-.06,1],[.08,-.12,1],[.04,-.09,1],[-.04,-.09,1],[-.08,-.12,1]),
  mop:()=>S(line([0,-.5],[0,.25]),line([-.1,.25],[.1,.25]),...[-.08,-.04,0,.04,.08].map(x=>line([x,.25],[x*1.4,.42]))),
  bucket:()=>S(line([-.17,-.12,1],[-.13,.25,1],[.13,.25,1],[.17,-.12,1],[-.17,-.12,1]),arc(0,-.12,.17,.22,Math.PI,Math.PI*2,20)),
  table:()=>S(arc(0,0,.38,.09,0,Math.PI*2,40),line([0,.09],[0,.45,1],[-.15,.5])),
  papers:()=>S(...[0,1,2,3,4,5].map(i=>rect(-.25+(i%2)*.03,.3-i*.08,.5,.06))),
  token:()=>S(arc(0,0,.22,.22,0,Math.PI*2,40),rect(-.1,-.03,.2,.06),arc(0,0,.16,.16,Math.PI*.65,Math.PI*.95,8)),
  house:()=>line([-.4,.45,1],[-.4,-.05,1],[-.48,-.05,1],[0,-.45,1],[.48,-.05,1],[.4,-.05,1],[.4,.45,1],[.08,.45,1],[.08,.15,1],[-.08,.15,1],[-.08,.45,1],[-.4,.45,1]),
  houseSplit:()=>S(I.house(),line([0,.15],[0,-.42])),
  calendar:()=>S(rect(-.25,-.25,.5,.5),line([-.25,-.12],[.25,-.12]),line([-.12,-.32],[-.12,-.2]),line([.12,-.32],[.12,-.2])),
  chain:()=>S(...[0,1,2,3,4].map(i=>arc(-.4+i*.19,0,.12,i%2?.04:.07,0,Math.PI*2,24))),
  boiler:()=>S(rect(-.15,-.3,.3,.65),line([-.2,-.38],[-.3,-.5]),line([0,-.4],[0,-.55]),line([.2,-.38],[.3,-.5])),
  waves:()=>S(...[0,1,2].map(r=>{const o=[];for(let i=0;i<=40;i++)o.push([-.4+i*.02,r*.14+Math.sin(i*.6)*.04,0]);return o;})),
  tire:()=>S(arc(0,0,.3,.3,0,Math.PI*2,40),arc(0,0,.14,.14,0,Math.PI*2,30),line([.24,-.2],[.4,-.34])),
  siren:()=>S(line([-.2,.2],[.2,.2]),arc(0,.2,.16,.24,Math.PI,Math.PI*2,20),line([-.3,-.12],[-.4,-.22]),line([0,-.14],[0,-.36]),line([.3,-.12],[.4,-.22])),
  bandage:()=>S(M(rect(-.32,-.1,.64,.2),1,0,0,-.5),M(line([-.06,-.06],[.06,.06]),1,0,0,-.5),M(line([.06,-.06],[-.06,.06]),1,0,0,-.5)),
  phone:()=>S(rect(-.17,-.32,.34,.64),line([-.05,.25],[.05,.25])),
  menorah:()=>{const p=[line([-.2,.45],[.2,.45]),line([0,.45],[0,-.12])];for(let i=-4;i<=4;i++){if(!i)continue;const x=i*.07;p.push(F.bez([0,.1],[x*.3,.1],[x,.05],[x,-.05],8));}return S(...p);},
  candle:()=>rect(-.12,-.1,.24,.5),
  tray:()=>S(line([-.35,0,1],[.35,0,1],[.3,.08,1],[-.3,.08,1],[-.35,0,1]),arc(-.1,-.02,.1,.06,Math.PI,Math.PI*2,14),arc(.12,-.02,.1,.06,Math.PI,Math.PI*2,14)),
  car:()=>S(chaikin(line([-.5,.15,1],[-.5,-.02,1],[-.3,-.05,1],[-.18,-.22,1],[.15,-.22,1],[.3,-.05,1],[.5,-.02,1],[.5,.15,1],[-.5,.15,1]),1),arc(.24,.15,.09,.09,0,Math.PI*2,16),arc(-.24,.15,.09,.09,0,Math.PI*2,16)),
  moon:()=>S(arc(0,0,.22,.22,Math.PI*.35,Math.PI*1.65,30),arc(.1,0,.18,.19,Math.PI*1.45,Math.PI*.55,30)),
  helicopter:()=>S(arc(0,0,.25,.13,0,Math.PI*2,30),line([.25,0],[.6,-.03,1],[.62,-.12,1],[.66,-.03,1]),line([0,-.13],[0,-.2]),line([-.15,.13],[-.18,.2,1],[.18,.2,1],[.15,.13])),
  rotor:()=>line([-.4,-.2],[.4,-.2]),
  guitar:()=>S(arc(0,.18,.16,.15,Math.PI*1.75,Math.PI*3.25,24),arc(0,-.05,.12,.11,Math.PI*.75,Math.PI*2.25,20),line([-.03,-.14,1],[-.03,-.52,1],[.03,-.52,1],[.03,-.14,1])),
  suitcase:()=>S(rect(-.15,-.22,.3,.4),line([-.06,-.22,1],[-.06,-.3,1],[.06,-.3,1],[.06,-.22,1])),
  beachChair:()=>line([-.3,.3,1],[.1,-.2,1],[.2,-.15,1],[-.15,.3,1],[-.3,.3,1],[-.05,.05,1],[.3,.05,1],[.3,.3,1]),
  cupboard:()=>S(rect(-.45,-.45,.9,.9),line([-.45,-.15],[.45,-.15]),line([-.45,.15],[.45,.15])),
  can:()=>S(arc(0,-.06,.06,.02,0,Math.PI*2,14),line([.06,-.06],[.06,.06]),arc(0,.06,.06,.02,0,Math.PI,8),line([-.06,.06],[-.06,-.06])),
  chair:()=>line([-.15,-.45,1],[-.15,.4,1],[-.15,.02,1],[.2,.02,1],[.2,.4,1]),
  clothes:()=>chaikin(line([-.18,0,1],[-.12,-.12],[0,-.08],[.08,-.16],[.2,-.06],[.22,.08,1],[.2,.18,1],[.12,.05],[-.05,.1],[-.15,.2,1],[-.18,0,1]),2),
  mic:()=>S(arc(0,-.38,.05,.07,0,Math.PI*2,16),line([0,-.31],[0,.45,1],[-.12,.5]),line([0,.45],[.12,.5])),
  sign:()=>S(line([0,.5],[0,-.45]),line([0,-.4,1],[.32,-.4,1],[.4,-.33,1],[.32,-.26,1],[0,-.26,1]),line([0,-.18,1],[-.32,-.18,1],[-.4,-.11,1],[-.32,-.04,1],[0,-.04,1])),
  saleSign:()=>S(line([0,.5],[0,-.1]),rect(-.22,-.35,.44,.25)),
  letter:()=>S(line([-.22,-.3,1],[.18,-.3,1],[.24,-.24,1],[.24,.32,1],[-.22,.32,1],[-.22,-.3,1]),...[-.16,-.06,.04,.14].map((y,i)=>chaikin(line([-.15,y,1],[-.05,y-.02],[.05,y+.015],[.17-i*.03,y,1]),2))),
  circle:()=>arc(0,0,.5,.5,Math.PI*.5,Math.PI*2.45,80),
  frame:()=>S(rect(-.7,-.42,1.4,.84),...[-.6,-.4,-.2,0,.2,.4,.6].flatMap(x=>[rect(x-.03,-.38,.06,.05),rect(x-.03,.33,.06,.05)])),
  heart:(s=1)=>{const o=[];for(let i=0;i<=60;i++){const t=i/60*Math.PI*2,hx=16*Math.sin(t)**3,hy=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);o.push([hx*.012*s,-hy*.012*s,0]);}return o;},
  drop:(r=.1)=>{const o=[];for(let i=0;i<=40;i++){const t=i/40*Math.PI*2,x=Math.sin(t)*Math.pow(Math.sin(t/2),1.2),y=-Math.cos(t);o.push([x*r*.62,y*r,0]);}return o;},
  star:()=>{const o=[];for(let i=0;i<=10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?.08:.2;o.push([r*Math.cos(a),r*Math.sin(a),1]);}return o;},
  wave:()=>{const o=[];for(let i=0;i<=50;i++)o.push([-.35+i*.014,Math.sin(i*.3)*.08,0]);return o;},
  mountain:()=>line([-.4,.25,1],[-.12,-.25,1],[.02,-.02,1],[.14,-.18,1],[.4,.25,1]),
  hourglass:()=>line([-.18,-.3,1],[.18,-.3,1],[-.15,.3,1],[.15,.3,1],[-.18,-.3,1]),
  breath:()=>S(arc(0,0,.12,.12,0,Math.PI*2,24),arc(0,0,.24,.24,0,Math.PI*2,30),arc(0,0,.36,.36,0,Math.PI*2,36)),
  scale:()=>S(line([0,.35],[0,-.3]),line([-.3,-.25],[.3,-.25]),arc(-.3,-.1,.1,.07,0,Math.PI,10),arc(.3,-.1,.1,.07,0,Math.PI,10)),
  cross:()=>S(line([-.1,-.1],[.1,.1]),line([.1,-.1],[-.1,.1])),
};


const out=pts=>pts.map(([x,y,f])=>[x,y,f===2?1:0]);
const wrapI={};for(const k in I)wrapI[k]=(...a)=>out(I[k](...a));
window.FIGURES={bez,person,walker,walkAcross,profile,baby,inBed,seated,yogaTree,chaikin,mirror,flipX,arc,T,M,line,rect,potPlant,I:wrapI,out};
})();
