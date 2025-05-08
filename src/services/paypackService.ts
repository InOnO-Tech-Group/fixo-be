const paypackJs = require("paypack-js").default;

export const PAYPACK_API_ID = process.env.PAYPACK_API_ID || "";
export const PAYPACK_SECRET = process.env.PAYPACK_SECRET || "";
export const PAYPACK_ENVIRONMENT = process.env.PAYPACK_ENVIRONMENT || "";

console.log("Paypack API ID:", PAYPACK_API_ID);
console.log("Paypack Secret:", PAYPACK_SECRET);
console.log("Paypack Environment:", PAYPACK_ENVIRONMENT);

const paypack = new paypackJs({
    client_id: PAYPACK_API_ID,
    client_secret: PAYPACK_SECRET,
});

export { paypack };