import svgCaptcha from "svg-captcha";
import { getValue, setValue } from "../config/RedisConfig";

class PublicController {
	constructor() {}

	async getCaptcha(ctx) {
		let body = ctx.request.query;
		console.log(body.sid);
		let newCaptcha = svgCaptcha.create({
			size: 4,
			color: true,
			ignoreChars: "1il0oz2",
			width: 150,
			height: 38,
			noise: Math.floor(Math.random() * 5),
		});

		setValue(body.sid, newCaptcha.text);
		getValue(body.sid).then((res) => {
			console.log(res);
		});
		ctx.body = {
			code: 200,
			data: newCaptcha.data,
		};
	}
}

export default new PublicController();
