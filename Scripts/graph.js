document.addEventListener('DOMContentLoaded', function() {
    // Initialize Chart.js
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Data',
          borderColor: '#3498db', // Blue
          borderWidth: 4,
          pointBackgroundColor: '#3498db', // Blue
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true, // Fill area under the line
          backgroundColor: 'rgba(52, 152, 219, 0.2)', // Lighter shade of blue
          data: [65, 59, 80, 81, 56, 55, 40]
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor: '#666' // Color of y-axis labels
            },
            gridLines: {
              color: '#ccc' // Color of y-axis grid lines
            }
          }],
          xAxes: [{
            ticks: {
              fontColor: '#666' // Color of x-axis labels
            },
            gridLines: {
              color: '#ccc' // Color of x-axis grid lines
            }
          }]
        },
        legend: {
          display: false // Hide legend
        },
        tooltips: {
          mode: 'index',
          intersect: false
        }
      }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Click event for graph container
    document.getElementById('graphContainer').addEventListener('click', function() {
      var subBox = document.getElementById('subBox');
      var subBoxChart = document.getElementById('myChartExpanded');
      if (!subBox.classList.contains('active')) {
        subBox.classList.add('active');
        subBox.style.width = '90%'; // Larger width
        subBox.style.height = '90%'; // Larger height
        subBoxChart.width = subBox.clientWidth;
        subBoxChart.height = subBox.clientHeight;
        var ctx = subBoxChart.getContext('2d');
        var myChartExpanded = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
              label: 'Data',
              borderColor: '#3498db', // Blue
              borderWidth: 4,
              pointBackgroundColor: '#3498db', // Blue
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
              fill: true, // Fill area under the line
              backgroundColor: 'rgba(52, 152, 219, 0.2)', // Lighter shade of blue
              data: [65, 59, 80, 81, 56, 55, 40]
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  fontColor: '#666' // Color of y-axis labels
                },
                gridLines: {
                  color: '#ccc' // Color of y-axis grid lines
                }
              }],
              xAxes: [{
                ticks: {
                  fontColor: '#666' // Color of x-axis labels
                },
                gridLines: {
                  color: '#ccc' // Color of x-axis grid lines
                }
              }]
            },
            legend: {
              display: false // Hide legend
            },
            tooltips: {
              mode: 'index',
              intersect: false
            }
          }
        });
      }
    });
});

// Function to close the sub-box
function closeSubBox() {
    var subBox = document.getElementById('subBox');
    subBox.classList.remove('active');
}
