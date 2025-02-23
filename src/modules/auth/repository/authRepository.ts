import Session from "../../../database/models/session";
import User, { IUser } from "../../../database/models/user";
import { Sessions } from "../../../types/auth";

const findUserByAttribute = async (key: string, value: string) => {
  return await User.findOne({ [key]: value });
};
const findUserById = async (id: string) => {
  return await User.findById(id);
};
const saveSession = async (data: Sessions) => {
  return await Session.create(data)
}

const findSessionByTwoAttributes = async (key1: string, value1: string, key2: string, value2: string) => {
  return await Session.findOne({ [key1]: value1, [key2]: value2 });
}

const deleteSession = async (_id: any) => {
  return await Session.findByIdAndDelete(_id)
}

const updateUser = async (_id: any, data: any) => {
  return await User.findByIdAndUpdate(_id, data, { new: true })
}

const findAllUsers = async () => {
  return await User.find();
}

export default {
  findUserByAttribute,
  findUserById,
  saveSession,
  findSessionByTwoAttributes,
  deleteSession,
  updateUser,
  findAllUsers
};
