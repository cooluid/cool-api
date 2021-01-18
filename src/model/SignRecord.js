import mongoose from "@/config/DBHelper";
import moment from "dayjs";

const Schema = mongoose.Schema;
//定义数据类型
const SingRecordSchema = new Schema({
	uid: { type: String, ref: "users" },
	created: { type: Date },
	favs: { type: Number },
});

SingRecordSchema.pre("save", function (next) {
	this.created = moment().format("YYYY-MM-DD HH:mm:ss");
	next();
});

SingRecordSchema.statics = {
	findByUid: function (uid) {
		return this.findOne({ uid: uid }).sort({ created: -1 });
	},
};

const SignRecord = mongoose.model("sign-record", SingRecordSchema);

export default SignRecord;
