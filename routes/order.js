const express = require("express");

const router = express.Router();
const {
  createOrder,
  getAllOrders,
  removeOrder,
  getAOrder,
  getAllOrdersAdmin,
  getMonthlyIncome,
} = require("../controllers/order");

router.route("/").post(createOrder).get(getAllOrders);
router.route("/income").get(getMonthlyIncome);
router.route("/admin").get(getAllOrdersAdmin);
router.route("/:id").delete(removeOrder).get(getAOrder);
module.exports = router;
