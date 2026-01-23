import { Route, Routes } from "react-router-dom";
import { Login, SignUp } from "../screens";
import { Typography } from "antd";

const { Title } = Typography;

const AuthRouter = () => {
  return (
    <div
      className="container-fluid"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="row" style={{ width: "100%" }}>
        <div
          className="col d-none d-lg-flex text-center"
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <div
            style={{
              fontSize: 120,
              marginBottom: 24,
            }}
          >
            🔥
          </div>
          <Title style={{ color: "#fff", fontSize: 48, fontWeight: 700 }}>
            GasKhanhVan
          </Title>
          <Title level={3} style={{ color: "rgba(255,255,255,0.9)" }}>
            Admin Management System
          </Title>
          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.8)",
              maxWidth: 400,
            }}
          >
            Manage your gas cylinder business with ease. Track products, orders,
            and customers all in one place.
          </p>
        </div>

        <div
          className="col"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AuthRouter;
