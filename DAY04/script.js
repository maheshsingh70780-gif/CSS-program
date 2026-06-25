document.getElementById("loginForm").addEventListener("submit", function(e){

    e.preventDefault();

    let username = document.getElementById("first").value;
    let password = document.getElementById("second").value;

    fetch("login.php",{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:`username=${username}&password=${password}`
    })
    .then(response => response.text())
    .then(data => {
        alert(data);

        if(data === "Login Successful"){
            window.location.href = "welcome.html";
        }
    });
});