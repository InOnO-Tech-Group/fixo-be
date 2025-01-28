import Session from "../../../database/models/session";
import User from "../../../database/models/user";

const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};
const saveSession = async (data:{userId:string,content:string})=>{
  return await Session.create(data)
}

export default { findUserByEmail,saveSession };
