// Add event listener to the "Monitor" link
document.getElementById('monitor').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent default action (navigation to monitor.html)
    
    // Prepare the request body
    const farmdata = {
      device_id: 82,  // Example device_id, replace with actual values
      user_id: 68,    // Example user_id, replace with actual values
    };
  
    // Call your POST API here
    fetch('http://91.108.105.16:8085/device/listdevicemqttdata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        farmdata: farmdata  // Pass device_id and user_id inside farmdata
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('API response:', data);
      // Handle the response from the API
      window.location.href = '../html/monitor.html'; // Redirect after API call if necessary
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
  