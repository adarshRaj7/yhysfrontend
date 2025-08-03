document.addEventListener('DOMContentLoaded', function() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    // Add initial hidden state
    serviceItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
    });
    
    // Animate in with delay
    serviceItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 100 * index);
    });
  });