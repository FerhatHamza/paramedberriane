// ✨ Connect to your Cloudflare Worker API
const API_BASE = "paramedberriane-api.ferhathamza17.workers.dev"; // 👈 غيّر هذا إلى اسم الـ Worker الحقيقي

const API = {
  getClasses: async () => {
    const resp = await fetch(`${API_BASE}/api/classes`);
    if (!resp.ok) throw new Error("Erreur lors du chargement des classes");
    return await resp.json();
  },

  getStudentsByClass: async (cls) => {
    const resp = await fetch(`${API_BASE}/api/students?class=${cls}`);
    if (!resp.ok) throw new Error("Erreur lors du chargement des étudiants");
    return await resp.json();
  },

  saveAttendance: async (classNum, students) => {
    const resp = await fetch(`${API_BASE}/api/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ class: classNum, students }),
    });
    return await resp.json();
  },
};
