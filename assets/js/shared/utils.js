// ===================== UTILS =====================
function genId(p){return p+String(Date.now()).slice(-6)+String(Math.random()).slice(2,5)}
function fmtD(d){if(!d)return'-';const p=d.split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:d}
function catN(k){return categoryConfig[k]?.name||k}
function catC(k){return{thietbi:'cat-thietbi',linhkien:'cat-linhkien',ngoai_vi:'cat-ngoai_vi',tieuhao:'cat-tieuhao'}[k]||'badge-info'}
function stB(s){const m={available:['Sẵn sàng','badge-success'],allocated:['Đã cấp phát','badge-info'],borrowed:['Đang mượn','badge-warning']};const[t,c]=m[s]||[s,'badge-secondary'];return`<span class="badge ${c}">${t}</span>`}
function normalizeCondition(value){const raw=(value||'').toString().trim(),key=raw.toLocaleLowerCase('vi-VN').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/\s+/g,' ');if(['new','moi'].includes(key))return'new';if(['old','used','cu','da qua sd','da qua su dung'].includes(key))return'old';if(['broken','hong'].includes(key))return'broken';return raw}
function getConditionLabel(value){const condition=normalizeCondition(value);return{new:'Mới',old:'Cũ',broken:'Hỏng'}[condition]||condition}
function getConditionSearchText(value){const condition=normalizeCondition(value),label=getConditionLabel(value);return condition==='old'?`${label} Đã qua SD Đã qua sử dụng old used`:label}
function cdB(c){if(!c)return'-';const condition=normalizeCondition(c),cls={new:'cond-new',old:'cond-old',broken:'cond-broken'}[condition]||'';return`<span class="badge ${cls}">${getConditionLabel(c)}</span>`}
function acB(t){return`<span class="badge ${{allocate:'badge-info',return:'badge-success',borrow:'badge-warning',add:'badge-secondary'}[t]||'badge-secondary'}">${t}</span>`}
function getInitials(n){if(!n)return'?';return n.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
function getActiveUsers(){return users.filter(u=>u.status==='active')}
function qtyBadge(q){return`<span class="qty-badge"><i class="fas fa-cubes"></i> SL: ${q}</span>`}
function localDateInputValue(date){const d=date instanceof Date?date:new Date();const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return`${y}-${m}-${day}`}
function setNewTransactionDateDefaults(formId){const form=document.getElementById(formId);if(!form)return;const today=localDateInputValue();form.querySelectorAll('input[type="date"][data-default-today]').forEach(input=>{if(!input.value)input.value=today})}

function showToast(msg,type='success'){const ic={success:'fa-check-circle',error:'fa-times-circle',warning:'fa-exclamation-circle'};const c=document.getElementById('toastContainer');const el=document.createElement('div');el.className='toast '+type;el.innerHTML=`<i class="fas ${ic[type]||ic.success}"></i><span>${msg}</span>`;c.appendChild(el);setTimeout(()=>{el.style.animation='toastOut .3s forwards';setTimeout(()=>el.remove(),300)},3000)}
function openModal(t,h){if(typeof cleanupAddDevHistoryModal==='function')cleanupAddDevHistoryModal();document.getElementById('modalTitle').textContent=t;document.getElementById('modalBody').innerHTML=h;document.getElementById('modal').classList.add('show')}
function closeModal(){if(typeof cleanupAddDevHistoryModal==='function')cleanupAddDevHistoryModal();document.getElementById('modal').classList.remove('show')}
function openModal2(t,h){document.getElementById('modal2Title').textContent=t;document.getElementById('modal2Body').innerHTML=h;document.getElementById('modal2').classList.add('show')}
function closeModal2(){document.getElementById('modal2').classList.remove('show')}
