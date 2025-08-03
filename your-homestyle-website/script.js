document.addEventListener('DOMContentLoaded', function() {
    // Get current time in IST (UTC+5:30)
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utcTime + (5.5 * 3600000));
    const hours = istTime.getHours();
    
    // Get sky element
    const sky = document.querySelector('.sky');
    
    // Remove all time classes first
    sky.classList.remove('daytime', 'evening', 'night');
    
    // Hide all time-based elements first
    document.querySelectorAll('.daytime-element, .evening-element, .night-element').forEach(el => {
      el.style.display = 'none';
    });
    
    // Determine time of day and set appropriate class
    if (hours >= 6 && hours < 17) { // Daytime (6 AM - 5 PM)
      sky.classList.add('daytime');
      document.querySelectorAll('.daytime-element').forEach(el => {
        el.style.display = 'block';
      });
    } 
    else if (hours >= 17 && hours < 19) { // Evening (5 PM - 7 PM)
      sky.classList.add('evening');
      document.querySelectorAll('.evening-element').forEach(el => {
        el.style.display = 'block';
      });
    } 
    else { // Night (7 PM - 6 AM)
      sky.classList.add('night');
      document.querySelectorAll('.night-element').forEach(el => {
        el.style.display = 'block';
      });
    }
  });



  document.addEventListener('DOMContentLoaded', function() {
    // Get current time in IST (UTC+5:30)
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utcTime + (5.5 * 3600000));
    const hours = istTime.getHours();
    
    // Get elements
    const sky = document.querySelector('.sky');
    const footer = document.querySelector('.site-footer');
    
    // Remove all time classes first
    sky.classList.remove('daytime', 'evening', 'night');
    footer.classList.remove('daytime', 'evening', 'night');
    
    // Set time classes
    if (hours >= 6 && hours < 17) { // Daytime (6 AM - 5 PM)
      sky.classList.add('daytime');
      footer.classList.add('daytime');
    } 
    else if (hours >= 17 && hours < 19) { // Evening (5 PM - 7 PM)
      sky.classList.add('evening');
      footer.classList.add('evening');
    } 
    else { // Night (7 PM - 6 AM)
      sky.classList.add('night');
      footer.classList.add('night');
    }
    
    // Update email address (replace with your actual email)
    const emailLink = document.querySelector('.email-address a');
    if (emailLink) {
      emailLink.href = "mailto:design@yourhomeyourstyle.com";
      emailLink.textContent = "design@yourhomeyourstyle.com";
    }
  });