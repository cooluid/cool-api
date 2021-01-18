import send from "../config/MailConfig";
import bcrypt from "bcrypt";
import moment from "dayjs";
import jsonwebtoken from "jsonwebtoken";
import config from "../config/index";
import { checkCode } from "@/common/Utils";
import User from "@/model/User";
import signRecord from "@/model/SignRecord";

class LoginController {
	constructor() {}

	async testApi(ctx) {
		console.log(ctx.request);
		ctx.body = {
			code: 200,
		};
	}

	async forget(ctx) {
		const { body } = ctx.request;
		try {
			let result = await send({
				code: "1234",
				from: "社区激活验证码 350670694@qq.com",
				to: "350670694@qq.com",
				expire: moment().add(30, "m").format("YYYY-MM-DD HH:mm:ss"),
				email: body.username,
				user: "cool",
			});
			ctx.body = {
				code: 200,
				data: result,
				msg: `邮件发送成功`,
			};
		} catch (e) {
			console.log(`错误的数据：${e}`);
		}
	}

	async login(ctx) {
		const { body } = ctx.request;
		let sid = body.sid;
		let code = body.code;
		let result = await checkCode(sid, code);

		if (result) {
			let user = await User.findOne({ username: body.username });
			let checkUserPassword =
				(await user) && bcrypt.compare(body.password, user.password);
			if (checkUserPassword) {
				let token = jsonwebtoken.sign({ _id: user._id }, config.JWT_SECRET, {
					expiresIn: "1d",
				});

				let userObj = user.toJSON();
				let arr = ["password", "roles", "username"];
				arr.map((item) => {
					delete userObj[item];
				});

				let record = await signRecord.findByUid(user._id);
				let b = false;
				if (record) {
					b =
						moment(record.created).format("YYYY-MM-DD") ===
						moment().format("YYYY-MM-DD");
				}
				userObj.isSign = b;
				ctx.body = {
					code: 200,
					token: token,
					data: userObj,
					msg: "登录成功",
				};
			} else {
				ctx.body = {
					code: 404,
					msg: "用户名或者密码错误",
				};
			}
		} else {
			ctx.body = {
				code: 401,
				msg: "验证码不正确",
			};
		}
	}

	async reg(ctx) {
		const { body } = ctx.request;
		let sid = body.sid;
		let username = body.username;
		let password = body.password;
		let code = body.code;
		let name = body.name;
		let msg = {};

		if (await checkCode(sid, code)) {
			//查询是否注册了用户名
			let user1 = await User.findOne({ username: username });
			let user2 = await User.findOne({ name: name });
			if (user1 && typeof user1.username !== "undefined") {
				msg.username = ["此用户名已经注册，请用邮箱找回密码"];
			} else if (user2 && typeof user2.name !== "undefined") {
				msg.name = ["此昵称已经被注册，请修改"];
			} else {
				//开始写入库
				password = await bcrypt.hash(password, 5);
				let user = new User({
					username: username,
					name: name,
					password: password,
					created: moment().format("YYYY-MM-DD HH:mm:ss"),
				});
				let result = await user.save();
				if (result) {
					ctx.body = {
						code: 200,
						data: result,
						msg: "注册成功",
					};

					return;
				}
			}
		} else {
			msg.code = ["验证码失效，请重新获取"];
		}

		ctx.body = {
			code: 500,
			msg: msg,
		};
	}
}

export default new LoginController();
