let db = require("./db");
let Way = db.Way;

let all = () => {
  return new Promise((resolve, reject) => {
    Way.find({}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let way = new Way(obj);
    way.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Way.findOne({ Way_id: obj.Way_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.from =
          obj.from == null || obj.from == undefined ? data.from : obj.from;
        data.to = obj.to == null || obj.to == undefined ? data.to : obj.to;
        data.fromDate =
          obj.fromDate == null || obj.fromDate == undefined
            ? data.fromDate
            : obj.fromDate;
        data.toDate =
          obj.toDate == null || obj.toDate == undefined
            ? data.toDate
            : obj.toDate;
        data.title =
          obj.title == null || obj.title == undefined ? data.title : obj.title;
        data.description =
          obj.description == null || obj.description == undefined
            ? data.description
            : obj.description;
        data.Car_id =
          obj.Car_id == null || obj.Car_id == undefined
            ? data.Car_id
            : obj.Car_id;
        data.Driver_id =
          obj.Driver_id == null || obj.Driver_id == undefined
            ? data.Driver_id
            : obj.Driver_id;
        data.Reporter_id =
          obj.Reporter_id == null || obj.Reporter_id == undefined
            ? data.Reporter_id
            : obj.Reporter_id;
        data.time.duration =
          obj.time.duration == null || obj.time.duration == undefined
            ? data.time.duration
            : obj.time.duration;
        data.time.UCT_code =
          obj.time.UCT_code == null || obj.time.UCT_code == undefined
            ? data.time.UCT_code
            : obj.time.UCT_code;
        data.type =
          obj.type == null || obj.type == undefined ? data.type : obj.type;
        data.price =
          obj.price == null || obj.price == undefined ? data.price : obj.price;
        data.total =
          obj.total == null || obj.total == undefined ? data.total : obj.total;
        data.Status_id =
          obj.Status_id == null || obj.Status_id == undefined
            ? data.Status_id
            : obj.Status_id;
        data.since = new Date();
        data.save((error, datas) => {
          if (error) reject(error);
          resolve(datas);
        });
      }
    });
  });
};

let find = (id) => {
  return new Promise((resolve, reject) => {
    Way.findOne({ Way_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    Way.deleteOne({ Way_id: id }, (err, data) => {
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
};
