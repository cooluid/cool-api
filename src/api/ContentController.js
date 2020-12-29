import Post from "@/model/Post";

class ContentController {
	async getPostList(ctx) {
		const body = ctx.query;

		//测试数据
		// const post = new Post({
		// 	title: "test title1",
		// 	content: "test content1",
		// 	catalog: "advise",
		// 	fav: 20,
		// 	isEnd: 0,
		// 	reads: 0,
		// 	answer: 0,
		// 	status: 0,
		// 	isTop: 0,
		// 	sort: 0,
		// 	tags: [],
		// });
		// const tmp = await post.save();
		// console.log(
		// 	"🚀 ~ file: ContentController.js ~ line 22 ~ ContentController ~ getPostList ~ tmp",
		// 	tmp
		// );

		const sort = body.sort ? body.sort : "created";
		const page = body.page ? parseInt(body.page) : 0;
		const limit = body.limit ? parseInt(body.limit) : 20;
		let options = {};

		if (typeof body.catalog !== "undefined" && body.catalog !== "") {
			options.catalog = body.catalog;
		}
		if (typeof body.isTop !== "undefined" && body.isTop !== "") {
			options.isTop = body.isTop;
		}
		if (typeof body.status !== "undefined" && body.status !== "") {
			options.status = body.status;
		}
		if (typeof body.isEnd !== "undefined" && body.isEnd !== "") {
			options.isEnd = body.isEnd;
		}
		if (typeof body.tag !== "undefined" && body.tag !== "") {
			options.tags = { $elemMatch: { name: body.tag } };
		}

		const result = await Post.getLists(options, sort, page, limit);
		ctx.body = {
			code: 200,
			data: result,
			msg: "获取文章列表成功",
		};
	}
}

export default new ContentController();
