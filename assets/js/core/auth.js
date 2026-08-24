// ===================== ĐĂNG NHẬP / PHÂN QUYỀN =====================
function showLoginScreen(){document.getElementById('loginScreen').classList.add('show');document.querySelector('.header').style.display='none';document.querySelector('.main-container').style.display='none'}
function hideLoginScreen(){document.getElementById('loginScreen').classList.remove('show');document.querySelector('.header').style.display='flex';document.querySelector('.main-container').style.display='flex'}
function handleLogin(e){e.preventDefault();const code=document.getElementById('loginCode').value.trim().toUpperCase();const pass=document.getElementById('loginPass').value;const errBox=document.getElementById('loginErr');const u=users.find(x=>x.code.toUpperCase()===code);if(!u||u.status!=='active'||(u.password||'123456')!==pass){errBox.textContent='Sai mã NV hoặc mật khẩu, hoặc tài khoản đã bị khóa.';errBox.style.display='block';return}
    errBox.style.display='none';currentUser=u;try{localStorage.setItem('itams_session',u.code)}catch(err){}
    document.getElementById('loginCode').value='';document.getElementById('loginPass').value='';
    hideLoginScreen();afterLogin()}
function logout(){if(!confirm('Đăng xuất khỏi hệ thống?'))return;currentUser=null;try{localStorage.removeItem('itams_session')}catch(e){}showLoginScreen()}
function tryAutoLogin(){try{const code=localStorage.getItem('itams_session');if(code){const u=users.find(x=>x.code===code&&x.status==='active');if(u){currentUser=u;return true}}}catch(e){}return false}
function renderCurrentUserBox(){const el=document.getElementById('curUserName');if(el&&currentUser)el.textContent=`${currentUser.name} (${currentUser.role})`}
function applyRolePermissions(){const isAdmin=currentUser&&currentUser.role==='Admin';const isUser=currentUser&&currentUser.role==='User';document.querySelectorAll('.nav-link[data-admin-only]').forEach(btn=>btn.classList.toggle('locked',!isAdmin));document.querySelectorAll('.nav-link[data-no-user]').forEach(btn=>btn.classList.toggle('locked',isUser));const backupBtn=document.getElementById('backupBtn');if(backupBtn)backupBtn.style.display=isUser?'none':'';renderAllocGiverBox();renderRetReceiverBox();renderBrLenderBox()}
function afterLogin(){renderCurrentUserBox();applyRolePermissions();renderEverything();renderAllocUserList();renderAssetGroupSelects()}
let currentAdminCat='thietbi',currentDevCatKey='',currentDevSubId='';
let invFilter='all',invSearch='',assetCatFilter='',assetStatusFilter='',assetGroupFilter='',assetSearch='';
let allocSrcSelected=new Set(),retSrcSelected=new Set(),brSrcSelected=new Set(),invChecked=new Set();
let retEmpDevices=[],retTgtIds=new Set(),brTgtIds=new Set();
let allocQtys={},brQtys={};
let retQtys={};
let retEmpUser=null;
