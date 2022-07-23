const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");

const registerUser = async (req, res) => {
  const user = await User.create(req.body);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "please provide username or password" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({ msg: "Invalid Credentials !" });
  }
  const isPasswordCorrect = await user.comparePassword();

  if (password != isPasswordCorrect) {
    res.status(StatusCodes.NOT_FOUND).json({ msg: "Invalid Credentials!!" });
  }

  const token = user.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.username, isAdmin: user.isAdmin }, token });
};

module.exports = {
  registerUser,
  loginUser,
};
