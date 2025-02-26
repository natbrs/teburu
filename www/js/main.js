async function toggleProfileOptions() {
  const profileOptions = document.getElementById('profile-options');
  const profileImg = document.getElementById('profile-img');

  if (profileOptions.classList.contains('show')) {
    profileOptions.classList.remove('show');
    profileImg.classList.remove('show-border');
  } else {
    profileOptions.classList.add('show');
    profileImg.classList.add('show-border');
  }
}

window.toggleProfileOptions = toggleProfileOptions;

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav__link');
  const profileOptionLinks = document.querySelectorAll('.profile-option');

  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(link => link.classList.remove('active-link'));
      profileOptionLinks.forEach(link => link.classList.remove('active-link'));
      this.classList.add('active-link');
    });
  });
  profileOptionLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(link => link.classList.remove('active-link'));
      profileOptionLinks.forEach(link => link.classList.remove('active-link'));
      this.classList.add('active-link');
    });
  });
});