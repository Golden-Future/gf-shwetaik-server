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

                data.roleName = obj.roleName == '' || obj.roleName == null || obj.roleName == undefined ? data.roleName : obj.roleName;

                data.userManage = obj.userManage == null || obj.userManage == undefined ? data.userManage : obj.userManage;

                data.roleManage = obj.roleManage == null || obj.roleManage == undefined ? data.roleManage : obj.roleManage;

                data.languageManage = obj.languageManage == null || obj.languageManage == undefined ? data.languageManage : obj.languageManage;

                data.lang = obj.lang == null || obj.lang == undefined ? data.lang : obj.lang;

                data.user_id = obj.user_id == null || obj.user_id == undefined ? data.user_id : obj.user_id;

                data.tableManage = obj.tableManage == null || obj.tableManage == undefined ? data.tableManage : obj.tableManage;

                data.colorManage = obj.colorManage == null || obj.colorManage == undefined ? data.colorManage : obj.colorManage;

                data.filterManage = obj.filterManage == null || obj.filterManage == undefined ? data.filterManage : obj.filterManage;

                data.tableSync = obj.tableSync == null || obj.tableSync == undefined ? data.tableSync : obj.tableSync;

                data.tableFetch = obj.tableFetch == null || obj.tableFetch == undefined ? data.tableFetch : obj.tableFetch;

                data.tableInsert = obj.tableInsert == null || obj.tableInsert == undefined ? data.tableInsert : obj.tableInsert;

                data.since = new Date()
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

let findByUid = (id) => {
    return new Promise((resolve, reject) => {
        SystemOption.findOne({ user_id: id }, (err, data) => {
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
    destory,
    findByUid
}