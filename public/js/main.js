// DOM elements
const chatmessages = document.querySelector(".chat-messages");
const form = document.getElementById("chat-form");
const userslist = document.getElementById("users");
const leave_btn = document.getElementById("leave-btn");
const roomName = document.getElementById("room-name");
const roomCode = document.getElementById("room-code");
const userName = document.getElementById("user-name");

// Extracting user ID from URL query parameters
const id = window.location.search.split("?")[1].split("&")[0].split("=")[1];

// Event listener for leave button
leave_btn.addEventListener("click", () => {
  window.location.href = `/home?id=${id}`;
});

// Extracting room name and code from URL query parameters
const roomname = window.location.search
  .split("?")[1]
  .split("&")[2]
  .split("=")[1];
const roomcode = window.location.search
  .split("?")[1]
  .split("&")[1]
  .split("=")[1];

// Setting room name and code in the UI
roomName.innerText = roomname;
roomCode.innerText = roomcode;

// Retrieving user information from the server and initializing socket connection
axios.get(`/users/${id}`).then((r) => {
  userName.innerText = r.data.cuser[0].userName;
  socket.emit("join-room", {
    username: userName.innerText,
    roomcode: roomCode.innerText,
    roomname: roomName.innerText,
  });
});

// Initializing socket connection
const socket = io();

// Event listener for receiving chat messages
socket.on("message", (message) => {
  outputmsg(message);
  // Scroll to bottom of chat messages
  chatmessages.scrollTop = chatmessages.scrollHeight;
});

// Event listener for receiving updated user list
socket.on("users-info", (users) => {
  // Clear existing users list
  userslist.innerHTML = ``;
  // Add each user to the users list
  users.forEach((element) => {
    const li = document.createElement("li");
    li.innerText = element.username;
    userslist.appendChild(li);
  });
});

// Function to display chat message in the UI
function outputmsg(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg["username"]} <span>${msg["time"]}</span></p>
      <p class="text">
        ${msg["message"]}
      </p>`;
  chatmessages.appendChild(div);
}

// Event listener for submitting chat message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get the message from the input field
  const mesg = e.target.elements.msg.value;
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  // Emit the message to the server
  socket.emit("chat-message", mesg);
});
