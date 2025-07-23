import { Request, Response } from "express";
import callSessionRepository from "../repository/callSessionRepository";

const createCallSession = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const session = await callSessionRepository.createCallSession(data);
    return res.status(201).json(session);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create call session", error });
  }
};

const getAllCallSessions = async (req: Request, res: Response) => {
  try {
    const sessions = await callSessionRepository.findAllCallSessions();
    return res.status(200).json(sessions);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get call sessions", error });
  }
};

const getCallSessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = await callSessionRepository.findCallSessionById(id);
    if (!session) return res.status(404).json({ message: "Call session not found" });
    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({ message: "Failed to get call session", error });
  }
};

const getCallSessionsInRange = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      res.status(400).json({ message: "Start and end dates are required" });
    }

    const startDate = new Date(start as string);
    const endDate = new Date(end as string);

    const sessions = await callSessionRepository.findCallSessionsInRange(startDate, endDate);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Failed to get sessions in range", error });
  }
};

export default {
  createCallSession,
  getAllCallSessions,
  getCallSessionById,
  getCallSessionsInRange,
};
