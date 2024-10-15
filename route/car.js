module.exports = () => {
  let express = require("express"),
    router = express.Router(),
    jwt = require("jsonwebtoken"),
    passport = require("passport"),
    { response } = require("../helper/e2e"),
    bcrypt = require("../helper/pass"),
    Car = require("../database/car"),
    Way = require("../database/way"),
    Status = require("../database/car_status"),
    Driver = require("../database/driver"),
    CarUser = require("../database/carUser");
  /*** api */
  const ENV = require("../env/env").environment;
  const API = ENV.API_URL;
  /*** api */

  router.post(`${API}/carUser/register`, (req, res) => {
    let { email, password } = req.body;
    bcrypt
      .encrypt(password)
      .then((result) => {
        let obj = {
          email: email,
          password: result,
        };
        CarUser.save(obj)
          .then((result) => res.json(response(result, true)))
          .catch((error) => res.json(response(error, false)));
      })
      .catch((error) => {
        res.json(response(error, false));
      });
  });

  router.post(`${API}/carUser/login`, (req, res) => {
    let { email, password } = req.body;
    CarUser.findEmail(email)
      .then((result) => {
        bcrypt
          .compare(password, result.password)
          .then((res) => {
            console.log(res);
            // if (res) {
            // let payload = { email: result.email, name: result.carUser_id };
            // let token = jwt.sign(payload, process.env.CARSECRET);
            // let data = encrypt.encrypt(JSON.stringify(result));
            // console.log(res, token, payload, result);
            res.json({
              con: res,
              // token: token,
              data: result,
              msg: `Login Successful!`,
            });
            // } else {
            //   res.json({ con: false, msg: "Password Wrong" });
            // }
          })
          // .catch((error) => res.json(response(error, false)));
          .catch((error) => res.json({ con: false, msg: error }));
      })
      // .catch((error) => res.json(response(error, false)));
      .catch((error) => res.json({ con: false, msg: "3333" }));
  });

  router.get(`${API}/all/carUser/`, (req, res) => {
    CarUser.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });
  // ****** CAR ******* //

  router.get(
    `${API}/car`,
    // passport.authenticate("car-jwt", {session: false}),
    (req, res) => {
      Car.all()
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.post(
    `${API}/car/find`,
    passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Car.save(req.body)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.post(
    `${API}/car`,
    passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Car.find(req.body.car_id)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.put(
    `${API}/car`,
    passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Car.update(req.body)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.delete(
    `${API}/car`,
    passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Car.destory(req.body.car_id)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  // ****** CAR ******* //

  // ****** STATUS ******* //

  router.get(
    `${API}/status`,
    // passport.authenticate("car-jwt", {session: false}),
    (req, res) => {
      Status.all()
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.post(
    `${API}/status/find`,
    // passport.authenticate("car-jwt", {session: false}),
    (req, res) => {
      Status.save(req.body)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.post(
    `${API}/status`,
    // passport.authenticate("car-jwt", {session: false}),
    (req, res) => {
      Status.find(req.body.status_id)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.put(
    `${API}/status`,
    passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Status.update(req.body)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.delete(
    `${API}/status`,
    passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Status.destory(req.body.status_id)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  // ****** STATUS ******* //

  // ****** DRIVER ******* //

  router.get(
    `${API}/driver`,
    passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Driver.all()
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.post(
    `${API}/driver/find`,
    passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Status.save(req.body)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.post(
    `${API}/driver`,
    passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Status.find(req.body.driver_id)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.put(
    `${API}/driver`,
    passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Status.update(req.body)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.delete(
    `${API}/driver`,
    passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Status.destory(req.body.driver_id)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  // ****** DRIVER ******* //

  // ****** WAY ******* //

  router.get(
    `${API}/way`,
    // passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Way.all()
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.post(
    `${API}/way/find`,
    // passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Way.save(req.body)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.post(
    `${API}/way`,
    // passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Way.find(req.body.way_id)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.put(
    `${API}/way`,
    // passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Way.update(req.body)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.delete(
    `${API}/way`,
    // passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Way.destory(req.body.way_id)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  router.post(
    `${API}/way`,
    // passport.authenticate("car-jwt", { session: false }),
    (req, res) => {
      Way.findByPeriod(req.body.fromDate, req.body.toDate)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
    },
  );

  // ****** WAY ******* //

  return router;
};
