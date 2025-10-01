import React from "react";
import { useNavigate } from "react-router-dom";

const LoginMobile = () => {
  const navigate = useNavigate();
  return (
    <>
    <button onClick={() => navigate("/login")} className="md:hidden text-sm text-black hover:cursor-pointer no-underline shadow-xl p-1.5 rounded font-semibold">
      Log In
    </button>
    </>
    
  );
};
export default LoginMobile;
