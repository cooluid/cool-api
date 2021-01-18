import { getValue } from "@/config/RedisConfig";
import config from "@/config/index";
import jwt from "jsonwebtoken";

const getJWTPayload = (token) => {
	return jwt.verify(token.split(" ")[1], config.JWT_SECRET);
};

const checkCode = async (key, value) => {
	let redisData = await getValue(key);
	if (!redisData) {
		return false;
	}

	return redisData.toLowerCase() === value.toLowerCase();
};

export { checkCode, getJWTPayload };
