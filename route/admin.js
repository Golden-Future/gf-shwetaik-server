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
    let Tab = require('../database/tabs');
    let Role = require('../database/role');
    let Language = require('../database/language');
    let LanguageText = require('../database/languageText');
    let SystemOption = require('../database/systemOption');
    let Table = require('../database/table');
    let Data = require('../database/data');

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

    // ****** Tab ******* //

    router.get('/superuser/all/tab', (req, res) => {
        Tab.all()
            .then((result) => res.json({ con: true, data: result, msg: `Successfull` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/save/tab', (req, res) => {
        let obj = {
            tabName: req.body.tabName,
            user_id: req.body.user_id,
            tabIcon: req.body.tabIcon,
            tabIconColor: req.body.tabIconColor,
        };
        Tab.save(obj)
            .then((result) => res.json({ con: true, data: result, msg: `Save Successfull` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/update/tab', (req, res) => {
        let obj = {
            tabName: req.body.tabName,
            user_id: req.body.user_id,
            tabIcon: req.body.tabIcon,
            tabIconColor: req.body.tabIconColor,
            tabs_id: req.body.tabs_id
        };

        Tab.update(obj)
            .then((result) => res.json({ con: true, data: result, msg: `Update Successfull` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/delete/tab', (req, res) => {
        let id = req.body.tabs_id;
        Tab.destory(id)
            .then((result) => res.json({ con: true, data: result, msg: `Delete Successfull` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    // ****** Tab ******* //

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

    // ****** Language Text ******* //

    router.get('/superuser/all/languageText', (req, res) => {
        LanguageText.all()
        .then((result) => res.json({ con: true, data: result, msg: `Success` }))
        .catch((error) => res.json({ con: false, data: error, msg: `Error` }));        
    })

    router.post('/superuser/save/languageText', (req, res) => {
        let obj = {
            text: req.body.text,
            language_id: req.body.language_id
        };
        LanguageText.save(obj)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/update/languageText', (req, res) => {
        let obj = {
            text: req.body.text,
            language_id: req.body.language_id,
            languageText_id: req.body.languageText_id
        };
        LanguageText.update(obj)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/delete/languageText', (req, res) => {
        let id = req.body.languageText_id;
        LanguageText.destory(id)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    })

    // ****** Language Text ******* //

    // ****** SystemOption ******* //

    router.get('/superuser/all/systemOption', (req, res) => {
        SystemOption.all()
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/save/systemOption', (req, res) => {
        let obj = {
            user_id: req.body.user_id,
            roleAccess: req.body.roleAccess,
            languageAccess: req.body.languageAccess,
            systemAccess: req.body.systemAccess,
            dataAccess: req.body.dataAccess,
        };

        SystemOption.save(obj)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/update/systemOption', (req, res) => {
        let obj = {
            user_id: req.body.user_id,
            roleAccess: req.body.roleAccess,
            languageAccess: req.body.languageAccess,
            systemAccess: req.body.systemAccess,
            dataAccess: req.body.dataAccess,
            systemOption_id: req.body.systemOption_id
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

    // ****** Data ******* //

    router.get('/superuser/all/data', (req, res) => {
        Data.all()
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/save/data', (req, res) => {
        let obj = {
            option: req.body.option,
            table_id: req.body.table_id
        };
        console.log(obj)
        Data.save(obj)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/update/data', (req, res) => {
        let obj = {
            option: req.body.option,
            data_id: req.body.data_id,
            table_id: req.body.table_id
        };
        Data.update(obj)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    router.post('/superuser/delete/data', (req, res) => {
        let id = req.body.data_id;
        Data.destory(id)
            .then((result) => res.json({ con: true, data: result, msg: `Success` }))
            .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
    });

    // ****** Data ******* //

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