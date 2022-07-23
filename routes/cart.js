const express =  require('express')

const router = express.Router();
const {addToCart,getCart, removeProduct,updateCart} = require("../controllers/cart")
router.get("/",getCart)
router.route("/:cartitem").post(addToCart).delete(removeProduct).put(updateCart)


module.exports=router