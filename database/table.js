let db = require('./db');
let Table = db.Tables;


let all = () => {
    return new Promise((resolve, reject) => {
        Table.aggregate([
            {
                $lookup: {
                    from: "colors",
                    localField: "color_id",
                    foreignField: "color_id",
                    as:"color"
                }
            },
            {
                $unwind: "$color"
            }
        ]).exec((e, d) => {
            if (e) reject(e);
            resolve(d);
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
                data.tableName= obj.tableName == null || obj.tableName == undefined ? data.tableName : obj.tableName;
                data.description= obj.description == null || obj.description == undefined ? data.description : obj.description;
                data.color_id= obj.color_id == null || obj.color_id == undefined ? data.color_id : obj.color_id;
                data.since= new Date();
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
        Table.findOne({ table_id: id }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
};

let findName = (id) => {
    return new Promise((resolve, reject) => {
        Table.findOne({ tableName: id }, (err, data) => {
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
    destory,
    findName
}