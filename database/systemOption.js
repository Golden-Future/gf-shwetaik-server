let db = require("./db");
let SystemOption = db.SystemOption;

let all = () => {
  return new Promise((resolve, reject) => {
    SystemOption.aggregate([
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

const save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let system = new SystemOption(obj);
    system.save((err, data) => {
      if (err) {
        return reject(err);
      } else {
        SystemOption.aggregate([
          {
            $match: { systemOption_id: data.systemOption_id },
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
        ]).exec((eror, dtas) => {
          if (eror) {
            return eror;
          } else {
            resolve(dtas[0]);
          }
        });
      }
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    SystemOption.findOne(
      { systemOption_id: obj.systemOption_id },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          data.userManage =
            obj.userManage == null || obj.userManage == undefined
              ? data.userManage
              : obj.userManage;

          data.roleManage =
            obj.roleManage == null || obj.roleManage == undefined
              ? data.roleManage
              : obj.roleManage;

          data.languageManage =
            obj.languageManage == null || obj.languageManage == undefined
              ? data.languageManage
              : obj.languageManage;

          data.lang =
            obj.lang == null || obj.lang == undefined ? data.lang : obj.lang;

          data.role_id =
            obj.role_id == null || obj.role_id == undefined
              ? data.role_id
              : obj.role_id;

          data.tableManage =
            obj.tableManage == null || obj.tableManage == undefined
              ? data.tableManage
              : obj.tableManage;

          data.colorManage =
            obj.colorManage == null || obj.colorManage == undefined
              ? data.colorManage
              : obj.colorManage;

          data.filterManage =
            obj.filterManage == null || obj.filterManage == undefined
              ? data.filterManage
              : obj.filterManage;

          data.tableSync =
            obj.tableSync == null || obj.tableSync == undefined
              ? data.tableSync
              : obj.tableSync;

          data.tableFetch =
            obj.tableFetch == null || obj.tableFetch == undefined
              ? data.tableFetch
              : obj.tableFetch;

          data.tableInsert =
            obj.tableInsert == null || obj.tableInsert == undefined
              ? data.tableInsert
              : obj.tableInsert;

          data.since = new Date();
          data.save((error, datas) => {
            if (error) {
              reject(error);
            } else {
              SystemOption.aggregate([
                {
                  $match: { systemOption_id: datas.systemOption_id },
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
    SystemOption.findOne({ systemOption_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let findByUid = (id) => {
  return new Promise((resolve, reject) => {
    SystemOption.aggregate([
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
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    SystemOption.deleteOne({ systemOption_id: id }, (err, data) => {
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
  findByUid,
};
