let db = require("./db");
let P_IV = db.P_IV;

let all = () => {
  return new Promise((resolve, reject) => {
    P_IV.aggregate([
      {
        $lookup: {
          from: "LocalIVs",
          localField: "localIV_id",
          foreignField: "localIV_id",
          as: "LocalIV",
        },
      },
      {
        $unwind: "$LocalIV",
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
    let p_iv = new P_IV(obj);
    p_iv.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    P_IV.findOne({ PIV_id: obj.PIV_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.localIV_id =
          obj.localIV_id == null || obj.localIV_id == undefined
            ? data.localIV_id
            : obj.localIV_id;
        data.sum = obj.sum == null || obj.sum == undefined ? data.sum : obj.sum;
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
      P_IV.deleteOne({ PIV_id: id }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    } else if (status === "find") {
      P_IV.findOne({ PIV_id: id }, (err, data) => {
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
