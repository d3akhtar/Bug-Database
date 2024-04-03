        document.addEventListener('DOMContentLoaded', function() {
            const table = document.getElementById('bugTable');
            table.addEventListener('click', function(event) {
                const row = event.target.closest('tr');
        	if (row) {
        	    const firstColumnValue = row.cells[0].textContent;
		    if (!isNaN(parseFloat(firstColumnValue)) && isFinite(firstColumnValue)){
        	    window.location.href = `reportPages/reportView.html?value=${encodeURIComponent(firstColumnValue)}`;
			}
        	}
            });
        });