let multer = require("multer");
let fs = require("fs");
let unique_username = require('unique-username-generator');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });
let express = require("express");
module.exports = () => {
    let router = express.Router();
    let jwt = require("jsonwebtoken"),
        passport = require("passport"),
        bcrypt = require("../helper/pass");
    // Database file import

    let User = require("../database/user");
    let Role = require('../database/role');
    let Language = require('../database/language');
    let SystemOption = require('../database/systemOption');
    let Table = require('../database/table');
    let Color = require('../database/color');
    let Filter = require('../database/filter');

    // ****** USER ******* //

    router.get('/superuser/all/user', (req, res) => {
        User.all()
            .then((result) => res.json({ con: true, data: result, msg: 'Data Get Success', status: 200, length: result.length }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error`, status: 304 }));
    });

    router.post('/superuser/login/user', (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        User.findEmail(email)
            .then((result) => {
                bcrypt.compare(password, result.password)
                    .then((data) => {
                        if (data) {
                            let payload = { email: result.email, name: result.name };
                            let token = jwt.sign(payload, process.env.SECRET);
                            res.json({ con: true, token: token, data: result, msg: `Login Successful!` });
                        } else {
                            res.json({ con: false, msg: "Password Wrong" });
                        }
                    })
                    .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
            })
            .catch((erro) => res.jsonn({ con: false, data: erro, msg: `Error` }));
    })
    
    router.post('/superuser/register/user', (req, res) => {
        let phone = req.body.phone;
        let email = req.body.email;
        let password = req.body.password;
        let role = req.body.role;
        let name = req.body.name;
        let userName = unique_username.generateUsername('',3,20);

        bcrypt.encrypt(password)
            .then((result) => {
                let obj = {
                    phone: phone,
                    email: email,
                    password: result,
                    role: role,
                    name: name,
                    userName : userName
                };
                User.save(obj)
                    .then((data) => res.json({ con: true, data: data, msg: `Save` }))
                    .catch((error) => res.json({ con: false, data: error, msg: 'User Save Erorr' }));
            })
            .catch((eee) => res.json({ con: false, data: eee, msg: `Encrypt Error` }));
    });

    router.post('/superuser/update/user', (req, res) => {
                let obj = {
                    phone: req.body.phone,
                    email: req.body.email,
                    role: req.body.role,
                    name: req.body.name,
                    userName: req.body.userName,
                    user_id: req.body.user_id,
                    password: null
                };
                User.update(obj)
                    .then((ree) => res.json({ con: true, data: ree, msg: `Update Successfully!` }))
                    .catch((error) => res.json({ con: false, data: error, msg: `Error Update in User data` }));
        
    });

    router.post('/superuser/delete/user', (req, res) => {
        let id = req.body.user_id;
        User.destory(id)
            .then((result) => res.json({ con: true, data: result, msg: 'Success' }))
            .catch((err) => res.json({ con: false, data: err, msg: `Error in Delete` }));
    });

    // ****** USER ******* //

    // ****** ROLE ******* //

    router.get('/superuser/all/role', (req, res) => {
        Role.all()
            .then((result) => res.json({ con: true, data: result, msg: `Success`,length: result.length }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/save/role', (req, res) => {
        let obj = {
            roleName: req.body.roleName,
        };
        Role.save(obj)
            .then((result) => res.json({ con: true, data: result, msg: `Save Successfull` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/update/role', (req, res) => {
        let obj = {
            roleName: req.body.roleName,
            role_id:req.body.role_id
        };
        Role.update(obj)
        .then((result) => res.json({ con: true, data: result, msg: `Update Successfull` }))
        .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/delete/role', (req, res) => {
        let id = req.body.role_id;
        Role.destory(id)
            .then((result) => res.json({ con: true, data: result, msg: `Delete Successfull` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    // ****** ROLE ******* //

    // ****** Language ******* //

    router.get('/superuser/all/language', (req, res) => {
        Language.all()
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/save/language', (req, res) => {
        let obj = {
            mm: req.body.mm,
            en: req.body.en
        }
        Language.save(obj)
            .then((result) => res.json({ con: true, data: result, msg: `Save Successfully` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/update/language', (req, res) => {
        let obj = {
            mm: req.body.mm,
            en: req.body.en,
            language_id: req.body.language_id
        };
        Language.update(obj)
            .then((result) => res.json({ con: true, data: result, msg: `Update Successfully` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/delete/language', (req, res) => {
        let id = req.body.language_id;
        Language.destory(id)
            .then((result) => res.json({ con: true, data: result, msg: `Delete Successfully` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    // ****** Language ******* //

    // ****** SystemOption ******* //

    router.get('/superuser/all/systemOption', (req, res) => {
        SystemOption.all()
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/save/systemOption', (req, res) => {
        let obj = {
            user_id: req.body.user_id,
            roleName: req.body.roleName,
            userManage: req.body.userManage,
            roleMannage: req.body.roleMannage,
            languageManage: req.body.languageManage,
            tableManage: req.body.tableManage,
            colorManage: req.body.colorManage,
            filterManage: req.body.filterManage,
            tableSync: req.body.tableSync,
            tableFetch: req.body.tableFetch,
            tableInsert: req.body.tableInsert,
        };

        SystemOption.save(obj)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/update/systemOption', (req, res) => {
        let obj = {
            user_id: req.body.user_id,
            roleName: req.body.roleName,
            userManage: req.body.userManage,
            roleMannage: req.body.roleMannage,
            languageManage: req.body.languageManage,
            tableManage: req.body.tableManage,
            colorManage: req.body.colorManage,
            filterManage: req.body.filterManage,
            tableSync: req.body.tableSync,
            tableFetch: req.body.tableFetch,
            tableInsert: req.body.tableInsert,
        };

        SystemOption.update(obj)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/delete/systemOption', (req, res) => {
        let id = req.body.systemOption_id;
        SystemOption.destory(id)
        .then((result) => res.json({ con: true, data: result, msg: `Success` }))
        .catch((error) => res.json({ con: false, data: error, msg: `Error` }));        
    })

    // ****** SystemOption ******* //

    // ****** Table ******* //

    router.get('/superuser/all/table', (req, res) => {
        Table.all()
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/save/table', (req, res) => {
        let table = {
            tableName: req.body.tableName
        };
        Table.save(table)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post("/superuser/update/table", (req, res) => {
        let obj = {
            tableName: req.body.tableName,
            table_id: req.body.table_id
        };
        Table.update(obj)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/delete/table', (req, res) => {
        let id = req.body.table_id;
        Table.destory(id)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    // ****** Table ******* //

    // ****** Filter ******* //

    router.get('/superuser/all/filter', (req, res) => {
        Filter.all()
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/save/filter', (req, res) => {
        let filter = {
            key: req.body.key,
            value: req.body.value,
            table_id: req.body.table_id,
            role_id: req.body.role_id,
            user_id: req.body.user_id,
        };
        Filter.save(filter)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post("/superuser/update/filter", (req, res) => {
        let filter = {
            key: req.body.key,
            value: req.body.value,
            table_id: req.body.table_id,
            role_id: req.body.role_id,
            user_id: req.body.user_id,
            filter_id: req.body.filter_id
        };
        Filter.update(filter)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/delete/filter', (req, res) => {
        let id = req.body.filter_id;
        Filter.destory(id)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    // ****** Filter ******* //

    // ****** Color ******* //


    router.get('/superuser/all/color', (req, res) => {
        Color.all()
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/save/color', (req, res) => {
        let color = {
            primary: req.body.primary,
            secondary: req.body.secondary,
            third: req.body.third,
        };
        Color.save(color)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post("/superuser/update/color", (req, res) => {
        let color = {
            primary: req.body.primary,
            secondary: req.body.secondary,
            third: req.body.third,
            color_id: req.body.color_id
        };
        Color.update(color)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/delete/delete', (req, res) => {
        let id = req.body.color_id;
        Color.destory(id)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    // ****** Color ******* //


    router.post("/all", (req, res) => {
        let data = req.body.data;
        let json = JSON.parse(data);
        let fileName = `${req.body.name}.json`
        fs.writeFile(fileName, JSON.stringify(json, null, 2), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error updating stock data");
            return;
          }
          res.status(200).send("Stock data updated successfully");
        });
    });
    
      // mobile
  router.get("/alldata", (req, res) => {
    fs.readFile("stock.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        res.send(data);
      }
    });
  });

      // desktp & mobile
  router.get("/addalldata", (req, res) => {
    fs.readFile("add.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        res.send(data);
      }
    });
  });

  // mobile
  router.post("/add", (req, res) => {
    let datas = req.body.data;
    // let json = JSON.parse(datas);
    console.log(datas);
    fs.writeFile("add.json", JSON.stringify(datas, null, 2), "utf8", (err) => {
      if (err) {
        res.send("Error writing file:", err);
        return;
      }
      res.send("Data added successfully!");
    });
  });


    return router;


}