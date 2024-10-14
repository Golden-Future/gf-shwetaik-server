let multer = require("multer");
let unique_username = require("unique-username-generator");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "_" + file.originalname);
  },
});

let express = require("express");
const Comment = require("../database/comment");
const {response} = require("../helper/e2e");
const RoleList = require("../database/roleList");
const Permission = require("../database/permission");
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
  let Transfer = require("../database/transfer");
  let CC = require("../database/choosingColumn");
  let Ann = require("../database/announcement");
  let List = require("../database/tableList");
  let { encrypt, response } = require("../helper/e2e");
  let PriceCode = require("../database/priceCode");
  let Product_Code = require("../database/productcode");
  let TeamCode = require("../database/teamcode");
  let Car = require("../database/car");
  let Way = require("../database/way");
  let Status = require("../database/car_status");
  let Log = require("../database/log");
  let Comment = require("../database/comment");
  let RoleList = require("../database/roleList");
  let Permission = require("../database/permission");

  // ****** USER ******* //

  router.get("/superuser/api/v_1/all/user", (req, res) => {
    User.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.get("/superuser/all/user", (req, res) => {
    User.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
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
              // let data = encrypt.encrypt(JSON.stringify(result));
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

  router.post("/superuser/changePass", (req, res) => {
    bcrypt
      .encrypt(req.body.password)
      .then((result) => {
        let obj = {
          user_id: req.body.user_id,
          password: result,
        };
        User.update(obj)
          .then((result) => res.json(response(result, true)))
          .catch((error) => res.json(response(error, false)));
      })
      .catch((eee) =>
        res.json({ con: false, data: eee, msg: `Encrypt Error` })
      );
  });

  router.post("/superuser/register/user", (req, res) => {
    const {
      phone,
      email,
      password,
      role_id: role,
      name,
      lang,
      photo,
      type,
    } = req.body;
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
          photo: photo,
          type: type,
          userName: userName,
          lang: lang,
        };
        User.save(obj)
          .then((data) => {
            // let dataa = encrypt.encrypt(JSON.stringify(data));
            res.json({ con: true, data: data, msg: `Save` });
          })
          .catch((error) =>
            res.json({ con: false, data: error, msg: "User Save Erorr" })
          );
      })
      .catch((eee) =>
        res.json({ con: false, data: eee, msg: `Encrypt Error` })
      );
  });

  router.post("/superuser/update/user", (req, res) => {
    User.update(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => {
        if (error.code == 1100) {
          res.json({
            con: false,
            data: error,
            msg: `Unique key error in  User data`,
          });
        } else {
          res.json({
            con: false,
            data: error,
            msg: `Error Update in User data`,
          });
        }
      });
  });

  router.post("/superuser/delete/user", (req, res) => {
    let id = req.body.user_id;
    User.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // **************** Other System **************

  router.post("/superuser/findType", (req, res) => {
    let type = req.body.type;
    User.findType(type)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/findRole", (req, res) => {
    let type = req.body.type;
    let role_id = req.body.role_id;
    User.findRole(type, role_id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // **************** Other System **************

  // ****** USER ******* //

  // ****** ROLE ******* //

  router.get("/superuser/all/role", (req, res) => {
    Role.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/all/roletype", (req, res) => {
    Role.findType(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/role", (req, res) => {
    let obj = {
      roleName: req.body.roleName,
      type: req.body.type,
    };
    Role.save(obj)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/role", (req, res) => {
    let obj = {
      roleName: req.body.roleName,
      type: req.body.type,
      role_id: req.body.role_id,
    };
    Role.update(obj)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/role", (req, res) => {
    let id = req.body.role_id;
    Role.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // ****** ROLE ******* //

  // ****** Language ******* //

  router.get("/superuser/all/language", (req, res) => {
    Language.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/language", (req, res) => {
    let obj = {
      mm: req.body.mm,
      en: req.body.en,
    };
    Language.save(obj)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/language", (req, res) => {
    let obj = {
      mm: req.body.mm,
      en: req.body.en,
      language_id: req.body.language_id,
    };
    Language.update(obj)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/language", (req, res) => {
    let id = req.body.language_id;
    Language.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // ****** Language ******* //

  // ****** SystemOption ******* //

  router.get("/superuser/all/systemOption", (req, res) => {
    SystemOption.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
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
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
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
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/systemOption", (req, res) => {
    let id = req.body.systemOption_id;
    SystemOption.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.get("/superuser/search/systemOption/:roleId", (req, res) => {
    let uid = req.param("roleId");
    SystemOption.findByUid(Number(uid))
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // ****** SystemOption ******* //

  // ****** Table ******* //

  router.get("/superuser/all/table", (req, res) => {
    Table.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/table", (req, res) => {
    let table = {
      tableName: req.body.tableName,
      description: req.body.description,
      color_id: req.body.color_id,
    };
    Table.save(table)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/table", (req, res) => {
    let obj = {
      tableName: req.body.tableName,
      description: req.body.description,
      color_id: req.body.color_id,
      table_id: req.body.table_id,
    };
    Table.update(obj)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/table", (req, res) => {
    let id = req.body.table_id;
    Table.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/table", (req, res) => {
    let id = req.body.tableName;
    Table.findName(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // ****** Table ******* //

  // ****** Color ******* //

  router.get("/superuser/all/color", (req, res) => {
    Color.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/color", (req, res) => {
    let color = {
      colorCode: req.body.colorCode,
    };
    Color.save(color)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/color", (req, res) => {
    let color = {
      colorCode: req.body.colorCode,
      color_id: req.body.color_id,
    };
    Color.update(color)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/color", (req, res) => {
    let id = req.body.color_id;
    Color.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // ****** Color ******* //

  // ****** Announcement ******* //

  router.get("/superuser/all/ann", (req, res) => {
    Ann.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/ann", (req, res) => {
    let color = {
      title: req.body.title,
      description: req.body.description,
      role: req.body.role,
    };
    Ann.save(color)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/ann", (req, res) => {
    let color = {
      title: req.body.title,
      description: req.body.description,
      role: req.body.role,
      announcement_id: req.body.announcement_id,
    };
    Ann.update(color)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/ann", (req, res) => {
    let id = req.body.announcement_id;
    Ann.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/ann", (req, res) => {
    let id = req.body.announcement_id;
    Ann.find(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // ****** Color ******* //

  router.get("/superuser/all/list", (req, res) => {
    List.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/list", (req, res) => {
    let color = {
      list: req.body.list,
      role_id: req.body.role_id,
    };
    List.save(color)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/list", (req, res) => {
    let color = {
      list: req.body.list,
      role_id: req.body.role_id,
      tableList_id: req.body.tableList_id,
    };
    List.update(color)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/list", (req, res) => {
    let id = req.body.tableList_id;
    List.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/list", (req, res) => {
    let id = req.body.tableList_id;
    List.find(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/listbyRole", (req, res) => {
    let id = req.body.role_id;
    List.findByRole(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // ****** CC ******* //

  router.get("/superuser/all/CC", (req, res) => {
    CC.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/CC", (req, res) => {
    let color = {
      role_id: req.body.role_id,
      tableName: req.body.tableName,
      name: req.body.name,
    };
    CC.save(color)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/CC", (req, res) => {
    let color = {
      role_id: req.body.role_id,
      tableName: req.body.tableName,
      name: req.body.name,
      choosingColumn_id: req.body.choosingColumn_id,
    };
    CC.update(color)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/CC", (req, res) => {
    let id = req.body.choosingColumn_id;
    CC.remove(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/findCC", (req, res) => {
    let tableName = req.body.tableName;
    let role_id = req.body.role_id;
    CC.findByTable(tableName, role_id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/CC", (req, res) => {
    let obj = {
      name: req.body.name,
      checked: req.body.checked,
      tableName: req.body.tableName,
      user_id: req.body.user_id,
    };
    CC.save(obj)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/CC", (req, res) => {
    let obj = {
      name: req.body.name,
      checked: req.body.checked,
      tableName: req.body.tableName,
      user_id: req.body.user_id,
    };
    CC.update(obj)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // ****** CC ******* //

  // ****** Price CODE ******* //

  router.get("/superuser/api/v_1/all/pcode", (req, res) => {
    PriceCode.allU()
      .then((result) => {
        res.json(response(result, true));
      })
      .catch((error) => res.json(response(error, false)));
  });

  router.get("/superuser/all/pcode", (req, res) => {
    PriceCode.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/pcode", (req, res) => {
    let obj = {
      one: req.body.one,
      two: req.body.two,
      three: req.body.three,
      four: req.body.four,
      five: req.body.five,
      six: req.body.six,
      seven: req.body.seven,
      eight: req.body.eight,
      nine: req.body.nine,
      zero: req.body.zero,
      active: req.body.active,
      role_id: req.body.role_id,
    };
    PriceCode.save(obj)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/pcode", (req, res) => {
    let obj = {
      one: req.body.one,
      two: req.body.two,
      three: req.body.three,
      four: req.body.four,
      five: req.body.five,
      six: req.body.six,
      seven: req.body.seven,
      eight: req.body.eight,
      nine: req.body.nine,
      zero: req.body.zero,
      active: req.body.active,
      role_id: req.body.role_id,
      pricecode_id: req.body.pricecode_id,
    };
    PriceCode.update(obj)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/pcode", (req, res) => {
    let id = req.body.pricecode_id;
    PriceCode.find(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/findid/pcode", (req, res) => {
    let id = req.body.role_id;
    PriceCode.findid(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/pcode", (req, res) => {
    let id = req.body.pricecode_id;
    PriceCode.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.get("/superuser/all/productCode", (req, res) => {
    Product_Code.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/productCode", (req, res) => {
    Product_Code.save(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/productCode", (req, res) => {
    Product_Code.update(obj)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/productCode", (req, res) => {
    let id = req.body.role_id;
    Product_Code.find(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/productCode", (req, res) => {
    let id = req.body.Product_Code_id;
    Product_Code.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.get("/superuser/all/teamCode", (req, res) => {
    TeamCode.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/teamCode", (req, res) => {
    TeamCode.save(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/teamCode", (req, res) => {
    TeamCode.update(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/teamCode", (req, res) => {
    let id = req.body.role_id;
    TeamCode.find(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/teamCode", (req, res) => {
    let id = req.body.TeamCode_id;
    TeamCode.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.get("/superuser/all/transfer", (req, res) => {
    Transfer.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/transfer", (req, res) => {
    Transfer.save(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/transfer", (req, res) => {
    Transfer.update(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/transfer", (req, res) => {
    let id = req.body.role_id;
    let status = req.body.status;
    Transfer.find(id, status)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/transfer/code", (req, res) => {
    Transfer.findCode(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/transfer", (req, res) => {
    let id = req.body.Transfer_id;
    Transfer.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // **************** Car **************

  // **************** car scheme **************

  router.get("/superuser/all/car", (req, res) => {
    Car.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/car", (req, res) => {
    Car.save(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/car", (req, res) => {
    Car.update(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/car", (req, res) => {
    let id = req.body.Car_id;
    Car.find(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/car", (req, res) => {
    let id = req.body.Car_id;
    Car.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // ************  car ***************

  // ************  way ***************

  router.get("/superuser/all/way", (req, res) => {
    Way.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/way", (req, res) => {
    Way.save(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/way", (req, res) => {
    Way.update(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/way", (req, res) => {
    let id = req.body.Way_id;
    Way.find(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/way", (req, res) => {
    let id = req.body.Way_id;
    Way.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // ************  way ***************

  // ************  status ***************

  router.get("/superuser/all/status", (req, res) => {
    Status.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/status", (req, res) => {
    Status.save(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/status", (req, res) => {
    Status.update(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/status", (req, res) => {
    let id = req.body.Status_id;
    Status.find(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/status", (req, res) => {
    let id = req.body.Status_id;
    Status.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // ************  status ***************

  // ************  log ***************

  router.get("/superuser/all/log", (req, res) => {
    Log.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/log", (req, res) => {
    Log.save(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/log", (req, res) => {
    Log.update(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/log", (req, res) => {
    let id = req.body.Log_id;
    Log.find(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/log", (req, res) => {
    let id = req.body.Log_id;
    Log.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // ************  log ***************

  // ************  comment ***************

  router.get("/superuser/all/comment", (req, res) => {
    Comment.all()
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/comment", (req, res) => {
    Comment.save(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/comment", (req, res) => {
    Comment.update(req.body)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/comment", (req, res) => {
    let id = req.body.Comment_id;
    Comment.find(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/comment", (req, res) => {
    let id = req.body.Comment_id;
    Comment.destory(id)
      .then((result) => res.json(response(result, true)))
      .catch((error) => res.json(response(error, false)));
  });

  // ************  comment ***************

  // ************* Car ********************


  // ************  ROLELIST ***************

  router.get("/superuser/all/roleList", (req, res) => {
    RoleList.all()
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/roleList", (req, res) => {
    RoleList.save(req.body)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/roleList", (req, res) => {
    RoleList.update(req.body)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/roleList", (req, res) => {
    let id = req.body.user_id;
    RoleList.findByUserid(id)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/roleList", (req, res) => {
    let id = req.body.roleList_id;
    RoleList.destory(id)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
  });

  // ************  ROLELIST ***************

  // ************  PERMISSION ***************

  router.get("/superuser/all/permission", (req, res) => {
    Permission.all()
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/save/permission", (req, res) => {
    Permission.save(req.body)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/update/permission", (req, res) => {
    Permission.update(req.body)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/find/permission", (req, res) => {
    let id = req.body.role_id;
    Permission.findByRoleId(id)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
  });

  router.post("/superuser/delete/permission", (req, res) => {
    let id = req.body.Comment_id;
    Permission.destory(id)
        .then((result) => res.json(response(result, true)))
        .catch((error) => res.json(response(error, false)));
  });

  // ************  PERMISSION ***************

  return router;
};
