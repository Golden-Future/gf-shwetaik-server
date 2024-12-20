let db = require("./db");
let Car = db.Car;

let all = () => {
  return new Promise((resolve, reject) => {
    Car.find({}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let car = new Car(obj);
    car.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Car.findOne({ car_id: obj.car_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.car_no =
          obj.car_no == null || obj.car_no == undefined
            ? data.car_no
            : obj.car_no;
        data.type =
          obj.type == null || obj.type == undefined ? data.type : obj.type;
        data.photo =
          obj.photo == null || obj.photo == undefined ? data.photo : obj.photo;
        data.photo1 =
          obj.photo1 == null || obj.photo1 == undefined
            ? data.photo1
            : obj.photo1;
        data.photo2 =
          obj.photo2 == null || obj.photo2 == undefined
            ? data.photo2
            : obj.photo2;
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
    Car.findOne({ car_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    Car.deleteOne({ car_id: id }, (err, data) => {
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
