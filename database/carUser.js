let db = require("./db");
let CarUser = db.carUser;

let all = () => {
    return new Promise((resolve, reject) => {
        CarUser.find({}, (err, d) => {
            if (err) reject(err);
            resolve(d);
        });
    });
};

let save = (obj) => {
    return new Promise((resolve, reject) => {
        obj["since"] = new Date();
        let user = new CarUser(obj);
        user.save((err, savedUser) => {
            if (err) return reject(err);
            resolve(savedUser);
        });
    });
};

let update = (obj) => {
    return new Promise((resolve, reject) => {
        CarUser.findOne({ carUser_id: obj.carUser_id }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                data.email =
                    obj.email == null || obj.email == undefined ? data.email : obj.email;
                data.password =
                    obj.password == null || obj.password == undefined
                        ? data.password
                        : obj.password;
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

let find = (id) => {
    return new Promise((resolve, reject) => {
        CarUser.findOne({ carUser_id: id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    });
};

let findEmail = (email) => {
    return new Promise((resolve, reject) => {
        CarUser.findOne({email: email},(err,data)=>{
            if(err) reject(err);
            resolve(data)
        })
    });
};

let destory = (id) => {
    return new Promise((resolve, reject) => {
        CarUser.deleteOne({ carUser_id: id }, (err, daa) => {
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
    findEmail,
    destory,
};
