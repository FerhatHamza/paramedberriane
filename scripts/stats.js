// Simple stats display (reads students_cleaned.json)
async function loadStats(){
  const resp = await fetch('students_cleaned.json'); if(!resp.ok){ document.getElementById('stats').textContent='لا توجد بيانات'; return; }
  const data = await resp.json();
  const total = data.length;
  const classes = {};
  data.forEach(s=>{ classes[s.class] = (classes[s.class]||0)+1; });
  let html = `<p>مجموع الطلبة: ${total}</p>`;
  html += '<h4>عدد الطلبة حسب القاعات</h4><ul>';
  for(const k of Object.keys(classes)) html += `<li>القاعة ${k}: ${classes[k]}</li>`;
  html += '</ul>';
  document.getElementById('stats').innerHTML = html;
}
loadStats();
