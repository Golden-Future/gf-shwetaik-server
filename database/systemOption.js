let db = require('./db');
let SystemOption = db.SystemOption;


let all = () => {
    return new Promise((resolve, reject) => {
        SystemOption.find({}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let save = (obj) => {
    return new Promise((resolve, reject) => {
        obj['since'] = new Date();
        let systemOption = new SystemOption(obj);
        systemOption.save((err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let update = (obj) => {
    return new Promise((resolve, reject) => {
        SystemOption.findOne({ systemOption_id: obj.systemOption_id }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                data.user_id = obj.user_id == '' || obj.user_id == null || obj.user_id == undefined ? data.user_id : obj.user_id;
                data.roleAccess = obj.roleAccess == '' || obj.roleAccess == null || obj.roleAccess == undefined ? data.roleAccess : obj.roleAccess;
                    data.languageAccess = obj.languageAccess == '' || obj.languageAccess == null || obj.languageAccess == undefined ? data.languageAccess : obj.languageAccess;
                    data.systemAccess = obj.systemAccess == '' || obj.systemAccess == null || obj.systemAccess == undefined ? data.systemAccess : obj.systemAccess;
                    data.dataAccess = obj.dataAccess == '' || obj.dataAccess == null || obj.dataAccess == undefined ? data.dataAccess : obj.dataAccess;
                data.since=  new Date()
                data.save((error, datas) => {
                    if (error) reject(error);
                    resolve(datas);
                })
            }
        })
    })
};

let find = (id) => {
    return new Promise((resolve, reject) => {
        SystemOption.findOne({ systemOption_id: id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let destory = (id) => {
    return new Promise((resolve, reject) => {
        SystemOption.deleteOne({ systemOption_id: id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
}
module.exports = {
    all,
    save,
    update,
    find,
    destory
}