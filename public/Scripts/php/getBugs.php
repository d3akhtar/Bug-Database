<?php

$id = $_REQUEST["id"];
$data = [
    [ 'id' => '1', 'bug_number' => '1', 'title' => "bug_1_Title", 'date_add' => "Today", 'status' => "Active" ],
    [ 'id' => '1', 'bug_number' => '2', 'title' => "bug_2_Title", 'date_add' => "Today", 'status' => "Active" ],
    [ 'id' => '2', 'bug_number' => '3', 'title' => "bug_3_Title", 'date_add' => "Today", 'status' => "Resolved" ],
    [ 'id' => '3', 'bug_number' => '4', 'title' => "bug_4_Title", 'date_add' => "Today", 'status' => "Active" ],
];
header('Content-Type: application/json; charset=utf-8');

$res = [];
foreach ($data as $value){
    if ($value['id'] == $id){
        array_push($res, $value);
    }
}

echo json_encode($res);

?>