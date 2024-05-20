let db = require('./db');
let Data = db.Data;


let all = () => {
    return new Promise((resolve, reject) => {
        Data.find({}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let save = (obj) => {
    return new Promise((resolve, reject) => {
        obj['since'] = new Date();
        let datas = new Data(obj);
        datas.save((err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let update = (obj) => {
    return new Promise((resolve, reject) => {
        Data.findOne({ data_id: obj.data_id }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                let object = {
                    option: obj.option == null || obj.option == undefined ? data.option : obj.option,
                    table_id: obj.table_id == null || obj.table_id == undefined ? data.table_id : obj.table_id,
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
        Data.findOne({ data_id: id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let destory = (id) => {
    return new Promise((resolve, reject) => {
        Data.deleteOne({ data_id: id }, (err, data) => {
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