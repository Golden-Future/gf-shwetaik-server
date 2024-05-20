let db = require('./db');
let LanguageText = db.LanguageText;


let all = () => {
    return new Promise((resolve, reject) => {
        LanguageText.find({}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let save = (obj) => {
    return new Promise((resolve, reject) => {
        obj['since'] = new Date();
        let languageText = new LanguageText(obj);
        languageText.save((err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let update = (obj) => {
    return new Promise((resolve, reject) => {
        LanguageText.findOne({ languageText_id: obj.languageText_id }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                let object = {
                    text: obj.text == null || obj.text == undefined ? data.text : obj.text,
                    langugae_id: obj.langugae_id == null || obj.langugae_id == undefined ? data.langugae_id : obj.langugae_id,
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
        LanguageText.findOne({ languageText_id: id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let destory = (id) => {
    return new Promise((resolve, reject) => {
        LanguageText.deleteOne({ languageText_id: id }, (err, data) => {
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