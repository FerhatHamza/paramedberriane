// Load classes and students (uses API stub)
async function loadClasses(){
  const classes = await API.getClasses();
  const sel = document.getElementById('classSelect');
  sel.innerHTML = '<option value="">-- اختر قاعة --</option>';
  classes.forEach(c=>{
    const o = document.createElement('option'); o.value=c; o.textContent=c; sel.appendChild(o);
  });
}
document.getElementById('loadBtn').addEventListener('click', async ()=>{
  const cls = document.getElementById('classSelect').value;
  if(!cls){ alert('اختر القاعة'); return; }
  const students = await API.getStudentsByClass(cls);
  const tbl = document.getElementById('studentsTbl'); const tbody = tbl.querySelector('tbody');
  tbody.innerHTML='';
  students.forEach(s=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.last_name||''}</td><td>${s.first_name||''}</td><td>${s.nin||''}</td>
      <td><input type="checkbox" class="morning"></td>
      <td><input type="checkbox" class="evening"></td>
      <td class="status">---</td>`;
    tbody.appendChild(tr);
  });
  tbl.style.display='table';
});
document.getElementById('markAbsent').addEventListener('click', async ()=>{
  const nin = document.getElementById('ninInput').value.trim();
  if(!nin){ alert('أدخل رقم التعريف'); return; }
  const rows = Array.from(document.querySelectorAll('#studentsTbl tbody tr'));
  const row = rows.find(r=> r.cells[2].textContent.trim()===nin);
  if(row){
    row.querySelector('.morning').checked = false;
    row.querySelector('.evening').checked = false;
    row.querySelector('.status').textContent = 'غائب';
    alert('تم وضع الطالب غائبًا');
  } else {
    alert('لم يتم العثور على الطالب في هذه القاعة. تأكد من اختيار القاعة الصحيحة.');
  }
});
document.getElementById('saveAttendance').addEventListener('click', async ()=>{
  const rows = Array.from(document.querySelectorAll('#studentsTbl tbody tr'));
  const payload = rows.map(r=>{
    const nin = r.cells[2].textContent.trim();
    const morning = r.querySelector('.morning').checked;
    let evening = r.querySelector('.evening').checked;
    let status = 'حاضر';
    if(!morning){ evening = false; status='غائب'; }
    else if(morning && !evening){ status='مقصي'; }
    return {nin, morning, evening, status};
  });
  console.log('Saving', payload);
  alert('تم حفظ الحضور محليًا (نموذج). عند ربط السيرفر سيُرسل هذا إلى API.');
});
