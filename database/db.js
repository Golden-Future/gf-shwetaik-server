const mongoose = require("mongoose");
let paginate = require("mongoose-paginate");
let url = "mongodb://127.0.0.1:27017/shweTaikInternational";
mongoose.connect(url, { useNewUrlParser: true })
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log(err));
let autoI = require("simple-mongoose-autoincrement");
let Schema = mongoose.Schema;

let UserScheme = new Schema({
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role_id: { type: Number},
  name: { type: String },
  userName: { type: String },
  lang: { type: String },
  since: { type: Date, required: true },
});

let SystemOptionsScheme = new Schema({
  role_id: { type: Number, required: true, unique: true },
  userManage: { type: Boolean },
  roleManage: { type: Boolean },
  languageManage: { type: Boolean },
  tableManage: { type: Boolean },
  colorManage: { type: Boolean },
  filterManage: { type: Boolean },
  tableSync: { type: Boolean },
  tableFetch: { type: Boolean },
  tableInsert: { type: Boolean },
  since: { type: Date, required: true },
});

let LanguageScheme = new Schema({
  mm: { type: String },
  en: { type: String },
  since: { type: Date, required: true },
});

let RoleScheme = new Schema({
  roleName: { type: String },
  since: { type: Date, required: true },
});

let ColorScheme = new Schema({
  colorCode: { type: String },
  since: { type: Date, required: true },
});

let TableListScheme = new Schema({
  list: { type: String },
  role_id: { type: Number },
  since: { type: Date }
});

let TableScheme = new Schema({
  tableName: { type: String, required: true, unique: true },
  description: { type: String },
  color_id: { type: Number },
  since: { type: Date },
});

let choosingColumnScheme = new Schema({
  role_id: { type: Number },
  table_id: { type: Number },
  name: { type: String },
  since: { type: Date },
});


let announcementScheme = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  role: { type: String },
  since: { type: Date },
});

UserScheme.plugin(autoI, { field: "user_id" });
UserScheme.plugin(paginate);
let User = mongoose.model("Users", UserScheme);

TableListScheme.plugin(autoI, { field: "tableList_id" });
TableListScheme.plugin(paginate);
let tableList = mongoose.model("tableLists", TableListScheme);

SystemOptionsScheme.plugin(autoI, { field: "systemOption_id" });
SystemOptionsScheme.plugin(paginate);
let SystemOption = mongoose.model("SystemOptions", SystemOptionsScheme);

LanguageScheme.plugin(autoI, { field: "language_id" });
LanguageScheme.plugin(paginate);
let Language = mongoose.model("Languages", LanguageScheme);

RoleScheme.plugin(autoI, { field: "role_id" });
RoleScheme.plugin(paginate);
let Role = mongoose.model("Roles", RoleScheme);

ColorScheme.plugin(autoI, { field: "color_id" });
ColorScheme.plugin(paginate);
let Color = mongoose.model("Colors", ColorScheme);

TableScheme.plugin(autoI, { field: "table_id" });
TableScheme.plugin(paginate);
let Tables = mongoose.model("Tables", TableScheme);

choosingColumnScheme.plugin(autoI, { field: "choosingColumn_id" });
choosingColumnScheme.plugin(paginate);
let ChoosingColumn = mongoose.model("ChoosingColumns", choosingColumnScheme);

announcementScheme.plugin(autoI, { field: "announcement_id" });
announcementScheme.plugin(paginate);
let Announcement = mongoose.model("Announcement", announcementScheme);

module.exports = {
  User,
  Role,
  Language,
  SystemOption,
  Tables,
  Announcement,
  ChoosingColumn,
  Color,
  tableList
};
