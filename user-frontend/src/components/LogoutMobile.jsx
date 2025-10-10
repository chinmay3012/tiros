import React from "react";
import { useAuth } from "../context/AuthContext";

const LogoutMobile = () => {
  const { logout } = useAuth();
  return (
    <>
    <button 
    onClick={() => logout()} className="md:hidden text-sm text-black hover:cursor-pointer no-underline shadow-xl p-1.5 rounded font-semibold hover:bg-[#95C5F4]">
      Log Out
    </button>
    </>
    
  );
};
export default LogoutMobile;