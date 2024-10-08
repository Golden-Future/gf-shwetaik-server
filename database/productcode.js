let db = require("./db");
let Product_Code = db.Product_Code;

let all = () => {
  return new Promise((resolve, reject) => {
    Product_Code.find({}, (err, d) => {
      if (err) reject(err);
      resolve(d);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let user = new Product_Code(obj);
    user.save((err, savedUser) => {
      if (err) return reject(err);
      resolve(savedUser);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Product_Code.findOne(
      { Product_Code_id: obj.Product_Code_id },
      (err, data) => {
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
          data.QTY =
            obj.QTY == null || obj.QTY == undefined ? data.QTY : obj.QTY;
          data.since = new Date();
          data.save((error, datas) => {
            if (error) {
              reject(error);
            } else {
              resolve(datas);
            }
          });
        }
      }
    );
  });
};

let find = (id) => {
  return new Promise((resolve, reject) => {
    Product_Code.find({ role_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    Product_Code.deleteOne({ Product_Code_id: id }, (err, daa) => {
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
  allU,
};
