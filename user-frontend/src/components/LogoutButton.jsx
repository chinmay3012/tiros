import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={() => logout()}
      className="hidden md:flex text-sm text-black hover:cursor-pointer no-underline shadow-sm p-1.5 px-2 rounded bg-teal-300" 
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
