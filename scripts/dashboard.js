document.addEventListener("DOMContentLoaded", async () => {
  const cardContainer = document.querySelector(".card-container");
  const studentsSection = document.querySelector(".students-section");
  const classTitle = document.getElementById("classTitle");
  const studentsTableBody = document.querySelector("#studentsTable tbody");
  const saveBtn = document.getElementById("saveBtn");


  async function loadStudentsTable(classNum) {
  try {
    // مسح الجدول أولاً
    studentsTableBody.innerHTML = '';
    const students = await API.getStudentsByClass(classNum);
    // استخدام for...of بدلاً من forEach للتعامل مع async/await
    for (const student of students) {
      try {
        // جلب بيانات الحضور للطالب
        const attendance = await API.getAttendanceById(student.id);
        console.log("بيانات الحضور:", attendance);
        
        // إنشاء الصف
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${student.first_name} ${student.last_name}</td>
          <td class="${attendance.morning_present ? 'present' : 'absent'}">
            <input type="checkbox" class="morning" ${attendance.morning_present ? 'checked' : ''}>
          </td>       
          <td><input type="checkbox" class="math" ${student.math ? 'checked' : ''}></td>
          <td><input type="checkbox" class="science" ${student.science ? 'checked' : ''}></td>
          <td class="${attendance.evening_present ? 'present' : 'absent'}">
            <input type="checkbox" class="evening" ${attendance.evening_present ? 'checked' : ''}>
          </td>
          <td><input type="checkbox" class="english" ${student.english ? 'checked' : ''}></td>
          <td><input type="checkbox" class="french" ${student.french ? 'checked' : ''}></td>
          <td><input type="checkbox" class="spanish" ${student.spanish ? 'checked' : ''}></td>
          <td><input type="checkbox" class="german" ${student.german ? 'checked' : ''}></td>
        `;

        // إضافة event listeners
        const morningCheckbox = tr.querySelector('.morning');
        const eveningCheckbox = tr.querySelector('.evening');
        const morningCell = morningCheckbox.parentElement;
        const eveningCell = eveningCheckbox.parentElement;

        morningCheckbox.addEventListener('change', (e) => {
          morningCell.className = e.target.checked ? 'present' : 'absent';
          // حفظ التغيير
          updateStudentAttendance(student.id, 'morning_present', e.target.checked);
        });

        eveningCheckbox.addEventListener('change', (e) => {
          eveningCell.className = e.target.checked ? 'present' : 'absent';
          // حفظ التغيير
          updateStudentAttendance(student.id, 'evening_present', e.target.checked);
        });

        // إضافة الصف إلى الجدول
        studentsTableBody.appendChild(tr);
        
      } catch (error) {
        console.error(`خطأ في تحميل بيانات الطالب ${student.id}:`, error);
        // إضافة صف ببيانات افتراضية في حالة الخطأ
        addFallbackRow(student);
      }
    }
    
    console.log('تم تحميل جميع الطلبة بنجاح');
    
  } catch (error) {
    console.error('خطأ في تحميل الجدول:', error);
  }
}

// دالة مساعدة للصف الافتراضي في حالة الخطأ
function addFallbackRow(student) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${student.first_name} ${student.last_name}</td>
    <td class="absent"><input type="checkbox" class="morning"></td>       
    <td><input type="checkbox" class="math" ${student.math ? 'checked' : ''}></td>
    <td><input type="checkbox" class="science" ${student.science ? 'checked' : ''}></td>
    <td class="absent"><input type="checkbox" class="evening"></td>
    <td><input type="checkbox" class="english" ${student.english ? 'checked' : ''}></td>
    <td><input type="checkbox" class="french" ${student.french ? 'checked' : ''}></td>
    <td><input type="checkbox" class="spanish" ${student.spanish ? 'checked' : ''}></td>
    <td><input type="checkbox" class="german" ${student.german ? 'checked' : ''}></td>
  `;
  studentsTableBody.appendChild(tr);
}

// دالة لتحديث الحضور
async function updateStudentAttendance(studentId, field, value) {
  try {
    await API.updateAttendance(studentId, {
      [field]: value ? 1 : 0
    });
  } catch (error) {
    console.error('خطأ في تحديث الحضور:', error);
  }
}

  
  // إنشاء بطاقات القاعات من 1 إلى 26 مباشرة
  for (let i = 1; i <= 26; i++) {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = `القاعة ${i}`;
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
      loadStudentsTable(classNum);

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
