const Cart = require("../models/cart");
const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const addToCart = async (req, res) => {
  const {
    user: { userId },
    params: { cartitem: cartId },
  } = req;

  const product = await Product.findById({
    _id: cartId,
  });
  if (!product) {
    throw new NotFoundError(`No product was found with id ${productId}`);
  }
  req.body.createdBy = req.user.userId;
  req.body.products[0].productId = req.params.cart;
  const cartProduct = await Cart.create(req.body);
  res.status(StatusCodes.CREATED).json({ cartProduct });
};

const getCart = async (req, res) => {
  const {
    user: { userId },
  } = req;

  const cartitems = await Cart.find({ userId: userId });

  res.status(StatusCodes.OK).json({ cartitems, count: cartitems.length });
};

const removeProduct = async (req, res) => {
  const {
    user: { userId },
    params: { cart: cartId },
  } = req;
  const product = await Cart.findOneAndRemove({
    createdBy:userId,
    _id: cartId,
  });
  if (!product) {
    throw new NotFoundError(`No product was found with id ${cartId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateCart = async (req, res) => {
  const {
    user: { userId },
    params: { cart: cartId },
  } = req;
  req.body.userId = req.user.userId;
  req.body.productId = req.params.product;
  const updatedCart = await Cart.findByIdAndUpdate(
    {
      userId: userId,
      _id: cartId,
    },
    req.body,
    { new: true, runValidators: true }
  );


  res.status(StatusCodes.OK).json({ updateCart });
};

module.exports = {
  addToCart,
  getCart,
  removeProduct,
  updateCart,
};
