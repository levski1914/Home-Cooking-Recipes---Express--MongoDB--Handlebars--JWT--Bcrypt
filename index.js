const express = require("express");
const handleBars = require("express-handlebars");
const mongoose = require("mongoose");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const { authMiddleWare } = require("./middlewares/authMiddleware");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authMiddleWare);

app.engine(
  "hbs",
  handleBars.engine({
    extname: "hbs",
  })
);

app.set("view engine", "hbs");
app.use(routes);

mongoose.connect("mongodb://127.0.0.1:27017/homeRecipes");

mongoose.connection.on("connected", () => console.log("DB is connected"));
mongoose.connection.on("disconnected", () => console.log("DB is disconnected"));
mongoose.connection.on("err", (err) => console.log(err));
app.listen(5000, () => {
  console.log(`Server is listening on port:5000`);
});
