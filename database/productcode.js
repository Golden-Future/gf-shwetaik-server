let db = require("./db");
let Product_Code = db.Product_Code;

let allU = () => {
  return new Promise((resolve, reject) => {
    Product_Code.find({}, (err, d) => {
      if (err) reject(err);
      resolve(d);
    });
  });
};

let all = () => {
  return new Promise((resolve, reject) => {
    Product_Code.aggregate([
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
    let user = new Product_Code(obj);
    user.save((err, savedUser) => {
      if (err) return reject(err);

      Product_Code.aggregate([
        {
          $match: { Product_Code_id: savedUser.Product_Code_id },
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
    Product_Code.findOne(
      { Product_Code_id: obj.Product_Code_id },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          let Product_CodeScheme = new Schema({
            code: { type: Number },
            location: {
              CODE: { type: String },
              DESCRIPTION: { type: String },
            },
            QTY: { type: Number },
            role_id: { type: Number },
            since: { type: Date },
          });

          data.code =
            obj.code == null || obj.code == undefined ? data.code : obj.code;
          data.location.CODE =
            obj.location.CODE == null || obj.location.CODE == undefined
              ? data.location.CODE
              : obj.location.CODE;
          data.location.DESCRIPTION =
            obj.location.DESCRIPTION == null ||
            obj.location.DESCRIPTION == undefined
              ? data.location.DESCRIPTION
              : obj.location.DESCRIPTION;
          data.role_id =
            obj.role_id == null || obj.role_id == undefined
              ? data.role_id
              : obj.role_id;
          data.QTY =
            obj.QTY == null || obj.QTY == undefined ? data.QTY : obj.QTY;
          data.since = new Date();
          data.save((error, datas) => {
            if (error) {
              reject(error);
            } else {
              Product_Code.aggregate([
                {
                  $match: { Product_Code_id: datas.Product_Code_id },
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
      }
    );
  });
};

let find = (id) => {
  return new Promise((resolve, reject) => {
    Product_Code.aggregate([
      {
        $match: { role_id: id },
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
    Product_Code.deleteOne({ Product_Code_id: id }, (err, daa) => {
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
