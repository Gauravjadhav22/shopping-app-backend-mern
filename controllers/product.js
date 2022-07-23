const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const Product = require("../models/product");


const getAllProducts = async (req, res) => {
  const qNew = req.query.new;
  const  qCategory = req.query.category

  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } 
    const allproducts = await Product.find().sort();
    res.status(StatusCodes.OK).json({ allproducts, count: allproducts.length });
    // res.status(StatusCodes.OK).json(products);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }



  
};
const getProduct = async (req, res) => {
  const {
    id
  } = req.params;

  const product = await Product.findById({ _id: id});
  if (!product) {
    throw new NotFoundError(`No product was found with id ${productId}` );
   }
  res.status(StatusCodes.OK).json({ product});
};

const createProduct = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const updateProduct = async (req, res) => {
  const {
    body: { title, description, img, categories, size, price },
    user: { userId },
    params: { id: productId },
  } = req;

  if (
    title === "" ||
    description === "" ||
    img === "" ||
    categories === "" ||
    size === "" ||
    price <= 0
  ) {
    res.json({
      msg: "title, description, img, categories, size, price one of them or all are incorrect!",
    });
  }
  const product = await Product.findByIdAndUpdate(
    { _id: productId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
   throw new NotFoundError(`No product was found with id ${productId}` );
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const {
    user: { userId },
    params: { id: productId },
  } = req;
  const product = await Product.findByIdAndRemove({
    _id: productId,
    createdBy: userId,
  });
  if (!product) {
    throw new NotFoundError(`No product was found with id ${productId}` );
   }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
};
