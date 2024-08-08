let db = require("./db");
let User = db.User;

let all = () => {
    return new Promise((resolve, reject) => {
      User.aggregate([
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
      ])
      .exec((err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  };

  let save = (obj) => {
    return new Promise((resolve, reject) => {
      obj["since"] = new Date();
      let user = new User(obj);
      user.save((err, savedUser) => {
        if (err) return reject(err);
  
        User.aggregate([
          {
            $match: { user_id: savedUser.user_id } 
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
            $unwind: "$role" 
          }
        ])
        .exec((aggErr, data) => {
          if (aggErr) return reject(aggErr);
          resolve(data[0]); 
        });
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
        data.password =
          obj.password == null || obj.password == undefined
            ? data.password
            : obj.password;
        data.role_id =
          obj.role_id == null || obj.role_id == undefined ? data.role_id : obj.role_id;
        data.name =
          obj.name == null || obj.name == undefined ? data.name : obj.name;
        data.userName =
          obj.userName == null || obj.userName == undefined
            ? data.userName
            : obj.userName;
        data.lang =
          obj.lang == null || obj.lang == undefined
            ? data.lang
            : obj.lang;
        data.since = new Date();
        data.save((error, datas) => {
          if (error) {
            reject(error);
          } else {
            User.aggregate([
              {
                $match: { user_id: datas.user_id}
              },
              {
                $lookup: {
                  from: "roles",
                  localField: "role_id",
                  foreignField: "role_id",
                  as: "role"
                }
              },
              {
                $unwind: "$role"
              }
            ]).exec((e, d) => {
              if (e) reject(e);
              resolve(d);
            })
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
        $match: { user_id: id }
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
        $unwind: "$role" 
      }
    ])
    .exec((err, data) => {
      if (err) reject(err);
      resolve(data[0]); 
    });
  });
};

let findEmail = (email) => {
  return new Promise((resolve, reject) => {
    User.aggregate([
      {
        $match: { email: email }
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
        $unwind: "$role" 
      }
    ])
    .exec((err, data) => {
      if (err) reject(err);
      resolve(data[0]); 
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
