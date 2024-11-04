const Data = require("../Models/messagesModel");
const pvtData = require("../Models/pvtMessagesModel");

exports.getAllMessages = async (roomcode) => {
  return await Data.find({ Room: roomcode });
};
exports.getAllPvtMessages = async (obj) => {
  const query = await pvtData
    .find({
      $or: [
        { From: obj.username, To: obj.friendname },
        { From: obj.friendname, To: obj.username },
      ],
    })
    .sort({ Time: 1 });
  return query;
};
