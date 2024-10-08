let db = require("./db");
let MV_User = db.MV_User;

let all = () => {
  return new Promise((resolve, reject) => {
    MV_User.find({}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let Iv_Good = new MV_User(obj);
    Iv_Good.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    MV_User.findOne({ MV_User_id: obj.MV_User_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.email =
          obj.email == null || obj.email == undefined ? data.email : obj.email;
        data.password =
          obj.password == null || obj.password == undefined
            ? data.password
            : obj.password;
        data.type =
          obj.type == null || obj.type == undefined ? data.type : obj.type;
        data.since = new Date();
        data.save((error, datas) => {
          if (error) reject(error);
          resolve(datas);
        });
      }
    });
  });
};

let findEmail = (email) => {
  return new Promise((resolve, reject) => {
    MV_User.findOne({ email: email }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let findOrDelete = (id, status) => {
  return new Promise((resolve, reject) => {
    if (status === "delete") {
      MV_User.deleteOne({ MV_User_id: id }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    } else if (status === "find") {
      MV_User.findOne({ MV_User_id: id }, (err, data) => {
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
  findEmail,
};
