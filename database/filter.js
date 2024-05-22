let db = require('./db');
let Filter = db.Filter;


let all = () => {
    return new Promise((resolve, reject) => {
        Filter.find({}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let save = (obj) => {
    return new Promise((resolve, reject) => {
        obj['since'] = new Date();
        let filter = new Filter(obj);
        filter.save((err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let update = (obj) => {
    return new Promise((resolve, reject) => {
        Filter.findOne({ filter_id: obj.filter_id }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                data.key = obj.key == '' || obj.key == null || obj.key == undefined ? data.key : obj.key;

                data.value = obj.value == '' || obj.value == null || obj.value == undefined ? data.value : obj.value;

                data.table_id = obj.table_id == '' || obj.table_id == null || obj.table_id == undefined ? data.table_id : obj.table_id;

                data.role_id = obj.role_id == '' || obj.role_id == null || obj.role_id == undefined ? data.role_id : obj.role_id;

                data.user_id = obj.user_id == '' || obj.user_id == null || obj.user_id == undefined ? data.user_id : obj.user_id;

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
        Filter.findOne({ filter_id: id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let destory = (id) => {
    return new Promise((resolve, reject) => {
        Filter.deleteOne({ filter_id: id }, (err, data) => {
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