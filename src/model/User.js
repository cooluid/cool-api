import mongoose from "@/config/DBHelper";
import moment from "dayjs";

const Schema = mongoose.Schema;
const UserSchema = new Schema({
	username: { type: String, index: { unique: true }, sparse: true }, //	用户名
	password: { type: String }, //	密码
	name: { type: String }, //	昵称
	created: { type: Date }, //	注册时间
	favs: { type: Number, default: 100 }, //	积分
	updated: { type: Date }, //	更新时间
	gender: { type: String, default: 0 }, //性别：0-男 1-女
	roles: { type: Array, default: ["user"] }, //user	角色：user-普通用户 admin-管理员 super_admin-超级管理员
	pic: { type: String, default: "/img/avatar.png" }, //用户头像
	mobile: { type: Number, match: /^1[3-9](\d{9})$/, default: "" }, //	用户手机号码
	status: { type: Number, default: 0 }, //	是被//禁用 0-正常 1-禁言 2-账号禁用
	regmark: { type: String }, //	个性签名
	location: { type: String }, //	城市
	isVip: { type: Number, default: 0 }, //VIP用户: 0-普通用户 1-vip用户
	count: { type: Number, default: 0 }, //签到次数
});

UserSchema.pre("save", function (next) {
	this.created = moment().format("YYYY-MM-DD HH:mm:ss");
	next();
});

UserSchema.pre("update", function (next) {
	this.updated = moment().format("YYYY-MM-DD HH:mm:ss");
	next();
});

UserSchema.post("save", function (error, doc, next) {
	if (error.name === "MongoError" && error.code === 11000) {
		next(new Error("Error:Mongoose has a duplicate key."));
	} else {
		next(error);
	}
});

UserSchema.statics = {
	findById: function (id) {
		//用ID查询，并排除掉某些字段
		return this.findOne({ _id: id }, { password: 0, username: 0, mobile: 0 });
	},
};

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
