let db = require("./db");
let tableList = db.tableList;

let all = () => {
  return new Promise((resolve, reject) => {
        tableList.aggregate([
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
      let list = new tableList(obj);
      list.save((err, savedUser) => {
        if (err) return reject(err);
        tableList.aggregate([
          {
            $match: { tableList_id: savedUser.tableList_id } 
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
    tableList.findOne({ user_id: obj.tableList_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.list =
          obj.list == null || obj.list == undefined ? data.list : obj.list;
        data.role_id =
          obj.role_id == null || obj.role_id == undefined ? data.role_id : obj.role_id;
        data.since = new Date();
        data.save((error, datas) => {
          if (error) {
            reject(error);
          } else {
            tableList.aggregate([
              {
                $match: { user_id: datas.tableList_id}
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
    tableList.findOne({tableList_id: id},(e,d)=>{
      if (e) {
        reject(e);
      } else {
        tableList.aggregate([
          {
         $match: {tableList_id: d.tableList_id}
          },
          {
            $lookup: {
              from: "roles",
              localField: "role_id",
              foreignField: "role_id",
              as:"role"
            }
          },
          {
            $unwind: "$role"
          }
        ]).exec((er, da) => {
          if (er) reject(er);
          resolve(da);
       })
      }
    })
  });
};

let findByRole = (id) => {
  return new Promise((resolve, reject) => {
    tableList.findOne({role_id: id},(e,d)=>{
      if (e) {
        reject(e);
      } else {
        tableList.aggregate([
          {
         $match: {tableList_id: d.tableList_id}
          },
          {
            $lookup: {
              from: "roles",
              localField: "role_id",
              foreignField: "role_id",
              as:"role"
            }
          },
          {
            $unwind: "$role"
          }
        ]).exec((er, da) => {
          if (er) reject(er);
          resolve(da);
       })
      }
    })
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    tableList.deleteOne({ tableList_id: id }, (err, daa) => {
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
  findByRole
};
