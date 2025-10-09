document.addEventListener("DOMContentLoaded", async () => {
  const cardContainer = document.querySelector(".card-container");
  const studentsSection = document.querySelector(".students-section");
  const classTitle = document.getElementById("classTitle");
  const studentsTableBody = document.querySelector("#studentsTable tbody");
  const saveBtn = document.getElementById("saveBtn");

  // إنشاء بطاقات القاعات من 1 إلى 26 مباشرة
  for (let i = 1; i <= 26; i++) {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = `📍 القاعة ${i}`;
    cardContainer.appendChild(card);

    // عند الضغط على بطاقة القاعة
    card.addEventListener("click", async () => {
      const classNum = i; // رقم القاعة
      classTitle.textContent = `الطلاب في القاعة ${classNum}`;
      studentsSection.style.display = "block";

      // جلب الطلاب من API حسب القاعة
      let students = [];
      try {
        students = await API.getStudentsByClass(classNum);
        // التأكد من كل الحقول
        students = students.map(s => ({
          ...s,
          morning_present: s.morning_present || 0,
          evening_present: s.evening_present || 0,
          english: s.english || 0,
          french: s.french || 0,
          spanish: s.spanish || 0,
          german: s.german || 0,
          math: s.math || 0,
          science: s.science || 0,
        }));
      } catch (err) {
        alert("حدث خطأ أثناء جلب الطلاب: " + err.message);
        return;
      }

      // عرض الطلاب في الجدول
      studentsTableBody.innerHTML = "";
      students.forEach(s => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${s.first_name} ${s.last_name}</td>
          <td class="${s.morning_present ? "present" : "absent"}"><input type="checkbox" class="morning" ${s.morning_present ? "checked" : ""}></td>
          <td class="${s.evening_present ? "present" : "absent"}"><input type="checkbox" class="evening" ${s.evening_present ? "checked" : ""}></td>
          <td><input type="checkbox" class="english" ${s.english ? "checked" : ""}></td>
          <td><input type="checkbox" class="french" ${s.french ? "checked" : ""}></td>
          <td><input type="checkbox" class="spanish" ${s.spanish ? "checked" : ""}></td>
          <td><input type="checkbox" class="german" ${s.german ? "checked" : ""}></td>
          <td><input type="checkbox" class="math" ${s.math ? "checked" : ""}></td>
          <td><input type="checkbox" class="science" ${s.science ? "checked" : ""}></td>
        `;

        // تحديث اللون عند تغيير الحضور
        tr.querySelector(".morning").addEventListener("change", e => {
          tr.querySelector(".morning").parentElement.className = e.target.checked ? "present" : "absent";
        });
        tr.querySelector(".evening").addEventListener("change", e => {
          tr.querySelector(".evening").parentElement.className = e.target.checked ? "present" : "absent";
        });

        studentsTableBody.appendChild(tr);
      });

      // حفظ الحضور والمواد
      saveBtn.onclick = async () => {
        const updatedStudents = [];
        const rows = studentsTableBody.querySelectorAll("tr");
        rows.forEach((tr, index) => {
          const s = students[index];
          updatedStudents.push({
            id: s.id,
            morning_present: tr.querySelector(".morning").checked ? 1 : 0,
            evening_present: tr.querySelector(".evening").checked ? 1 : 0,
            english: tr.querySelector(".english").checked ? 1 : 0,
            french: tr.querySelector(".french").checked ? 1 : 0,
            spanish: tr.querySelector(".spanish").checked ? 1 : 0,
            german: tr.querySelector(".german").checked ? 1 : 0,
            math: tr.querySelector(".math").checked ? 1 : 0,
            science: tr.querySelector(".science").checked ? 1 : 0,
          });
        });

        try {
          await API.saveAttendance(classNum, updatedStudents);
          alert("تم حفظ البيانات بنجاح!");
        } catch (err) {
          alert("حدث خطأ أثناء الحفظ: " + err.message);
        }
      };
    });
  }
});
