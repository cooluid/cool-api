import mongoose from "@/config/DBHelper";
import moment from "dayjs";

const Schema = mongoose.Schema;
const PostSchema = new Schema({
	uid: { type: String, ref: "users" }, //  用户ID
	title: { type: String }, //文章标题
	content: { type: String }, // 文章内容
	created: { type: Date }, //创建时间
	catalog: { type: String }, // 帖子分类：index-全部 ask-提问 advise-建议 discuss-交流 share-分享 logs-动态notice-公告
	fav: { type: Number }, //0  帖子积分
	isEnd: { type: Number }, //是结贴：0-未结贴 1-已结贴
	reads: { type: Number }, //阅读量
	answer: { type: Number }, // 0 回答数
	status: { type: Number }, // 0  0-打开回复 1-关闭回复
	isTop: { type: Number }, //是置顶：0-未置顶 1-已置顶
	sort: { type: Number }, //置顶排序
	tags: { type: Array }, //帖子标签：精华，加精，etc
});

PostSchema.pre("save", function (next) {
	this.created = moment().format("YYYY-MM-DD HH:mm:ss");
	next();
});

PostSchema.pre("deleteOne", function () {
	console.log(`你删除了一条数据！`);
});

PostSchema.statics = {
	/**
	 * 获取文章列表数据
	 * @param {Object} options 筛选条件
	 * @param {Number} sort 排序
	 * @param {Number} page 分页
	 * @param {Number} limit 条数
	 */
	getLists: function (options, sort, page, limit) {
		return this.find(options)
			.sort({ [sort]: -1 })
			.skip(page * limit)
			.limit(limit)
			.populate({ path: "uid", select: "name isVip pic" });
	},
};

const PostModel = mongoose.model("post", PostSchema);
export default PostModel;
