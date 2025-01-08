 // Function to check value and show/hide GIF
    function checkValueAndToggleGif() {
      const descriptionElement = document.getElementById('descriptionValue');
      const gifElement = document.getElementById('runningCatGif');
      
      // Get the description value (assuming it's a number)
      const descriptionValue = parseFloat(descriptionElement.textContent);
      
      if (descriptionValue > 1) {
        gifElement.style.display = 'block'; // Show GIF
      } else {
        gifElement.style.display = 'none';  // Hide GIF
      }
    }

    // Call the function when the page loads
    window.onload = checkValueAndToggleGif;

    // Optionally, update the value and re-check without reloading
    function updateValue(newValue) {
      const descriptionElement = document.getElementById('descriptionValue');
      descriptionElement.textContent = newValue;
      checkValueAndToggleGif();
    }

    // Example of how to use the updateValue function
    // You can call this function to change the value and update the GIF visibility
    // updateValue(10); // Show GIF
    // updateValue(-5); // Hide GIF