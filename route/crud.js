module.exports = () => {
  let express = require("express"),
    router = express.Router(),
    { encrypt, response } = require("../helper/e2e"),
    v1 = "/api/v_1";

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

  return { router, GET, POST, UPDATE, DELETE, FIND };
};
