document.getElementById('saveChoices').addEventListener('click', ()=>{
  const cls = document.getElementById('classSelect').value;
  if(!cls){ alert('اختر القاعة'); return; }
  const data = {
    class: cls,
    english: Number(document.getElementById('english').value||0),
    french: Number(document.getElementById('french').value||0),
    spanish: Number(document.getElementById('spanish').value||0),
    german: Number(document.getElementById('german').value||0),
    math: Number(document.getElementById('math').value||0),
    science: Number(document.getElementById('science').value||0)
  };
  console.log('Choices saved (local stub):', data);
  alert('تم حفظ اختيارات المادة محليًا (نموذج). عند ربط السيرفر سيُرسل هذا إلى API.');
});
