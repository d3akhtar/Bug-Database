<?php

$id = $_REQUEST["id"];
$data = [
    [ 'bug_number' => '1', 'title' => "bug_1_Title", 'date_add' => "Today", 'status' => "Active" ],
    [ 'bug_number' => '2', 'title' => "bug_2_Title", 'date_add' => "Today", 'status' => "Active" ],
    [ 'bug_number' => '3', 'title' => "bug_3_Title", 'date_add' => "Today", 'status' => "Resolved" ],
    [ 'bug_number' => '4', 'title' => "bug_4_Title", 'date_add' => "Today", 'status' => "Active" ],
];
header('Content-Type: application/json; charset=utf-8');
echo json_encode($data);

?>