import React from "react";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores";
import { AuthStatuses } from "../utils/constants";

const ProtectedRoute = observer(({ children }) => {
  const { appStore } = useStore();
  if (appStore.authStatus !== AuthStatuses.LOGIN_SUCCESS) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
});

export default ProtectedRoute;
