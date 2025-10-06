/*! moffel.fit Persoonlijke Profiel Widget v1.0
 *  Opslag: localStorage met per-persoon namespace: moffelfit:{slug}:profile
 *  Publieke API op window.ProfileWidget: setCalories, incrementWorkouts, getData, clear
 */
(function(){
  const NS = 'moffelfit';
  const KEY = (slug) => `${NS}:${slug}:profile`;

  function load(slug){
    try{ return JSON.parse(localStorage.getItem(KEY(slug))||'{}'); }
    catch(e){ return {}; }
  }
  function save(slug, data){
    localStorage.setItem(KEY(slug), JSON.stringify(data));
  }

  function el(sel, root=document){ return root.querySelector(sel); }
  function els(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  function formatWeight(value){
    if(value==='' || value==null) return '';
    // Intern: punt als decimaal, Extern: komma
    let num = (''+value).replace(',', '.').replace(/[^0-9.]/g,'');
    if(num==='') return '';
    const f = Math.round(parseFloat(num)*10)/10; // 1 decimaal
    return f.toString().replace('.', ',');
  }
  function parseWeight(viewValue){
    if(viewValue===''||viewValue==null) return null;
    const num = viewValue.replace(',', '.').replace(/[^0-9.]/g,'');
    const f = parseFloat(num);
    return Number.isFinite(f)? f : null;
  }

  function render(root){
    const slug = root.dataset.person;
    if(!slug){ console.warn('profile widget: data-person ontbreekt'); return; }
    const data = Object.assign({
      firstName:'', lastName:'', heightCm:'', weightKg:null,
      caloriesKcal:'', workoutsCompleted:0, photoDataUrl:''
    }, load(slug));

    // Bind inputs
    const bindText = (sel, key, transformIn=(v)=>v, transformOut=(v)=>v) => {
      const node = el(sel, root);
      if(!node) return;
      node.value = transformIn(data[key]||'');
      node.addEventListener('input', ()=>{
        data[key] = transformOut(node.value);
        save(slug, data);
      });
    };

    bindText('[data-field="firstName"]','firstName');
    bindText('[data-field="lastName"]','lastName');
    bindText('[data-field="heightCm"]','heightCm', v=>v, v=>v.replace(/[^0-9]/g,''));
    // Gewicht met komma-notatie
    const weightInput = el('[data-field="weightKg"]', root);
    if(weightInput){
      weightInput.value = formatWeight(data.weightKg);
      weightInput.addEventListener('blur', ()=>{
        const parsed = parseWeight(weightInput.value);
        data.weightKg = parsed;
        weightInput.value = formatWeight(parsed);
        save(slug, data);
      });
      weightInput.addEventListener('input', ()=>{
        // live opslaan, maar niet formatteren
        const parsed = parseWeight(weightInput.value);
        data.weightKg = parsed;
        save(slug, data);
      });
    }

    // Calories (laatst bekende)
    const calInput = el('[data-field="caloriesKcal"]', root);
    if(calInput){
      calInput.value = data.caloriesKcal || '';
      calInput.addEventListener('input', ()=>{
        data.caloriesKcal = calInput.value.replace(/[^0-9]/g,'');
        save(slug, data);
      });
    }

    // Workouts
    const workoutCount = el('[data-field="workoutsCompleted"]', root);
    const incBtn = el('[data-action="inc-workouts"]', root);
    if(workoutCount){
      workoutCount.textContent = data.workoutsCompleted || 0;
    }
    if(incBtn){
      incBtn.addEventListener('click', ()=>{
        data.workoutsCompleted = (data.workoutsCompleted||0) + 1;
        save(slug, data);
        workoutCount.textContent = data.workoutsCompleted;
      });
    }

    // Foto upload
    const avatarImg = el('[data-field="photo"] img', root);
    const avatarInput = el('[data-field="photo-input"]', root);
    if(avatarImg && data.photoDataUrl){
      avatarImg.src = data.photoDataUrl;
      avatarImg.style.display = 'block';
    }
    if(avatarInput){
      avatarInput.addEventListener('change', ()=>{
        const file = avatarInput.files && avatarInput.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (e)=>{
          data.photoDataUrl = e.target.result;
          save(slug, data);
          if(avatarImg){
            avatarImg.src = data.photoDataUrl;
            avatarImg.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // Dag-knoppen automatisch linken op basis van slug
    els('[data-day]', root).forEach(a=>{
      const day = a.getAttribute('data-day');
      a.href = `/${slug}/${day}.html`;
    });
  }

  // Auto-init
  function initAll(){
    document.querySelectorAll('[data-profile-widget]').forEach(render);
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initAll);
  } else { initAll(); }

  // Exporteer eenvoudige API
  window.ProfileWidget = {
    setCalories(slug, kcal){
      const data = Object.assign({},{}, load(slug));
      data.caloriesKcal = String(kcal).replace(/[^0-9]/g,'');
      save(slug, data);
    },
    incrementWorkouts(slug, n=1){
      const data = Object.assign({workoutsCompleted:0}, load(slug));
      data.workoutsCompleted = (data.workoutsCompleted||0) + (n||1);
      save(slug, data);
    },
    getData(slug){ return load(slug); },
    clear(slug){ localStorage.removeItem(KEY(slug)); }
  };
})();