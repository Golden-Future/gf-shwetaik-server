const mongoose = require("mongoose");
let paginate = require("mongoose-paginate");
let url = "mongodb://127.0.0.1:27017/shweTaikInternational";
const connect = mongoose.connect(url, { useNewUrlParser: true });
let autoI = require("simple-mongoose-autoincrement");
let Schema = mongoose.Schema;

let UserScheme = new Schema({
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role_id: { type: Schema.Types.ObjectId, ref: "Roles", required: true },
  name: { type: String },
  userName: { type: String },
  lang: { type: String },
  since: { type: Date, required: true },
});

let SystemOptionsScheme = new Schema({
  role_id: { type: Schema.Types.ObjectId, ref: "Roles", required: true },
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

let TableScheme = new Schema({
  tableName: { type: String },
  description: { type: String },
  color_id: { type: Schema.Types.ObjectId, ref: "Colors", required: true },
  since: { type: Date },
});

let choosingColumnScheme = new Schema({
  role_id: { type: Schema.Types.ObjectId, ref: "Roles", required: true },
  checked: { type: Boolean },
  table_id: { type: Schema.Types.ObjectId, ref: "Tables", required: true },
  since: { type: Date },
});

let announcementRoleScheme = new Schema({
  role_id: { type: Schema.Types.ObjectId, ref: "Roles", required: true },
  since: { type: Date },
});

let announcementScheme = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  announcementrole_id: {
    type: Schema.Types.ObjectId,
    ref: "AnnouncementRoles",
    required: true,
  },
});

announcementScheme.plugin(autoI, { field: "announcement_id" });
announcementScheme.plugin(paginate);
let Announcement = mongoose.model("Announcement", announcementScheme);

announcementRoleScheme.plugin(autoI, { field: "announcementroles_id" });
announcementRoleScheme.plugin(paginate);
let AnnouncementRole = mongoose.model(
  "AnnouncementRoles",
  announcementRoleScheme
);

RoleScheme.plugin(autoI, { field: "role_id" });
RoleScheme.plugin(paginate);
let Role = mongoose.model("Roles", RoleScheme);

choosingColumnScheme.plugin(autoI, { field: "choosingColumn_id" });
choosingColumnScheme.plugin(paginate);
let ChoosingColumn = mongoose.model("ChoosingColumn", choosingColumnScheme);

UserScheme.plugin(autoI, { field: "user_id" });
UserScheme.plugin(paginate);
let User = mongoose.model("Users", UserScheme);

LanguageScheme.plugin(autoI, { field: "language_id" });
LanguageScheme.plugin(paginate);
let Language = mongoose.model("Languages", LanguageScheme);

SystemOptionsScheme.plugin(autoI, { field: "systemOption_id" });
SystemOptionsScheme.plugin(paginate);
let SystemOption = mongoose.model("SystemOptions", SystemOptionsScheme);

TableScheme.plugin(autoI, { field: "table_id" });
TableScheme.plugin(paginate);
let Tables = mongoose.model("Tables", TableScheme);

ColorScheme.plugin(autoI, { field: "color_id" });
ColorScheme.plugin(paginate);
let Color = mongoose.model("Colors", ColorScheme);

module.exports = {
  User,
  Role,
  Language,
  SystemOption,
  Tables,
  Announcement,
  AnnouncementRole,
  ChoosingColumn,
  Color,
};
