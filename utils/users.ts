export interface User {
  id: string;
  username: string;
  room: string;
}
const users: Array<User> = [];

// join user
export function joinUser(user: User) {
  users.push(user);

  return user;
}

// get current user
export function getCurrentUser(id: string) {
  return users.find((u) => u.id === id);
}

// leave user
export function userLeave(id: string) {
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// get room users

export function getRoomUsers(room: string) {
  return users.filter((u) => u.room === room);
}
