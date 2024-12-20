let db = require("./db");
let User = db.User;

let all = () => {
  return new Promise((resolve, reject) => {
    User.find({}, (err, d) => {
      if (err) reject(err);
      resolve(d);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let user = new User(obj);
    user.save((err, savedUser) => {
      if (err) return reject(err);
      resolve(savedUser);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    User.findOne({ user_id: obj.user_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.phone =
          obj.phone == null || obj.phone == undefined ? data.phone : obj.phone;
        data.email =
          obj.email == null || obj.email == undefined ? data.email : obj.email;
        data.notiToken =
          obj.notiToken == null || obj.notiToken == undefined
            ? data.notiToken
            : obj.notiToken;
        data.password =
          obj.password == null || obj.password == undefined
            ? data.password
            : obj.password;
        data.name =
          obj.name == null || obj.name == undefined ? data.name : obj.name;
        data.type =
          obj.type == null || obj.type == undefined ? data.type : obj.type;
        data.photo =
          obj.photo == null || obj.photo == undefined ? data.photo : obj.photo;
        data.userName =
          obj.userName == null || obj.userName == undefined
            ? data.userName
            : obj.userName;
        data.lang =
          obj.lang == null || obj.lang == undefined ? data.lang : obj.lang;
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

let find = (id) => {
  return new Promise((resolve, reject) => {
    User.aggregate([
      {
        $match: { user_id: id },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role_id",
          foreignField: "role_id",
          as: "role",
        },
      },
      {
        $unwind: "$role",
      },
    ]).exec((err, data) => {
      if (err) reject(err);
      resolve(data[0]);
    });
  });
};

let findEmail = (email) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    User.deleteOne({ user_id: id }, (err, daa) => {
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
  findEmail,
  destory,
};
