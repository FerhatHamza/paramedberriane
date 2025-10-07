function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMsg = document.getElementById('error-msg');

  const users = {
    admin: 'admin123',
    responsable: '1234'
  };

  if (users[username] && users[username] === password) {
    localStorage.setItem('user', username);
    window.location.href = username === 'admin' ? 'admin.html' : 'dashboard.html';
  } else {
    errorMsg.style.display = 'block';
  }
}
