let db = require("./db");
let Way = db.Way;

let all = () => {
  return new Promise((resolve, reject) => {
    Way.aggregate([
      {
        $lookup: {
          from: "drivers", // Look up the roles collection
          localField: "driver_id", // Match based on role_id
          foreignField: "driver_id",
          as: "driver", // Output the results as "role"
        },
      },
      {
        $unwind: "$driver", // Unwind the role array to a single document
      },
      {
        $lookup: {
          from: "cars", // Look up the users collection
          localField: "car_id", // Match based on user_id
          foreignField: "car_id",
          as: "car", // Output the results as "user"
        },
      },
      {
        $unwind: "$car",
      },
      {
        $lookup: {
          from: "status", // Look up the users collection
          localField: "status_id", // Match based on user_id
          foreignField: "status_id",
          as: "status", // Output the results as "user"
        },
      },
      {
        $unwind: "$status",
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
    let way = new Way(obj);
    way.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Way.findOne({ way_id: obj.way_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.fromLocation =
          obj.fromLocation == null || obj.fromLocation == undefined
            ? data.fromLocation
            : obj.fromLocation;

        data.toLocation =
          obj.toLocation == null || obj.toLocation == undefined
            ? data.toLocation
            : obj.toLocation;

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

        data.driver_id =
          obj.driver_id == null || obj.driver_id == undefined
            ? data.driver_id
            : obj.driver_id;

        data.car_id =
          obj.car_id == null || obj.car_id == undefined
            ? data.car_id
            : obj.car_id;

        data.duration =
          obj.duration == null || obj.duration == undefined
            ? data.duration
            : obj.duration;

        data.UCT_code =
          obj.UCT_code == null || obj.UCT_code == undefined
            ? data.UCT_code
            : obj.UCT_code;

        data.type =
          obj.type == null || obj.type == undefined ? data.type : obj.type;

        data.price =
          obj.price == null || obj.price == undefined ? data.price : obj.price;

        data.discount =
          obj.discount == null || obj.discount == undefined
            ? data.discount
            : obj.discount;

        data.total =
          obj.total == null || obj.total == undefined ? data.total : obj.total;

        data.car_no =
          obj.car_no == null || obj.car_no == undefined
            ? data.car_no
            : obj.car_no;

        data.status_id =
          obj.status_id == null || obj.status_id == undefined
            ? data.status_id
            : obj.status_id;
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
    Way.findOne({ way_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let findByPeriod = (fromDate, toDate) => {
  return new Promise((resolve, reject) => {
    Way.find(
      {
        $or: [
          { fromDate: { $gte: fromDate, $lte: toDate } },
          { toDate: { $gte: fromDate, $lte: toDate } },
        ],
      },
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      }
    );
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    Way.deleteOne({ way_id: id }, (err, data) => {
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
  findByPeriod,
};
