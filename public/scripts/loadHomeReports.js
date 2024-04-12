$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {
    console.log("In loadDataTable()");

    const order = 'ORDER BY b.dateModified DESC';
    const url = `/getBugsTable?param=${encodeURIComponent(order)}`;
    console.log(url);


    dataTable = $('#tblData').DataTable({
        select: true,
        "ajax": { url: url, dataSrc: '' },
        "columns": [
            { data: 'bug_id', "width": "10%", "text-align": "center" },
            { data: 'comment_title', "width": "20%" },
            { data: 'comment_body', "width": "30%" },
            { data: 'bug_dateAdded', "width": "20%" },
            { data: 'bug_dateModified', "width": "30%" }
        ]
    })
}