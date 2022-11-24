// let API_URL = "https://stonksbackend-production.up.railway.app";
// // let API_URL = "http://127.0.0.1:6969";

// window.onload = async () => {
//   if (localStorage.getItem("token")) {
//     let headers = new Headers();
//     headers.append("Authorization", "Bearer " + localStorage.getItem("token"));
//     let res = await fetch(`${API_URL}/verify`, {
//       headers: headers,
//     });
//     let text = await res.text();
//     let json = JSON.parse(text);

//     if (json.type == "success") {
//       document.getElementById("username").textContent =
//         localStorage.getItem("username");
//       document.getElementById("welcome-text").style.display = "block";
//       document.getElementById("btn-logout").style.display = "block";
//     } else {
//       localStorage.clear();
//       window.location = "/login.html";
//     }
//   } else {
//     localStorage.clear();
//     window.location = "/login.html";
//   }
// };

// function logout() {
//   localStorage.clear();
//   window.location = "/login.html";
// }
