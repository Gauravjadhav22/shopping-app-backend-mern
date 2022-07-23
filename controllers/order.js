const Order = require("../models/order");
const User = require("../models/user");
const { NotFoundError } = require("../errors");
const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllOrders = async (req, res) => {
  const orders = await Order.find({ createdBy: req.user.userId });
  console.log(orders);
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const getAllOrdersAdmin = async (req, res) => {
  console.log(req.user.userId);
  const user = await User.findById(req.user.userId);

  if (!user.isAdmin) {
    throw new BadRequestError(
      `the user with ${user.userId} does not have rights to see all orders`
    );
  }

  const orders = await Order.find();
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const getAOrder = async (req, res) => {
  const {
    user: { userId },
    params: { id: _id },
  } = req;
  console.log(userId);
  console.log(_id);

  const orders = await Order.find({ _id: _id, createdBy: userId });
  console.log(orders);
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const createOrder = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const order = await Order.create(req.body);

  console.log(order);
  res.status(StatusCodes.CREATED).json({ order });
};
const removeOrder = async (req, res) => {
  const {
    user: { userId },
    params: { id: orderId },
  } = req;
  const order = await Order.findByIdAndRemove({
    _id: orderId,
    createdBy: userId,
  });
  if (!order) {
    throw new NotFoundError(`No product was found with id ${productId}`);
  }
  res.status(StatusCodes.OK).send();
};

const getMonthlyIncome = async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  console.log(req.user.userId);
  const user = await User.findById(req.user.userId);

  if (!user.isAdmin) {
    throw new BadRequestError(
      `the user with ${user.userId} does not have rights to see all orders`
    );
  }

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(StatusCodes.OK).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
};
module.exports = {
  getAllOrders,
  getAOrder,
  createOrder,
  removeOrder,
  getAllOrdersAdmin,
  getMonthlyIncome,
};
