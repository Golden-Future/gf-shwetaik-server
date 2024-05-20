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
    role: { type: String, required: true },
    name: { type: String },
    userName: {type: String},
    since: { type: Date, required: true }
});

let SystemOptionsScheme = new Schema({
    user_id: { type: Number, required: true },
    roleAccess: { type: Boolean },
    languageAccess: { type: Boolean },
    systemAccess: { type: Boolean },
    dataAccess: { type: Boolean },
    systemBoardAccess: {type: Boolean},
    since: { type: Date, required: true },
});

let LanguageScheme = new Schema({
    mm: { type: String },
    en: { type: String },
    since: { type: Date, required: true }
});

let LanguageTextScheme = new Schema({
    text: { type: String },
    langugae_id: { type: Number },
    since: { type: Date, required: true }
});

let RoleScheme = new Schema({
    roleName: { type: String },
    since: { type: Date, required: true }
});

let TabsScheme = new Schema({
    tabName: { type: String },
    user_id: { type: Number },
    tabIcon: { type: String },
    tabIconColor: { type: String },
    since: { type: Date, required: true }
});

let TableScheme = new Schema({
    tableName: { type: String },
    since: { type: Date }
});

let DataScheme = new Schema({
    table_id: {type: Number},
    option: { type: Map, of: String },
    since: { type: Date }
});

RoleScheme.plugin(autoI, { field: "role_id" });
RoleScheme.plugin(paginate);
let Role = mongoose.model("Roles", RoleScheme);

UserScheme.plugin(autoI, { field: "user_id" });
UserScheme.plugin(paginate);
let User = mongoose.model("Users", UserScheme);

LanguageScheme.plugin(autoI, { field: "language_id" });
LanguageScheme.plugin(paginate);
let Language = mongoose.model("Languages", LanguageScheme);

LanguageTextScheme.plugin(autoI, { field: "languageText_id" });
LanguageTextScheme.plugin(paginate);
let LanguageText = mongoose.model("LanguageText", LanguageTextScheme);

TabsScheme.plugin(autoI, { field: "tabs_id" });
TabsScheme.plugin(paginate);
let Tabs = mongoose.model("Tabs", TabsScheme);

SystemOptionsScheme.plugin(autoI, { field: "systemOption_id" });
SystemOptionsScheme.plugin(paginate);
let SystemOption = mongoose.model("SystemOptions", SystemOptionsScheme);

TableScheme.plugin(autoI, { field: "table_id" });
TableScheme.plugin(paginate);
let Tables = mongoose.model("Tables", TableScheme);

DataScheme.plugin(autoI, { field: "data_id" });
DataScheme.plugin(paginate);
let Data = mongoose.model("Datas", DataScheme);


module.exports = {
    User,
    Role,
    Language,
    LanguageText,
    Tabs,
    SystemOption,
    Tables,
    Data,
}