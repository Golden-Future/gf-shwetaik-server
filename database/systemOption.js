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

                data.role_id = obj.role_id == '' || obj.role_id == null || obj.role_id == undefined ? data.role_id : obj.role_id;

                data.roleMannage = obj.roleMannage == '' || obj.roleMannage == null || obj.roleMannage == undefined ? data.roleMannage : obj.roleMannage;

                data.roleMannage = obj.roleMannage == '' || obj.roleMannage == null || obj.roleMannage == undefined ? data.roleMannage : obj.roleMannage;

                data.languageManage = obj.languageManage == '' || obj.languageManage == null || obj.languageManage == undefined ? data.languageManage : obj.languageManage;

                data.tableManage = obj.tableManage == '' || obj.tableManage == null || obj.tableManage == undefined ? data.tableManage : obj.tableManage;

                data.colorManage = obj.colorManage == '' || obj.colorManage == null || obj.colorManage == undefined ? data.colorManage : obj.colorManage;

                data.filterManage = obj.filterManage == '' || obj.filterManage == null || obj.filterManage == undefined ? data.filterManage : obj.filterManage;

                data.tableSync = obj.tableSync == '' || obj.tableSync == null || obj.tableSync == undefined ? data.tableSync : obj.tableSync;

                data.tableFetch = obj.tableFetch == '' || obj.tableFetch == null || obj.tableFetch == undefined ? data.tableFetch : obj.tableFetch;

                data.tableInsert = obj.tableInsert == '' || obj.tableInsert == null || obj.tableInsert == undefined ? data.tableInsert : obj.tableInsert;

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