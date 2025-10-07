// واجهة بسيطة للتواصل مع الـ API (حالياً تعمل محلياً كـ stub)
const API = {
  getClasses: async () => {
    const resp = await fetch('students_cleaned.json').catch(()=>null);
    if(!resp) return [];
    const data = await resp.json();
    const classes = [...new Set(data.map(s=>s.class).filter(Boolean))];
    return classes.sort();
  },
  getStudentsByClass: async (cls) => {
    const resp = await fetch('students_cleaned.json');
    const data = await resp.json();
    return data.filter(s=>String(s.class)===String(cls));
  },
};
