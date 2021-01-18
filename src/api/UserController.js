//API逻辑处理
import SignRecord from "@/model/SignRecord";
import { getJWTPayload } from "@/common/Utils";
import User from "@/model/User";
import moment from "dayjs";

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
}

export default new UserController();
