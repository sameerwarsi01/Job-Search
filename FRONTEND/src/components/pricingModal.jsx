import React, { useState } from "react";
import axios from "axios";
import { 
  FiCheck, 
  FiX, 
  FiShield, 
  FiCreditCard, 
  FiSmartphone, 
  FiLock,
  FiArrowLeft 
} from "react-icons/fi";

function PricingModal({ isOpen, onClose, onUpgradeSuccess, onComplete, plan }) {
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [step, setStep] = useState("INPUT"); // "INPUT" | "PIN" | "SUCCESS"
  const [upiId, setUpiId] = useState("user@okaxis");
  const [upiPin, setUpiPin] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "4242 •••• •••• 4242",
    expiry: "12/28",
    cvv: "888",
  });
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState("");

  if (!isOpen || !plan) return null;

  // Step 1: Proceed to PIN screen
  const handleProceedToAuth = (e) => {
    e.preventDefault();
    setError("");
    if (selectedMethod === "upi" && !upiId.trim()) {
      setError("Please enter a valid UPI ID");
      return;
    }
    setStep("PIN");
  };

  // Step 2: Submit PIN and trigger simulated backend checkout
  const handleFinalPayment = async (e) => {
    e.preventDefault();
    if (upiPin.length < 4) {
      setError("Please enter a 4-digit UPI / Security PIN (e.g. 1234)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const headers = {};
      if (token) {
        headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      }

      const res = await axios.post(
        "http://localhost:3000/api/payment/mock-checkout",
        {
          planName: plan.name,
          amount: plan.amount,
          paymentMethod: selectedMethod.toUpperCase(),
        },
        {
          headers,
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            parsed.isPro = true;
            parsed.subscriptionPlan = plan.name.toLowerCase();
            localStorage.setItem("user", JSON.stringify(parsed));
          } catch (err) {
            console.error(err);
          }
        }

        setSuccessData(res.data.transaction);
        setStep("SUCCESS");
        if (onUpgradeSuccess) onUpgradeSuccess(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment simulation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("INPUT");
    setSuccessData(null);
    setError("");
    setUpiPin("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <FiX className="text-xl" />
        </button>

        {/* STEP 1: PAYMENT METHOD & DETAILS */}
        {step === "INPUT" && (
          <form onSubmit={handleProceedToAuth}>
            <div className="mb-4">
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 uppercase">
                Razorpay Sandbox
              </span>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">Checkout</h2>
              <p className="text-xs text-slate-500">{plan.name} Tier • Fast Activation</p>
            </div>

            {/* Total Amount Card */}
            <div className="mb-5 flex items-baseline justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount to Pay</span>
                <div className="text-2xl font-black text-slate-900">
                  {plan.price} <span className="text-xs font-normal text-slate-500">/{plan.period}</span>
                </div>
              </div>
              <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                Test Mode
              </span>
            </div>

            {/* Method Tabs */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Payment Option
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod("upi")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-sm font-semibold transition ${
                    selectedMethod === "upi"
                      ? "border-violet-600 bg-violet-50 text-violet-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <FiSmartphone /> UPI Apps
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod("card")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-sm font-semibold transition ${
                    selectedMethod === "card"
                      ? "border-violet-600 bg-violet-50 text-violet-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <FiCreditCard /> Card
                </button>
              </div>
            </div>

            {/* Inputs based on selection */}
            {selectedMethod === "upi" ? (
              <div className="mb-5 space-y-2">
                <label className="text-xs font-medium text-slate-600">Enter Dummy UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@okhdfcbank"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-500"
                />
                <p className="text-[11px] text-slate-400">Supports GPay, PhonePe, Paytm simulation.</p>
              </div>
            ) : (
              <div className="mb-5 space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">Card Number</label>
                  <input
                    type="text"
                    readOnly
                    value={cardDetails.number}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-mono text-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-600">Expiry</label>
                    <input
                      type="text"
                      readOnly
                      value={cardDetails.expiry}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">CVV</label>
                    <input
                      type="password"
                      readOnly
                      value={cardDetails.cvv}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && <p className="mb-3 text-center text-xs font-semibold text-rose-500">{error}</p>}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 font-bold text-white shadow-md shadow-violet-200 hover:bg-violet-700 active:scale-95 transition"
            >
              Continue to Pay {plan.price}
            </button>
          </form>
        )}

        {/* STEP 2: UPI / BANK PIN AUTHENTICATION */}
        {step === "PIN" && (
          <form onSubmit={handleFinalPayment}>
            <button
              type="button"
              onClick={() => { setStep("INPUT"); setError(""); }}
              className="mb-4 flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              <FiArrowLeft /> Back to options
            </button>

            <div className="text-center mb-5">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <FiLock className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Enter UPI / Security PIN</h3>
              <p className="text-xs text-slate-500 mt-1">
                Paying <strong>{plan.price}</strong> to <strong>Search&Track Technologies</strong>
              </p>
            </div>

            <div className="my-5">
              <input
                type="password"
                maxLength={6}
                value={upiPin}
                onChange={(e) => setUpiPin(e.target.value)}
                placeholder="••••"
                autoFocus
                className="w-full tracking-[1em] text-center font-mono text-2xl font-bold rounded-xl border-2 border-violet-400 py-3 text-slate-800 focus:outline-none focus:border-violet-600 bg-violet-50/30"
              />
              <p className="mt-2 text-center text-xs text-slate-400">
                Enter any dummy 4-digit PIN (e.g. 1234)
              </p>
            </div>

            {error && <p className="mb-3 text-center text-xs font-semibold text-rose-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 transition"
            >
              <FiShield />
              {loading ? "Authorizing Bank Transaction..." : `Confirm & Pay ${plan.price}`}
            </button>
          </form>
        )}

        {/* STEP 3: TRANSACTION SUCCESS RECEIPT */}
        {step === "SUCCESS" && successData && (
          <div className="py-4 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <FiCheck className="text-3xl animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Payment Successful!</h3>
            <p className="mt-1 text-xs text-slate-500">
              Your subscription is now active on <strong>{plan.name} Plan</strong>.
            </p>

            <div className="my-5 rounded-2xl bg-slate-50 p-4 text-left text-xs space-y-2 border border-slate-200/60">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-800">{successData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Paid Amount:</span>
                <span className="font-bold text-slate-800">{plan.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-semibold text-slate-700">{successData.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Status:</span>
                <span className="font-bold text-emerald-600">SUCCESS / SETTLED</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onComplete) onComplete();
                else handleClose();
              }}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-bold text-white shadow-md hover:opacity-95 active:scale-95 transition"
            >
              Continue to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PricingModal;