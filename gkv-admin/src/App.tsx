import React from "react";
import { ConfigProvider } from "antd";
import "./App.css";
import "./styles/admin.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Routers from "./routers/Routers";
import "react-quill/dist/quill.snow.css";

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1890ff",
            borderRadius: 8,
            colorBgContainer: "#ffffff",
            fontSize: 14,
            colorLink: "#1890ff",
            colorSuccess: "#52c41a",
            colorWarning: "#faad14",
            colorError: "#ff4d4f",
            colorInfo: "#1890ff",
          },
          components: {
            Layout: {
              headerBg: "#ffffff",
              siderBg: "#001529",
            },
            Menu: {
              darkItemBg: "transparent",
              darkItemSelectedBg: "#1890ff",
            },
            Button: {
              primaryShadow: "0 2px 8px rgba(24, 144, 255, 0.3)",
            },
          },
        }}
      >
        <BrowserRouter>
          <Routers />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
