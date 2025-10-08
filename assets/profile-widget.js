/*! moffel.fit Persoonlijke Profiel Widget v1.1 (routes fix) */
(function(){
  const NS = 'moffelfit';
  const KEY = (slug) => `${NS}:${slug}:profile`;
  const load = (slug) => { try { return JSON.parse(localStorage.getItem(KEY(slug))||'{}'); } catch(e){ return {}; } };
  const save = (slug, data) => localStorage.setItem(KEY(slug), JSON.stringify(data));
  const el = (sel, root=document) => root.querySelector(sel);
  const els = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const formatWeight = (v)=>{
    if(v===''||v==null) return '';
    let num = (''+v).replace(',', '.').replace(/[^0-9.]/g,'');
    if(num==='') return '';
    const f = Math.round(parseFloat(num)*10)/10;
    return f.toString().replace('.', ',');
  };
  const parseWeight = (v)=>{
    if(v===''||v==null) return null;
    const f = parseFloat(v.replace(',', '.').replace(/[^0-9.]/g,''));
    return Number.isFinite(f) ? f : null;
  };

  function render(root){
    const slug = root.dataset.person;
    if(!slug) return;
    const data = Object.assign({firstName:'',lastName:'',heightCm:'',weightKg:null,caloriesKcal:'',workoutsCompleted:0,photoDataUrl:''}, load(slug));

    const bindText=(sel,key,inn=(v)=>v,out=(v)=>v)=>{
      const node = el(sel, root); if(!node) return;
      node.value = inn(data[key]||'');
      node.addEventListener('input', ()=>{ data[key]=out(node.value); save(slug,data); });
    };
    bindText('[data-field="firstName"]','firstName');
    bindText('[data-field="lastName"]','lastName');
    bindText('[data-field="heightCm"]','heightCm',(v)=>v,(v)=>v.replace(/[^0-9]/g,''));

    const w = el('[data-field="weightKg"]', root);
    if(w){
      w.value = formatWeight(data.weightKg);
      w.addEventListener('blur', ()=>{ data.weightKg = parseWeight(w.value); w.value = formatWeight(data.weightKg); save(slug,data); });
      w.addEventListener('input', ()=>{ data.weightKg = parseWeight(w.value); save(slug,data); });
    }

    const c = el('[data-field="caloriesKcal"]', root);
    if(c){
      c.value = data.caloriesKcal||'';
      c.addEventListener('input', ()=>{ data.caloriesKcal = c.value.replace(/[^0-9]/g,''); save(slug,data); });
    }

    const wc = el('[data-field="workoutsCompleted"]', root);
    const inc = el('[data-action="inc-workouts"]', root);
    if(wc) wc.textContent = data.workoutsCompleted||0;
    if(inc) inc.addEventListener('click', ()=>{ data.workoutsCompleted=(data.workoutsCompleted||0)+1; save(slug,data); wc.textContent=data.workoutsCompleted; });

    const avatarImg = el('[data-field="photo"] img', root);
    const avatarInput = el('[data-field="photo-input"]', root);
    if(avatarImg && data.photoDataUrl){ avatarImg.src = data.photoDataUrl; avatarImg.style.display='block'; }
    if(avatarInput){
      avatarInput.addEventListener('change', ()=>{
        const file = avatarInput.files && avatarInput.files[0]; if(!file) return;
        const reader = new FileReader();
        reader.onload = (e)=>{ data.photoDataUrl = e.target.result; save(slug,data); if(avatarImg){ avatarImg.src=data.photoDataUrl; avatarImg.style.display='block'; } };
        reader.readAsDataURL(file);
      });
    }

    // ✅ FIXED ROUTE TARGETS
    els('[data-day]', root).forEach(a => {
      const day = a.getAttribute('data-day').replace('/', '').trim();
      a.href = `/${slug}/workouts/${day}/`;
    });
  }

  function initAll(){ document.querySelectorAll('[data-profile-widget]').forEach(render); }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', initAll); } else { initAll(); }

  window.ProfileWidget = {
    setCalories(slug,kcal){ const d=Object.assign({}, load(slug)); d.caloriesKcal=String(kcal).replace(/[^0-9]/g,''); save(slug,d); },
    incrementWorkouts(slug,n=1){ const d=Object.assign({workoutsCompleted:0}, load(slug)); d.workoutsCompleted=(d.workoutsCompleted||0)+(n||1); save(slug,d); },
    getData(slug){ return load(slug); },
    clear(slug){ localStorage.removeItem(KEY(slug)); }
  };
})();
