let db = require("./db");
let TeamCode = db.TeamCode;

let all = () => {
  return new Promise((resolve, reject) => {
    TeamCode.aggregate([
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
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let user = new TeamCode(obj);
    user.save((err, savedUser) => {
      if (err) return reject(err);

      TeamCode.aggregate([
        {
          $match: { TeamCode_id: savedUser.TeamCode_id },
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
      ]).exec((aggErr, data) => {
        if (aggErr) return reject(aggErr);
        resolve(data[0]);
      });
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    TeamCode.findOne({ TeamCode_id: obj.TeamCode_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.code =
          obj.code == null || obj.code == undefined ? data.code : obj.code;
        data.role_id =
          obj.role_id == null || obj.role_id == undefined
            ? data.role_id
            : obj.role_id;
        data.since = new Date();
        data.save((error, datas) => {
          if (error) {
            reject(error);
          } else {
            TeamCode.aggregate([
              {
                $match: { TeamCode_id: datas.TeamCode_id },
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
            ]).exec((e, d) => {
              if (e) reject(e);
              resolve(d);
            });
          }
        });
      }
    });
  });
};

let find = (id) => {
  return new Promise((resolve, reject) => {
    TeamCode.find({ role_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    TeamCode.deleteOne({ TeamCode_id: id }, (err, daa) => {
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
