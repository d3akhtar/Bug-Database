// Replace the months list with the full time span of the bug (xValue)
// Replace the integers list with the xValues yValue
drawGraph(['January', 'February', 'March', 'April', 'May', 'June', 'July'], [65, 59, 80, 81, 56, 55, 40]);
drawSubGraph(['January', 'February', 'March', 'April', 'May', 'June', 'July'], [65, 59, 80, 81, 56, 55, 40]);

// Function to draw the graph when you land on the page
function drawGraph(xValue, yValue) {
  document.addEventListener('DOMContentLoaded', function () {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: xValue,
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
          data: yValue
        }]
      },
      options: {
        legend: {
          display: false // Hide legend
        }
      }
    });
  });
}

// Function to draw the graph that you see when you click the original
function drawSubGraph(xValue, yValue) {
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('graphContainer').addEventListener('click', function () {
      var subBox = document.getElementById('subBox');
      var subBoxChart = document.getElementById('myChartExpanded');
      if (!subBox.classList.contains('active')) {
        subBox.classList.add('active');
        subBox.style.width = '90%'; 
        subBox.style.height = '80%'; 
        subBoxChart.width = subBox.clientWidth;
        subBoxChart.height = subBox.clientHeight;
        var ctx = subBoxChart.getContext('2d');
        var myChartExpanded = new Chart(ctx, {
          type: 'line',
          data: {
            labels: xValue,
            datasets: [{
              label: 'Data',
              borderColor: '#3498db', 
              borderWidth: 4,
              pointBackgroundColor: '#3498db', 
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
              fill: true, 
              backgroundColor: 'rgba(52, 152, 219, 0.2)', 
              data: yValue
            }]
          },
          options: {
            legend: {
              display: false
            }
          }
        });
      }
    });
  });
}

// Function to close the sub-box
function closeSubBox() {
    var subBox = document.getElementById('subBox');
    subBox.classList.remove('active');
}

async function updatedChart() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  // Make an AJAX request to the server with the start and end dates
  const response = await fetch('/sprintDetails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ startDate, endDate })
  });

  if (response.ok) {
    const bugReports = await response.json(); // this is the array
    console.log('Bug reports retrieved successfully:', bugReports);
    // Process the bug reports as needed
    // code to draw graph can go here
    const bugValues = bugReports.result;

    const xValues = getDates(startDate, endDate);
    const yValues = bugValues;

    function getDates(startDate, endDate) {
      const dates = [];
      let currentDate = new Date(startDate);
      endDate = new Date(endDate);

      while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]); // Extract date part without time zone
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    }

    drawGraph(xValues, yValues);
    drawSubGraph(xValues, yValues);

  } 
  else {
    console.error('Error retrieving bug reports:', response.status);
    // Handle the error
  }
};