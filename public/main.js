const formElemet = document.getElementById("inputForm");
const roomNameEl = document.getElementById("room-name");
const roomMembersEl = document.getElementById("room-members");
const messageBox = document.getElementById("message-box");
const leaveBtn = document.getElementById("leave-btn");

leaveBtn.addEventListener("click", function () {
  const leave = confirm("Are you sure you want to leave tha chat?");
  if (leave) {
    window.location.href = "index.html";
  }
});

const socket = io();
const query = getQueryParams(window.location.href);

function getQueryParams(url) {
  const paramArr = url.slice(url.indexOf("?") + 1).split("&");
  const params = {};
  paramArr.map((param) => {
    const [key, val] = param.split("=");
    params[key] = decodeURIComponent(val);
  });
  return params;
}

// join the room
socket.emit("join-room", { username: query.username, room: query.room });

socket.on("room-users", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  addMessageToDom(message);
  messageBox.scrollTop = messageBox.scrollHeight;
});

formElemet.addEventListener("submit", function (event) {
  event.preventDefault();
  socket.emit("chat-message", this.input.value);
  this.input.value = "";
  this.input.focus();
});

function addMessageToDom({ username, text, time }) {
  const div = document.createElement("div");
  const classes = ["max-w-fit", "px-4", "py-1", "rounded-xl"];
  if (username === query.username) {
    classes.push("bg-blue-900");
    classes.push("self-end");
  } else {
    classes.push("bg-gray-700");
  }

  div.classList.add(...classes);
  div.innerHTML = `
          <div>
                <div class="flex gap-2">
                  <h2 class="font-bold text-blue-200">${
                    username === query.username ? "You" : username
                  }</h2>
                  <h4 class="text-gray-400">${time}</h4>
                </div>
                <h3>${text}</h3>
              </div>
  `;

  document.getElementById("message-box").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomNameEl.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  roomMembersEl.innerHTML = "";
  users.forEach((user) => {
    const div = document.createElement("div");
    const classes = ["flex", "items-center", "gap-2"];
    div.classList.add(...classes);
    div.innerHTML = `
    
                  <div class="h-3 w-3 bg-green-500 rounded-full"></div>
                  <h2>${user.username}</h2>
    `;

    roomMembersEl.appendChild(div);
  });
}
