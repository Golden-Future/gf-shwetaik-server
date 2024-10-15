let db = require("./db");
let Permission = db.Permission;

let all = () => {
  return new Promise((resolve, reject) => {
    Permission.find({}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let permission = new Permission(obj);
    permission.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Permission.findOne({ permission_id: obj.permission_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.task =
          obj.task == null || obj.task == undefined ? data.task : obj.task;
        data.create =
          obj.create == null || obj.create == undefined
            ? data.create
            : obj.create;
        data.update =
          obj.update == null || obj.update == undefined
            ? data.update
            : obj.update;
        data.delete =
          obj.delete == null || obj.delete == undefined
            ? data.delete
            : obj.delete;
        data.read =
          obj.read == null || obj.read == undefined ? data.read : obj.read;
        data.role_id =
          obj.role_id == null || obj.role_id == undefined
            ? data.role_id
            : obj.role_id;
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
    Permission.findOne({ permission_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let findByRoleId = (id) => {
  return new Promise((resolve, reject) => {
    Permission.find({ role_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
let destory = (id) => {
  return new Promise((resolve, reject) => {
    Permission.deleteOne({ permission_id: id }, (err, data) => {
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
  findByRoleId,
};
