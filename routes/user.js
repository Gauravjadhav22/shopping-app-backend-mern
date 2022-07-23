const router = require("express").Router();

const {
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserStats
} = require("../controllers/user");

router.route("/all").get(getAllUsers);
router.route("/stats").get(getUserStats)
router.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);

module.exports= router;