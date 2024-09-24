require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bodyParser = require("body-parser");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("./database/user");
const cors = require("cors");
const firebird = require("node-firebird");
let encrypt = require("./helper/e2e");
const app = express();

const jwtOption = {};
jwtOption.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOption.secretOrKey = process.env.SECRET;

const Strategy = new JwtStrategy(jwtOption, (payload, done) => {
  const email = payload.email;
  const name = payload.name;
  User.findEmail(email)
    .then((admin) => {
      if (admin.name === name) {
        done(null, admin);
      } else {
        done(null, false);
      }
    })
    .catch((err) => done(err, null));
});

passport.use(Strategy);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const adminRoute = require("./route/admin")(express, jwt, passport, bodyParser);
app.use("/admin", adminRoute);

var options = {};

options.host = "localhost";
options.port = 3050;
options.database = "/home/ACC-0008.FDB";
options.user = "SYSDBA";
options.password = "ea7c5a9b";
options.lowercase_keys = false;
options.role = null;
options.pageSize = 4096;
options.retryConnectionInterval = 1000;
options.blobAsText = false;
options.encoding = "UTF8";

app.get("/table/:name/:page/:size", (req, res) => {
  const name = req.params.name;
  let page = parseInt(req.params.page, 10);
  let size = parseInt(req.params.size, 10);

  // Validate page and size
  if (isNaN(page) || isNaN(size) || page < 1 || size < 1) {
    return res.status(400).send("Invalid page or size parameter.");
  }

  const offset = (page - 1) * size;
  const limit = size;

  firebird.attach(options, function (err, db) {
    if (err) {
      return res.status(500).send("Database connection failed: " + err.message);
    }

    const query = `SELECT * FROM ${name} ROWS ${offset + 1} TO ${
      offset + limit
    }`;

    db.query(query, function (err, result) {
      if (err) {
        db.detach();
        return res.status(500).send("Query failed: " + err.message);
      }

      res.json(result);
      db.detach();
    });
  });
});

app.get("/table/ss/:name", (req, res) => {
  let name = req.param("name");
  firebird.attach(options, function (err, db) {
    if (err) {
      return res.status(500).send("Database connection failed: " + err.message);
    }

    db.query(`SELECT * FROM ${name}`, function (err, result) {
      if (err) {
        db.detach();
        return res.status(500).send("Query failed: " + err.message);
      }

      res.json(result);
      db.detach();
    });
  });
});

app.post("/table/find", (req, res) => {
  const { tableName, uniquekey, data } = req.body;

  if (!tableName || !uniquekey || !data) {
    return res
      .status(400)
      .send("Table name, unique key, and data are required.");
  }

  firebird.attach(options, function (err, db) {
    if (err) {
      return res.status(500).send("Database connection failed: " + err.message);
    }

    const query = `SELECT * FROM ${tableName} WHERE ${uniquekey} = ?`;

    db.query(query, [data], function (err, result) {
      if (err) {
        db.detach();
        return res.status(500).send("Query failed: " + err.message);
      }

      if (result.length === 0) {
        return res.json({ con: false, msg: "No Data" });
      }

      res.json({
        con: true,
        msg: result,
      });
      db.detach();
    });
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
