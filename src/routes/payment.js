const express = require("express");
const paymentRouter = express.Router();
const { instance } = require("../utils/razorpay");
const { userAuth } = require("../middlewares/auth");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { type } = req.body;
    const { firstName, lastName, email } = req.user;
    const order = await instance.orders.create({
      amount: membershipAmount[type] * 100,
      currency: "INR",
      receipt: "order_rcptid_11",
      notes: {
        firstName,
        lastName,
        email,
        membershipType: type,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savePayment = await payment.save();
    res.status(200).json({
      success: true,
      payment: savePayment,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = paymentRouter;
