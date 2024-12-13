function toggleModal(show) {
  const modal = document.getElementById('auth-modal');
  modal.classList.toggle('hidden', !show);
}

function switchTab(tab) {
  document
    .querySelectorAll('.tab-content')
    .forEach((el) => el.classList.remove('active'));
  document.getElementById(`${tab}-form`).classList.add('active');
}

function showSection(section) {
  document
    .querySelectorAll('.tab-btn')
    .forEach((el) => el.classList.remove('active'));
  document.getElementById(section).classList.add('active');
}

function logout() {
  // Clear the JWT cookie
  document.cookie = 'jwt=; Max-Age=0; path=/; SameSite=Strict';

  // Redirect to the homepage or login page
  window.location.href = '/';
}
