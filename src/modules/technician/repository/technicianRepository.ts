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


export default { findUseraByEmail, findUserByUsername, createTechnician };
