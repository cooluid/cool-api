const DB_URL = "mongodb://cool:123456@fanr.co:27017/cooldb";
const REDIS = {
	host: "fanr.co",
	port: 15001,
	password: "123456",
};

const JWT_SECRET = "www.fanr.co";

export default {
	REDIS,
	JWT_SECRET,
	DB_URL,
};
