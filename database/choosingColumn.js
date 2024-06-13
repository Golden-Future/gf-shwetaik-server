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

// user_id: { type: String },
// since: { type: Date },

let update = (obj) => {
    return new Promise((resolve, reject) => {
        CC.findOne({ choosingColumn_id: obj.choosingColumn_id }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                data.name = obj.name == '' || obj.name == null || obj.name == undefined ? data.name : obj.name;

                data.checked = obj.checked == '' || obj.checked == null || obj.checked == undefined ? data.checked : obj.checked;

                data.tableName = obj.tableName == '' || obj.tableName == null || obj.tableName == undefined ? data.tableName : obj.tableName;

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

let destory = (id) => {
    return new Promise((resolve, reject) => {
        Color.deleteOne({ choosingColumn_id: id }, (err, data) => {
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
    findByTable
}