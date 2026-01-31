import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

const POLL_INTERVAL_MS = 2000;
const TIMEOUT_MS = 60000;

export default function CheckoutReturnPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("polling");
  const [message, setMessage] = useState("Confirming your payment...");
  const pollRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const paymentId = searchParams.get("merchantOrderId");
    if (!paymentId) {
      setStatus("error");
      setMessage("Missing payment reference");
      return;
    }

    const checkVerify = async () => {
      try {
        const res = await api.post("/payments/verify", { paymentId, provider: "phonepe" });
        const { verified, message: msg } = res.data;

        if (verified) {
          setStatus("success");
          setMessage("Payment successful!");
          if (pollRef.current) clearInterval(pollRef.current);
          navigate("/orders", { replace: true });
          return true;
        }

        if (msg === "Payment failed") {
          setStatus("error");
          setMessage("Payment failed");
          if (pollRef.current) clearInterval(pollRef.current);
          return true;
        }

        return false;
      } catch (err) {
        if (Date.now() - startTimeRef.current > TIMEOUT_MS) {
          setStatus("timeout");
          setMessage("Payment is being processed. Check your orders in a few moments.");
          if (pollRef.current) clearInterval(pollRef.current);
          return true;
        }
        return false;
      }
    };

    const poll = async () => {
      const done = await checkVerify();
      if (done) return;

      if (Date.now() - startTimeRef.current > TIMEOUT_MS) {
        setStatus("timeout");
        setMessage("Payment is being processed. Check your orders in a few moments.");
        if (pollRef.current) clearInterval(pollRef.current);
      }
    };

    poll();
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [searchParams, navigate]);

  if (status === "error") {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold text-red-600 mb-4">Payment failed</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => navigate("/checkout")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Checkout
        </button>
      </div>
    );
  }

  if (status === "timeout") {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold text-amber-600 mb-4">Payment processing</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="animate-pulse text-gray-600">{message}</div>
    </div>
  );
}
