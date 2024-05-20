let db = require('./db');
let Language = db.Language;


let all = () => {
    return new Promise((resolve, reject) => {
        Language.find({}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let save = (obj) => {
    return new Promise((resolve, reject) => {
        obj['since'] = new Date();
        let language = new Language(obj);
        language.save((err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let update = (obj) => {
    return new Promise((resolve, reject) => {
        Language.findOne({ language_id: obj.language_id }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                data.mm = obj.mm == null || obj.mm == undefined ? data.mm : obj.mm;
                data.en = obj.en == null || obj.en == undefined ? data.en : obj.en;
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
        Language.findOne({ language_id: id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let destory = (id) => {
    return new Promise((resolve, reject) => {
        Language.deleteOne({ language_id: id }, (err, data) => {
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