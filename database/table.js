let db = require('./db');
let Table = db.Tables;


let all = () => {
    return new Promise((resolve, reject) => {
        Table.find({}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let save = (obj) => {
    return new Promise((resolve, reject) => {
        obj['since'] = new Date();
        let table = new Table(obj);
        table.save((err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let update = (obj) => {
    return new Promise((resolve, reject) => {
        Table.findOne({ table_id: obj.table_id }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                let object = {
                    tableName: obj.tableName == null || obj.tableName == undefined ? data.tableName : obj.tableName,
                    code: obj.code == null || obj.code == undefined ? data.code : obj.code,
                    since: new Date()
                };
                object.save((error, datas) => {
                    if (error) reject(error);
                    resolve(datas);
                })
            }
        })
    })
};

let find = (id) => {
    return new Promise((resolve, reject) => {
        Table.findOne({ table_id: id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let destory = (id) => {
    return new Promise((resolve, reject) => {
        Table.deleteOne({ table_id: id }, (err, data) => {
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