//API逻辑处理
import SignRecord from "@/model/SignRecord";
import { getJWTPayload } from "@/common/Utils";
import User from "@/model/User";
import moment from "dayjs";
import send from "@/config/MailConfig";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { setValue, getValue } from "@/config/RedisConfig";
import config from "@/config/index";

class UserController {
	async userSign(ctx) {
		const obj = await getJWTPayload(ctx.header.authorization);
		const record = await SignRecord.findByUid(obj._id);
		const user = await User.findById(obj._id);
		let newRecord = {};
		let result = {};
		let count = user.count;
		let fav = 0;

		if (record !== null) {
			if (
				moment(record.created).format("YYYY-MM-DD") ===
				moment().format("YYYY-MM-DD")
			) {
				//已经签到了
				ctx.body = {
					code: 500,
					msg: "已经签到",
					favs: user.favs,
					count: user.count,
					lastSign: record.created,
				};
				return;
			}
			//连续签到
			if (
				moment(record.created).format("YYYY-MM-DD") ===
				moment().subtract(1, "days").format("YYYY-MM-DD")
			) {
				count += 1;
				if (count < 5) {
					fav = 5;
				} else if (count >= 5 && count < 15) {
					fav = 10;
				} else if (count >= 15 && count < 30) {
					fav = 15;
				} else if (count >= 30 && count < 100) {
					fav = 20;
				} else if (count >= 100 && count < 365) {
					fav = 30;
				} else if (count >= 365) {
					fav = 50;
				}
				await User.updateOne(
					{
						_id: obj._id,
					},
					{ $inc: { favs: fav, count: 1 } }
				);
				result = {
					favs: user.favs + fav,
					count: user.count + 1,
				};
			} else {
				//断签了
				fav = 5;
				await User.updateOne(
					{ _id: obj._id },
					{
						$set: { count: 1 },
						$inc: { favs: fav },
					}
				);
				result = {
					favs: user.favs + fav,
					count: 1,
				};
			}
			newRecord = new SignRecord({
				uid: obj._id,
				favs: fav,
			});
			await newRecord.save();
		} else {
			//无签到数据
			await User.updateOne(
				{
					_id: obj._id,
				},
				{
					$set: { count: 1 },
					$inc: { favs: 5 },
				}
			);
			newRecord = new SignRecord({
				uid: obj._id,
				favs: 5,
			});

			await newRecord.save();
			result = {
				favs: user.favs + 5,
				count: 1,
			};
		}
		ctx.body = {
			code: 200,
			msg: "请求成功",
			...result,
			lastSign: newRecord.created,
		};
	}

	//更新用户基本信息
	async updateUserInfo(ctx) {
		const { body } = ctx.request;
		const obj = getJWTPayload(ctx.header.authorization);
		//用户是否修改了邮箱
		const user = await User.findOne({ _id: obj._id });
		let msg = "";
		if (body.username && body.username !== user.username) {
			//新邮箱是否已经注册了
			let isRegister = await User.findOne({ username: body.username });
			if (isRegister) {
				ctx.body = {
					code: 501,
					msg: "此邮箱已经注册了",
				};
				return;
			}
			//修改邮箱
			const key = uuidv4();
			setValue(
				key,
				jwt.sign({ _id: obj._id }, config.JWT_SECRET, { expiresIn: "30m" })
			);
			await send({
				type: "email",
				data: {
					key: key,
					username: body.username,
				},
				code: "",
				expire: moment().add(30, "m").format("YYYY-MM-DD HH:mm:ss"),
				user: user.name,
				to: user.username,
			});

			msg = "更新基本资料成功，帐号修改需要点击链接确认修改账号，请查收邮件";
		}

		const arr = ["username", "mobile", "password"];
		arr.map((item) => {
			delete body[item];
		});

		let result = await User.updateOne({ _id: obj._id }, body);
		if (result.n === 1 && result.ok === 1) {
			ctx.body = {
				code: 200,
				msg: msg !== "" ? msg : "更新成功",
			};
		} else {
			ctx.body = {
				code: 500,
				msg: "更新失败",
			};
		}
	}

	//更新用户名
	async updateUsername(ctx) {
		const body = ctx.query;
		if (body.key) {
			const token = await getValue(body.key);
			const obj = getJWTPayload("Bearer " + token);
			await User.updateOne({ _id: obj._id }, { username: body.username });
			ctx.body = {
				code: 200,
				msg: "更新用户名成功",
			};
		}
	}
}

export default new UserController();
