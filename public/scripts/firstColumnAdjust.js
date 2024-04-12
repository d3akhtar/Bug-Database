window.onload = function () {
  adjustColumnWidths();
};

function adjustColumnWidths() {
  var table = document.getElementById('tblData');
  if (!table) return;

  var headerRow = table.rows[0];
  if (!headerRow) return;

  var colWidths = [];
  for (var i = 0; i < headerRow.cells.length; i++) {
    colWidths.push(headerRow.cells[i].offsetWidth);
  }

  var rows = table.rows;
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    for (var j = 0; j < row.cells.length; j++) {
      row.cells[j].style.width = colWidths[j] + 'px';
    }
  }
}