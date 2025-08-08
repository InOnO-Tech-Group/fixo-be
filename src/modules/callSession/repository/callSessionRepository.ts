import CallSession, { ICallSession, ICallSessionInput } from "../../../database/models/callSessions";

const createCallSession = async (data: ICallSessionInput) => {
  return await CallSession.create(data);
};

const findCallSessionsInRange = async (startDate: Date, endDate: Date) => {
  return await CallSession.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  })  
    .populate("technicianId")
    .sort({ technicianId: 1 });
};
const findCallSessionById = async (id: string) => {
  return await CallSession.findById(id).populate("technicianId");
};

const findAllCallSessions = async () => {
  return await CallSession.find().populate("technicianId");
};
const updateCallSession = async ({ userId, startedAt, endedAt, duration,technicianId }: any) => {
  return await CallSession.findOneAndUpdate(
    { userId},
    { startedAt, endedAt, duration,technicianId },
    { new: true }
  );
};


export default {
  createCallSession,
  findCallSessionsInRange,
  findCallSessionById,
  findAllCallSessions,
  updateCallSession
};
