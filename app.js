require("dotenv").config();
require("express-async-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const authRouter = require("./routes/auth");
const ConnectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middleware/error-handler");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const userRouter = require("./routes/user");
const orderRouter = require("./routes/order");
const paymentRouter = require("./routes/stripe");
const notFound = require("./middleware/not-found");
const authentication = require("./middleware/authentication");
const isAdmin = require("./middleware/IsAdmin");
const app = express();
app.use(cors());

const port = process.env.PORT || 8080;
app.use(express.json());

// app.get("/", (req, res) => {
//   console.log("hey");
//   res.json("server start");
// });
// app.use(express.static(path.join(__dirname, "ecommerce-frontend", "build")));
// app.get("/",(req, res)=> {
//   console.log("hey");
//   res.sendFile(
//     path.join(__dirname, "ecommerce-frontend", "build", "index.html")
//   );
// });

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/checkout", authentication, paymentRouter);
app.use("/api/v1/cart", authentication, cartRouter);
app.use("/api/v1/orders", authentication, orderRouter);
app.use("/api/v1/users", authentication, isAdmin, userRouter);
app.get("/api/v1", (req, res) => {
  console.log("else hey");
  res.send("API is running...");
});
// __dirname = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/ecommerce-frontend/build")));

//   app.get("*", (req, res) => {
//     console.log("if hey");
//     const index = path.resolve(
//       __dirname,
//       "ecommerce-frontend",
//       "build",
//       "index.html"
//     );

//     res.sendFile(index);
//   });

//   console.log("hey there");
// } else {
//   app.get("/", (req, res) => {
//     console.log("else hey");
//     res.send("API is running...");
//   });
// }
//middleware
app.use(errorHandlerMiddleware);
app.use(notFound);
const start = async () => {
  try {
    await ConnectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`server is listening on ${port}!....`));
  } catch (error) {
    console.log(error);
  }
};
start();
