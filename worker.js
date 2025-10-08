export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 🧭 API: جلب الطلبة حسب القاعة
    if (path === "/api/students" && request.method === "GET") {
      const classNum = url.searchParams.get("class");

      const query = `
        SELECT nin, last_name, first_name, father_name, birth_date, class, wing
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

      const insertQuery = `
        INSERT INTO attendance
        (nin, class, morning, evening, reason, english, french, spanish, german, math, science, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      const today = new Date().toISOString().split("T")[0];

      for (const s of students) {
        await env.DB.prepare(insertQuery)
          .bind(
            s.nin,
            classNum,
            s.morning,
            s.evening,
            s.reason || "",
            s.english || 0,
            s.french || 0,
            s.spanish || 0,
            s.german || 0,
            s.math || 0,
            s.science || 0,
            today
          )
          .run();
      }

      return Response.json({ success: true });
    }

    // 🌍 ملفات الواجهة (static)
    return env.ASSETS.fetch(request);
  },
};
