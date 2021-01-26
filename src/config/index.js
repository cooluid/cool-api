const DB_URL = "mongodb://cool:123456@xxxx.cool:27017/cooldb";
const REDIS = {
	host: "xxxx.cool",
	port: 15001,
	password: "123456",
};

const JWT_SECRET = "xxxx.cool";
const baseUrl =
	process.env.NODE_ENV === "production"
		? "http://xxxx.cool"
		: "http://localhost:8080";

export default {
	REDIS,
	JWT_SECRET,
	DB_URL,
	baseUrl,
};
