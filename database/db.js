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
  token: { type: String },
  address: { type: String },
  address1: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String },
  userName: { type: String },
  type: { type: String },
  photo: { type: String },
  lang: { type: String },
  since: { type: Date, required: true },
});

let carUserScheme = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String },
  since: { type: Date },
});

let LOCAL_IVScheme = new Schema({
  seller_id: { type: Number },
  type: { type: String },
  customer_id: { type: Number },
  since: { type: Date },
});

let Product_CodeScheme = new Schema({
  code: { type: String },
  location: {
    CODE: { type: String },
    DESCRIPTION: { type: String },
  },
  QTY: { type: Number },
  since: { type: Date },
});

let TeamCodeScheme = new Schema({
  code: { type: String },
  role_id: { type: Number },
  since: { type: Date },
});

let TransferScheme = new Schema({
  productCode: { type: String },
  qty: { type: Number },
  req_id: { type: Number },
  req_location: { type: String },
  res_id: { type: Number },
  res_location: { type: String },
  status: { type: Boolean },
  description: { type: String },
  type: { type: String },
  insert_status: { type: Boolean },
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
  priceTag: { type: String },
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
  type: { type: String },
  since: { type: Date, required: true },
});

let permissionScheme = new Schema({
  read: { type: Boolean },
  create: { type: Boolean },
  update: { type: Boolean },
  delete: { type: Boolean },
  task: { type: String },
  role_id: { type: Number },
  since: { type: Date },
});

let RoleListScheme = new Schema({
  user_id: { type: Number },
  role_id: { type: Number },
  since: { type: Date },
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

let P_IVScheme = new Schema({
  localIV_id: { type: Number },
  sum: { type: Number },
  since: { type: Date },
});

// Car Rental

let carScheme = new Schema({
  car_no: { type: String },
  type: { type: String },
  photo: { type: String },
  photo1: { type: String },
  photo2: { type: String },
  since: { type: Date },
});

let driverScheme = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  phone: { type: String },
  since: { type: Date },
});

let statusScheme = new Schema({
  name: { type: String },
  since: { type: Date },
});

let wayScheme = new Schema({
  fromLocation: { type: String },
  toLocation: { type: String },
  fromDate: { type: Date },
  toDate: { type: Date },
  title: { type: String },
  description: { type: String },
  driver_id: { type: Number },
  car_id: { type: Number },
  type: { type: String },
  price: { type: Number },
  car_no: { type: String },
  total: { type: Number },
  status_id: { type: Number },
  since: { type: Date },
});

carUserScheme.plugin(autoI, { field: "carUser_id" });
carUserScheme.plugin(paginate);
let carUser = mongoose.model("carUser", carUserScheme);

permissionScheme.plugin(autoI, { field: "permission_id" });
permissionScheme.plugin(paginate);
let Permission = mongoose.model("Permission", permissionScheme);

RoleListScheme.plugin(autoI, { field: "roleList_id" });
RoleListScheme.plugin(paginate);
let RoleList = mongoose.model("RoleLists", RoleListScheme);

carScheme.plugin(autoI, { field: "car_id" });
carScheme.plugin(paginate);
let Car = mongoose.model("Cars", carScheme);

driverScheme.plugin(autoI, { field: "driver_id" });
driverScheme.plugin(paginate);
let Driver = mongoose.model("Drivers", driverScheme);

statusScheme.plugin(autoI, { field: "status_id" });
statusScheme.plugin(paginate);
let Status = mongoose.model("Status", statusScheme);

wayScheme.plugin(autoI, { field: "way_id" });
wayScheme.plugin(paginate);
let Way = mongoose.model("Ways", wayScheme);

// Car Rental

TransferScheme.plugin(autoI, { field: "Transfer_id" });
TransferScheme.plugin(paginate);
let Transfers = mongoose.model("Transfers", TransferScheme);

TeamCodeScheme.plugin(autoI, { field: "TeamCode_id" });
TeamCodeScheme.plugin(paginate);
let TeamCode = mongoose.model("TeamCodes", TeamCodeScheme);

Product_CodeScheme.plugin(autoI, { field: "Product_Code_id" });
Product_CodeScheme.plugin(paginate);
let Product_Code = mongoose.model("Product_Codes", Product_CodeScheme);

P_IVScheme.plugin(autoI, { field: "PIV_id" });
P_IVScheme.plugin(paginate);
let P_IV = mongoose.model("PIvs", P_IVScheme);

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
  P_IV,
  Product_Code,
  TeamCode,
  Transfers,
  Car,
  Driver,
  Way,
  Status,
  Permission,
  RoleList,
  carUser,
};
