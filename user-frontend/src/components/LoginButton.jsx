import React from "react";
import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  const navigate = useNavigate();
  return (
    <>
    <button onClick={() => navigate("/login") } className="hidden md:flex text-sm text-black hover:cursor-pointer no-underline shadow-sm p-1.5 px-2 rounded bg-teal-300">
      Log In
    </button>
    </>
    
  );
};
export default LoginButton;
