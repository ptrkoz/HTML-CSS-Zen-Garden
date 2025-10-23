class Todo {
  
  constructor() {
    this.tasks = [];
    this.filter = '';
    this.currentEdit = null;

    this.$list = document.getElementById('list');
    this.$empty = document.getElementById('empty');
    this.$search = document.getElementById('search');
    this.$newText = document.getElementById('new-text');
    this.$newDue = document.getElementById('new-due');
    this.$add = document.getElementById('add');

    this.load();
    this.bind();
    this.draw();
  }

  bind() {
    this.$add.addEventListener('click', ()=>this.handleAdd());
    this.$newText.addEventListener('keydown', (e)=>{ if(e.key==='Enter') this.handleAdd(); });
    this.$search.addEventListener('input', (e)=>{ this.filter = e.target.value.trim(); this.draw(); });

    document.addEventListener('click', (e)=>{
      if(!this.currentEdit) return;
      const editingId = this.currentEdit.id;
      const target = e.target;
      const editInput = document.querySelector(`input[data-edit-id="${editingId}"]`);
      if(!editInput) return this.currentEdit = null;
      if(target===editInput || editInput.contains(target)) return;
      this.saveEdit(editingId);
    });
    this.$list.addEventListener('click', (e)=>e.stopPropagation());
  }

  load(){
    try{
      const raw = localStorage.getItem('listaZadan');
      if(raw) this.tasks = JSON.parse(raw);
    } catch (err) {
      console.warn('Błąd wczytywania', err);
      this.tasks = [];
    }
  }

  save(){ localStorage.setItem('listaZadan', JSON.stringify(this.tasks)); }

  validateText(text){
    if(!text) return 'Tekst jest wymagany.';
    if(text.trim().length < 3) return 'Tekst musi mieć przynajmniej 3 znaki.';
    if(text.trim().length > 255) return 'Tekst nie może mieć więcej niż 255 znaków.';
    return '';
  }

  validateDue(dueValue){
    if(!dueValue) return '';
    const due = new Date(dueValue);
    const now = new Date();
    if(isNaN(due.getTime())) return 'Nieprawidłowa data.';
    if(due <= now) return 'Data musi być w przyszłości.';
    return '';
  }

  handleAdd(){
    const text = this.$newText.value;
    const due = this.$newDue.value;
    const tErr = this.validateText(text.trim());
    if(tErr){ alert(tErr); return; }
    const dErr = this.validateDue(due);
    if(dErr){ alert(dErr); return; }

    const task = { id: Date.now().toString()+Math.random().toString(36).slice(2,6), text: text.trim(), due: due || null };
    this.tasks.push(task);
    this.save();
    this.$newText.value = '';
    this.$newDue.value = '';
    this.draw();
  }

  remove(id) { 
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
    this.draw();
  }
  
  startEdit(id) { 
    if(this.currentEdit && this.currentEdit.id !== id) this.saveEdit(this.currentEdit.id); 
    this.currentEdit = { id }; this.draw();
    const input=document.querySelector(`input[data-edit-id="${id}"]`); 
    if (input) {
      input.focus();input.select();
    }
  }
  
  saveEdit(id) {
    const input=document.querySelector(`input[data-edit-id="${id}"]`);
    const dueInput=document.querySelector(`input[due-edit-id="${id}"]`);
    if(!input || !dueInput) {
      this.currentEdit=null;
      return;
    }
    const newText=input.value.trim();
    const err=this.validateText(newText);
    if(err) {
      alert(err);
      input.focus();
      return;
    }
    const task=this.tasks.find(t=>t.id===id);
    if(task) {
      task.text=newText;
      task.due=dueInput.value||null;
    }
    this.currentEdit=null;
    this.save();
    this.draw();
  }
  
  editKeydownHandler(e,id) {
    if(e.key==='Enter') return this.saveEdit(id);
    if(e.key==='Escape'){ this.currentEdit=null; this.draw(); }
  }
  
  formatDue(due) {
    if(!due) return '';
    try{ const d=new Date(due); return d.toLocaleString(); }
    catch(e){ return due; }
  }
  
  matchesFilter(task){
    if(!this.filter||this.filter.length<2) return true;
    return task.text.toLowerCase().includes(this.filter.toLowerCase());
  }

  highlight(text, phrase) {
    if(!phrase||phrase.length<2) return this.escapeHtml(text);
    const re=new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'ig');
    return this.escapeHtml(text).replace(re,m=>`<mark>${m}</mark>`);
  }

  escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
  
  escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }


  draw(){
    this.$list.innerHTML='';
    this.$list.style.padding = '0';
    const visible=this.tasks.filter(t=>this.matchesFilter(t));
    this.$empty.style.display=visible.length?'none':'block';
    visible.forEach(task=>{
      const li=document.createElement('li');
      li.className='task';

      li.style.display='flex';
      li.style.alignItems='center';
      li.style.justifyContent='space-between';
      li.style.padding='8px 0';
      li.style.borderBottom='1px solid #eee';

      const left=document.createElement('div');
      left.className='left';
      left.style.display='flex';
      left.style.alignItems='center';
      left.style.flex='1';
      left.style.gap='12px';
      left.style.minWidth='0';

      const textWrapper=document.createElement('div'); 
      textWrapper.style.display='flex';
      textWrapper.style.alignItems='center';
      textWrapper.style.gap='12px';
      textWrapper.style.flex='1';
      textWrapper.style.minWidth='0';

      if(this.currentEdit&&this.currentEdit.id===task.id){
        const input=document.createElement('input');
        input.type='text';
        input.className='edit-text';
        input.setAttribute('data-edit-id',task.id);
        input.value=task.text;
        input.addEventListener('keydown',e=>this.editKeydownHandler(e,task.id));
        input.addEventListener('click',e=>e.stopPropagation());
        input.style.flex='1';
        input.style.minWidth='0';

        const meta=document.createElement('input');
        meta.type='datetime-local';
        meta.className='edit-due';
        meta.setAttribute('due-edit-id', task.id);
        meta.value=task.due||'';
        meta.addEventListener('keydown',e=>this.editKeydownHandler(e,task.id));
        meta.addEventListener('click',e=>e.stopPropagation());
        meta.style.flex='0 0 220px';
        meta.style.maxWidth='220px';

        textWrapper.appendChild(input);
        textWrapper.appendChild(meta);
      }else{ 
        const span=document.createElement('div');
        span.className='text';
        span.innerHTML=this.highlight(task.text,this.filter);

        span.style.overflow='hidden';
        span.style.textOverflow='ellipsis';
        span.style.whiteSpace='nowrap';
        span.style.flex='1';
        span.style.minWidth='0';
        span.addEventListener('click',e=>{e.stopPropagation();this.startEdit(task.id);}); 

        const meta=document.createElement('div');
        meta.className='meta';
        meta.textContent=task.due?`Termin: ${this.formatDue(task.due)}`:'';
        meta.addEventListener('click',e=>{e.stopPropagation();this.startEdit(task.id);}); 
        meta.style.flex='0 0 220px';
        meta.style.maxWidth='220px';
        meta.style.textAlign='right';
        meta.style.color='#666';

        textWrapper.appendChild(span)
        textWrapper.appendChild(meta);
      }
      left.appendChild(textWrapper);
      
      const right=document.createElement('div');
      right.style.display='flex';
      right.style.alignItems='center';
      right.style.gap='8px';
      right.style.marginLeft='12px';

      const del=document.createElement('button');
      del.className='delete';
      del.innerHTML='Usuń';
      del.title='Usuń';
      del.style.minWidth='64px';
      del.addEventListener('click',e=>{e.stopPropagation();
        if(confirm('Usunąć zadanie?')) this.remove(task.id);});
      right.appendChild(del);

      li.appendChild(left);
      li.appendChild(right);
      this.$list.appendChild(li);
    });
    if(this.filter&&this.filter.length>=2){ this.$list.setAttribute('aria-label',`Wyniki wyszukiwania: ${visible.length}`);} else {this.$list.removeAttribute('aria-label');}
  }
}

window.addEventListener('DOMContentLoaded',()=>window.todoApp=new Todo());
