const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: process.env.RAZOR_ID,
  key_secret: process.env.RAZOR_PASSWORD,
});

module.exports = {
  instance,
};
