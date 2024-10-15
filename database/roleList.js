let db = require("./db");
let RoleList = db.RoleList;

let all = () => {
  return new Promise((resolve, reject) => {
    RoleList.aggregate([
      {
        $lookup: {
          from: "roles", // Look up the roles collection
          localField: "role_id", // Match based on role_id
          foreignField: "role_id",
          as: "role", // Output the results as "role"
        },
      },
      {
        $unwind: "$role", // Unwind the role array to a single document
      },
      {
        $lookup: {
          from: "users", // Look up the users collection
          localField: "user_id", // Match based on user_id
          foreignField: "user_id",
          as: "user", // Output the results as "user"
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
        // Unwind user array, but allow null if no user matches
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
    let roleList = new RoleList(obj);
    roleList.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    RoleList.findOne({ roleList_id: obj.roleList_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.user_id =
          obj.user_id == null || obj.user_id == undefined
            ? data.user_id
            : obj.user_id;
        data.role_id =
          obj.role_id == null || obj.role_id == undefined
            ? data.role_id
            : obj.role_id;
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
    RoleList.aggregate([
      {
        $match: { roleList_id: id }, // Match based on roleList_id
      },
      {
        $lookup: {
          from: "roles", // Look up the roles collection
          localField: "role_id", // Match based on role_id
          foreignField: "role_id",
          as: "role", // Output the results as "role"
        },
      },
      {
        $unwind: "$role", // Unwind the role array to a single document
      },
      {
        $lookup: {
          from: "users", // Look up the users collection
          localField: "user_id", // Match based on user_id
          foreignField: "user_id",
          as: "user", // Output the results as "user"
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
    ]).exec((err, data) => {
      if (err) reject(err);
      resolve(data[0]); // resolve the first (and only) result from aggregation
    });
  });
};

let findByUserid = (id) => {
  return new Promise((resolve, reject) => {
    RoleList.aggregate([
      {
        $match: { user_id: id }, // Match based on user_id
      },
      {
        $lookup: {
          from: "roles", // Look up the roles collection
          localField: "role_id", // Match based on role_id
          foreignField: "role_id",
          as: "role", // Output the results as "role"
        },
      },
      {
        $unwind: "$role", // Unwind the role array to a single document
      },
      {
        $lookup: {
          from: "users", // Look up the users collection
          localField: "user_id", // Match based on user_id
          foreignField: "user_id",
          as: "user", // Output the results as "user"
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
        // Unwind user array, but allow null if no user matches
      },
    ]).exec((err, data) => {
      if (err) reject(err);
      resolve(data); // Resolve the full array of results, not just the first one
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    RoleList.deleteOne({ roleList_id: id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  all,
  save,
  update,
  find,
  destory,
  findByUserid,
};
