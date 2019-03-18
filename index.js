require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const passport = require("passport");

const users = require("./routes/api/users");

const app = express();
console.log();
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
console.log(process.env.DB_URI);
// Connect to MongoDB
mongoose
  .connect(
    process.env.DB_URI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);

const port = process.env.APP_PORT;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));