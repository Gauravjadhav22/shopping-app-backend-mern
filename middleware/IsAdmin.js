const User = require("../models/user");

const { BadRequestError } = require("../errors");

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.isAdmin) {
      throw new BadRequestError(`this ${user.username} user is not Admin`);
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = isAdmin;
