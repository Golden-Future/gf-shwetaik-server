require("dotenv").config();
let express = require("express"),
  app = express(),
  jwt = require("jsonwebtoken"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt,
  User = require("./database/user"),
  cors = require("cors");

let jwtOption = {};
jwtOption.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOption.secretOrKey = process.env.SECRET;

let myS = new JwtStrategy(jwtOption, (payload, done) => {
  let email = payload.email;
  let name = payload.name;
  User.findByAdminemail(email)
    .then((admin) => {
      if (admin.name == name) {
        done(null, admin);
      }
    })
    .catch((err) => done(err, null));
});

let adminRoute = require("./route/admin")(express, jwt, passport, bodyParser);

let path = require("path");

passport.use(myS);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use("/admin", adminRoute);

app.listen(process.env.PORT, (_) => {
  console.log(`Server is running at ${process.env.PORT}`);
});
