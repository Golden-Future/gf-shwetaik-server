let db = require("./db");
let RoleList = db.RoleList;

let all = () => {
    return new Promise((resolve, reject) => {
        RoleList.find({}, (err, data) => {
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
        RoleList.findOne({ roleList_id: id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

let findByUserid = (id) => {
    return new Promise((resolve, reject) => {
        RoleList.find({user_id:id}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
}
let destory = (role_id,user_id) => {
    return new Promise((resolve, reject) => {
        RoleList.find({user_id:user_id}, (err, data) => {
            if (err) {
                reject(err);
            }else{
                resolve(data);
            }
        })
        // RoleList.deleteOne({ roleList_id: id }, (err, data) => {
        //     if (err) reject(err);
        //     resolve(data);
        // });
    });
};

module.exports = {
    all,
    save,
    update,
    find,
    destory,
    findByUserid
};
