import { getValue } from "@/config/RedisConfig";
const checkCode = async (key, value) => {
	let redisData = await getValue(key);
	if (!redisData) {
		return false;
	}

	return redisData.toLowerCase() === value.toLowerCase();
};

export { checkCode };
