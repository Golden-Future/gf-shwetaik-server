module.exports = () => {
  let express = require("express"),
    router = express.Router(),
    jwt = require("jsonwebtoken"),
    bcrypt = require("../helper/pass"),
    { encrypt, response } = require("../helper/e2e"),
    MovieUser = require("../database/move_user");

  let v1 = "/api/v_1";

  let RQS = (Model, operation) => (req, res) => {
    let promise;
    switch (operation) {
      case "all":
        promise = Model.all();
        break;

      case "create":
        promise = Model.save(req.body);
        break;

      case "update":
        promise = Model.update(req.body);
        break;

      case "findOrDelete":
        promise = Model.findOrDelete(req.body, status);
        break;

      default:
        return res
          .status(400)
          .json({ error: "Invalid operation", success: false });
    }
    promise
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  };

  let GET = (sub, Model, operation) => {
    router.get(`${v1}/${sub}`, RQS(Model, operation));
  };

  let POST = (sub, Model, operation) => {
    router.post(`${v1}/${sub}`, RQS(Model, operation));
  };

  let UPDATE = (sub, Model, operation) => {
    router.put(`${v1}/${sub}`, RQS(Model, operation));
  };

  let DELETE = (sub, Model, operation, status) => {
    router.delete(`${v1}/${sub}`, RQS(Model, operation, status));
  };

  let FIND = (sub, Model, operation, status) => {
    router.post(`${v1}/${sub}`, RQS(Model, operation, status));
  };

  GET("user", MovieUser, "all");
  UPDATE("user", MovieUser, "update");
  DELETE("user", MovieUser, "delete");
  FIND("user", MovieUser, "find");

  router.post("/login/user", (req, res) => {
    let data = req.body;
    MovieUser.findEmail(data.email)
      .then((result) => {
        bcrypt
          .compare(data.password, result.password)
          .then((data) => {
            if (data) {
              let payload = { email: result.email, name: result.name };
              let token = jwt.sign(payload, process.env.SECRET);
              res.json({
                con: true,
                token: token,
                data: result,
                msg: `Login Successful!`,
              });
            } else {
              res.json({ con: false, msg: "Password Wrong" });
            }
          })
          .catch((error) =>
            res.json({ con: false, data: error, msg: `Error` })
          );
      })
      .catch((erro) => res.json({ con: false, data: erro, msg: `Error` }));
  });

  router.post("/register/user", (req, res) => {
    let data = req.body;
    bcrypt
      .encrypt(data.password)
      .then((result) => {
        let obj = {
          email: data.email,
          password: result,
        };
        MovieUser.save(obj)
          .then((result) => res.json(response(result, true)))
          .catch((error) => res.json(response(error, false)));
      })
      .catch((error) => res.json(response(error, false)));
  });

  return router;
};
