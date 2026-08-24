// ===================== EXPORT #4: BÁO CÁO THỐNG KÊ (EXCEL) =====================
function exportStatsExcel(){const wb=XLSX.utils.book_new();
const bySub={};devices.forEach(d=>{const k=d.subName||'(khác)';if(!bySub[k])bySub[k]={loai:k,tong:0,trongKho:0,daCapPhat:0,dangMuon:0};bySub[k].tong+=d.qty||1;if(isDeviceInWarehouse(d))bySub[k].trongKho+=d.qty||1;if(d.status==='allocated')bySub[k].daCapPhat+=d.qty||1;else if(d.status==='borrowed')bySub[k].dangMuon+=d.qty||1});
const ws1=XLSX.utils.json_to_sheet(Object.values(bySub).map(x=>({'Loại TB':x.loai,'Tổng SL':x.tong,'Trong kho':x.trongKho,'Đã cấp phát':x.daCapPhat,'Đang mượn':x.dangMuon})));XLSX.utils.book_append_sheet(wb,ws1,'Theo loai TB');
const byStatus={available:0,allocated:0,borrowed:0},warehouseQty=devices.filter(isDeviceInWarehouse).reduce((sum,device)=>sum+(device.qty||1),0);devices.forEach(d=>{byStatus[d.status]=(byStatus[d.status]||0)+(d.qty||1)});
const ws2=XLSX.utils.json_to_sheet([{'Phân loại':'Vị trí vật lý','Trạng thái':'Trong kho','Số lượng':warehouseQty},{'Phân loại':'Nghiệp vụ','Trạng thái':'Sẵn sàng','Số lượng':byStatus.available||0},{'Phân loại':'Nghiệp vụ','Trạng thái':'Đã cấp phát','Số lượng':byStatus.allocated||0},{'Phân loại':'Nghiệp vụ','Trạng thái':'Đang mượn','Số lượng':byStatus.borrowed||0}]);XLSX.utils.book_append_sheet(wb,ws2,'Theo trang thai');
const byDept={};devices.forEach(d=>{if(d.allocatedTo&&d.allocatedTo.dept){const k=d.allocatedTo.dept;byDept[k]=(byDept[k]||0)+(d.qty||1)}});
const ws3=XLSX.utils.json_to_sheet(Object.entries(byDept).map(([dept,sl])=>({'Bộ phận':dept,'Số lượng đang giữ':sl})));XLSX.utils.book_append_sheet(wb,ws3,'Theo bo phan');
XLSX.writeFile(wb,`bao-cao-thong-ke-${todayStr()}.xlsx`);showToast('Đã xuất báo cáo thống kê','success')}
