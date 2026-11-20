// מנוע מצגת: שקף אחד בכל פעם, ניווט במקלדת, בהחלקה ובכפתורים. #מספר בכתובת = מספר השקף.
(function(){
 'use strict';
 const slides=[...document.querySelectorAll('.slide')];
 if(!slides.length)return;
 let cur=0;
 const home=document.body.dataset.home||'hackathon.html';
 const nav=document.createElement('nav');nav.className='navbar';nav.setAttribute('aria-label','ניווט במצגת');
 nav.innerHTML=`<button class="nb" id="dPrev" type="button" aria-label="השקף הקודם">→ הקודם</button><span class="counter" id="dCount"></span><button class="nb" id="dNext" type="button" aria-label="השקף הבא">הבא ←</button><span class="ttl" id="dTitle"></span><span class="dots" id="dDots"></span><a class="home" href="${home}">כל התוצרים</a><span class="credit">© Abed Mihilia</span>`;
 const prog=document.createElement('div');prog.className='progress';prog.innerHTML='<i></i>';
 document.body.append(prog,nav);
 const dots=document.getElementById('dDots');
 dots.innerHTML=slides.map((s,i)=>`<button type="button" aria-label="שקף ${i+1}"></button>`).join('');
 [...dots.children].forEach((b,i)=>b.addEventListener('click',()=>show(i)));
 const titleOf=s=>s.dataset.title||(s.querySelector('h1,h2')?.textContent||'').trim();
 function show(i){
  i=Math.max(0,Math.min(slides.length-1,i));cur=i;
  slides.forEach((s,k)=>{s.classList.toggle('active',k===i);s.setAttribute('aria-hidden',k===i?'false':'true');});
  slides[i].scrollTop=0;
  document.getElementById('dCount').textContent=`${i+1} / ${slides.length}`;
  document.getElementById('dTitle').textContent=titleOf(slides[i]);
  document.getElementById('dPrev').disabled=i===0;
  document.getElementById('dNext').disabled=i===slides.length-1;
  [...dots.children].forEach((b,k)=>b.classList.toggle('on',k===i));
  prog.firstChild.style.width=`${(i+1)/slides.length*100}%`;
  if(location.hash!=='#'+(i+1))history.replaceState(null,'','#'+(i+1));
  document.dispatchEvent(new CustomEvent('slidechange',{detail:i}));
 }
 window.deckShow=show;
 document.getElementById('dPrev').addEventListener('click',()=>show(cur-1));
 document.getElementById('dNext').addEventListener('click',()=>show(cur+1));
 document.addEventListener('keydown',e=>{
  const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'))return;
  if(['ArrowLeft','PageDown',' '].includes(e.key)){e.preventDefault();show(cur+1);}
  else if(['ArrowRight','PageUp'].includes(e.key)){e.preventDefault();show(cur-1);}
  else if(e.key==='Home'){show(0);}else if(e.key==='End'){show(slides.length-1);}
 });
 let sx=null,sy=null;
 document.addEventListener('touchstart',e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;},{passive:true});
 document.addEventListener('touchend',e=>{if(sx==null)return;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;sx=null;
  if(e.target.closest('input[type=range]'))return;
  if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.5){dx<0?show(cur+1):show(cur-1);}},{passive:true});
 window.addEventListener('hashchange',()=>{const n=parseInt(location.hash.slice(1),10);if(n&&n-1!==cur)show(n-1);});

 // בוחר: כפתורים עם data-target ו-data-info. לחיצה מסמנת את הכפתור ומציגה את המידע.
 document.querySelectorAll('[data-target][data-info]').forEach(btn=>{
  btn.addEventListener('click',()=>{
   document.querySelectorAll(`[data-target="${btn.dataset.target}"]`).forEach(b=>b.classList.toggle('on',b===btn));
   const box=document.getElementById(btn.dataset.target);if(box)box.innerHTML=btn.dataset.info;
  });
 });
 const seen=new Set();
 document.querySelectorAll('[data-target][data-info]').forEach(b=>{if(!seen.has(b.dataset.target)){seen.add(b.dataset.target);b.click();}});

 const n=parseInt(location.hash.slice(1),10);
 show(n?n-1:0);
})();
