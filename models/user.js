const mongoose = require("mongoose");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    username: { type: String,unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    img:{type:String,required:false}
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  this.password = crypto.AES.encrypt(
    this.password,
    process.env.SECRET_KEY
  ).toString();
 
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, username: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function () {
  
  var decrypted = crypto.AES.decrypt(
    this.password,
    process.env.SECRET_KEY
  ).toString(crypto.enc.Utf8);
 
  return decrypted;
};


module.exports = mongoose.model("User", UserSchema);
