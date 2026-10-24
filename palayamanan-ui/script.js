// Pop-ups use <dialog>, so clicking a button never changes the URL or scrolls the page.
function stripe(tb){var n=0;tb.querySelectorAll('tr').forEach(function(r){if(r.hidden)return;r.classList.toggle('alt',n++%2===1);});}
document.addEventListener('click',function(e){
  var f=e.target.closest('[data-filter]');
  if(f){
    var g=f.closest('.filters');
    g.querySelectorAll('.fl').forEach(function(b){b.setAttribute('aria-pressed',b===f);});
    var tb=g.parentElement.querySelector('tbody');
    tb.querySelectorAll('tr').forEach(function(r){var k=f.dataset.filter;r.hidden=k!=='all'&&(k==='noaccount'?r.dataset.account!=='none':r.dataset.status!==k);});
    g.parentElement.classList.toggle('noacc',f.dataset.filter==='noaccount');
    stripe(tb);return;
  }
  var o=e.target.closest('[data-open]');
  if(o){e.preventDefault();document.getElementById(o.dataset.open).showModal();return;}
  var s=e.target.closest('[data-swap]');
  if(s){var d=s.closest('dialog');d.close();document.getElementById(s.dataset.swap).showModal();return;}
  var c=e.target.closest('[data-close]');
  if(c){c.closest('dialog').close();return;}
  if(e.target.tagName==='DIALOG'){e.target.close();}
});

(function(){
  var K='palRole',st=null;
  try{st=window.sessionStorage;}catch(e){}
  function get(){try{return st&&st.getItem(K);}catch(e){return null;}}
  function set(v){try{if(st){if(v){st.setItem(K,v);}else{st.removeItem(K);}}}catch(e){}}
  var p=location.pathname.split('/').pop()||'';
  if(/^(login-|index|staff-)/.test(p)){set(null);}
  else if(/^operator-/.test(p)){set('operator');}
  if(/^member-/.test(p)&&get()==='operator'){
    var nav=document.querySelector('.nav');
    if(nav&&!nav.querySelector('.gl')){
      var out=nav.querySelector('a[href^="login-"]');
      var h=document.createElement('span');h.className='gl';h.textContent='Operator';
      nav.insertBefore(h,out);
      [['operator-dashboard.html','Job Dashboard'],['operator-assignments.html','My Assignments'],['operator-history.html','Job History']].forEach(function(x){
        var a=document.createElement('a');a.href=x[0];a.textContent=x[1];nav.insertBefore(a,out);
      });
    }
    var r=document.querySelector('.role');if(r){r.textContent='MEMBER \u00B7 OPERATOR';}
  }
})();

(function(){
  var who=document.querySelector('.top .who');
  if(!who){return;}
  var role=who.textContent.trim();
  var data={
    Member:{name:'Juan Dela Cruz',contact:'0917-111-2222',addr:'Purok 1',rsbsa:'07-12-034-101',bday:'1984-05-20'},
    Operator:{name:'Ben Ramos',contact:'0925-100-0001',addr:'Purok 2'},
    Admin:{name:'Administrator',contact:'0917-000-0000'}
  };
  var me=data[role]||{name:role,contact:''};
  var pg=location.pathname.split('/').pop()||'';
  var outHref=/^member-/.test(pg)?'login-member.html':/^operator-/.test(pg)?'login-operator.html':/^admin-/.test(pg)?'staff-portal-7f3k.html':'login-member.html';

  var cv=document.createElement('span');cv.className='cv';cv.textContent='\u25BE';cv.setAttribute('aria-hidden','true');
  who.appendChild(cv);
  who.setAttribute('role','button');who.setAttribute('tabindex','0');
  who.setAttribute('aria-haspopup','menu');who.setAttribute('aria-expanded','false');

  var menu=document.createElement('div');menu.className='pm';menu.hidden=true;menu.setAttribute('role','menu');
  menu.innerHTML='<div class="pmh">'+me.name+'<span>'+role+' account</span></div>'+
    '<button type="button" role="menuitem" data-pm="pm-profile">My profile</button>'+
    '<button type="button" role="menuitem" data-pm="pm-pass">Change password</button>'+
    '<a class="out" role="menuitem" href="'+outHref+'">Log out</a>';
  who.appendChild(menu);

  function field(id,label,val,ro,type){
    return '<div class="fld"><label for="'+id+'">'+label+'</label><input id="'+id+'" type="'+(type||'text')+'" value="'+(val||'')+'"'+(ro?' readonly':'')+'></div>';
  }
  function build(id,title,intro,fields,ok,check){
    var d=document.createElement('dialog');
    d.id=id;d.className='pdlg';d.setAttribute('aria-label',title);
    d.style.width='min(460px,calc(100% - 32px))';
    var html='<div class="box" style="text-align:left"><h3>'+title+'</h3><p style="text-align:left;margin-bottom:16px">'+intro+'</p>'+fields+
      '<p class="err" role="alert"></p><div class="row" style="margin-top:12px"><button type="button" class="btn o" data-close>Cancel</button><button type="button" class="btn" data-ok>'+ok+'</button></div></div>';
    d.innerHTML=html;document.body.appendChild(d);
    d.addEventListener('click',function(e){
      if(!e.target.closest('[data-ok]')){return;}
      var msg=check(d);
      if(msg){d.querySelector('.err').textContent=msg;return;}
      d.querySelector('.box').innerHTML='<div class="tick">&#10003;</div><h3 style="text-align:center">Saved successfully</h3><p>Your changes have been recorded.</p><button type="button" class="btn full" data-close>Done</button>';
    });
    d.addEventListener('close',function(){d.innerHTML=html;});
  }

  var pf=field('pf-name','Full name',me.name,true);
  pf+=field('pf-contact','Contact number',me.contact,false,'tel');
  if(me.addr){pf+=field('pf-addr','Address',me.addr,false);}
  if(me.rsbsa){pf+=field('pf-rsbsa','RSBSA number',me.rsbsa,true)+field('pf-bday','Birthday',me.bday,true,'date');}
  build('pm-profile','My profile',me.rsbsa?'You can update your contact number and address. To correct your name, RSBSA number or birthday, visit the association office.':'You can update your contact details here.',pf,'Save changes',function(d){
    if(!d.querySelector('#pf-contact').value.trim()){return 'Enter a contact number.';}
    return '';
  });

  var pw=field('pw-cur','Current password','',false,'password')+field('pw-new','New password','',false,'password')+field('pw-con','Confirm new password','',false,'password');
  build('pm-pass','Change password','Use at least 8 characters. Do not share your password with anyone.',pw,'Update password',function(d){
    var c=d.querySelector('#pw-cur').value,n=d.querySelector('#pw-new').value,m=d.querySelector('#pw-con').value;
    if(!c){return 'Enter your current password.';}
    if(n.length<8){return 'New password must be at least 8 characters.';}
    if(n===c){return 'New password must be different from the current one.';}
    if(n!==m){return 'The new passwords do not match.';}
    return '';
  });

  function setOpen(o){menu.hidden=!o;who.setAttribute('aria-expanded',o?'true':'false');}
  who.addEventListener('click',function(e){
    var b=e.target.closest('[data-pm]');
    if(b){setOpen(false);document.getElementById(b.dataset.pm).showModal();return;}
    if(e.target.closest('.pm')){return;}
    setOpen(menu.hidden);
  });
  who.addEventListener('keydown',function(e){
    if(e.target!==who){return;}
    if(e.key==='Enter'||e.key===' '){e.preventDefault();setOpen(menu.hidden);}
  });
  document.addEventListener('click',function(e){if(!who.contains(e.target)){setOpen(false);}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){setOpen(false);}});
})();
