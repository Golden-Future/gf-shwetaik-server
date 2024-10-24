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
// let encrypt = require("./helper/e2e");
const app = express();
const genericPool = require("generic-pool");
const CarUser = require("./database/carUser");
const db = require("./database/db");
let Way = db.Way;
let Status = db.Status;

// Strategy options for car
const carJwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.CARSECRET,
};

// Strategy options for core
const coreJwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.CORESECRET,
};

// Car JWT Strategy
const carStrategy = new JwtStrategy(carJwtOptions, (payload, done) => {
  const email = payload.email;
  CarUser.findEmail(email)
    .then((user) => {
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    })
    .catch((err) => done(err, null));
});

// Admin JWT Strategy
const coreStrategy = new JwtStrategy(coreJwtOptions, (payload, done) => {
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

// Use both strategies in passport
passport.use("car-jwt", carStrategy);
passport.use("core-jwt", coreStrategy);

// Middleware to initialize passport
app.use(passport.initialize());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const adminRoute = require("./route/admin")(express, jwt, passport, bodyParser);
const carRoute = require("./route/car")(express, jwt, passport, bodyParser);
const movieRoute = require("./route/movie")(express);
app.use("/admin", adminRoute);
app.use("/car", carRoute);
app.use("/movie", movieRoute);

// Routes for admin with admin strategy protection
app.use(
  "/admin",
  passport.authenticate("core-jwt", { session: false }),
  adminRoute
);

// Routes for user with user strategy protection
app.use("/car", passport.authenticate("car-jwt", { session: false }), carRoute);

var options = {};

options.host = "127.0.0.1";
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

// Create a connection pool
const factory = {
  create: () => {
    return new Promise((resolve, reject) => {
      firebird.attach(options, (err, db) => {
        if (err) {
          return reject(err);
        }
        resolve(db);
      });
    });
  },
  destroy: (db) => {
    return new Promise((resolve) => {
      db.detach(() => {
        resolve();
      });
    });
  },
};

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

// app.post("/table/filter", (req, res) => {
//   let name = req.body.name;
//   let codes = req.body.codes;

//   let whereClause = codes
//     .map((code) => `ITEMCODE LIKE '${code}-%'`)
//     .join(" OR ");

//   firebird.attach(options, function (err, db) {
//     if (err) {
//       return res.status(500).send("Database connection failed: " + err.message);
//     }

//     db.query(
//       `SELECT * FROM ${name} WHERE ${whereClause}`,
//       function (err, result) {
//         if (err) {
//           db.detach();
//           return res.status(500).send("Query failed: " + err.message);
//         }

//         res.json(result);
//         db.detach();
//       }
//     );
//   });
// });

app.post("/table/filter", (req, res) => {
  let name = req.body.name; // Name of the main table (e.g., your main table name)
  let codes = req.body.codes; // List of codes to filter

  // Create the WHERE clause based on the provided codes
  let whereClause = codes
    .map((code) => `ITEMCODE LIKE '${code}-%'`)
    .join(" OR ");

  firebird.attach(options, function (err, db) {
    if (err) {
      return res.status(500).send("Database connection failed: " + err.message);
    }

    // Updated query to join LOCATION table with CODE from ST_LOCATION
    db.query(
      `SELECT c.*, l.CODE AS LOCATION_CODE, l.DESCRIPTION AS LOCATION_DESCRIPTION, 
              l.ADDRESS1, l.ADDRESS2, l.PROJECT, l.ISACTIVE 
       FROM ${name} c
       LEFT JOIN ST_LOCATION l ON c.LOCATION = l.CODE
       WHERE ${whereClause}`,
      function (err, result) {
        if (err) {
          db.detach();
          return res.status(500).send("Query failed: " + err.message);
        }

        // Send the query result as a JSON response
        res.json(result);
        db.detach();
      }
    );
  });
});

const pool = genericPool.createPool(factory, {
  max: 10, // Maximum number of connections in the pool
  min: 2, // Minimum number of connections in the pool
  idleTimeoutMillis: 30000, // Idle time before releasing the connection
});

app.get("/table/:name/:page/:size", (req, res) => {
  const name = "ST_ITEM";
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

// app.post("/table/find", (req, res) => {
//   const { tableName, uniquekey, data } = req.body;

//   if (!tableName || !uniquekey || !data) {
//     return res
//       .status(400)
//       .send("Table name, unique key, and data are required.");
//   }

//   firebird.attach(options, function (err, db) {
//     if (err) {
//       return res.status(500).send("Database connection failed: " + err.message);
//     }

//     const query = `SELECT * FROM ${tableName} WHERE ${uniquekey} = ?`;

//     db.query(query, [data], function (err, result) {
//       if (err) {
//         db.detach();
//         return res.status(500).send("Query failed: " + err.message);
//       }

//       if (result.length === 0) {
//         return res.json({ con: false, msg: "No Data" });
//       }

//       res.json({
//         con: true,
//         msg: result,
//       });
//       db.detach();
//     });
//   });
// });

// API to fetch table data with pagination
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

  pool
    .acquire()
    .then((db) => {
      const query = `SELECT * FROM ${name} ROWS ${offset + 1} TO ${
        offset + limit
      }`;

      db.query(query, (err, result) => {
        pool.release(db); // Return connection to the pool

        if (err) {
          return res.status(500).send("Query failed: " + err.message);
        }

        res.json(result);
      });
    })
    .catch((err) => {
      res.status(500).send("Database connection failed: " + err.message);
    });
});

// API to fetch all rows from a table
// app.get("/table/ss/:name", (req, res) => {
//   const name = req.param("name");

//   pool
//     .acquire()
//     .then((db) => {
//       db.query(`SELECT * FROM ${name}`, (err, result) => {
//         pool.release(db); // Return connection to the pool

//         if (err) {
//           return res.status(500).send("Query failed: " + err.message);
//         }

//         res.json(result);
//       });
//     })
//     .catch((err) => {
//       res.status(500).send("Database connection failed: " + err.message);
//     });
// });

// API to find a record by unique key
app.post("/table/find", (req, res) => {
  const { tableName, uniquekey, data } = req.body;

  if (!tableName || !uniquekey || !data) {
    return res
      .status(400)
      .send("Table name, unique key, and data are required.");
  }

  pool
    .acquire()
    .then((db) => {
      const query = `SELECT * FROM ${tableName} WHERE ${uniquekey} = ?`;

      db.query(query, [data], (err, result) => {
        pool.release(db); // Return connection to the pool

        if (err) {
          return res.status(500).send("Query failed: " + err.message);
        }

        if (result.length === 0) {
          return res.json({ con: false, msg: "No Data" });
        }

        res.json({
          con: true,
          msg: result,
        });
      });
    })
    .catch((err) => {
      res.status(500).send("Database connection failed: " + err.message);
    });
});
let drop =  ()=>{

<<<<<<< HEAD

Way.collection.drop(function(err, result) {
  if (err) {
    console.log('Error dropping collection:', err);
  } else {
    console.log('Collection dropped successfully');
  }
});


Status.collection.drop(function(err, result) {
  if (err) {
    console.log('Error dropping collection:', err);
  } else {
    console.log('Collection dropped successfully');
  }
});
};


//drop();
=======
app.get("/drop-collections", async (req, res) => {
  try {
    // Drop Status collection
    await Status.collection.drop();
    console.log("Status collection dropped");

    // Drop Ways collection
    await Way.collection.drop();
    console.log("Ways collection dropped");

    // Send response to the client
    res.send("Status and Ways collections dropped successfully");
  } catch (err) {
    console.error("Error dropping collections:", err);
    res.status(500).send("Error dropping collections: " + err.message);
  }
});

>>>>>>> 5f916ffb405775c7a6c0b2a5eae6d79b9e6119a7
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
