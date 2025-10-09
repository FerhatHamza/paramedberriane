export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 🧭 API: جلب الطلبة حسب القاعة
    if (path === "/api/students" && request.method === "GET") {
      const classNum = url.searchParams.get("class");

      const query = `
        SELECT id, nin, last_name, first_name, father_name, birth_date, class, wing
        FROM students
        WHERE class = ?;
      `;

      const { results } = await env.DB.prepare(query).bind(classNum).all();

      return Response.json(results || []);
    }

    // 🧾 API: حفظ حالة الحضور
    if (path === "/api/save" && request.method === "POST") {
      const body = await request.json();
      const { class: classNum, students } = body;

      if (!Array.isArray(students)) {
        return new Response("Invalid data", { status: 400 });
      }

      const today = new Date().toISOString().split("T")[0];

      const insertQuery = `
        INSERT INTO attendance (student_id, date, morning_present, evening_present, status)
        VALUES (?, ?, ?, ?, ?);
      `;

      for (const s of students) {
        await env.DB.prepare(insertQuery)
          .bind(
            s.id,              // ✅ ربط معرف الطالب من جدول students
            today,
            s.morning_present || 0,
            s.evening_present || 0,
            s.status || ""
          )
          .run();
      }

      return Response.json({ success: true });
    }

    // 📊 API: إحصائيات المشرف
    if (path === "/api/stats" && request.method === "GET") {
      const today = new Date().toISOString().split("T")[0];

      // إجمالي الطلبة
      const { results: students } = await env.DB.prepare("SELECT id FROM students").all();
      const total_students = students.length;

      // الحضور اليوم
      const { results: present } = await env.DB.prepare(`
        SELECT COUNT(DISTINCT student_id) AS count
        FROM attendance
        WHERE date = ? AND (morning_present = 1 OR evening_present = 1);
      `).bind(today).all();
      const present_today = present[0]?.count || 0;

      // الغيابات اليوم
      const { results: absent } = await env.DB.prepare(`
        SELECT COUNT(DISTINCT student_id) AS count
        FROM attendance
        WHERE date = ? AND (morning_present = 0 AND evening_present = 0);
      `).bind(today).all();
      const absent_today = absent[0]?.count || 0;

      // النسبة العامة
      const global_rate =
        total_students > 0 ? Math.round((present_today / total_students) * 100) : 0;

      // نسب الحضور حسب القاعات
      const { results: classStats } = await env.DB.prepare(`
        SELECT s.class,
          ROUND(AVG(CASE WHEN a.morning_present = 1 OR a.evening_present = 1 THEN 1 ELSE 0 END) * 100) AS rate
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE a.date = ?
        GROUP BY s.class;
      `).bind(today).all();

      // نسب اختيار المواد
      const { results: choices } = await env.DB.prepare("SELECT * FROM choices").all();
      const subjects = ["english", "french", "spanish", "german", "math", "science"];
      const subjectStats = subjects.map(subj => {
        const count = choices.filter(c => c[subj] === 1).length;
        const rate = total_students > 0 ? Math.round((count / total_students) * 100) : 0;
        const nameMap = {
          english: "الإنجليزية",
          french: "الفرنسية",
          spanish: "الإسبانية",
          german: "الألمانية",
          math: "الرياضيات",
          science: "العلوم",
        };
        return { name: nameMap[subj], count, rate };
      });

      // آخر الغيابات
      const { results: lastAbsences } = await env.DB.prepare(`
        SELECT s.first_name || ' ' || s.last_name AS name, s.class, a.date, a.status
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE (a.morning_present = 0 AND a.evening_present = 0)
        ORDER BY a.date DESC
        LIMIT 5;
      `).all();

      return Response.json({
        total_students,
        present_today,
        absent_today,
        global_rate,
        classes: classStats,
        subjects: subjectStats,
        last_absences: lastAbsences,
      });
    }

    // 🌍 ملفات الواجهة (static)
    return env.ASSETS.fetch(request);
  },
};
