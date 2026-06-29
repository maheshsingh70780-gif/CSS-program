<?php

$conn = mysqli_connect(
    "localhost",
    "root",
    "",
    "login_db"
);

if(!$conn){
    die("Connection Failed");
}

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM users
        WHERE username='$username'
        AND password='$password'";

$result = mysqli_query($conn,$sql);

if(mysqli_num_rows($result) > 0){
    echo "Login Successful";
}else{
    echo "Invalid Username or Password";
}

?>