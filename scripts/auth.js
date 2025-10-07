// بسيط: تسجيل دخول محلي (غير آمن - للبدء فقط)
document.getElementById('loginForm').addEventListener('submit', function(e){
  e.preventDefault();
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  if(user === 'responsable' && pass === '1234'){
    localStorage.setItem('user', JSON.stringify({role:'responsable', username:user}));
    location.href = 'dashboard.html';
  } else if(user === 'admin' && pass === 'admin123'){
    localStorage.setItem('user', JSON.stringify({role:'admin', username:user}));
    location.href = 'admin.html';
  } else {
    alert('بيانات الدخول خاطئة');
  }
});
