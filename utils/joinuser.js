users = [];

exports.joinuser = (id, username, roomcode, roomname) => {
  const user = { id, username, roomname, roomcode };
  users.push(user);
  return user;
};

exports.getallusers = (roomcode) => {
  return users.filter((user) => user.roomcode === roomcode);
};

exports.removeanuser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  users.splice(index, 1);
};
exports.getcurrentuser = (id) => {
  return users.find((user) => user.id === id);
};
