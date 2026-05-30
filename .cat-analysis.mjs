// Categorical palette accessibility analysis: WCAG contrast + CVD collision.
// Throwaway analysis script.

// Tailwind v3 ramps for the 16 reference hues (shade -> hex)
const T = {
  cyan:    {50:'#ECFEFF',100:'#CFFAFE',300:'#67E8F9',400:'#22D3EE',500:'#06B6D4',600:'#0891B2',700:'#0E7490',800:'#155E75'},
  orange:  {50:'#FFF7ED',100:'#FFEDD5',300:'#FDBA74',400:'#FB923C',500:'#F97316',600:'#EA580C',700:'#C2410C',800:'#9A3412'},
  yellow:  {50:'#FEFCE8',100:'#FEF9C3',300:'#FDE047',400:'#FACC15',500:'#EAB308',600:'#CA8A04',700:'#A16207',800:'#854D0E'},
  violet:  {50:'#F5F3FF',100:'#EDE9FE',300:'#C4B5FD',400:'#A78BFA',500:'#8B5CF6',600:'#7C3AED',700:'#6D28D9',800:'#5B21B6'},
  sky:     {50:'#F0F9FF',100:'#E0F2FE',300:'#7DD3FC',400:'#38BDF8',500:'#0EA5E9',600:'#0284C7',700:'#0369A1',800:'#075985'},
  pink:    {50:'#FDF2F8',100:'#FCE7F3',300:'#F9A8D4',400:'#F472B6',500:'#EC4899',600:'#DB2777',700:'#BE185D',800:'#9D174D'},
  fuchsia: {50:'#FDF4FF',100:'#FAE8FF',300:'#F0ABFC',400:'#E879F9',500:'#D946EF',600:'#C026D3',700:'#A21CAF',800:'#86198F'},
  rose:    {50:'#FFF1F2',100:'#FFE4E6',300:'#FDA4AF',400:'#FB7185',500:'#F43F5E',600:'#E11D48',700:'#BE123C',800:'#9F1239'},
  amber:   {50:'#FFFBEB',100:'#FEF3C7',300:'#FCD34D',400:'#FBBF24',500:'#F59E0B',600:'#D97706',700:'#B45309',800:'#92400E'},
  purple:  {50:'#FAF5FF',100:'#F3E8FF',300:'#D8B4FE',400:'#C084FC',500:'#A855F7',600:'#9333EA',700:'#7E22CE',800:'#6B21A8'},
  indigo:  {50:'#EEF2FF',100:'#E0E7FF',300:'#A5B4FC',400:'#818CF8',500:'#6366F1',600:'#4F46E5',700:'#4338CA',800:'#3730A3'},
  lime:    {50:'#F7FEE7',100:'#ECFCCB',300:'#BEF264',400:'#A3E635',500:'#84CC16',600:'#65A30D',700:'#4D7C0F',800:'#3F6212'},
  red:     {50:'#FEF2F2',100:'#FEE2E2',300:'#FCA5A5',400:'#F87171',500:'#EF4444',600:'#DC2626',700:'#B91C1C',800:'#991B1B'},
  slate:   {50:'#F8FAFC',100:'#F1F5F9',300:'#CBD5E1',400:'#94A3B8',500:'#64748B',600:'#475569',700:'#334155',800:'#1E293B'},
  teal:    {50:'#F0FDFA',100:'#CCFBF1',300:'#5EEAD4',400:'#2DD4BF',500:'#14B8A6',600:'#0D9488',700:'#0F766E',800:'#115E59'},
  blue:    {50:'#EFF6FF',100:'#DBEAFE',300:'#93C5FD',400:'#60A5FA',500:'#3B82F6',600:'#2563EB',700:'#1D4ED8',800:'#1E40AF'},
};

// belle-todo category -> hue family, in proposed index order (1..16)
const CATS = [
  ['gift','red'], ['venue','orange'], ['entertainment','amber'], ['budget','yellow'],
  ['paper','lime'], ['meeting','teal'], ['family','cyan'], ['guest','sky'],
  ['schedule','blue'], ['photo','indigo'], ['ring','violet'], ['bgm','purple'],
  ['beauty','fuchsia'], ['dress','pink'], ['invitation','rose'], ['official','slate'],
];

const hex2rgb = h => { h=h.replace('#',''); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; };
const srgb2lin = c => { c/=255; return c<=0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4); };
const lin2srgb = c => { const v = c<=0.0031308 ? c*12.92 : 1.055*Math.pow(c,1/2.4)-0.055; return Math.max(0,Math.min(255,Math.round(v*255))); };
const relLum = h => { const [r,g,b]=hex2rgb(h).map(srgb2lin); return 0.2126*r+0.7152*g+0.0722*b; };
const contrast = (a,b) => { const L1=relLum(a),L2=relLum(b); const hi=Math.max(L1,L2),lo=Math.min(L1,L2); return (hi+0.05)/(lo+0.05); };

const WHITE='#FFFFFF', G900='#111827', G800='#1F2937';

// ---- WCAG table ----
console.log('=== WCAG CONTRAST (target: text 4.5, non-text/UI 3.0) ===');
console.log('cat'.padEnd(14), 'fam'.padEnd(9), '500/wht', '600/wht', '700/wht', '700/100', '800/100', '| dark: 300/900 400/900 300/800');
for (const [cat,fam] of CATS) {
  const r=T[fam];
  const row = [
    contrast(r[500],WHITE).toFixed(2),
    contrast(r[600],WHITE).toFixed(2),
    contrast(r[700],WHITE).toFixed(2),
    contrast(r[700],r[100]).toFixed(2),
    contrast(r[800],r[100]).toFixed(2),
  ];
  const dark = [
    contrast(r[300],G900).toFixed(2),
    contrast(r[400],G900).toFixed(2),
    contrast(r[300],G800).toFixed(2),
  ];
  console.log(cat.padEnd(14), fam.padEnd(9), row.map(x=>x.padStart(6)).join(' '), '|', dark.map(x=>x.padStart(6)).join(' '));
}

// ---- CVD simulation (Machado et al. 2009, severity 1.0, linear-RGB matrices) ----
const M = {
  normal:  [1,0,0, 0,1,0, 0,0,1],
  protan:  [0.152286,1.052583,-0.204868, 0.114503,0.786281,0.099216, -0.003882,-0.048116,1.051998],
  deutan:  [0.367322,0.860646,-0.227968, 0.280085,0.672501,0.047413, -0.011820,0.042940,0.968881],
  tritan:  [1.255528,-0.076749,-0.178779, -0.078411,0.930809,0.147602, 0.004733,0.691367,0.303900],
};
const simulate = (hex,m) => {
  const [r,g,b]=hex2rgb(hex).map(srgb2lin);
  const R=m[0]*r+m[1]*g+m[2]*b, G=m[3]*r+m[4]*g+m[5]*b, B=m[6]*r+m[7]*g+m[8]*b;
  return [lin2srgb(R),lin2srgb(G),lin2srgb(B)];
};
// sRGB(0-255)->Lab (D65)
const rgb2lab = ([r,g,b]) => {
  let R=srgb2lin(r),G=srgb2lin(g),B=srgb2lin(b);
  let X=(R*0.4124+G*0.3576+B*0.1805)/0.95047;
  let Y=(R*0.2126+G*0.7152+B*0.0722)/1.00000;
  let Z=(R*0.0193+G*0.1192+B*0.9505)/1.08883;
  const f=t=>t>0.008856?Math.cbrt(t):7.787*t+16/116;
  const fx=f(X),fy=f(Y),fz=f(Z);
  return [116*fy-16, 500*(fx-fy), 200*(fy-fz)];
};
// CIEDE2000
const de2000 = (lab1,lab2) => {
  const [L1,a1,b1]=lab1,[L2,a2,b2]=lab2;
  const avgL=(L1+L2)/2;
  const C1=Math.hypot(a1,b1),C2=Math.hypot(a2,b2),avgC=(C1+C2)/2;
  const G=0.5*(1-Math.sqrt(Math.pow(avgC,7)/(Math.pow(avgC,7)+Math.pow(25,7))));
  const a1p=a1*(1+G),a2p=a2*(1+G);
  const C1p=Math.hypot(a1p,b1),C2p=Math.hypot(a2p,b2),avgCp=(C1p+C2p)/2;
  const h=(x,y)=>{ if(x===0&&y===0)return 0; let a=Math.atan2(y,x)*180/Math.PI; return a<0?a+360:a; };
  const h1p=h(a1p,b1),h2p=h(a2p,b2);
  const dLp=L2-L1, dCp=C2p-C1p;
  let dhp; const dh=h2p-h1p;
  if(C1p*C2p===0)dhp=0; else if(Math.abs(dh)<=180)dhp=dh; else dhp=dh>180?dh-360:dh+360;
  const dHp=2*Math.sqrt(C1p*C2p)*Math.sin(dhp*Math.PI/360);
  let avghp; if(C1p*C2p===0)avghp=h1p+h2p; else if(Math.abs(h1p-h2p)<=180)avghp=(h1p+h2p)/2; else avghp=(h1p+h2p+ (h1p+h2p<360?360:-360))/2;
  const T_=1-0.17*Math.cos((avghp-30)*Math.PI/180)+0.24*Math.cos((2*avghp)*Math.PI/180)+0.32*Math.cos((3*avghp+6)*Math.PI/180)-0.20*Math.cos((4*avghp-63)*Math.PI/180);
  const dTheta=30*Math.exp(-Math.pow((avghp-275)/25,2));
  const Rc=2*Math.sqrt(Math.pow(avgCp,7)/(Math.pow(avgCp,7)+Math.pow(25,7)));
  const Sl=1+(0.015*Math.pow(avgL-50,2))/Math.sqrt(20+Math.pow(avgL-50,2));
  const Sc=1+0.045*avgCp, Sh=1+0.015*avgCp*T_;
  const Rt=-Rc*Math.sin(2*dTheta*Math.PI/180);
  return Math.sqrt(Math.pow(dLp/Sl,2)+Math.pow(dCp/Sc,2)+Math.pow(dHp/Sh,2)+Rt*(dCp/Sc)*(dHp/Sh));
};

// sanity check
console.log('\n[sanity] dE(black,white)=', de2000(rgb2lab([0,0,0]),rgb2lab([255,255,255])).toFixed(1), ' dE(same)=', de2000(rgb2lab([100,50,50]),rgb2lab([100,50,50])).toFixed(2));

console.log('\n=== CVD COLLISIONS among base(500) colors — closest pairs per vision type (dE2000) ===');
for (const type of ['normal','protan','deutan','tritan']) {
  const labs = CATS.map(([cat,fam]) => ({cat, lab: rgb2lab(simulate(T[fam][500], M[type]))}));
  const pairs=[];
  for(let i=0;i<labs.length;i++)for(let j=i+1;j<labs.length;j++)pairs.push({a:labs[i].cat,b:labs[j].cat,d:de2000(labs[i].lab,labs[j].lab)});
  pairs.sort((x,y)=>x.d-y.d);
  const worst=pairs.slice(0,6).map(p=>`${p.a}/${p.b}=${p.d.toFixed(1)}`).join('  ');
  console.log(type.padEnd(8), 'min dE pairs:', worst);
}

// ---- best-fit Subtle alpha: base(500) over white ≈ Tailwind-100 ----
const mixOverWhite = (hex,a) => hex2rgb(hex).map(c => Math.round(c*a + 255*(1-a)));
console.log('\n=== Subtle tint: alpha of base(500) over white that best matches Tailwind-100 ===');
let alphas=[];
for (const [cat,fam] of CATS){
  const r=T[fam]; const target=rgb2lab(hex2rgb(r[100]));
  let best=1,bd=1e9;
  for(let a=0.06;a<=0.30;a+=0.005){ const d=de2000(rgb2lab(mixOverWhite(r[500],a)),target); if(d<bd){bd=d;best=a;} }
  alphas.push(best);
}
alphas.sort((x,y)=>x-y);
const med=alphas[Math.floor(alphas.length/2)];
console.log('per-hue best alpha range:', (alphas[0]*100).toFixed(0)+'%','..',(alphas[alphas.length-1]*100).toFixed(0)+'%', ' median≈', (med*100).toFixed(0)+'%');
// verify: Bold(700) text on a 14% mix tint — worst case
console.log('\n=== Bold(700) text on color-mix(base 14%, white) tint — min contrast across 16 ===');
let mn=99;
for(const [cat,fam] of CATS){ const r=T[fam]; const tint='#'+mixOverWhite(r[500],0.14).map(c=>c.toString(16).padStart(2,'0')).join(''); const c=contrast(r[700],tint); if(c<mn)mn=c; }
console.log('min Bold/tint(14%) contrast =', mn.toFixed(2));

// ---- greedy max-min CVD-aware ordering (worst dE over normal+protan+deutan) ----
const labAll = {};
for(const [cat,fam] of CATS){ labAll[cat]={ normal:rgb2lab(simulate(T[fam][500],M.normal)), protan:rgb2lab(simulate(T[fam][500],M.protan)), deutan:rgb2lab(simulate(T[fam][500],M.deutan)) }; }
const dmin=(a,b)=>Math.min(de2000(labAll[a].normal,labAll[b].normal),de2000(labAll[a].protan,labAll[b].protan),de2000(labAll[a].deutan,labAll[b].deutan));
const names=CATS.map(c=>c[0]);
// start from the hue with max total separation, then greedily add the one maximizing min-distance to chosen set
let chosen=[]; let remaining=[...names];
// seed: pair with the largest mutual distance, pick the more "central"/distinct one => just start with 'gift' (red) as a stable anchor, then greedy
chosen.push('red'in labAll?'gift':names[0]);
remaining=remaining.filter(n=>n!==chosen[0]);
while(remaining.length){ let bestN=null,bestScore=-1; for(const n of remaining){ const s=Math.min(...chosen.map(c=>dmin(n,c))); if(s>bestScore){bestScore=s;bestN=n;} } chosen.push(bestN); remaining=remaining.filter(n=>n!==bestN); }
console.log('\n=== CVD-aware greedy ordering (most-separable-first; min dE to prior set in []) ===');
chosen.forEach((n,i)=>{ const s = i===0?'-':Math.min(...chosen.slice(0,i).map(c=>dmin(n,c))).toFixed(1); console.log(String(i+1).padStart(2), n.padEnd(14), 'minDE-to-prev-set:', s); });
