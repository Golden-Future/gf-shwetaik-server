let multer = require("multer");
let fs = require("fs");
let unique_username = require("unique-username-generator");
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
  let Role = require("../database/role");
  let Language = require("../database/language");
  let SystemOption = require("../database/systemOption");
  let Table = require("../database/table");
  let Color = require("../database/color");
  let CC = require("../database/choosingColumn");
  let Ann = require('../database/announcement');
  let List = require('../database/tableList');

  // ****** USER ******* //

  router.get("/superuser/all/user", (req, res) => {
    User.all()
      .then((result) =>
        res.json({
          con: true,
          data: result,
          msg: "Data Get Success",
          status: 200,
          length: result.length,
        })
      )
      .catch((error) =>
        res.json({ con: false, data: error, msg: `Error`, status: 304 })
      );
  });

  router.post("/superuser/login/user", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findEmail(email)
      .then((result) => {
        bcrypt
          .compare(password, result.password)
          .then((data) => {
            if (data) {
              let payload = { email: result.email, name: result.name };
              let token = jwt.sign(payload, process.env.SECRET);
              res.json({
                con: true,
                token: token,
                data: result,
                msg: `Login Successful!`,
              });
            } else {
              res.json({ con: false, msg: "Password Wrong" });
            }
          })
          .catch((error) =>
            res.json({ con: false, data: error, msg: `Error` })
          );
      })
      .catch((erro) => res.json({ con: false, data: erro, msg: `Error` }));
  });

  router.post("/superuser/register/user", (req, res) => {
    const { phone, email, password, role_id: role, name, lang } = req.body;
    const userName = unique_username.generateUsername("", 3, 20);    
    bcrypt
      .encrypt(password)
      .then((result) => {
        let obj = {
          phone: phone,
          email: email,
          password: result,
          role_id: role,
          name: name,
          userName: userName,
          lang: lang
        };
        User.save(obj)
          .then((data) => res.json({ con: true, data: data, msg: `Save` }))
          .catch((error) =>
            res.json({ con: false, data: error, msg: "User Save Erorr" })
          );
      })
      .catch((eee) =>
        res.json({ con: false, data: eee, msg: `Encrypt Error` })
      );
  });

  router.post("/superuser/update/user", (req, res) => {
    let obj = {
      phone: req.body.phone,
      email: req.body.email,
      role_id: req.body.role_id,
      name: req.body.name,
      userName: req.body.userName,
      user_id: req.body.user_id,
      lang: req.body.lang,
      password: req.body.password,
    };
    User.update(obj)
      .then((ree) =>
        res.json({ con: true, data: ree, msg: `Update Successfully!` })
      )
      .catch((error) => {
        if (error.code == 1100) {
          res.json({ con: false, data: error, msg: `Unique key error in  User data` })
        } else {
          res.json({ con: false, data: error, msg: `Error Update in User data` })
        }
      }
      );
  });

  router.post("/superuser/delete/user", (req, res) => {
    let id = req.body.user_id;
    User.destory(id)
      .then((result) => res.json({ con: true, data: result, msg: "Success" }))
      .catch((err) =>
        res.json({ con: false, data: err, msg: `Error in Delete` })
      );
  });

  // ****** USER ******* //

  // ****** ROLE ******* //

  router.get("/superuser/all/role", (req, res) => {
    Role.all()
      .then((result) =>
        res.json({
          con: true,
          data: result,
          msg: `Success`,
          length: result.length,
        })
      )
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/save/role", (req, res) => {
    let obj = {
      roleName: req.body.roleName,
    };
    Role.save(obj)
      .then((result) =>
        res.json({ con: true, data: result, msg: `Save Successfull` })
      )
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/update/role", (req, res) => {
    let obj = {
      roleName: req.body.roleName,
      role_id: req.body.role_id,
    };
    Role.update(obj)
      .then((result) =>
        res.json({ con: true, data: result, msg: `Update Successfull` })
      )
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/delete/role", (req, res) => {
    let id = req.body.role_id;
    Role.destory(id)
      .then((result) =>
        res.json({ con: true, data: result, msg: `Delete Successfull` })
      )
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  // ****** ROLE ******* //

  // ****** Language ******* //

  router.get("/superuser/all/language", (req, res) => {
    Language.all()
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/save/language", (req, res) => {
    let obj = {
      mm: req.body.mm,
      en: req.body.en,
    };
    Language.save(obj)
      .then((result) =>
        res.json({ con: true, data: result, msg: `Save Successfully` })
      )
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/update/language", (req, res) => {
    let obj = {
      mm: req.body.mm,
      en: req.body.en,
      language_id: req.body.language_id,
    };
    Language.update(obj)
      .then((result) =>
        res.json({ con: true, data: result, msg: `Update Successfully` })
      )
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/delete/language", (req, res) => {
    let id = req.body.language_id;
    Language.destory(id)
      .then((result) =>
        res.json({ con: true, data: result, msg: `Delete Successfully` })
      )
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  // ****** Language ******* //

  // ****** SystemOption ******* //

  router.get("/superuser/all/systemOption", (req, res) => {
    SystemOption.all()
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/save/systemOption", (req, res) => {
    let obj = {
      userManage: req.body.userManage,
      roleManage: req.body.roleManage,
      languageManage: req.body.languageManage,
      role_id: req.body.role_id,
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

  router.post("/superuser/update/systemOption", (req, res) => {
    let obj = {
      userManage: req.body.userManage,
      roleManage: req.body.roleManage,
      languageManage: req.body.languageManage,
      tableManage: req.body.tableManage,
      colorManage: req.body.colorManage,
      filterManage: req.body.filterManage,
      role_id: req.body.role_id,
      tableSync: req.body.tableSync,
      tableFetch: req.body.tableFetch,
      tableInsert: req.body.tableInsert,
      systemOption_id: req.body.systemOption_id,
    };
    SystemOption.update(obj)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/delete/systemOption", (req, res) => {
    let id = req.body.systemOption_id;
    SystemOption.destory(id)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.get("/superuser/search/systemOption/:roleId", (req, res) => {
    let uid = req.param('roleId');
    console.log(uid);
    SystemOption.findByUid(Number(uid))
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  // ****** SystemOption ******* //

  // ****** Table ******* //

  router.get("/superuser/all/table", (req, res) => {
    Table.all()
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/save/table", (req, res) => {
    let table = {
      tableName: req.body.tableName,
      description: req.body.description,
      color_id: req.body.color_id
    };
    Table.save(table)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/update/table", (req, res) => {
    let obj = {
      tableName: req.body.tableName,
      description: req.body.description,
      color_id: req.body.color_id,
      table_id: req.body.table_id,
    };
    Table.update(obj)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/delete/table", (req, res) => {
    let id = req.body.table_id;
    Table.destory(id)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  // ****** Table ******* //

  // ****** Color ******* //

  router.get("/superuser/all/color", (req, res) => {
    Color.all()
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/save/color", (req, res) => {
    let color = {
      colorCode: req.body.colorCode,
    };
    Color.save(color)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/update/color", (req, res) => {
    let color = {
      colorCode: req.body.colorCode,
      color_id: req.body.color_id,
    };
    Color.update(color)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/delete/color", (req, res) => {
    let id = req.body.color_id;
    Color.destory(id)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  // ****** Color ******* //


  // ****** Announcement ******* //

  router.get("/superuser/all/ann", (req, res) => {
    Ann.all()
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/save/ann", (req, res) => {
    let color = {
      title: req.body.title,
      description: req.body.description,
      role: req.body.role,
    };
    Ann.save(color)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/update/ann", (req, res) => {
    let color = {
      title: req.body.title,
      description: req.body.description,
      role: req.body.role,
      announcement_id: req.body.announcement_id,
    };
    Ann.update(color)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/delete/ann", (req, res) => {
    let id = req.body.announcement_id;
    Ann.destory(id)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/find/ann", (req, res) => {
    let id = req.body.announcement_id;
    Ann.find(id)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  // ****** Color ******* //


  router.get("/superuser/all/list", (req, res) => {
    List.all()
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/save/list", (req, res) => {
    let color = {
      list: req.body.list,
      role_id: req.body.role_id,
    };
    List.save(color)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/update/list", (req, res) => {
    let color = {
      list: req.body.list,
      role_id: req.body.role_id,
      tableList_id: req.body.tableList_id
    };
    List.update(color)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/delete/list", (req, res) => {
    let id = req.body.tableList_id;
    List.destory(id)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/find/list", (req, res) => {
    let id = req.body.tableList_id;
    List.find(id)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/find/listbyRole", (req, res) => {
    let id = req.body.role_id;
    List.findByRole(id)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  // ****** CC ******* //

  router.get("/superuser/all/CC", (req, res) => {
    CC.all()
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/save/CC", (req, res) => {
    let color = {
      role_id: req.body.role_id,
      table_id: req.body.table_id,
      name: req.body.name,
    };
    CC.save(color)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/update/CC", (req, res) => {
    let color = {
      role_id: req.body.role_id,
      table_id: req.body.table_id,
      name: req.body.name,
      choosingColumn_id: req.body.choosingColumn_id,
    };
    CC.update(color)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/delete/CC", (req, res) => {
    let id = req.body.choosingColumn_id;
    CC.remove(id)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/findCC", (req, res) => {
      let table_id = req.body.table_id;
      let role_id = req.body.role_id;
      CC.findByTable(table_id,role_id)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/save/CC", (req, res) => {
    let obj = {
      name: req.body.name,
      checked: req.body.checked,
      tableName: req.body.tableName,
      user_id: req.body.user_id,
    };
    CC.save(obj)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  router.post("/superuser/update/CC", (req, res) => {
    let obj = {
      name: req.body.name,
      checked: req.body.checked,
      tableName: req.body.tableName,
      user_id: req.body.user_id,
    };
    CC.update(obj)
      .then((result) => res.json({ con: true, data: result, msg: `Success` }))
      .catch((error) => res.json({ con: false, data: error, msg: `Error` }));
  });

  // ****** CC ******* //

  router.post("/all", (req, res) => {
    let data = req.body.data;
    let json = JSON.parse(data);
    let fileName = `${req.body.name}.json`;
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
  router.post("/alldata", (req, res) => {
    let tname = req.body.tName;
    fs.readFile(`${tname}.json`, "utf8", (err, data) => {
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
    let tname = req.body.tName;
    console.log(datas);
    fs.writeFile(
      `${tname}.json`,
      JSON.stringify(datas, null, 2),
      "utf8",
      (err) => {
        if (err) {
          res.send("Error writing file:", err);
          return;
        }
        res.send("Data added successfully!");
      }
    );
  });

  return router;
};
