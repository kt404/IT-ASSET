// ===================== PERSISTENCE (Supabase + localStorage cache) =====================
function getStateSnapshot(){return {categoryConfig,devices,users,allocations,returns,borrows,activities,addDevLogs,inventorySnapshots:typeof inventorySnapshots==='undefined'?[]:inventorySnapshots,departments,assetGroups,appSettings}}
function applyStateSnapshot(p){if(!p)return;if(p.categoryConfig)categoryConfig=p.categoryConfig;if(p.devices)devices=p.devices;if(p.users)users=p.users;if(p.allocations)allocations=p.allocations;if(p.returns)returns=p.returns;if(p.borrows)borrows=p.borrows;if(p.activities)activities=p.activities;if(p.addDevLogs)addDevLogs=p.addDevLogs;if(Array.isArray(p.inventorySnapshots))inventorySnapshots=p.inventorySnapshots;if(Array.isArray(p.departments))departments=p.departments;if(Array.isArray(p.assetGroups))assetGroups=p.assetGroups;if(p.appSettings)appSettings=Object.assign({warehouseManagerName:'',warehouseManager:null,defaultWarehouseLocation:''},p.appSettings);if(typeof invalidateDashboardCache==='function')invalidateDashboardCache()}

function setSyncBadge(state){const b=document.getElementById('syncBadge'),t=document.getElementById('syncBadgeText');if(!b)return;b.classList.remove('ok','err','syncing');if(!SUPABASE_CONFIGURED){b.classList.add('err');t.textContent='Chưa cấu hình Supabase';b.title='Chỉ đang lưu cục bộ trên trình duyệt này. Điền SUPABASE_URL/ANON_KEY để đồng bộ đám mây.';return}
    if(typeof setStateHistorySaving==='function')setStateHistorySaving(state==='syncing');
    if(state==='syncing'){b.classList.add('syncing');t.textContent='Đang đồng bộ...'}
    else if(state==='ok'){b.classList.add('ok');t.textContent='Đã đồng bộ';b.title='Dữ liệu đã lưu lên Supabase. Bấm để tải lại mới nhất.'}
    else if(state==='err'){b.classList.add('err');t.textContent='Lỗi đồng bộ';b.title='Không lưu được lên Supabase, dữ liệu vẫn an toàn trong trình duyệt này. Bấm để thử lại.'}
}

let _saveTimer=null;
function persistState(snap,stateJson){
    snap=snap||getStateSnapshot();stateJson=stateJson||JSON.stringify(snap);
    try{localStorage.setItem('itams_v4',stateJson)}catch(e){}
    if(!sb)return
    clearTimeout(_saveTimer);
    setSyncBadge('syncing');
    _saveTimer=setTimeout(()=>{
        sb.from('app_state').upsert({id:'main',data:snap,updated_at:new Date().toISOString()}).then(({error})=>{
            if(error){console.error('Supabase save error:',error);setSyncBadge('err')}
            else{setSyncBadge('ok')}
        });
    },400);
}
function saveData(){const snap=getStateSnapshot(),stateJson=JSON.stringify(snap);if(typeof invalidateDashboardCache==='function')invalidateDashboardCache();if(typeof recordStateHistoryBeforePersist==='function')recordStateHistoryBeforePersist(stateJson);persistState(snap,stateJson)}

function loadData(){let stateJson=null;try{const d=localStorage.getItem('itams_v4');if(d){applyStateSnapshot(JSON.parse(d));stateJson=d}}catch(e){}if(typeof resetStateHistoryBaseline==='function')resetStateHistoryBaseline(stateJson)}

async function loadRemoteData(){
    if(!sb)return false;
    setSyncBadge('syncing');
    try{
        const{data,error}=await sb.from('app_state').select('data').eq('id','main').maybeSingle();
        if(error){console.error('Supabase load error:',error);setSyncBadge('err');return false}
        if(data&&data.data&&Object.keys(data.data).length){applyStateSnapshot(data.data);if(typeof resetStateHistoryBaseline==='function')resetStateHistoryBaseline(JSON.stringify(getStateSnapshot()));setSyncBadge('ok');return true}
        // Chưa có dữ liệu trên server -> đẩy dữ liệu hiện tại (mặc định/local) lên làm dữ liệu gốc
        await sb.from('app_state').upsert({id:'main',data:getStateSnapshot(),updated_at:new Date().toISOString()});
        setSyncBadge('ok');return false
    }catch(e){console.error(e);setSyncBadge('err');return false}
}

function renderEverything(){
    const fns=[renderDashboard,renderNotifications,renderDeptMgrList,renderAdminCatList,renderWarehouseManagerSetting,renderDefaultWarehouseLocationSetting,renderUserTable,()=>renderAllocHistory(),()=>renderRetHistory(),()=>renderBrHistory(),renderInventory,renderAssets,renderDevCatGrid,renderAllocSrc,renderAllocTgt];
    fns.forEach(fn=>{try{fn()}catch(e){console.error('renderEverything lỗi ở',fn.name||'anonymous',':',e)}});
}

async function manualSync(){if(!sb){showToast('Chưa cấu hình Supabase','warning');return}showToast('Đang tải dữ liệu mới nhất...','warning');const ok=await loadRemoteData();renderEverything();showToast(ok?'Đã đồng bộ dữ liệu mới nhất':'Không tải được, đang dùng dữ liệu cục bộ',ok?'success':'error')}
