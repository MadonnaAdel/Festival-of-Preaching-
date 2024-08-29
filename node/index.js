const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv").config();
const adminRouter = require("./routes/adminRoutes"); 
const userRouter = require("./routes/userRoutes");  
const app = express();
const port = process.env.PORT || 3500;
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/admin", adminRouter);
app.use("/users", userRouter);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to db 😍"))
  .catch((err) => console.error(err));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
