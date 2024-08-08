let db = require('./db');
let Announcement = db.Announcement;


let all = () => {
    return new Promise((resolve, reject) => {
        Announcement.find({}, (e, d) => {
            if (e) reject(e);
            resolve(d);
        })
    })
};

let save = (obj) => {
    return new Promise((resolve, reject) => {
        obj[since] = new Date();
        let announcement = new Announcement(obj);
        announcement.save((e, d) => {
            if (e) reject(e);
            resolve(d);
        })
    })
};

let update = (obj) => {
    return new Promise((resolve, reject) => {
        Announcement.findOne({ announcement_id: obj.announcement_id }, (e, d) => {
            if (e) {
                reject(e);
            } else {
                d.title = obj.title == null || obj.title == undefined ? d.title : obj.title;
                d.description = obj.description == null || obj.description == undefined ? d.description : obj.description;
                d.role = obj.role == null || obj.role == undefined ? d.role : obj.role;
                d.since = new Date();
                d.save((er, da) => {
                    if (er) reject(er);
                    resolve(da);
                })
            }
        })
    })
};

let destory = (id) => {
    return new Promise((resolve, reject) => {
        Announcement.deleteOne({ announcement_id: id }, (e, d) => {
            if (e) reject(e);
            resolve(d);
        })
    })
};

let find = (id) => {
    return new Promise((resolve, reject) => {
        Announcement.findOne({ announcement_id: id }, (e, d) => {
            if (e) reject(e);
            resolve(d);
        })
    })
}

module.exports = {
    all,
    save,
    update,
    destory,
    find
}