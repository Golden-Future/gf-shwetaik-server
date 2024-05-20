let db = require('./db');
let Tabs = db.Tabs;


let all = () => {
    return new Promise((resolve, reject) => {
        Tabs.find({}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let save = (obj) => {
    return new Promise((resolve, reject) => {
        obj['since'] = new Date();
        let tabs = new Tabs(obj);
        tabs.save((err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let update = (obj) => {
    return new Promise((resolve, reject) => {
        Tabs.findOne({ tabs_id: obj.tabs_id }, (err, data) => {
            if (err) {
                reject(err)
            } else {
                let object = {
                    tabName: obj.tabName == null || obj.tabName == undefined ? data.tabName : obj.tabName,
                    user_id: obj.user_id == null || obj.user_id == undefined ? data.user_id : obj.user_id,
                    tabIcon: obj.tabIcon == null || obj.tabIcon == undefined ? data.tabIcon : obj.tabIcon,
                    tabIconColor: obj.tabIconColor == null || obj.tabIconColor == undefined ? data.tabIconColor : obj.tabIconColor,
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
        Tabs.findOne({ tabs_id: id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let destory = (id) => {
    return new Promise((resolve, reject) => {
        Tabs.deleteOne({ tabs_id: id }, (err, data) => {
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