import AdminWithdrawal from "../../../database/models/adminWithdrawals"
import PaymentSettings from "../../../database/models/paymentSettings"
import SystemIncomeTracker from "../../../database/models/systemIncomeTracker"
import TechniciansPayments from "../../../database/models/techniciansPayments"
import TechniciansWithdraws from "../../../database/models/techniciansWithdraws"
import User from "../../../database/models/user"

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

const techWithdrawMoney = async (data: any) => {
    return await TechniciansWithdraws.create(data)
}

const techFindOwnWithdrawals = async (technician: any) => {
    return await TechniciansWithdraws.find({ technician })
}

const findAllTechsWithdrawals = async () => {
    return await TechniciansWithdraws.find().populate("technician", "firstName lastName email phone profile").sort({ createdAt: 1 })
}

const saveSystemIncomeTracker = async (data: any) => {
    return await SystemIncomeTracker.create(data)
}

const findAllSystemIncomes = async () => {
    return await SystemIncomeTracker.find().sort({ createdAt: -1 })
}
const findAllTechnicians = async () => {
    return await User.find()
        .select('_id email balance')
        .sort({ balance: -1 });
}

const saveAdminWithdrawals = async (data: any) => {
    return await AdminWithdrawal.create(data)
}

const savePaymentSettings = async (data: any) => {
    return await PaymentSettings.create(data)
}

const findPaymentSettings = async () => {
    return await PaymentSettings.find().sort({
        createdAt: -1
    })
}

const findLatestSetting = async () => {
    return await PaymentSettings.findOne().sort({
        createdAt: -1
    })
}

export default {
    findTechnicianPaymentBy2Attributes,
    saveTechnicianPayment, updateTechnicianPayment,
    findTechnicianPaymentByDepositId,
    findTechniciansPayments,
    findTechnicianPayments,
    techWithdrawMoney,
    techFindOwnWithdrawals,
    findAllTechsWithdrawals,
    saveSystemIncomeTracker,
    findAllSystemIncomes,
    findAllTechnicians,
    saveAdminWithdrawals,
    savePaymentSettings,
    findPaymentSettings,
    findLatestSetting
}