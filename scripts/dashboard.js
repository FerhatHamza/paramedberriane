document.addEventListener("DOMContentLoaded", async () => {
  const cardContainer = document.querySelector(".card-container");
  const studentsSection = document.querySelector(".students-section");
  const classTitle = document.getElementById("classTitle");
  const studentsTableBody = document.querySelector("#studentsTable tbody");
  const saveBtn = document.getElementById("saveBtn");

  // جلب القاعات من API
  let classes = [];
  try {
    classes = await API.getClasses(); // يجب أن ترجع array من أسماء القاعات أو أرقامها
  } catch (err) {
    alert("حدث خطأ أثناء جلب القاعات: " + err.message);
    return;
  }

  // إنشاء بطاقة لكل قاعة
  classes.forEach(cls => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = `📍 ${cls}`;
    cardContainer.appendChild(card);

    // عند الضغط على بطاقة القاعة
    card.addEventListener("click", async () => {
      const classNum = cls;
      classTitle.textContent = `الطلاب في القاعة ${classNum}`;
      studentsSection.style.display = "block";

      // جلب الطلاب
      let students = [];
      try {
        students = await API.getStudentsByClass(classNum);
        // التأكد من وجود كل الحقول
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

      students.forEach((s, index) => {
        const tr = document.createElement("tr");

        const morningClass = s.morning_present ? "present" : "absent";
        const eveningClass = s.evening_present ? "present" : "absent";

        tr.innerHTML = `
          <td>${s.first_name} ${s.last_name}</td>
          <td class="${morningClass}"><input type="checkbox" class="morning" ${s.morning_present ? "checked" : ""}></td>
          <td class="${eveningClass}"><input type="checkbox" class="evening" ${s.evening_present ? "checked" : ""}></td>
          <td><input type="checkbox" class="english" ${s.english ? "checked" : ""}></td>
          <td><input type="checkbox" class="french" ${s.french ? "checked" : ""}></td>
          <td><input type="checkbox" class="spanish" ${s.spanish ? "checked" : ""}></td>
          <td><input type="checkbox" class="german" ${s.german ? "checked" : ""}></td>
          <td><input type="checkbox" class="math" ${s.math ? "checked" : ""}></td>
          <td><input type="checkbox" class="science" ${s.science ? "checked" : ""}></td>
        `;

        // تحديث اللون عند تغيير checkbox
        tr.querySelector(".morning").addEventListener("change", e => {
          tr.querySelector(".morning").parentElement.className = e.target.checked ? "present" : "absent";
        });
        tr.querySelector(".evening").addEventListener("change", e => {
          tr.querySelector(".evening").parentElement.className = e.target.checked ? "present" : "absent";
        });

        studentsTableBody.appendChild(tr);
      });

      // الزر الآن يستخدم classNum الصحيح
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
          await API.saveAttendance(classNum, updatedStudents); // حفظ جميع البيانات للقاعة الصحيحة
          alert("تم حفظ البيانات بنجاح!");
        } catch (err) {
          alert("حدث خطأ أثناء الحفظ: " + err.message);
        }
      };
    });
  });
});
