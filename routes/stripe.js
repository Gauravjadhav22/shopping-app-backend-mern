const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "inr",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        console.log("error is here");
        res.status(500).json(stripeErr);
      } else {
        console.log("the request has succeed! ");
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
