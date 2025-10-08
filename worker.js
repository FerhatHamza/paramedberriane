export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // إعداد رؤوس الاستجابة الافتراضية
    const headers = {
      "Content-Type": "application/json; charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    };

    // ✅ جلب قائمة الطلبة
    if (path === "/api/students" && method === "GET") {
      const result = await env.DB.prepare("SELECT * FROM students").all();
      return new Response(JSON.stringify(result.results), { headers });
    }

    // ✅ إضافة حضور أو غياب
    if (path === "/api/attendance" && method === "POST") {
      const data = await request.json();
      const { nin, morning_present, evening_present, status } = data;

      // البحث عن الطالب
      const student = await env.DB.prepare("SELECT id FROM students WHERE nin = ?").bind(nin).first();
      if (!student) {
        return new Response(JSON.stringify({ error: "الطالب غير موجود" }), { status: 404, headers });
      }

      await env.DB.prepare(`
        INSERT INTO attendance (student_id, date, morning_present, evening_present, status)
        VALUES (?, DATE('now'), ?, ?, ?)
      `).bind(student.id, morning_present, evening_present, status).run();

      return new Response(JSON.stringify({ success: true }), { headers });
    }

    // ✅ تسجيل اختيارات المواد
    if (path === "/api/choices" && method === "POST") {
      const data = await request.json();
      const { nin, english, french, spanish, german, math, science } = data;

      const student = await env.DB.prepare("SELECT id FROM students WHERE nin = ?").bind(nin).first();
      if (!student) {
        return new Response(JSON.stringify({ error: "الطالب غير موجود" }), { status: 404, headers });
      }

      await env.DB.prepare(`
        INSERT INTO choices (student_id, english, french, spanish, german, math, science)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(student_id) DO UPDATE SET
          english = excluded.english,
          french = excluded.french,
          spanish = excluded.spanish,
          german = excluded.german,
          math = excluded.math,
          science = excluded.science
      `).bind(student.id, english, french, spanish, german, math, science).run();

      return new Response(JSON.stringify({ success: true }), { headers });
    }

    // ✅ إحصائيات عامة
    if (path === "/api/stats" && method === "GET") {
      const absences = await env.DB.prepare(`
        SELECT s.class, COUNT(a.id) as absents
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE a.morning_present = 0 OR a.evening_present = 0
        GROUP BY s.class
      `).all();

      const choices = await env.DB.prepare(`
        SELECT 
          SUM(english) AS english,
          SUM(french) AS french,
          SUM(spanish) AS spanish,
          SUM(german) AS german,
          SUM(math) AS math,
          SUM(science) AS science
        FROM choices
      `).first();

      return new Response(JSON.stringify({ absences: absences.results, choices }), { headers });
    }

    // ✅ السماح بالـ OPTIONS (CORS)
    if (method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // 🚫 أي مسار غير معروف
    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers });
  },
};
