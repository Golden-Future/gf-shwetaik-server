let db = require('./db');
let Color = db.Color;


let all = () => {
    return new Promise((resolve, reject) => {
        Color.find({}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let save = (obj) => {
    return new Promise((resolve, reject) => {
        obj['since'] = new Date();
        let color = new Color(obj);
        color.save((err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let update = (obj) => {
    return new Promise((resolve, reject) => {
        Color.findOne({ color_id: obj.color_id }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                data.colorCode = obj.colorCode == '' || obj.colorCode == null || obj.colorCode == undefined ? data.colorCode : obj.colorCode;

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
        Color.findOne({ color_id: id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let destory = (id) => {
    return new Promise((resolve, reject) => {
        Color.deleteOne({ color_id: id }, (err, data) => {
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