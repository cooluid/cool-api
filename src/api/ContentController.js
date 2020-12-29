import Post from "@/model/Post";
import Links from "@/model/Links";

class ContentController {
	async getPostList(ctx) {
		const body = ctx.query;
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

		console.log(body);
		const result = await Post.getLists(options, sort, page, limit);
		ctx.body = {
			code: 200,
			data: result,
			msg: "获取文章列表成功",
		};
	}

	async getLinks(ctx) {
		const result = await Links.find({ type: "links" });
		ctx.body = {
			code: 200,
			data: result,
			msg: "获取友情链接成功",
		};
	}

	async getTips(ctx) {
		const result = await Links.find({ type: "tips" });
		ctx.body = {
			code: 200,
			data: result,
			msg: "获取温馨提醒成功",
		};
	}

	async getTopWeek(ctx) {
		const result = await Post.getTopWeek();
		ctx.body = {
			code: 200,
			data: result,
			msg: "获取本周热议成功",
		};
	}
}

export default new ContentController();
