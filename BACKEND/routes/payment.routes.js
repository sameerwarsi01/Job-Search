const express = require("express");
const router = express.Router();
const User = require("../Models/user.model.js");
const { userAuthentication } = require("../Middleware/userMiddleware.js");

// SIMULATED / MOCK CHECKOUT ROUTE
router.post("/mock-checkout", userAuthentication, async(req, res) => {
    try {
        const { planName = "pro", amount = 199, paymentMethod = "UPI"} = req.body;

        // calculate 1 month validity
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        // Generate the Id Mock Transanction
        const mockTxnId = "TXN_SIM" + Math.random().toString(36).substring(2, 10).toUpperCase();

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                isPro: true,
                subscriptionPlan: planName.toLowerCase(),
                subscriptionExpiresAt: expiresAt,
            },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "Payment Simulated Successfully!! Welcomne to Pro." ,
            transaction: {
                id: mockTxnId,
                amount,
                plan: planName,
                paymentMethod,
                date: new Date(),
            },
            user: updatedUser,    
        });
    } catch (error) {
        console.error("Simulation payment error", error);
        return res.status(500).json({ success: false, message: "Payment simulation failed"});
    }
});

// STATUS CHECK ROUTE
router.get("/status", userAuthentication, async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select("isPro subscriptionPlan subscriptionExpiresAt");
        return res.status(200).json({ success: true, subscription: user});
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch status" });
    }
});

module.exports = router;