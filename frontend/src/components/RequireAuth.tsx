import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RequireAuth: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { token } = useAuth(); //useAuthでtoken取得

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
