let db = require("./db");
let Permission = db.Permission;

let all = () => {
    return new Promise((resolve, reject) => {
        Permission.find({}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

let save = (obj) => {
    return new Promise((resolve, reject) => {
        obj["since"] = new Date();
        let permission = new Permission(obj);
        permission.save((err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

let update = (obj) => {
    return new Promise((resolve, reject) => {
        Permission.findOne({ permission_id: obj.permission_id }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                data.user_id =
                    obj.user_id == null || obj.user_id == undefined ? data.user_id : obj.user_id;
                data.role_id =
                    obj.role_id == null || obj.role_id == undefined ? data.role_id : obj.role_id;
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
        Permission.findOne({ permission_id: id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

let findByRoleId = (id) => {
    return new Promise((resolve, reject) => {
        Permission.find({role_id :id}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
}
let destory = (id) => {
    return new Promise((resolve, reject) => {
        Permission.deleteOne({ permission_id: id }, (err, data) => {
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
    findByRoleId
};
