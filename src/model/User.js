import mongoose from "@/config/DBHelper";

const Schema = mongoose.Schema;
const UserSchema = new Schema({
	username: String,
	password: String,
});

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
