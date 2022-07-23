const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true,unique:false},
    description: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: Array,required:true },
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
