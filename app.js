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

let Strategy = new JwtStrategy(jwtOption, (payload, done) => {
  let email = payload.email;
  let name = payload.name;
  User.findEmail(email)
    .then((admin) => {
      if (admin.name === name) {
        done(null, admin);
      }
    })
    .catch((err) => done(err, null));
});

let adminRoute = require("./route/admin")(express, jwt, passport, bodyParser);
let userRoute = require("./route/user")(express, jwt, passport, bodyParser);
let colorRoute = require("./route/color")(express, jwt, passport, bodyParser);
let systemRoute = require("./route/system")(express, jwt, passport, bodyParser);
let roleRoute = require("./route/role")(express, jwt, passport, bodyParser);
let dataSyncRoute = require("./route/dataSync")(express, jwt, passport, bodyParser);

passport.use(Strategy);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/color", colorRoute);
app.use("/system", systemRoute);
app.use("/role", roleRoute);
app.use("/dataSync", dataSyncRoute);

app.listen(process.env.PORT, (_) => {
  console.log(`Server is running at ${process.env.PORT}`);
});
