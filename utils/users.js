const users = [];

// join user
function joinUser(user) {
  users.push(user);
  return user;
}

// get current user
function getCurrentUser(id) {
  return users.find((u) => u.id === id);
}

// leave user
function userLeave(id) {
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// get room users

function getRoomUsers(room) {
  return users.filter((u) => u.room === room);
}

module.exports = {
  joinUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
