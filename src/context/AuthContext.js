"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({
    id: 1, 
    name: "Arjun Mehta",  
    email: "arjun.mehta@example.com",  
    phone: "9876543210"
  });

  const login = (user = { id: 1, name: "Arjun Mehta", email: "arjun.mehta@example.com", phone: "9876543210" }) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
