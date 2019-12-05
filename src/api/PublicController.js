import svgCaptcha from 'svg-captcha'

class PublicController {
	constructor() {
	}

	async getCaptcha(ctx) {
		let newCaptcha;
		newCaptcha = svgCaptcha.create({
			size: 4,
			color: true,
			ignoreChars: '1il0oz2',
			width: 150,
			height: 50,
			noise: Math.floor(Math.random() * 5)
		});
		console.log(newCaptcha.data);
		ctx.body = {
			code: 200,
			data: newCaptcha.data,
		}
	}
}

export default new PublicController()
