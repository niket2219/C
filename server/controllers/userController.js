const User = require("../models/userModel");
const Otp = require("../models/otpModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

const SendMail = (email, otpcode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "niket2219@gmail.com",
      pass: "fdmi vcwv kcqx zssd",
    },
  });

  async function main() {
    const info = await transporter.sendMail({
      from: "niket2219@gmail.com",
      to: `${email}`,
      subject: "Do not reply to this mail as it is a system generated email",
      text: "Your code to verify your account is : ",
      html: `<p>Your code to verify your account is : </p><br><b>${otpcode}</b>`,
    });
  }
  main().catch(console.error);
};

module.exports.forgot_password = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    const userotp = await Otp.findOne({ email: email });
    const response = {};

    if (user) {
      if (userotp) {
        let newotpcode = Math.floor(Math.random() * 1000000 + 1);
        userotp.otp = newotpcode;
        await userotp.save();
        SendMail(email, newotpcode);
        response.statusText = "Success";
        response.message = "Please check your email";
        response.status = true;
      } else {
        let otpcode = Math.floor(Math.random() * 1000000 + 1);
        const otpData = new Otp({
          email,
          otp: otpcode,
          expiresIn: new Date().getTime() + 100 * 1000,
        });

        const otpres = await otpData.save();
        SendMail(email, otpcode);
        response.statusText = "Success";
        response.message = "Please check your email";
        response.status = true;
      }
    } else {
      response.message = "Invalid User";
      response.status = false;
    }
    res.send(response);
  } catch (ex) {
    next(ex);
  }
};

module.exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const data = await Otp.findOne({ email: email });

    if (data.otp == otp) {
      res.send({
        status: true,
        message: "OTp Verified Successfully",
      });
    } else {
      res.send({
        status: false,
        message: "Invalid OTp",
      });
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.changePassword = async (req, res, next) => {
  const { email, password, cpassword } = req.body;
  try {
    const data = await User.findOne({ email });
    if (password != cpassword) {
      res.send({
        status: false,
        message: "Password and Confirm password should be same",
      });
    } else {
      if (data) {
        const hashedPassword = await bcrypt.hash(password, 10);
        data.password = hashedPassword;
        await data.save();
        res.send({
          status: true,
          message: "Password Updated Successfully . Proceed to Login",
        });
      }
    }
  } catch (ex) {
    next(ex);
  }
};
