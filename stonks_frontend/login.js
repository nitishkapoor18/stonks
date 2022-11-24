function scrollToSectionTwo() {
  document.getElementById("section-2").scrollIntoView();
}

let API_URL = "https://stonksbackend-production.up.railway.app";
// let API_URL = "http://127.0.0.1:6969";

window.onload = () => {
  if (localStorage.getItem("token")) {
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + localStorage.getItem("token"));
    let res = fetch(`${API_URL}/verify`, {
      headers: headers,
    });
    let text = res.text();
    let json = JSON.parse(text);

    console.log(json);

    if (json.type == "success") {
      window.location = "/";
    } else {
      localStorage.clear();
    }
  }
};

function flashMessage(message, duration, color) {
  let msg_span = document.getElementById("message");
  msg_span.style.color = color;
  msg_span.textContent = message;
  msg_span.parentElement.style.display = "flex";
  setTimeout(() => {
    msg_span.parentElement.style.display = "none";
    msg_span.textContent = "";
    msg_span.style.color = "white";
  }, duration);
}

async function handleSubmit(e) {
  e.preventDefault();

  let username = document.getElementById("username").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (e.submitter.id == "btn-login") {
    let res = await fetch(`${API_URL}/login/${username}/${email}/${password}`);
    let text = await res.text();
    let json = JSON.parse(text);

    if (json.type == "success") {
      localStorage.setItem("token", json.token);
      localStorage.setItem("username", json.username);
      localStorage.setItem("email", json.email);
      flashMessage(json.msg, 5000, "lawngreen");
      window.location = "/";
    } else {
      flashMessage(json.msg, 5000, "deeppink");
    }
  } else {
    let res = await fetch(`${API_URL}/signup/${username}/${email}/${password}`);
    let text = await res.text();
    let json = JSON.parse(text);

    if (json.type == "success") {
      localStorage.setItem("token", json.token);
      localStorage.setItem("username", json.username);
      localStorage.setItem("email", json.email);
      flashMessage("User registered.", 5000, "lawngreen");
      window.location = "/";
    } else if (json.msg == "user already exists") {
      flashMessage("Email already in use.", 5000, "deeppink");
    }
  }
}
