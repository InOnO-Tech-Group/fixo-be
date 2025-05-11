import SystemIncomeTracker from "../models/systemIncomeTracker";

const generateRandomData = () => {
    const trackers = [];
    const inDescriptions = [
        "Service fee from user transaction",
        "Platform subscription payment",
        "Premium feature purchase",
        "API usage charge",
        "Marketplace commission",
        "Processing fee collection",
        "Monthly service charge",
        "Developer license fee",
        "Payment gateway fee",
        "Account verification charge"
    ];

    const outDescriptions = [
        "Payment processor fee",
        "Infrastructure maintenance",
        "Third-party service charge",
        "System refund issued",
        "Fraud reversal",
        "Bank chargeback fee",
        "Cloud hosting costs",
        "Customer support refund",
        "Security audit expense",
        "Regulatory compliance fee"
    ];

    for (let i = 0; i < 100; i++) {
        const type = Math.random() < 0.7 ? 'in' : 'out';
        
        const grossAmount = (Math.floor(Math.random() * 196) + 5) * 10; // 50-2000
        
        let serviceFee, transactionFee;
        if (type === 'in') {
            serviceFee = Math.round(grossAmount * 0.4 * 100) / 100;
            
            transactionFee = Math.random() < 0.3
                ? Math.round(grossAmount * (0.01 + Math.random() * 0.04) * 100) / 100
                : 0;
        } else {
            serviceFee = 0;
            transactionFee = grossAmount;
        }

        const netIncome = type === 'in' 
            ? Math.max(0, serviceFee - transactionFee)
            : -transactionFee;

        const randomDate = new Date(2020, 0, 1).getTime() +
            Math.random() * (new Date(2023, 11, 31).getTime() - new Date(2020, 0, 1).getTime());

        const descriptions = type === 'in' ? inDescriptions : outDescriptions;
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];

        trackers.push({
            grossAmount: type === 'in' ? grossAmount : -grossAmount,
            serviceFee,
            transactionFee,
            netIncome,
            description: `${description} #${Math.floor(1000 + Math.random() * 9000)}`,
            type,
            createdAt: new Date(randomDate)
        });
    }

    return trackers;
};

const seedIncomeTracker = async () => {
    const trackers = generateRandomData();
    await SystemIncomeTracker.insertMany(trackers);
    console.log("SystemIncomeTracker seeded with 100 diverse records");
}

export async function unseedIncomeTracker() {
    await SystemIncomeTracker.deleteMany({});
    console.log("SystemIncomeTracker unseeded");
}

export default seedIncomeTracker;