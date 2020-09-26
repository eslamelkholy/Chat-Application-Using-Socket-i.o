const users = [];

const addUser = ({ id, name, room }) => {
  name = cleanUpStrings(name);
  room = cleanUpStrings(room);
  const isUserExists = users.find((user) => user.room === room && user.name === name);
  if (isUserExists) return { error: "Username is Taken" };
  const user = { id, name, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const cleanUpStrings = (str) => str.trim().toLowerCase();

export default {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
