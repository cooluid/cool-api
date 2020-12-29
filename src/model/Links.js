import mongoose from "@/config/DBHelper";
import moment from "dayjs";

const Schema = mongoose.Schema;
const LinksSchema = new Schema({
	title: { type: String, default: "" }, //		标题
	link: { type: String, default: "links" }, //		链接
	type: { type: String, default: "" }, //  友情链接还是温馨提箱
	created: { type: Date, default: "" }, //		创建时间
	isTop: { type: Number, default: 0 }, //	 置顶：0-未置顶 1-置顶
	sort: { type: Number, default: 0 }, //	排序
});

LinksSchema.pre("save", function (next) {
	this.created = moment().format("YYYY-MM-DD HH:mm:ss");
	next();
});

LinksSchema.pre("deleteOne", function () {
	console.log(`你删除了一条数据！`);
});

// LinksSchema.statics = {
// 	/**
// 	 * 获取文章列表数据
// 	 * @param {Object} options 筛选条件
// 	 * @param {Number} sort 排序
// 	 * @param {Number} page 分页
// 	 * @param {Number} limit 条数
// 	 */
// 	getLists: function (options, sort, page, limit) {
// 		return this.find(options)
// 			.sort({ [sort]: -1 })
// 			.skip(page * limit)
// 			.limit(limit)
// 			.populate({ path: "uid", select: "name isVip pic" });
// 	},
// };

const LinkModel = mongoose.model("links", LinksSchema);
export default LinkModel;
