import send from "../config/MailConfig";
import moment from "moment";

class LoginController {
	constructor() {
	}

	async testApi(ctx) {
		console.log(ctx.request)
		ctx.body = {
			code: 200
		}
	}

	async forget(ctx) {
		const {body} = ctx.request
		try {
			let result = await send({
				code: '1234',
				from: '社区激活验证码 350670694@qq.com',
				to: '350670694@qq.com',
				expire: moment().add(30, 'm').format('YYYY-MM-DD HH:mm:ss'),
				email: body.username,
				user: 'cool'
			})
			ctx.body = {
				code: 200,
				data: result,
				msg: `邮件发送成功`
			}
		} catch (e) {
			console.log(`错误的数据：${e}`)
		}
	}
}

export default new LoginController()