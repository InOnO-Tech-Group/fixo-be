import User from "../models/user";
import { hashPassword } from "../../helpers/auth";

const seedUsers = async () => {
    const users = [
        {
            firstName: "inono",
            lastName: "akima",
            username: "inonoakima",
            email: "akimana.inono@gmail.com",
            password: await hashPassword("password123"),
            role: "admin",
        },
        {
            firstName: "Ndahimana",
            lastName: "Bonheur",
            username: "ndahimana154",
            email: "ndahimana154@gmail.com",
            password: await hashPassword("password123"),
            role: "technician",
            otpEnabled: false
        },
        {
            firstName: "Demo",
            lastName: "User1",
            username: "demouser",
            email: "demouser1@gmail.com",
            password: await hashPassword("password123"),
            role: "admin",
            otpEnabled: false
        },
        {
            firstName: "Demo",
            lastName: "User2",
            username: "demouser2",
            email: "demouser2@gmail.com",
            password: await hashPassword("password123"),
            role: "technician",
            otpEnabled: false
        },

    ];

    await User.deleteMany({});
    await User.insertMany(users);
    console.log("Users seeded successfully.");
};

export async function unseedUsers() {
    await User.deleteMany({});
    console.log("Users removed successfully.");
}

export default seedUsers;
