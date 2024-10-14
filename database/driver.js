let db = require("./db");
let Driver = db.Driver;

let all = () => {
  return new Promise((resolve, reject) => {
    Driver.find({}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let driver = new Driver(obj);
    driver.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Driver.findOne({ driver_id: obj.driver_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.name =
          obj.name == null || obj.name == undefined ? data.name : obj.name;
        data.email =
          obj.email == null || obj.email == undefined ? data.email : obj.email;
        data.password =
          obj.password == null || obj.password == undefined
            ? data.password
            : obj.password;
        data.phone =
          obj.phone == null || obj.phone == undefined ? data.phone : obj.phone;
        data.since = new Date();
        data.save((error, datas) => {
          if (error) reject(error);
          resolve(datas);
        });
      }
    });
  });
};

let find = (id) => {
  return new Promise((resolve, reject) => {
    Driver.findOne({ driver_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    Driver.deleteOne({ driver_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
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
