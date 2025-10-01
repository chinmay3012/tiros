// src/admin/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useReducer } from "react";
import api from "../api/axios";

const AuthContext = createContext();

const initialState = {
  admin: null, // { _id, name, email }
  token: localStorage.getItem("adminToken") || null,
  loading: true, // Start with loading true to check auth on mount
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN_START": return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return { ...state, loading: false, token: action.payload.token, admin: action.payload.admin };
    case "LOGIN_FAILURE": return { ...state, loading: false, error: action.payload };
    case "LOGOUT": return { ...initialState, token: null, admin: null };
    case "AUTH_CHECK_COMPLETE": return { ...state, loading: false };
    default: return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Check for existing token and admin info on app load
    const token = localStorage.getItem("adminToken");
    const adminInfo = localStorage.getItem("adminInfo");
    
    if (token && adminInfo) {
      try {
        const parsedAdminInfo = JSON.parse(adminInfo);
        
        // Check if token is expired (basic check)
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          // Token expired, clear storage
          localStorage.removeItem("adminInfo");
          localStorage.removeItem("adminToken");
          dispatch({ type: "AUTH_CHECK_COMPLETE" });
        } else {
          // Token is valid, restore session
          dispatch({ 
            type: "LOGIN_SUCCESS", 
            payload: { 
              token: token, 
              admin: parsedAdminInfo 
            } 
          });
        }
      } catch (error) {
        console.error("Error parsing admin info or token:", error);
        localStorage.removeItem("adminInfo");
        localStorage.removeItem("adminToken");
        dispatch({ type: "AUTH_CHECK_COMPLETE" });
      }
    } else {
      // No stored credentials, set loading to false
      dispatch({ type: "AUTH_CHECK_COMPLETE" });
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const { data } = await api.post("/api/admin/login", { email, password });
      
      if (data && data.token) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminInfo", JSON.stringify({ 
          _id: data._id, 
          name: data.name, 
          email: data.email
        }));
        dispatch({ 
          type: "LOGIN_SUCCESS", 
          payload: { 
            token: data.token, 
            admin: { 
              _id: data._id, 
              name: data.name, 
              email: data.email
            } 
          } 
        });
        return { ok: true };
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      const message = err?.response?.data?.message || err.message || "Login failed";
      dispatch({ type: "LOGIN_FAILURE", payload: message });
      return { ok: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    dispatch({ type: "LOGOUT" });
    window.location.href = "/admin/login";
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
