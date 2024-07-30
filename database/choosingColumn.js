let db = require('./db');
let CC = db.ChoosingColumn;


let all = () => {
    return new Promise((resolve, reject) => {
        CC.find({}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let save = (obj) => {
    return new Promise((resolve, reject) => {
        obj['since'] = new Date();
        let cc = new CC(obj);
        cc.save((err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let update = (obj) => {
    return new Promise((resolve, reject) => {
        CC.findOne({ choosingColumn_id: obj.choosingColumn_id }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                data.name = obj.name === '' || obj.name == null || false ? data.name : obj.name;

                data.checked = obj.checked === '' || obj.checked == null || false ? data.checked : obj.checked;

                data.tableName = obj.tableName === '' || obj.tableName == null || false ? data.tableName : obj.tableName;

                data.user_id = obj.user_id === '' || obj.user_id == null || false ? data.user_id : obj.user_id;

                data.since = new Date()
                
                data.save((error, result) => {
                    if (error) reject(error);
                    resolve(result);
                })
            }
        })
    })
};

let find = (id) => {
    return new Promise((resolve, reject) => {
        CC.findOne({ choosingColumn_id: id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};


let findByTable = (obj) => {
    return new Promise((resolve, reject) => {
        CC.findOne({ tableName: obj.tableName,user_id: obj.id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let remove = (id) => {
    return new Promise((resolve, reject) => {
        CC.deleteOne({ choosingColumn_id: id }, (err, data) => {
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
    remove,
    findByTable
}
