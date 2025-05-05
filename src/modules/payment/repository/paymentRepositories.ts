import TechniciansPayments from "../../../database/models/techniciansPayments"

const findTechnicianPaymentBy2Attributes = async (data: any) => {
    return await TechniciansPayments.findOne(data)
        .populate("technician", "firstName lastName email phone profile")
}

const saveTechnicianPayment = async (data: any) => {
    return await TechniciansPayments.create(data)
}

const updateTechnicianPayment = async (id: string, data: any) => {
    return await TechniciansPayments.findByIdAndUpdate(id, data, { new: true })
}

const findTechnicianPaymentByDepositId = async (depositId: string) => {
    return await TechniciansPayments.findOne({ depositId })
}

const findTechniciansPayments = async () => {
    return await TechniciansPayments.find()
        .populate("technician", "firstName lastName email phone profile").sort(
            { createdAt: -1 }
        )
}

const findTechnicianPayments = async (technicianId: any) => {
    return await TechniciansPayments.find({ technician: technicianId })
        .populate("technician", "firstName lastName email phone profile").sort(
            { createdAt: -1 }
        )
}

export default {
    findTechnicianPaymentBy2Attributes,
    saveTechnicianPayment, updateTechnicianPayment,
    findTechnicianPaymentByDepositId,
    findTechniciansPayments,
    findTechnicianPayments
}