// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navOverlay = document.createElement('div');
  
  // Create overlay element
  navOverlay.className = 'nav-overlay';
  document.body.appendChild(navOverlay);

  // Toggle menu function
  function toggleMenu() {
    mainNav.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  }

  // Menu toggle click event
  menuToggle.addEventListener('click', toggleMenu);

  // Overlay click event
  navOverlay.addEventListener('click', toggleMenu);

  // Close menu when clicking on nav links
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        toggleMenu();
      }
    });
  });
});