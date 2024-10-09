let db = require("./db");
let Comment = db.Comments;

let all = () => {
  return new Promise((resolve, reject) => {
    Comment.find({}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let comment = new Comment(obj);
    comment.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    Comment.findOne({ Comment_id: obj.Comment_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.description =
          obj.description == null || obj.description == undefined
            ? data.description
            : obj.description;
        data.user_id =
          obj.user_id == null || obj.user_id == undefined
            ? data.user_id
            : obj.user_id;
        data.Way_id =
          obj.Way_id == null || obj.Way_id == undefined
            ? data.Way_id
            : obj.Way_id;
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
    Comment.findOne({ Comment_id: id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let destory = (id) => {
  return new Promise((resolve, reject) => {
    Comment.deleteOne({ Comment_id: id }, (err, data) => {
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
