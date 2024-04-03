<?php

$bug_number = $_REQUEST["bug_number"];
$data = [
    [ 'bug_number' => '1', 'title' => 'Bug title', 'details' => 'details about bug', 'contributor_name' => 'null', 'date_added' => "Yesterday" ],
    [ 'bug_number' => '1', 'title' => 'Comment 1', 'details' => 'comment about bug 1', 'contributor_name' => 'bob', 'date_added' => "Today" ],
    [ 'bug_number' => '1', 'title' => 'Comment 1', 'details' => 'details about the bug', 'contributor_name' => 'the', 'date_added' => "Today" ],
    [ 'bug_number' => '1', 'title' => 'Comment 2', 'details' => 'comment about bug 1', 'contributor_name' => 'builder', 'date_added' => "Tommorow" ],
];
header('Content-Type: application/json; charset=utf-8');

$res = [];

foreach ($data as $value){
    if ($value['bug_number'] == $bug_number){
        array_push($res, $value);
    }
}

echo json_encode($res);

?>