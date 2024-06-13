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
    roleName: { type: String },
    user_id:  {type: String},
    userManage: { type: Boolean },
    roleManage: { type: Boolean },
    languageManage: { type: Boolean },
    tableManage: { type: Boolean },
    colorManage: { type: Boolean },
    filterManage: {type: Boolean},
    tableSync: { type: Boolean },
    tableFetch: { type: Boolean },
    tableInsert: { type: Boolean },
    lang: { type: String},
    since: { type: Date, required: true },
});

let LanguageScheme = new Schema({
    mm: { type: String },
    en: { type: String },
    since: { type: Date, required: true }
});

let RoleScheme = new Schema({
    roleName: { type: String },
    since: { type: Date, required: true }
});

let ColorScheme = new Schema({
    primary: { type: String },
    secondary: { type: String },
    third: { type: String },
    since: { type: Date ,required: true}
})

let FilterScheme = new Schema({
    key: { type: String },
    value: { type: String },
    table_id: { type: Number },
    role_id: { type: Number },
    length: {type: Number},
    user_id: { type: Number },
    since: { type: Date }
})

let TableScheme = new Schema({
    tableName: { type: String },
    code: {type: String},
    since: { type: Date }
});

let choosingColumnScheme = new Schema({
    name: { type: String },
    checked: { type: Boolean },
    tableName: { type: String },
    user_id: { type: String },
    since: { type: Date },
})


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

FilterScheme.plugin(autoI, { field: 'filter_id' });
FilterScheme.plugin(paginate);
let Filter = mongoose.model('Filters', FilterScheme);

ColorScheme.plugin(autoI, { field: 'color_id' });
ColorScheme.plugin(paginate);
let Color = mongoose.model('Colors', ColorScheme);

module.exports = {
    User,
    Role,
    Language,
    SystemOption,
    Tables,
    Filter,
    ChoosingColumn,
    Color
}