function login(event) {
  event.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.token) {
        window.localStorage.setItem("token", data.token);
        window.location.href = "index.html";
        document.querySelector(".modifier").style.display = "block";
      } else {
        document.querySelector(".error-message").style.display = "block";
        errormessage.innerHTML = "Error : " + data.message;
        document.querySelector(".modifier").style.display = "none";
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
document.getElementById("submitButton").addEventListener("click", login);

const errormessage = document.querySelector(".error-message");
