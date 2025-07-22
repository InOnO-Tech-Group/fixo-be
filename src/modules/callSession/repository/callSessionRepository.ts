import CallSession, { ICallSession } from "../../../database/models/callSessions";

const createCallSession = async (data: ICallSession) => {
  return await CallSession.create(data);
};

const findCallSessionsInRange = async (startDate: Date, endDate: Date) => {
  return await CallSession.find({
    startedAt: { $gte: startDate },
    endedAt: { $lte: endDate },
  }).populate("technicianId");
};


const findCallSessionById = async (id: string) => {
  return await CallSession.findById(id).populate("technicianId");
};

const findAllCallSessions = async () => {
  return await CallSession.find().populate("technicianId");
};

export default {
  createCallSession,
  findCallSessionsInRange,
  findCallSessionById,
  findAllCallSessions,
};
