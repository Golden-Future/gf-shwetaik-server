const mongoose = require("mongoose");
let paginate = require("mongoose-paginate");
let url = "mongodb://127.0.0.1:27017/shweTaikInternational";
mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));
let autoI = require("simple-mongoose-autoincrement");
let Schema = mongoose.Schema;

let UserScheme = new Schema({
  phone: { type: String },
  phone1: { type: String },
  address: { type: String },
  address1: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role_id: { type: Number },
  name: { type: String },
  userName: { type: String },
  lang: { type: String },
  since: { type: Date, required: true },
});

let LOCAL_IVScheme = new Schema({
  seller_id: { type: Number },
  type: { type: String },
  customer_id: { type: Number },
  since: { type: Date },
});

let IV_GoodScheme = new Schema({
  localIV_id: { type: Number },
  code: { type: String },
  description: { type: String },
  price: { type: Number },
  location: { type: String },
  quantity: { type: Number },
  since: { type: Date },
});

let PriceCodeScheme = new Schema({
  one: { type: String },
  two: { type: String },
  three: { type: String },
  four: { type: String },
  five: { type: String },
  six: { type: String },
  seven: { type: String },
  eight: { type: String },
  nine: { type: String },
  zero: { type: String },
  role_id: { type: Number },
  active: { type: Boolean },
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
  since: { type: Date },
});

let TableScheme = new Schema({
  tableName: { type: String, required: true, unique: true },
  description: { type: String },
  color_id: { type: Number },
  since: { type: Date },
});

let choosingColumnScheme = new Schema({
  role_id: { type: Number },
  tableName: { type: String },
  name: { type: String },
  since: { type: Date },
});

let announcementScheme = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  role: { type: String },
  since: { type: Date },
});

let ST_AVAscheme = new Schema({
  code: { type: String },
  quantity: { type: Number },
  seller_id: { type: Number },
  location: { type: String },
  status: { type: Boolean },
  since: { type: Date },
});

let P_IVScheme = new Schema({
  localIV_id: { type: Number },
  sum: { type: Number },
  since: { type: Date },
});

// ST Booking

let ST_UserScheme = new Schema({
  email: { type: String, required: true },
  password: { type: String },
  since: { type: Date },
});

let ST;

// ST Booking

P_IVScheme.plugin(autoI, { field: "PIV_id" });
P_IVScheme.plugin(paginate);
let P_IV = mongoose.model("PIvs", P_IVScheme);

ST_AVAscheme.plugin(autoI, { field: "STAVA_id" });
ST_AVAscheme.plugin(paginate);
let ST_AVA = mongoose.model("STAVAs", ST_AVAscheme);

IV_GoodScheme.plugin(autoI, { field: "ivGood_id" });
IV_GoodScheme.plugin(paginate);
let IV_Good = mongoose.model("IvGoods", IV_GoodScheme);

LOCAL_IVScheme.plugin(autoI, { field: "localIV_id" });
LOCAL_IVScheme.plugin(paginate);
let IV_LOCAL = mongoose.model("LocalIVs", LOCAL_IVScheme);

UserScheme.plugin(autoI, { field: "user_id" });
UserScheme.plugin(paginate);
let User = mongoose.model("Users", UserScheme);

PriceCodeScheme.plugin(autoI, { field: "pricecode_id" });
PriceCodeScheme.plugin(paginate);
let PriceCodes = mongoose.model("PriceCodes", PriceCodeScheme);

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

// ST Booking

ST_UserScheme.plugin(autoI, { field: "STUser_id" });
ST_UserScheme.plugin(paginate);
let ST_User = mongoose.model("STUsers", ST_UserScheme);

// ST Booking

module.exports = {
  User,
  Role,
  Language,
  SystemOption,
  Tables,
  Announcement,
  ChoosingColumn,
  Color,
  tableList,
  PriceCodes,
  IV_Good,
  IV_LOCAL,
  ST_AVA,
  P_IV,

  // ST Booking

  ST_User,

  // ST Booking
};
