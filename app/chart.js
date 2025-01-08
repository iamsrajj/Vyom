   // Example data for 4 charts
    

      const ctx1 = document.getElementById('chart1').getContext('2d');
      const ctx2 = document.getElementById('chart2').getContext('2d');
      const ctx3 = document.getElementById('chart3').getContext('2d');
      const ctx4 = document.getElementById('chart4').getContext('2d');

      const data = {
        labels: ['January', 'February', 'March', 'April'],
        datasets: [{
          label: 'Sample Data',
          data: [10, 20, 30, 40],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true
        }]
      };

      // Chart options
      const options = {
        responsive: true,
        maintainAspectRatio: false
      };

      // Create 4 charts
      new Chart(ctx1, { type: 'line', data: data, options: options });
      new Chart(ctx2, { type: 'line', data: data, options: options });
      new Chart(ctx3, { type: 'line', data: data, options: options });
      new Chart(ctx4, { type: 'line', data: data, options: options });