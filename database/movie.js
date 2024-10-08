let db = require("./db");
let MV_Movie = db.MV_Movie;

let all = () => {
  return new Promise((resolve, reject) => {
    MV_Movie.find({}, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let save = (obj) => {
  return new Promise((resolve, reject) => {
    obj["since"] = new Date();
    let Iv_Good = new MV_Movie(obj);
    Iv_Good.save((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

let update = (obj) => {
  return new Promise((resolve, reject) => {
    MV_Movie.findOne({ MV_Movie_id: obj.MV_Movie_id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data.photo =
          obj.photo == null || obj.photo == undefined ? data.photo : obj.photo;
        data.coverphoto =
          obj.coverphoto == null || obj.coverphoto == undefined
            ? data.coverphoto
            : obj.coverphoto;
        data.title =
          obj.title == null || obj.title == undefined ? data.title : obj.title;
        data.description =
          obj.description == null || obj.description == undefined
            ? data.description
            : obj.description;
        data.tmdbID =
          obj.tmdbID == null || obj.tmdbID == undefined
            ? data.tmdbID
            : obj.tmdbID;
        data.since = new Date();
        data.save((error, datas) => {
          if (error) reject(error);
          resolve(datas);
        });
      }
    });
  });
};

let findOrDelete = (id, status) => {
  return new Promise((resolve, reject) => {
    if (status === "delete") {
      MV_Movie.deleteOne({ MV_Movie_id: id }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    } else if (status === "find") {
      MV_Movie.findOne({ MV_Movie_id: id }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    }
  });
};

module.exports = {
  all,
  save,
  update,
  findOrDelete,
};
