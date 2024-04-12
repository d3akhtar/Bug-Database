// Replace the months list with the full time span of the bug (xValue)
// Replace the integers list with the xValues yValue

async function main() {
  const today = getTodaysDate();
  const twoWeeks = getDateTwoWeeksAgo();
  const dates = getDates(twoWeeks, today);
  const pending = await gatherArray(twoWeeks, today);
  changeData(pending);

  drawGraph(dates, pending.result);
}
main();
function getDateTwoWeeksAgo() {
  const today = new Date();
  const twoWeeksAgo = new Date(today.getTime() - (14 * 24 * 60 * 60 * 1000)); // Subtract 14 days in milliseconds
  const year = twoWeeksAgo.getFullYear();
  let month = twoWeeksAgo.getMonth() + 1; // Months are zero-based, so add 1
  let day = twoWeeksAgo.getDate();

  // Ensure month and day are two digits
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  // Return the date two weeks ago in the format YYYY-MM-DD
  return `${year}-${month}-${day}`;
}

function getTodaysDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1; // Months are zero-based, so add 1
  let day = today.getDate();

  // Ensure month and day are two digits
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  // Return today's date in the format YYYY-MM-DD
  return `${year}-${month}-${day}`;
}


// Function to draw the graph when you land on the page
function drawGraph(xValue, yValue) {
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
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true // Ensure the y-axis starts at 0
          }
        }]
      }
    }
  });
}

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

async function gatherArray(startDate, endDate) {
  // Make an AJAX request to the server with the start and end dates
  const today = Date(getTodaysDate());
  const response = await fetch('/sprintDetails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ startDate, endDate })
  });
  console.log("yeeted");
  if (response.ok) {
    const bugReports = await response.json(); // this is the array
    console.log('Bug reports retrieved successfully:', bugReports);
    // Process the bug reports as needed
    // code to draw graph can go here
    result = bugReports.result
    return bugReports;
  } else {
    console.error('Error retrieving bug reports:', response.status);
  }
}

function changeData(results) {
  console.log("changing");
  document.getElementById("net").textContent = results.netIncrease;
  document.getElementById("created").textContent = results.bugsAdded;
  document.getElementById("resolved").textContent = results.bugsResolved;
}

document.getElementById('submitDatesBtn').addEventListener('click', async () => {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  if (startDate > endDate) {
    alert("please enter valid dates");
    return;
  }
  const xValues = getDates(startDate, endDate);
  const bugReports = await gatherArray(startDate, endDate);
  const yValues = bugReports.result;
  changeData(bugReports);
  drawGraph(xValues, yValues);
});