// DOM elements
const createbtn = document.getElementById("createroom-btn");
const joinbtn = document.getElementById("join-btn");
const addfriendbtn = document.getElementById("addFriend-btn");
const roomname = document.getElementById("roomName");
const roomcode = document.getElementById("joinCode");
const friendemail = document.getElementById("friendEmail");
const pendinglist = document.getElementById("pendingList");
const allfriendslist = document.getElementById("allFriendsList");
const logout = document.getElementById("logout");

// Logout event listener
logout.addEventListener("click", async () => {
  // Send logout request to the server
  const result = await axios.delete("/users/logout");
  // Redirect to login page
  window.location.href = "/login";
});

// Create room button event listener
createbtn.addEventListener("click", async () => {
  // Check if room name is provided
  if (roomname.value == "") {
    alert("Enter Room Name");
    return;
  }
  // Send request to create a new room
  const result = await axios.post("/room/createRoom", {
    roomName: roomname.value,
  });
  // Redirect to the chat room with room details
  window.location.href = `/chat?id=${
    window.location.search.split("=")[1]
  }&roomCode=${result.data.newRoom.roomCode}&roomName=${
    result.data.newRoom.roomName
  }`;
});

// Join room button event listener
joinbtn.addEventListener("click", async () => {
  // Check if room code is provided
  if (roomcode.value == "") {
    alert("Enter room code");
    return;
  }
  try {
    // Send request to join the room
    const result = await axios.post("/room/joinRoom", {
      roomCode: roomcode.value,
    });
    // Redirect to the chat room with room details
    window.location.href = `/chat?id=${
      window.location.search.split("=")[1]
    }&roomCode=${result.data.currentRoom.roomCode}&roomName=${
      result.data.currentRoom.roomName
    }`;
  } catch (err) {
    // Alert if there's an error joining the room
    alert(err.response.data.message);
  }
});

// Add friend button event listener
addfriendbtn.addEventListener("click", async () => {
  // Check if friend's email is provided
  if (friendemail.value == "") {
    alert("Enter email");
    return;
  }
  try {
    // Send friend request to the provided email
    const result = await axios.post("/mixed/sendRequest", {
      userEmail: friendemail.value,
    });
    // Alert if the request was successful
    alert(result.data.message);
    return;
  } catch (err) {
    // Alert if there's an error sending the request
    alert(err.response.data.message);
  }
});

// Function to fetch and display pending friend requests
const pending = async () => {
  const result = await axios.get("/mixed/getFriendrequests");
  const arr = result.data.user;
  arr.forEach((ele) => {
    var temp = `<li class="friend-request">
    ${ele}<button onclick="acceptRequest('${ele}')">Accept</button
    ><button onclick="deleteRequest('${ele}')">Delete</button>
  </li>`;
    pendinglist.innerHTML += temp;
  });
};

// Function to fetch and display all friends
const allfriend = async () => {
  const result = await axios.get("/mixed/getListOfFriends");
  const arr = result.data.user;
  arr.forEach((ele) => {
    var temp = `
    <li>
    ${ele}
    <button onclick="pvtchat('${ele}')">CHAT</button>
    </li>`;
    allfriendslist.innerHTML += temp;
  });
};

// Call functions to display pending friend requests and all friends
pending();
allfriend();

// Function to accept a friend request
const acceptRequest = async (str) => {
  const result = await axios.post("/mixed/accept", {
    requestName: str,
  });
  // Reload the page after accepting the request
  window.location.reload();
};

// Function to delete a friend request
const deleteRequest = async (str) => {
  const result = await axios.post("/mixed/delete", {
    requestName: str,
  });
  // Reload the page after deleting the request
  window.location.reload();
};

// Function to start a private chat with a friend
const pvtchat = (ele) => {
  // Get the user's ID from the URL
  const id = window.location.search.split("?")[1].split("=")[1];
  // Get the user's details and redirect to private chat room
  axios.get(`/users/${id}`).then((r) => {
    window.location.href = `/pvtmsg?username=${r.data.cuser[0].userName}&friendname=${ele}`;
  });
};
