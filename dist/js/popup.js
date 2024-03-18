function showAlert(message, type) {
    // Remove any existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(el => el.remove());
  
    // Create the alert div
    const alert = document.createElement('div');
    alert.innerHTML = `${message}<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>`;
    alert.className = `alert ${type}`;
    document.body.appendChild(alert);
  
    // Make the alert visible
    setTimeout(() => {
      alert.style.opacity = "1";
      alert.style.top = "15px"; // Slide down
    }, 100);
  
    // After 5 seconds, remove the alert
    setTimeout(() => {
      alert.style.opacity = "0";
      alert.style.top = "-50px"; // Slide out of view
      setTimeout(() => alert.remove(), 600); // Wait for animation to finish before removing
    }, 5000);
}

function showLoading() {
    document.getElementById('loadingContainer').style.display = 'flex'; // Show loading GIF container
    // Disable buttons and inputs, or overlay the entire screen with the loading container to prevent interactions
  }
  
  // Hide loading GIF and enable interactions
  function hideLoading() {
    document.getElementById('loadingContainer').style.display = 'none'; // Hide loading GIF container
    // Enable buttons and inputs
  }