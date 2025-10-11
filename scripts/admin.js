document.addEventListener("DOMContentLoaded", async () => {
  try {
    const stats = await API.getStats();

    document.getElementById("totalStudents").textContent = stats.total_students;
    document.getElementById("presentToday").textContent = stats.present_today;
    document.getElementById("absentToday").textContent = stats.absent_today;
    document.getElementById("attendanceRate").textContent = stats.global_rate + "%";

    
    // const getReadyBtn = document.getElementById("PustBtn");
    // const getReadyBtn2 = document.getElementById("PustBtn2");

    // async function handleClick() {
    //   await API.getReady();
    // }
    // async function handleClick2() {
    //   await API.getReady2();
    // }
    
    // getReadyBtn.addEventListener("click", handleClick);
    // getReadyBtn2.addEventListener("click", handleClick2);
    
    const subjTbody = document.querySelector("#subjectsTable tbody");
    stats.subjects.forEach(s => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${s.name}</td><td>${s.count}</td><td>${s.rate}%</td>`;
      subjTbody.appendChild(tr);
    });

    const clsTbody = document.querySelector("#classesTable tbody");
    stats.classes.forEach(c => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${c.class}</td> <td>${c.absent_count}</td>  <td>${c.rate}%</td>`;
      clsTbody.appendChild(tr);
    });

    const absTbody = document.querySelector("#absencesTable tbody");
    stats.last_absences.forEach((a, i) => {
     const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${i+1}</td>
            <td>${a.nin}</td>
            <td>${a.name}</td>
            <td>${a.class}</td>`;
      absTbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading stats:", err);
  }
});
