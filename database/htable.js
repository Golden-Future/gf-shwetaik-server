let db = require("./db");
let Htable = db.htable;

let all = () => {
  return new Promise((resolve, reject) => {
    Htable.find({}, (err, d) => {
      if (err) {
        reject(err);
      } else {
        resolve(d);
      }
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    let user = new Htable(obj);
    user.save((err, savedUser) => {
      if (err) return reject(err);
      resolve(savedUser);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Htable.findOne({ htable_id: obj.carUser_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.tableNo =
          obj.tableNo == null || obj.tableNo == undefined
            ? data.tableNo
            : obj.tableNo;
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

let find = (id) => {
  return new Promise((resolve, reject) => {
    Htable.findOne({ htable_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    Htable.deleteOne({ htable_id: id }, (err, daa) => {
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
