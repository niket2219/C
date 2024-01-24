const Messages = require("../models/messageModel");
const Groups = require("../models/groups");
const grpMsg = require("../models/groupMsgModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.createGroup = async (req, res, next) => {
  try {
    const { name, creator } = req.body;
    const members = [];
    members.push(creator);

    const group = await Groups.create({
      name,
      creator,
      members: members,
    });

    return res.json({ status: true, group });
  } catch (ex) {
    next(ex);
  }
};

module.exports.grpMsg = async (req, res, next) => {
  try {
    const { sender, message } = req.body;

    const groupmsg = await grpMsg.create({
      grpId: req.params.id,
      sender,
      message,
    });

    return res.json({ status: true, groupmsg });
  } catch (ex) {
    next(ex);
  }
};

module.exports.allgroups = async (req, res, next) => {
  try {
    const data = await Groups.find({
      members: {
        $elemMatch: { $eq: req.params.name },
      },
    });
    return res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports.getgrpmsg = async (req, res, next) => {
  try {
    const messages = await grpMsg.find({ grpId: req.params.id });

    // const projectedMessages = messages.map((msg) => {
    //   return {
    //     fromSelf: msg.sender.toString() === from,
    //     message: msg.message.text,
    //   };
    // });
    res.json(messages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addToGroup = async (req, res, next) => {
  try {
    const { user, group_id } = req.body;
    const grp = await Groups.findOne({ _id: group_id });
    const data = await grp.update({ $push: { members: user } });
    res.send(data);
  } catch (ex) {
    next(ex);
  }
};

module.exports.leavegrp = async (req, res, next) => {
  try {
    const grp = await Groups.findOne({ _id: req.params.id });
    const data = await grp.update({ $pull: { members: req.params.name } });
    res.send(data);
  } catch (error) {
    next(error);
  }
};
