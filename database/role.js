let db = require("./db");
let Role = db.Role;

let all = () => {
  return new Promise((resolve, reject) => {
    Role.find({}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let role = new Role(obj);
    role.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Role.findOne({ role_id: obj.role_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.roleName =
          obj.roleName == null || obj.roleName == undefined
            ? data.roleName
            : obj.roleName;
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

let findType = (type) => {
  return new Promise((resolve, reject) => {
    Role.findOne({ roleName: type }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let find = (id) => {
  return new Promise((resolve, reject) => {
    Role.findOne({ role_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    Role.deleteOne({ role_id: id }, (err, data) => {
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
  findType,
  destory,
};
