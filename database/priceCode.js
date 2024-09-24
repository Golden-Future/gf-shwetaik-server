let db = require("./db");
let PriceCodes = db.PriceCodes;

let allU = () => {
  return new Promise((resolve, reject) => {
    PriceCodes.find({}, (err, d) => {
      if (err) reject(err);
      resolve(d);
    });
  });
};

let all = () => {
  return new Promise((resolve, reject) => {
    PriceCodes.aggregate([
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
    let price = new PriceCodes(obj);
    price.save((err, savedUser) => {
      if (err) return reject(err);

      PriceCodes.aggregate([
        {
          $match: { pricecode_id: savedUser.pricecode_id },
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
    PriceCodes.findOne({ pricecode_id: obj.pricecode_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.one = obj.one == null || obj.one == undefined ? data.one : obj.one;
        data.two = obj.two == null || obj.two == undefined ? data.two : obj.two;
        data.three =
          obj.three == null || obj.three == undefined ? data.three : obj.three;
        data.four =
          obj.four == null || obj.four == undefined ? data.four : obj.four;
        data.five =
          obj.five == null || obj.five == undefined ? data.five : obj.five;
        data.six = obj.six == null || obj.six == undefined ? data.six : obj.six;
        data.seven =
          obj.seven == null || obj.seven == undefined ? data.seven : obj.seven;
        data.eight =
          obj.eight == null || obj.eight == undefined ? data.eight : obj.eight;
        data.five =
          obj.nine == null || obj.nine == undefined ? data.nine : obj.nine;
        data.ten = obj.ten == null || obj.ten == undefined ? data.ten : obj.ten;
        data.role_id =
          obj.role_id == null || obj.role_id == undefined
            ? data.role_id
            : obj.role_id;
        data.active =
          obj.active == null || obj.active == undefined
            ? data.active
            : obj.active;
        data.since = new Date();
        data.save((error, datas) => {
          if (error) {
            reject(error);
          } else {
            PriceCodes.aggregate([
              {
                $match: { pricecode_id: datas.pricecode_id },
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
    PriceCodes.aggregate([
      {
        $match: { pricecode_id: pricecode_id },
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

let destory = (id) => {
  return new Promise((resolve, reject) => {
    PriceCodes.deleteOne({ pricecode_id: id }, (err, daa) => {
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
