let db = require('./db');
let CC = db.ChoosingColumn;

let all = () => {
    return new Promise((resolve, reject) => {
        CC.aggregate([
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
        {
          $lookup: {
            from: "tables",
            localField: "table_id",
            foreignField: "table_id",
            as: "table",
          },
        },
        {
          $unwind: "$table", 
        },
      ])
      .exec((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
  
let save = (obj) => {
    return new Promise((resolve, reject) => {
        obj['since'] = new Date();
        let cc = new CC(obj);
        cc.save((err, data) => {
          if (err) {
            reject(err);
          } else {
            CC.aggregate([
              {
                $match: { choosingColumn_id: data.choosingColumn_id}
              },
              {
                $lookup: {
                  from: "tables",
                  localField: "table_id",
                  foreignField: "table_id",
                  as: "table"
                }
              },
              {
                $unwind: "$table"
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
            ]).exec((errr, datas) => {
              if (errr) reject(errr);
              resolve(datas);
            })
            }
        })
    })
};

let update = (obj) => {
    return new Promise((resolve, reject) => {
        CC.findOne({ choosingColumn_id: obj.choosingColumn_id }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                data.name = obj.name === '' || obj.name == null || false ? data.name : obj.name;
                data.role_id = obj.role_id === '' || obj.role_id == null || false ? data.role_id : obj.role_id;
                data.table_id = obj.table_id === '' || obj.table_id == null || false ? data.table_id : obj.table_id;
                data.since = new Date()
                data.save((error, result) => {
                    if (error) reject(error);
                    resolve(result);
                })
            }
        })
    })
};

let findByTable = (t,r) => {
  return new Promise((resolve, reject) => {
    CC.find({ table_id: t,role_id:r}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  })
  };

let remove = (id) => {
    return new Promise((resolve, reject) => {
        CC.deleteOne({ choosingColumn_id: id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
}
module.exports = {
    all,
    save,
    update,
    remove,
    findByTable
}
