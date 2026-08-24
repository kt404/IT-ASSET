// ===================== NHÓM TÀI SẢN =====================
const DEFAULT_ASSET_GROUP_ID='inventory_asset';
function getDefaultAssetGroups(){return[{id:'fixed_asset',name:'Tài sản cố định'},{id:'construction_asset',name:'Tài sản công trình'},{id:DEFAULT_ASSET_GROUP_ID,name:'Tài sản tồn kho',isDefault:true}]}
function normalizeAssetGroupName(name){return(name||'').toString().trim().replace(/\s+/g,' ').toLocaleLowerCase('vi-VN')}
function getDefaultAssetGroup(){return assetGroups.find(g=>g.isDefault)||assetGroups.find(g=>g.id===DEFAULT_ASSET_GROUP_ID)||assetGroups[0]}
function getAssetGroupId(device){const id=device&&device.assetGroupId;return assetGroups.some(g=>g.id===id)?id:(getDefaultAssetGroup()||{}).id||DEFAULT_ASSET_GROUP_ID}
function getAssetGroupName(deviceOrId){const id=typeof deviceOrId==='string'?deviceOrId:getAssetGroupId(deviceOrId);const group=assetGroups.find(g=>g.id===id)||getDefaultAssetGroup();return group?group.name:'Tài sản tồn kho'}
function assetGroupOptions(selectedId,includeAll){const selected=selectedId||DEFAULT_ASSET_GROUP_ID;return(includeAll?'<option value="">Tất cả nhóm tài sản</option>':'')+assetGroups.map(g=>`<option value="${g.id}" ${g.id===selected?'selected':''}>${g.name}</option>`).join('')}
function renderAssetGroupSelects(){const filter=document.getElementById('assetGroupFilter');if(filter){const value=filter.value;filter.innerHTML=assetGroupOptions(value,true);filter.value=value}const add=document.getElementById('addAssetGroupId');if(add){const value=add.value||getDefaultAssetGroup().id;add.innerHTML=assetGroupOptions(value,false);add.value=value}}
