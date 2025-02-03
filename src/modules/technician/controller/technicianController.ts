import { Request, Response } from "express";
import httpStatus from "http-status";
import technicianRepository from "../repository/technicianRepository";

const addNewTechnician = async (req: Request, res: Response) => {
  try {
    const technicianData = req.body;
    const technician = await technicianRepository.createTechnician(technicianData)

    res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      message: "Technician added successfully",
      data: technician,
    });
  } catch (error: any) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateTechnicianStatus = async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
      const technician = await technicianRepository.updateTechnicianStatus(id)
  
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "Technician updated successfully",
        data: technician,
      });
    } catch (error: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  const getAllTechnicians = async (req: Request, res: Response) => {
    try {  
      res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "Technician updated successfully",
        data: req.users,
      });
    } catch (error: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

export default {addNewTechnician,updateTechnicianStatus,getAllTechnicians}