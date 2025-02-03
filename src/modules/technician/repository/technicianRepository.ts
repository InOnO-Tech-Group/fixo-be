import User, { IUser } from "../../../database/models/user";
const findUseraByEmail = async (email: string) => {
  return await User.findOne({ email });
};
const findUserByUsername = async (username: string) => {
  return await User.findOne({ username });
};

const createTechnician = async (data: IUser) => {
  return await User.create(data);
};
const updateTechnicianStatus = async (id:string)=>{
    return  await User.findByIdAndUpdate(
        id,
        [{ $set: { status: { $not: "$status" } } }],
        { new: true }
      );
      
}

export default { findUseraByEmail, findUserByUsername, createTechnician ,updateTechnicianStatus};
