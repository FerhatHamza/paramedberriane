document.addEventListener("DOMContentLoaded", async () => {
  const classesContainer = document.getElementById("classesContainer");
  const studentsSection = document.getElementById("studentsSection");
  const classTitle = document.getElementById("classTitle");
  const studentsTableBody = document.querySelector("#studentsTable tbody");
  const saveBtn = document.getElementById("saveBtn");

  // إنشاء 26 بطاقة للقاعة
  for (let i = 1; i <= 26; i++) {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = `قاعة ${i}`;
    card.dataset.classNum = i;
    classesContainer.appendChild(card);

    card.addEventListener("click", async () => {
      classTitle.textContent = `الطلاب في القاعة ${i}`;
      studentsSection.style.display = "block";

      // جلب الطلاب
      let students = [];
      try {
        students = await API.getStudentsByClass(i);
      } catch (err) {
        alert("حدث خطأ أثناء جلب الطلاب: " + err.message);
        return;
      }

      studentsTableBody.innerHTML = "";

      students.forEach(s => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${s.first_name} ${s.last_name}</td>
          <td><input type="checkbox" class="morning" ${s.morning_present ? "checked" : ""}></td>
          <td><input type="checkbox" class="evening" ${s.evening_present ? "checked" : ""}></td>
          <td><input type="checkbox" class="english" ${s.english ? "checked" : ""}></td>
          <td><input type="checkbox" class="french" ${s.french ? "checked" : ""}></td>
          <td><input type="checkbox" class="spanish" ${s.spanish ? "checked" : ""}></td>
          <td><input type="checkbox" class="german" ${s.german ? "checked" : ""}></td>
          <td><input type="checkbox" class="math" ${s.math ? "checked" : ""}></td>
          <td><input type="checkbox" class="science" ${s.science ? "checked" : ""}></td>
        `;
        studentsTableBody.appendChild(tr);
      });

      // حفظ التغييرات
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
          await API.saveAttendance(i, updatedStudents);
          alert("تم حفظ البيانات بنجاح!");
        } catch (err) {
          alert("حدث خطأ أثناء الحفظ: " + err.message);
        }
      };
    });
  }
});

