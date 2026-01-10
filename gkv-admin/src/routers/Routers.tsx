import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import AuthRouter from "./AuthRouter";
import MainRouter from "./MainRouter";
import { RootState } from "../redux/store";
import { addAuth } from "../redux/reducers/authReducer";
import { localDataNames } from "../constants/appInfos";

function Routers() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const authData = localStorage.getItem(localDataNames.authData);
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        dispatch(addAuth(parsedData));
      } catch (error) {
        console.error("Error parsing auth data:", error);
        localStorage.removeItem(localDataNames.authData);
      }
    }
    setIsLoading(false);
  }, [dispatch]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return isAuthenticated ? <MainRouter /> : <AuthRouter />;
}

export default Routers;
