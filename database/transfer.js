let db = require("./db");
let Transfer = db.Transfers;

let all = () => {
  return new Promise((resolve, reject) => {
    Transfer.find({}, (err, d) => {
      if (err) reject(err);
      resolve(d);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let user = new Transfer(obj);
    user.save((err, savedUser) => {
      if (err) return reject(err);
      resolve(savedUser);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Transfer.findOne({ Transfer_id: obj.Transfer_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.code =
          obj.code == null || obj.code == undefined ? data.code : obj.code;
        data.location.CODE =
          obj.location.CODE == null || obj.location.CODE == undefined
            ? data.location.CODE
            : obj.location.CODE;
        data.location.DESCRIPTION =
          obj.location.DESCRIPTION == null ||
          obj.location.DESCRIPTION == undefined
            ? data.location.DESCRIPTION
            : obj.location.DESCRIPTION;
        data.QTY = obj.QTY == null || obj.QTY == undefined ? data.QTY : obj.QTY;
        data.since = new Date();
        data.save((error, datas) => {
          if (error) {
            reject(error);
          } else {
            resolve(datas);
          }
        });
      }
    });
  });
};

let find = (id, status) => {
  return new Promise((resolve, reject) => {
    if (status == "req") {
      Transfer.find({ req_id: id }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    } else if (status == "res") {
      Transfer.find({ res_id: id }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    }
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    Transfer.deleteOne({ Transfer_id: id }, (err, daa) => {
      if (err) reject(err);
      resolve(daa);
    });
  });
};

module.exports = {
  all,
  save,
  update,
  find,
  destory,
};
