let db = require("./db");
let Transfer = db.Transfers;

let all = () => {
  return new Promise((resolve, reject) => {
    Transfer.find({}, (err, d) => {
      if (err) reject(err);
      resolve(d);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let user = new Transfer(obj);
    user.save((err, savedUser) => {
      if (err) return reject(err);
      resolve(savedUser);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Transfer.findOne({ Transfer_id: obj.Transfer_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        // type: { type: String },
        // insert_status: { type: Boolean },
        //       since: { type: Date },

        data.productCode =
          obj.productCode == null || obj.productCode == undefined
            ? data.productCode
            : obj.productCode;
        data.req_id =
          obj.req_id == null || obj.req_id == undefined
            ? data.req_id
            : obj.req_id;
        data.qty = obj.qty == null || obj.qty == undefined ? data.qty : obj.qty;
        data.req_id =
          obj.req_id == null || obj.req_id == undefined
            ? data.req_id
            : obj.req_id;
        data.req_location =
          obj.req_location == null || obj.req_location == undefined
            ? data.req_location
            : obj.req_location;
        data.res_id =
          obj.res_id == null || obj.res_id == undefined
            ? data.res_id
            : obj.res_id;
        data.res_location =
          obj.res_location == null || obj.res_location == undefined
            ? data.res_location
            : obj.res_location;
        data.status =
          obj.status == null || obj.status == undefined
            ? data.status
            : obj.status;
        data.description =
          obj.description == null || obj.description == undefined
            ? data.description
            : obj.description;
        data.type =
          obj.type == null || obj.type == undefined ? data.type : obj.type;
        data.insert_status =
          obj.insert_status == null || obj.qty == undefined
            ? data.insert_status
            : obj.insert_status;
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

let find = (id, status) => {
  return new Promise((resolve, reject) => {
    Transfer.find({ req_id: id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.find({ status: status }, (error, datas) => {
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

let findCode = (code, status) => {
  return new Promise((resolve, reject) => {
    Transfer.find({ code: code }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.find({ status: status }, (error, datas) => {
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

let destory = (id) => {
  return new Promise((resolve, reject) => {
    Transfer.deleteOne({ Transfer_id: id }, (err, daa) => {
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
  findCode,
};
