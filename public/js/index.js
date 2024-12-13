function showLogin() {
  document.getElementById('login-modal').classList.add('active');
}

function showRegister() {
  document.getElementById('register-modal').classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}
