import Session from "../../../database/models/session";
import User from "../../../database/models/user";
import { Sessions } from "../../../types/auth";

const findUserByAttribute = async (key: string, value: string) => {
  return await User.findOne({ [key]: value });
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

export default {
  findUserByAttribute,
  saveSession,
  findSessionByTwoAttributes,
  deleteSession
};
