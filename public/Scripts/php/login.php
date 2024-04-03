<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $host = "localhost";
    $dbusername = "root";
    $dbpassword = "";
    $dbname = "login";

    $conn = new mysqli($host, $dbusername, $dbpassword, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: ". $conn->connect_error);

    }

    //validate login authentication
    $query = "SELECT * FROM `authentication` WHERE username= '$username' AND password= '$password'";
    $result = $conn->query($query);

    if($result->num_rows == 1) {
        header("Location: main.html");
        exit();
    }
    else {
        header("Location: resetPassword.html");
        exit();
    }

    $conn->close();

}

?>