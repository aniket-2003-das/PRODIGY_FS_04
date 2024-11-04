// DOM elements
const friendname = document.getElementById("friend-name");
const username = document.getElementById("user-name");
const form = document.getElementById("chat-form");
const chatmessages = document.querySelector(".chat-messages");
const leave_btn = document.getElementById("leave-btn");

// Setting the username and friendname from URL query parameters
username.innerText = window.location.search
  .split("?")[1]
  .split("&")[0]
  .split("=")[1];
friendname.innerText = window.location.search
  .split("?")[1]
  .split("&")[1]
  .split("=")[1];

// Event listener for leave button
leave_btn.addEventListener("click", () => {
  history.back();
});

// Initializing socket connection
const socket = io();

// Emitting join-pvt event to the server
socket.emit("join-pvt", {
  username: username.innerText,
  friendname: friendname.innerText,
});

// Event listener for submitting chat message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get the message from the input field
  const mesg = e.target.elements.msg.value;
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  // Emit the chat-pvt event to the server
  socket.emit("chat-pvt", {
    From: username.innerText,
    To: friendname.innerText,
    message: mesg,
  });
});

// Event listener for receiving chat messages
socket.on("message", (message) => {
  outputmsg(message);
  // Scroll to bottom of chat messages
  chatmessages.scrollTop = chatmessages.scrollHeight;
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
