let db = require("./db");
let IV_Good = db.IV_Good;

let all = () => {
  return new Promise((resolve, reject) => {
    IV_Good.find({}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let Iv_Good = new IV_Good(obj);
    Iv_Good.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    IV_Good.findOne({ ivGood_id: obj.ivGood_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.localIV_id =
          obj.localIV_id == null || obj.localIV_id == undefined
            ? data.localIV_id
            : obj.localIV_id;
        data.code =
          obj.code == null || obj.code == undefined ? data.code : obj.code;
        data.description =
          obj.description == null || obj.description == undefined
            ? data.description
            : obj.description;
        data.price =
          obj.price == null || obj.price == undefined ? data.price : obj.price;
        data.location =
          obj.location == null || obj.location == undefined
            ? data.location
            : obj.location;
        data.quantity =
          obj.quantity == null || obj.quantity == undefined
            ? data.quantity
            : obj.quantity;
        data.since = new Date();
        data.save((error, datas) => {
          if (error) reject(error);
          resolve(datas);
        });
      }
    });
  });
};

let findOrDelete = (id, status) => {
  return new Promise((resolve, reject) => {
    if (status === "delete") {
      IV_Good.deleteOne({ ivGood_id: id }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    } else if (status === "find") {
      IV_Good.findOne({ ivGood_id: id }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    }
  });
};

module.exports = {
  all,
  save,
  update,
  findOrDelete,
};
